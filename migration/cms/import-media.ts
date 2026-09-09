/**
 * Local-only importer. Uses the CMS's installed dependencies, without HTTP uploads.
 * node --experimental-strip-types migration/cms/import-media.ts --cms-root /absolute/cms
 * Add --apply only when a real import is explicitly authorized.
 */
import assert from 'node:assert/strict'
import { createMediaState, mediaIdentity, portableMedia, writeMediaState } from './preserve-media.mjs'
import { constants } from 'node:fs'
import { access, lstat, readFile, realpath, stat } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

type Item = Record<string, unknown> & {
  uploadFile: string
  suggestedMediaAlt: string
  requiresMediaAlt: false
  cmsMediaId: string | number | null
  cmsFilename: string | null
}
type Created = { id: string | number; filename?: string }

function localDatabaseURI(value: string | undefined): string {
  assert(value, 'DATABASE_URI is required')
  let uri: URL
  try { uri = new URL(value) } catch { throw new Error('DATABASE_URI must be a PostgreSQL URL') }
  assert(['postgres:', 'postgresql:'].includes(uri.protocol), 'Expected PostgreSQL DATABASE_URI')
  assert(['localhost', '127.0.0.1', '[::1]'].includes(uri.hostname), 'Database host must be loopback')
  // pg query parameters can override the URL host, port, and connection options.
  // Reject all of them so a superficially local URL cannot redirect the connection.
  assert(!uri.search && !uri.hash, 'DATABASE_URI query parameters and fragments are not allowed')
  assert(uri.pathname.length > 1, 'DATABASE_URI must name an existing database')
  return value
}

function inside(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate)
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)
}

