/** Shared portable identity and installation-local resolution; no database access. */
import assert from 'node:assert/strict';
import { mkdir, open, readFile, realpath, link, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const fields = ['source', 'sourceFile', 'uploadFile', 'transform', 'proposedFilename', 'reference'];
const target = { website: 6, slug: 'abat', domain: 'abat.localhost', owner: 1 };
export function mediaIdentity(item) {
  return JSON.stringify(fields.map(field => {
    assert(typeof item?.[field] === 'string' && item[field], `Missing media identity: ${field}`);
    return item[field];
  }));
}
function index(records) {
  assert(Array.isArray(records) && records.length === 59, 'Expected exactly 59 Media records');
  const result = new Map(), sources = new Set(), references = new Set();
  for (const item of records) {
    const identity = mediaIdentity(item);
    assert(!result.has(identity) && !sources.has(item.source) && !references.has(item.reference), 'Duplicate Media identity/source/reference');
    result.set(identity, item); sources.add(item.source); references.add(item.reference);
  }
  return result;
}
export function portableMedia(records) {
  index(records);
  return records.map(item => ({ ...item, cmsMediaId: null, cmsFilename: null }));
}
export function preparePortableMedia(previous, generated) {
  // Retain the inventory guard, never installation-specific resolution.
  const old = index(previous), next = index(generated);
  assert([...old.keys()].every(key => next.has(key)), 'Media inventory/identity changed');
  return portableMedia(generated);
}
export function createMediaState(resolved) {
  index(resolved);
  const state = { version: 1, target, mappings: resolved.map(item => ({
    ...Object.fromEntries(fields.map(field => [field, item[field]])),
    cmsMediaId: item.cmsMediaId, cmsFilename: item.cmsFilename,
  })) };
  resolveMediaState(portableMedia(resolved), state);
  return state;
}
export function resolveMediaState(manifest, state) {
  const records = index(manifest);
  for (const item of records.values()) assert(item.cmsMediaId === null && item.cmsFilename === null, 'Prepared Media must remain portable');
  assert(state?.version === 1, 'Unsupported local Media state');
  assert.deepEqual(state.target, target, 'Local Media state target mismatch');
  const mappings = index(state.mappings), ids = new Set(), filenames = new Set();
  for (const [key, item] of mappings) {
    assert(records.has(key), 'Stale or mismatched local Media identity');
    assert((Number.isSafeInteger(item.cmsMediaId) && item.cmsMediaId > 0) || (typeof item.cmsMediaId === 'string' && /^[1-9][0-9]*$/.test(item.cmsMediaId)), 'Unresolved Media ID');
    assert(typeof item.cmsFilename === 'string' && /^[A-Za-z0-9._-]+$/.test(item.cmsFilename), 'Unresolved Media filename');
    assert(!ids.has(String(item.cmsMediaId)) && !filenames.has(item.cmsFilename), 'Duplicate local Media ID/filename');
    ids.add(String(item.cmsMediaId)); filenames.add(item.cmsFilename);
  }
  return manifest.map(item => {
    const mapping = mappings.get(mediaIdentity(item));
    assert(mapping, 'Missing local Media mapping');
    return { ...item, cmsMediaId: mapping.cmsMediaId, cmsFilename: mapping.cmsFilename };
  });
}
export async function readMediaState(migration) {
  const file = path.join(migration, '.state/media.json');
  assert(await realpath(file) === file, 'Local Media state must not be a symlink');
  const text = await readFile(file, 'utf8');
  return { file, text, state: JSON.parse(text) };
}
export async function writeMediaState(migration, state) {
  const directory = path.join(migration, '.state');
  await mkdir(directory, { recursive: true, mode: 0o700 });
  assert(await realpath(directory) === directory, 'State directory must not be a symlink');
  const file = path.join(directory, 'media.json');
  const temporary = path.join(directory, `.media-${randomUUID()}.tmp`);
  const handle = await open(temporary, 'wx', 0o600);
  try {
    await handle.writeFile(`${JSON.stringify(state, null, 2)}\n`);
    await handle.sync();
  } finally { await handle.close(); }
  let published = false;
  try {
    // Atomic publication, fail if a previous/concurrent installation state exists.
    await link(temporary, file);
    published = true;
  } finally {
    // Cleanup failure after publication must not roll back referenced Media.
    try { await unlink(temporary); } catch (error) {
      if (!published) throw error;
    }
  }
}
