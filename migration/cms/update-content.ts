/**
 * Local-only ABAT content updater; existing Pages/Layout only. No prepared files or CMS files are changed.
 * node --experimental-strip-types migration/cms/update-content.ts --cms-root /absolute/cms
 * Default: DRY RUN. Explicit --apply enables one atomic content transaction.
 */
import assert from 'node:assert/strict'
import { readMediaState, resolveMediaState } from './preserve-media.mjs'
import { readFile, realpath } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'

type RecordData = Record<string, any>
type MediaItem = { reference: string; cmsMediaId: string | number; cmsFilename: string }

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
  assert(cmsArgument, 'Usage: update-content.ts --cms-root /absolute/cms [--apply]')
  assert(process.env.NODE_ENV?.trim().toLowerCase() !== 'production', 'Production is forbidden')
  const repo = await realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'))
  const allowedCMS = '/Users/leo/Documents/Codex/2026-06-29/files-mentioned-by-the-user-you'
  assert(path.resolve(cmsArgument) === allowedCMS, 'Only the verified local CMS checkout is allowed')
  const cmsRoot = await realpath(cmsArgument)
  assert(cmsRoot === allowedCMS, 'CMS symlinks are not allowed')
  const prepared = path.join(repo, 'migration/cms/prepared')
  const originals = new Map<string, string>()
  async function preparedFile(name: string): Promise<string> {
    assert(typeof name === 'string' && !path.isAbsolute(name), 'Prepared path must be relative')
    const file = path.resolve(prepared, name)
    assert(inside(prepared, file) && await realpath(file) === file, 'Unsafe prepared file path')
    const text = await readFile(file, 'utf8')
    originals.set(file, text)
    return text
  }
  async function unchanged(): Promise<void> {
    for (const [file, original] of originals) {
      assert(await readFile(file, 'utf8') === original, `Prepared file changed: ${path.basename(file)}`)
    }
  }
  const localMedia = await readMediaState(path.join(repo, 'migration/cms'))
  originals.set(localMedia.file, localMedia.text)
  const items: MediaItem[] = resolveMediaState(JSON.parse(await preparedFile('media.json')), localMedia.state)
  assert(Array.isArray(items) && items.length === 59, 'Expected exactly 59 resolved Media items')
  const references = new Set<string>()
  const ids = new Set<string>()
  const filenames = new Set<string>()
  for (const item of items) {
    assert(item && typeof item === 'object', 'Invalid Media item')
    assert(typeof item.reference === 'string' && /^\/api\/media\/file\/[A-Za-z0-9._-]+$/.test(item.reference), 'Invalid prepared Media reference')
    assert((typeof item.cmsMediaId === 'number' && Number.isSafeInteger(item.cmsMediaId) && item.cmsMediaId > 0) ||
      (typeof item.cmsMediaId === 'string' && item.cmsMediaId.trim()), 'Unresolved Media ID')
    assert(typeof item.cmsFilename === 'string' && /^[A-Za-z0-9._-]+$/.test(item.cmsFilename), 'Unresolved or unsafe Media filename')
    assert(!references.has(item.reference) && !ids.has(String(item.cmsMediaId)) && !filenames.has(item.cmsFilename), 'Duplicate Media reference, ID or filename')
    references.add(item.reference)
    ids.add(String(item.cmsMediaId))
    filenames.add(item.cmsFilename)
  }
  const layoutManifest = JSON.parse(await preparedFile('layout.json'))
  assert.deepEqual(layoutManifest, {
    collection: 'layout-settings',
    fields: { header: { enabled: true, mode: 'code' }, footer: { enabled: true, mode: 'code' } },
    files: { 'header.html': 'header.html', 'footer.html': 'footer.html', siteCSS: 'site.css' },
    website: null,
  }, 'Unexpected prepared Layout contract')
  const pageManifest: RecordData[] = JSON.parse(await preparedFile('pages.json'))
  assert(Array.isArray(pageManifest) && pageManifest.length === 14, 'Expected exactly 14 Pages')
  const validation = JSON.parse(await preparedFile('validation.json'))
  const cmsRequire = createRequire(path.join(cmsRoot, 'package.json'))
  const importCMS = (name: string) => import(pathToFileURL(cmsRequire.resolve(name)).href)
  // Same six allowlisted pure validation modules and loader as export.mjs.
  const contractFiles = new Set([
    'src/modules/pages/pageHtml.ts', 'src/modules/styling/css.ts',
    'src/modules/media/public.ts', 'src/lib/hostname.ts',
    'src/modules/interactions/contract.ts', 'src/modules/forms/schema.ts',
  ])
  const contractSources = new Map<string, string>()
  for (const file of contractFiles) {
    const source = await readFile(path.join(cmsRoot, file), 'utf8')
    assert(createHash('sha256').update(source).digest('hex').slice(0, 12) === validation.contractHashes[file], `CMS contract changed: ${file}`)
    contractSources.set(file, source)
  }
  const ts = cmsRequire('typescript')
  const contractCache = new Map<string, RecordData>()
  function contract(name: string): RecordData {
    assert(contractFiles.has(name), `Out-of-scope CMS contract import: ${name}`)
    if (contractCache.has(name)) return contractCache.get(name)!
    const module = { exports: {} }
    contractCache.set(name, module.exports)
    const compiled = ts.transpileModule(contractSources.get(name), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    } }).outputText
    const localRequire = (specifier: string) => {
      if (specifier.startsWith('@/')) return contract(`src/${specifier.slice(2)}.ts`)
      assert(['parse5', 'css-tree'].includes(specifier), `Out-of-scope CMS dependency: ${specifier}`)
      return cmsRequire(specifier)
    }
    new Function('require', 'module', 'exports', compiled)(localRequire, module, module.exports)
    return module.exports
  }
  const { validateAndSerializePageHtml } = contract('src/modules/pages/pageHtml.ts')
  const { compileCustomCSS } = contract('src/modules/styling/css.ts')
  const previousCwd = process.cwd()
  let payload: any
  let owner: any
  let transactionID: string | number | undefined
  let failure: unknown
  let summary: string | undefined
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
    assert(website.id === 6 && website.slug === 'abat' && website.domain === 'abat.localhost', 'Website 6 does not match the prepared target')
    assert(website.owner === 1, 'Website 6 must be owned by user 1')
    const access = { user: owner, overrideAccess: false, depth: 0 }
    const resolved = new Map<string, string>()
    const expectedPaths = [
      '/', '/bystrovozvodimye-zdaniya', '/proekty',
      '/promyshlennye-zdaniya-i-proizvodstvennye-ceha', '/stroitelstvo-angarov',
      '/stroitelstvo-skladov', '/zdaniya-iz-metallokonstrukciy', '/zdaniya-iz-sendvich-paneley',
      '/proekty/zdanie-stolovoy-s-ofisami', '/proekty/angar-dlya-avtoservisa',
      '/proekty/kranovaya-estakada-5-tonn', '/proekty/kranovyy-put-silovye-mashiny',
      '/proekty/promyshlennoe-zdanie-2880', '/proekty/angar-dlya-avtoremontnyh-masterskih',
    ]
    assert.deepEqual(pageManifest.map(item => item.expectedPath).sort(), [...expectedPaths].sort(), 'Unexpected prepared Page paths')
    // Only generated content and CMS-maintained update attribution may differ.
    function protectedPage(doc: RecordData): RecordData {
      const { html, pageCSS, updatedAt, updatedBy, ...rest } = doc
      return rest
    }
    function protectedLayout(doc: RecordData): RecordData {
      const { siteCSS, updatedAt, header, footer, ...rest } = doc
      const { html: headerHTML, ...headerRest } = header
      const { html: footerHTML, ...footerRest } = footer
      return { ...rest, header: headerRest, footer: footerRest }
    }
    async function guardState(req?: RecordData): Promise<RecordData> {
      const options = { ...access, ...(req ? { req } : {}) }
      const currentOwner = await payload.findByID({ ...options, collection: 'users', id: 1 })
      assert(currentOwner.id === 1 && currentOwner.isActive === true && currentOwner.globalRole === 'platform-owner', 'Owner changed')
      const currentWebsite = await payload.findByID({ ...options, collection: 'websites', id: 6 })
      assert(currentWebsite.id === 6 && currentWebsite.slug === 'abat' && currentWebsite.domain === 'abat.localhost' && currentWebsite.owner === 1, 'Website changed')
      assert.deepEqual(currentWebsite, website, 'Website state/status changed during preflight')
      const mediaState = []
      for (const item of items) {
        const media = await payload.findByID({ ...options, collection: 'media', id: item.cmsMediaId })
        assert(String(media.id) === String(item.cmsMediaId) && media.website === 6 && media.filename === item.cmsFilename, `Media mismatch: ${item.cmsMediaId}`)
        resolved.set(item.reference, `/api/media/file/${media.filename}`)
        mediaState.push(media)
      }
      // Query both live and latest views, deduplicating by logical Page ID rather
      // than confusing version rows with separate Pages. Include unrelated Pages.
      const views: RecordData[][] = []
      for (const draft of [false, true]) {
        const found = await payload.find({ ...options, collection: 'pages', draft, pagination: false, sort: 'id', where: { website: { equals: 6 } } })
        assert(found.totalDocs === found.docs.length, 'Incomplete Page listing')
        views.push(found.docs)
      }
      const targets = expectedPaths.map(expectedPath => {
        const matches = views.map(docs => docs.filter(doc => doc.path === expectedPath))
        assert(matches.every(docs => docs.length === 1), `Missing or ambiguous Page: ${expectedPath}`)
        const [live, latest] = matches.map(docs => docs[0])
        assert(live.id === latest.id && live.website === 6 && latest.website === 6, `Logical Page mismatch: ${expectedPath}`)
        for (const doc of [live, latest]) {
          assert(doc.contentMode === 'code', `Page is not in Code Mode: ${expectedPath}`)
          assert(['draft', 'published'].includes(doc._status), `Unknown publication state: ${expectedPath}`)
          assert(doc.path === (doc.pageType === 'home' ? '/' : `/${doc.slug}`), `Routing would change: ${expectedPath}`)
        }
        // Never publish, discard or merge an independent pending draft.
        assert.deepEqual(protectedPage(latest), protectedPage(live), `Live/draft protected fields differ: ${expectedPath}`)
        if (live._status === 'published') {
          assert(latest.html === live.html && latest.pageCSS === live.pageCSS, `Separate unpublished content exists: ${expectedPath}`)
        }
        return { expectedPath, id: live.id, draft: latest._status === 'draft', live, latest }
      })
      assert(new Set(targets.map(item => item.id)).size === 14, 'Expected 14 distinct logical Pages')
      const targetIDs = new Set(targets.map(item => item.id))
      const unrelated = views.map(docs => docs.filter(doc => !targetIDs.has(doc.id)))
      const layouts = await payload.find({ ...options, collection: 'layout-settings', limit: 2, where: { website: { equals: 6 } } })
      assert(layouts.totalDocs === 1 && layouts.docs.length === 1, 'Exactly one existing ABAT Layout is required')
      const layout = layouts.docs[0]
      assert(layout.website === 6 && layout.header?.mode === 'code' && layout.footer?.mode === 'code', 'Layout must already use Code Mode')
      return { website: currentWebsite, media: mediaState, targets, unrelated, layout }
    }
    const originalState = await guardState()
    const originalLayout = originalState.layout
    const used = new Set<string>()
    function resolveMedia(text: string): string {
      // A single-pass token replacement avoids prefix collisions and cascading mappings.
      const output = text.replace(/\/api\/media\/file\/[^\s"'<>()[\]{};,#?]+/g, reference => {
        const actual = resolved.get(reference)
        assert(actual, `Unresolved prepared Media reference: ${reference}`)
        used.add(reference)
        return actual
      })
      assert(!/\/images\/|\{\{[^}]*media|\/api\/media\/file\/(?=[\s"'<>]|$)/i.test(output), 'Unresolved prepared asset reference')
      return output
    }
    const header = validateAndSerializePageHtml(resolveMedia(await preparedFile(layoutManifest.files['header.html'])))
    const footer = validateAndSerializePageHtml(resolveMedia(await preparedFile(layoutManifest.files['footer.html'])))
    const siteCSS = resolveMedia(await preparedFile(layoutManifest.files.siteCSS))
    validateAndSerializePageHtml(header)
    validateAndSerializePageHtml(footer)
    compileCustomCSS(siteCSS, 'site')
    const layoutData = {
      header: { html: header },
      footer: { html: footer },
      siteCSS,
    }
    const paths = new Set<string>()
    const pages: Array<{ expectedPath: string; data: RecordData }> = []
    for (const item of pageManifest) {
      assert(item && item.website === null && item.fields && item.files, 'Invalid prepared Page')
      const fields = item.fields
      assert(typeof fields.title === 'string' && fields.title.trim(), 'Missing Page title')
      assert(typeof fields.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(fields.slug), 'Invalid Page slug')
      assert(['home', 'regular', 'service', 'article', 'custom'].includes(fields.pageType), 'Invalid pageType')
      assert(fields.contentMode === 'code' && fields._status === 'draft', 'Prepared Page must be a code draft')
      assert(fields.seo && Object.keys(fields.seo).every(key => ['metaTitle', 'metaDescription'].includes(key)), 'Unexpected SEO fields')
      assert(typeof fields.seo.metaTitle === 'string' && typeof fields.seo.metaDescription === 'string', 'Missing prepared SEO')
      assert(item.expectedPath === (fields.pageType === 'home' ? '/' : `/${fields.slug}`), 'Prepared expectedPath mismatch')
      assert(!paths.has(item.expectedPath), 'Duplicate expectedPath')
      paths.add(item.expectedPath)
      const html = validateAndSerializePageHtml(resolveMedia(await preparedFile(item.files.html)))
      const pageCSS = resolveMedia(await preparedFile(item.files.pageCSS))
      validateAndSerializePageHtml(html)
      compileCustomCSS(pageCSS, 'page')
      pages.push({ expectedPath: item.expectedPath, data: { html, pageCSS } })
    }
    assert(used.size === 59, 'Expected all 59 unique Media references in prepared content')
    await unchanged()
    const plan = {
      mode: apply ? 'APPLY' : 'DRY RUN', website: { id: website.id, slug: website.slug, domain: website.domain, owner: website.owner, status: website.status },
      mediaResolved: used.size, htmlValidated: 16, cssValidated: 15,
      layout: { id: originalLayout.id, fields: ['header.html', 'footer.html', 'siteCSS'] },
      pages: originalState.targets.map((target: RecordData) => ({ id: target.id, path: target.expectedPath, status: target.latest._status, draftSave: target.draft, fields: ['html', 'pageCSS'] })),
      unrelatedPages: [...new Map(originalState.unrelated.flat().map((doc: RecordData) => [String(doc.id), { id: doc.id, path: doc.path, status: doc._status }])).values()],
      protectedChangesRequired: 0,
    }
    console.log(JSON.stringify(plan, null, 2))
    if (!apply) {
      assert.deepEqual(await guardState(), originalState, 'Target state changed during dry run')
      await unchanged()
      summary = 'DRY RUN OK | website=6 | pagesResolved=14 | layoutResolved=1 | mediaResolved=59 | protectedChanges=0 | writes=0'
    } else {
      // Same guarded pool switch and explicit transaction as the first importer.
      // Normal CMS versions/audit hooks participate through the transaction req.
      await db.pool.end()
      db.poolOptions.options = '-c default_transaction_read_only=off'
      db.pool = new db.pg.Pool(db.poolOptions)
      await db.connect()
      assert(typeof db.beginTransaction === 'function' && typeof db.commitTransaction === 'function' && typeof db.rollbackTransaction === 'function', 'Transactions are required')
      // This installed adapter consumes the underlying transaction rejection. Observe
      // it so a serialization/commit failure can never be reported as success.
      let transactionFailure: unknown
      const originalTransaction = db.drizzle.transaction
      db.drizzle.transaction = function (...args: any[]) {
        return originalTransaction.apply(this, args).catch((error: unknown) => {
          transactionFailure = error
          throw error
        })
      }
      let started: string | number | null
      try {
        started = await db.beginTransaction({ isolationLevel: 'serializable' })
      } finally {
        db.drizzle.transaction = originalTransaction
      }
      assert(started !== null && started !== undefined, 'Database did not start an atomic transaction')
      transactionID = started
      const req = { user: owner, transactionID }
      // Recheck everything within the same serializable snapshot as all mutations.
      const currentState = await guardState(req)
      assert.deepEqual(currentState, originalState, 'Guarded state changed during preflight')
      await unchanged()
      const options = { ...access, req }
      const layout = await payload.update({ ...options, collection: 'layout-settings', id: currentState.layout.id, data: layoutData })
      assert.deepEqual(protectedLayout(layout), protectedLayout(originalLayout), 'Protected Layout fields changed')
      assert(layout.header.html === header && layout.footer.html === footer && layout.siteCSS === siteCSS, 'Layout content mismatch')
      for (const page of pages) {
        const target = currentState.targets.find((item: RecordData) => item.expectedPath === page.expectedPath)
        assert(target, 'Unresolved Page update target')
        assert.deepEqual(Object.keys(page.data).sort(), ['html', 'pageCSS'], 'Non-content Page patch forbidden')
        const doc = await payload.update({ ...options, collection: 'pages', id: target.id, draft: target.draft, data: page.data })
        assert.deepEqual(protectedPage(doc), protectedPage(target.latest), `Protected Page fields changed: ${page.expectedPath}`)
        assert(doc.html === page.data.html && doc.pageCSS === page.data.pageCSS, `Page content mismatch: ${page.expectedPath}`)
      }
      // Read back every protected record before committing; any hook side effect
      // outside the content allowlist aborts the same transaction.
      const after = await guardState(req)
      assert.deepEqual(after.website, originalState.website, 'Website changed')
      assert.deepEqual(after.media, originalState.media, 'Media changed')
      assert.deepEqual(after.unrelated, originalState.unrelated, 'Unrelated Pages changed')
      assert.deepEqual(protectedLayout(after.layout), protectedLayout(originalLayout), 'Layout protected fields changed')
      for (const target of after.targets) {
        const prior = originalState.targets.find((item: RecordData) => item.id === target.id)
        const patch = pages.find(item => item.expectedPath === target.expectedPath)!.data
        assert(prior, 'Logical Page identity changed')
        assert.deepEqual(protectedPage(target.live), protectedPage(prior.live), 'Stored Page protected fields changed')
        assert.deepEqual(protectedPage(target.latest), protectedPage(prior.latest), 'Latest Page protected fields changed')
        assert(target.latest.html === patch.html && target.latest.pageCSS === patch.pageCSS, 'Latest content did not persist')
        if (target.draft) assert.deepEqual(target.live, prior.live, 'Draft update changed the stored Page')
        else assert(target.live.html === patch.html && target.live.pageCSS === patch.pageCSS, 'Stored content did not persist')
      }
      await unchanged()
      assert(db.sessions[transactionID], 'Update transaction ended before commit')
      await db.commitTransaction(transactionID)
      if (transactionFailure) throw transactionFailure
      transactionID = undefined
      summary = 'UPDATE OK | website=6 | pagesUpdated=14 | layoutUpdated=1 | mediaWrites=0 | protectedChanges=0 | unrelatedWrites=0'
    }
  } catch (error) {
    failure = error
    if (transactionID !== undefined) {
      try {
        await payload.db.rollbackTransaction(transactionID)
        transactionID = undefined
        console.error('ROLLBACK OK | all updater transaction changes reverted')
      } catch (rollbackError) {
        failure = new AggregateError([error, rollbackError], 'UPDATE AND TRANSACTION ROLLBACK FAILED; inspect the local database before retrying')
      }
    }
  } finally {
    if (payload?.db) {
      try { await payload.db.pool?.end() } catch (error) { failure ??= error }
      try { await payload.db.destroy() } catch (error) { failure ??= error }
    }
    process.chdir(previousCwd)
  }
  if (failure) throw failure
  if (summary) console.log(summary)
}

main().catch((error: unknown) => {
  // Do not dump connection objects or credentials on errors.
  let detail = error
  const seen = new Set<unknown>()
  while (detail instanceof Error && detail.cause && !seen.has(detail)) {
    seen.add(detail)
    detail = detail.cause
  }
  const message = detail instanceof Error ? (detail.message || detail.name) : String(detail)
  console.error(`UPDATE FAILED: ${message.replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[redacted database URI]')}`)
  process.exitCode = 1
})