async function main(): Promise<void> {
  let apply = false
  let cmsArgument: string | undefined
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--apply' && !apply) apply = true
    else if (arg === '--cms-root' && cmsArgument === undefined) {
      cmsArgument = args[++i]
      assert(cmsArgument && path.isAbsolute(cmsArgument), '--cms-root requires an absolute CMS path')
    } else throw new Error(`Unknown or duplicate argument: ${arg}`)
  }
  assert(cmsArgument, 'Usage: import-media.ts --cms-root /absolute/cms [--apply]')
  assert(process.env.NODE_ENV?.trim().toLowerCase() !== 'production', 'Production is forbidden')
  const repo = await realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'))
  const cmsRoot = await realpath(cmsArgument)
  const manifestPath = path.join(repo, 'migration/cms/prepared/media.json')
  assert((await realpath(manifestPath)) === manifestPath, 'Manifest must not be a symlink')
  const original = await readFile(manifestPath, 'utf8')
  const manifest: unknown = JSON.parse(original)
  assert(Array.isArray(manifest) && manifest.length === 59, 'Manifest must contain exactly 59 entries')
  const items = manifest as Item[]
  portableMedia(items) // Validate all 59 stable, unique identities.
  const statePath = path.join(repo, 'migration/cms/.state/media.json')
  async function requireAbsentState(): Promise<void> {
    try { await lstat(statePath) } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return
      throw error
    }
    throw new Error('Local Media state already exists; first import refused')
  }
  await requireAbsentState()
  const files: string[] = []
  for (const [index, item] of items.entries()) {
    const label = `Media item ${index + 1}`
    assert(item && typeof item === 'object' && !Array.isArray(item), `${label}: invalid object`)
    assert(typeof item.uploadFile === 'string' && item.uploadFile.trim(), `${label}: missing uploadFile`)
    assert(!path.isAbsolute(item.uploadFile), `${label}: uploadFile must be repository-relative`)
    const file = await realpath(path.resolve(repo, item.uploadFile))
    assert(inside(repo, file), `${label}: uploadFile escapes the ABAT repository`)
    const info = await stat(file)
    assert(info.isFile() && info.size > 0, `${label}: uploadFile must be a nonempty regular file`)
    await access(file, constants.R_OK)
    assert(typeof item.suggestedMediaAlt === 'string' && item.suggestedMediaAlt.trim(), `${label}: missing alt`)
    assert(item.requiresMediaAlt === false, `${label}: Media alt is not resolved`)
    assert(item.cmsMediaId === null && item.cmsFilename === null, `${label}: CMS values must be unresolved (null)`)
    files.push(file)
  }

  const previousCwd = process.cwd()
  const cmsRequire = createRequire(path.join(cmsRoot, 'package.json'))
  // Runtime imports deliberately resolve from the existing CMS installation.
  const importCMS = (name: string) => import(pathToFileURL(cmsRequire.resolve(name)).href)
  // The dynamically loaded CMS owns these types; no dependency is added to ABAT.
  let payload: any
  let owner: any
  const created: Created[] = []
  let stateUpdated = false
  const mappings = new Map<string, Item>()
  let failure: unknown
  try {
    process.chdir(cmsRoot)
    const nextRequire = createRequire(cmsRequire.resolve('next/package.json'))
    const { loadEnvConfig } = nextRequire('@next/env')
    loadEnvConfig(cmsRoot, process.env.NODE_ENV !== 'production')
    assert(process.env.NODE_ENV?.trim().toLowerCase() !== 'production', 'Production is forbidden')
    const databaseURI = localDatabaseURI(process.env.DATABASE_URI)
    assert(process.env.PAYLOAD_DROP_DATABASE !== 'true', 'PAYLOAD_DROP_DATABASE is forbidden')
    const { tsImport } = await importCMS('tsx/esm/api')
    const configModule = await tsImport(path.join(cmsRoot, 'payload.config.ts'), {
      parentURL: import.meta.url,
      tsconfig: path.join(cmsRoot, 'tsconfig.json'),
    })
    const config = await configModule.default
    // Use the real config, suppressing startup code generation and background writes.
    config.typescript.autoGenerate = false
    config.admin.importMap.autoGenerate = false
    config.jobs.autoRun = []
    config.telemetry = false
    const { BasePayload } = await importCMS('payload')
    payload = new BasePayload()
    await payload.init({ config, disableDBConnect: true, disableOnInit: true })
    const db = payload.db
    assert(db.name === 'postgres', 'Only the existing PostgreSQL adapter is supported')
    assert(db.poolOptions.connectionString === databaseURI, 'Config database differs from DATABASE_URI')
    assert(!db.pool && !db.readReplicaOptions?.length, 'Unexpected existing pool or read replicas')
    assert(!Object.keys(db.extensions ?? {}).length, 'Automatic database extensions are forbidden')
    assert(typeof db.destroy === 'function', 'Database adapter must support cleanup')
    db.push = false
    db.disableCreateDatabase = true
    // Explicit settings prevent PGHOST/PGOPTIONS or config options changing the target.
    const uri = new URL(databaseURI)
    db.poolOptions = {
      connectionString: databaseURI,
      host: uri.hostname.replace(/^\[|\]$/g, ''),
      port: Number(uri.port || 5432),
      options: '-c default_transaction_read_only=on',
      connectionTimeoutMillis: 10000,
    }
    // Own the pool so startup cannot retain an unreleased connection.
    db.pool = new db.pg.Pool(db.poolOptions)
    await db.connect()
    // Identity bootstrap is a read only: Local API defaults to privileged reads.
    // All subsequent operations explicitly enforce normal access as this verified owner.
    owner = await payload.findByID({ collection: 'users', id: 1, depth: 0 })
    assert(owner.id === 1 && owner.isActive === true && owner.globalRole === 'platform-owner', 'Owner 1 must be an active platform-owner')
    owner = { ...owner, collection: 'users' }
    const website = await payload.findByID({ collection: 'websites', id: 6, depth: 0, user: owner, overrideAccess: false })
    assert(website.id === 6 && website.slug === 'abat' && website.domain === 'abat.localhost' && website.status === 'draft', 'Website 6 does not match the prepared target')
    assert(website.owner === 1, 'Website 6 must be owned by user 1')
    const existing = await payload.count({ collection: 'media', where: { website: { equals: 6 } }, user: owner, overrideAccess: false })
    assert(existing.totalDocs === 0, 'Website 6 already has Media records')
    assert(await readFile(manifestPath, 'utf8') === original, 'Manifest changed during validation')
    if (!apply) {
      console.log('DRY RUN OK | website=6 abat abat.localhost draft | owner=1 active platform-owner | files=59/59 | existingMedia=0 | writes=0')
    } else {
      // All guards passed using a read-only pool. Open the same local database for writes.
      await db.pool.end()
      db.poolOptions.options = '-c default_transaction_read_only=off'
      db.pool = new db.pg.Pool(db.poolOptions)
      await db.connect()
      await requireAbsentState()
      for (const [index, item] of items.entries()) {
        const doc = await payload.create({
          collection: 'media',
          data: { website: 6, alt: item.suggestedMediaAlt },
          filePath: files[index],
          user: owner,
          overrideAccess: false,
        })
        assert((typeof doc.id === 'number' && Number.isSafeInteger(doc.id) && doc.id > 0) || (typeof doc.id === 'string' && doc.id.length > 0), 'Create returned no usable Media ID')
        // Register the ID before validating the filename so this record can be rolled back.
        created.push({ id: doc.id, filename: doc.filename })
        assert(typeof doc.filename === 'string' && doc.filename.trim(), 'Create returned no actual filename')
        mappings.set(mediaIdentity(item), { ...item, cmsMediaId: doc.id, cmsFilename: doc.filename })
      }
      const updated = items.map(item => {
        const mapping = mappings.get(mediaIdentity(item))
        assert(mapping, 'Created Media identity was not resolved')
        return mapping
      })
      assert(await readFile(manifestPath, 'utf8') === original, 'Manifest changed during import')
      await writeMediaState(path.join(repo, 'migration/cms'), createMediaState(updated))
      stateUpdated = true
      console.log('IMPORT OK | website=6 | mediaCreated=59 | localStateWritten=yes | manifestUpdated=no')
    }
  } catch (error) {
    failure = error
    if (apply && !stateUpdated) {
      const rollbackFailures: Array<string | number> = []
      for (const record of [...created].reverse()) {
        try {
          await payload.delete({ collection: 'media', id: record.id, user: owner, overrideAccess: false })
        } catch { rollbackFailures.push(record.id) }
      }
      console.error(rollbackFailures.length
        ? `ROLLBACK FAILED | remaining Media IDs: ${rollbackFailures.join(', ')}`
        : `ROLLBACK OK | deleted=${created.length}`)
    }
  } finally {
    if (payload?.db) {
      try { await payload.db.pool?.end() } catch (error) { failure ??= error }
      try { await payload.db.destroy() } catch (error) { failure ??= error }
    }
    process.chdir(previousCwd)
  }
  if (failure) throw failure
}

main().catch((error: unknown) => {
  // Do not dump connection objects or credentials on errors.
  let detail = error
  const seen = new Set<unknown>()
  while (detail instanceof Error && detail.cause && !seen.has(detail)) {
    seen.add(detail)
    detail = detail.cause
  }
  const message = detail instanceof Error ? detail.message : String(detail)
  console.error(`IMPORT FAILED: ${message.replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[redacted database URI]')}`)
  process.exitCode = 1
})
