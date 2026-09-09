/** Repeatable, offline ABAT -> existing CMS Code Mode export. No CMS writes. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as jsxRuntime from 'react/jsx-runtime';
import ts from 'typescript';
import { preparePortableMedia } from './preserve-media.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../..');
const output = path.join(directory, 'prepared');
const previousMedia = JSON.parse(fs.readFileSync(path.join(output, 'media.json'), 'utf8'));
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--cms-contract') {
  throw new Error('Usage: pnpm exec node migration/cms/export.mjs --cms-contract /absolute/path/to/allowed-cms');
}
const cmsRoot = path.resolve(args[1]);
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve('next/package.json'));
// Both are already installed dependencies of the pinned Next.js version.
const postcss = nextRequire('postcss');
const sharp = nextRequire('sharp');
const hash = value => createHash('sha256').update(value).digest('hex').slice(0, 12);
const relative = file => path.relative(root, file).split(path.sep).join('/');
const write = (name, text) => {
  const destination = path.join(output, name);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, text);
};
const json = (name, value) => write(name, `${JSON.stringify(value, null, 2)}\n`);

// Execute only allowlisted pure contract modules. Never load Payload, config, routes, or DB code.
const contractFiles = new Set([
  'src/modules/pages/pageHtml.ts', 'src/modules/styling/css.ts',
  'src/modules/media/public.ts', 'src/lib/hostname.ts',
  'src/modules/interactions/contract.ts', 'src/modules/forms/schema.ts',
]);
const cmsRequire = createRequire(path.join(cmsRoot, 'package.json'));
const contractCache = new Map();
function contract(name) {
  if (!contractFiles.has(name)) throw new Error(`Out-of-scope CMS import: ${name}`);
  if (contractCache.has(name)) return contractCache.get(name);
  const loadedModule = { exports: {} };
  contractCache.set(name, loadedModule.exports);
  const source = fs.readFileSync(path.join(cmsRoot, name), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const localRequire = specifier => {
    if (specifier.startsWith('@/')) return contract(`src/${specifier.slice(2)}.ts`);
    if (!['parse5', 'css-tree'].includes(specifier)) throw new Error(`Out-of-scope CMS dependency: ${specifier}`);
    return cmsRequire(specifier);
  };
  new Function('require', 'module', 'exports', compiled)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const { validateAndSerializePageHtml } = contract('src/modules/pages/pageHtml.ts');
const { compileCustomCSS } = contract('src/modules/styling/css.ts');
const { parseFragment, serialize } = cmsRequire('parse5');
const { validManagedAttribute } = contract('src/modules/interactions/contract.ts');
function renderFragment(element) {
  const fragment = parseFragment(renderToStaticMarkup(element));
  // React 19 adds resource hints for eager images; Code Mode accepts content only.
  fragment.childNodes = fragment.childNodes.filter(node => {
    const attrs = Object.fromEntries((node.attrs || []).map(attr => [attr.name, attr.value]));
    return !(node.tagName === 'link' && attrs.rel === 'preload' && attrs.as === 'image' && attrs.href?.startsWith('/api/media/file/'));
  });
  const html = validateAndSerializePageHtml(serialize(fragment));
  const check = node => {
    if (node.tagName === 'script') throw new Error('Executable HTML rejected');
    for (const { name, value } of node.attrs || []) {
      if (/^on/i.test(name) || (name.startsWith('data-') && (!name.startsWith('data-cms-') || !validManagedAttribute(name, value, node.tagName)))) {
        throw new Error(`Unsupported runtime attribute: ${name}`);
      }
    }
    for (const child of node.childNodes || []) check(child);
  };
  check(parseFragment(html));
  return html;
}

const media = new Map();
const styles = new Map();
const liftedStyles = new Map();
const modules = new Map();
const svgJobs = new Map();

function mediaURL(source, alt = '', usage = 'image') {
  if (!source.startsWith('/images/')) throw new Error(`Unmapped asset: ${source}`);
  const file = path.join(root, 'public', source);
  if (!fs.existsSync(file)) throw new Error(`Missing source asset: ${source}`);
  let item = media.get(source);
  if (!item) {
    const svg = source.endsWith('.svg');
    const filename = `abat-${path.basename(source, path.extname(source))}-${hash(source)}${svg ? '.png' : path.extname(source)}`;
    item = {
      source, sourceFile: relative(file), proposedFilename: filename,
      reference: `/api/media/file/${filename}`,
      uploadFile: svg ? `migration/cms/prepared/assets/${filename}` : relative(file),
      transform: svg ? 'SVG -> PNG at 3x; source retained' : 'none',
      altTexts: [], usages: [], cmsMediaId: null, cmsFilename: null,
    };
    media.set(source, item);
    if (svg) svgJobs.set(filename, { input: file });
  }
  if (!item.altTexts.includes(alt)) item.altTexts.push(alt);
  if (!item.usages.includes(usage)) item.usages.push(usage);
  return item.reference;
}
function cssURLs(value) {
  return value.replace(/url\(\s*(["']?)(\/images\/[^)"']+)\1\s*\)/g,
    (_, quote, source) => `url("${mediaURL(source, '', 'CSS')}")`);
}
function styleClass(style) {
  const declarations = Object.entries(style).map(([property, value]) => {
    if (typeof value !== 'string') throw new Error(`Unsupported inline style: ${property}`);
    return `${property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}:${cssURLs(value)}`;
  }).join(';');
  const name = `abat-style-${hash(declarations)}`;
  liftedStyles.set(name, `.${name}{${declarations}}`);
  return name;
}
function inlineIcon(props, key) {
  if (props['aria-label'] || props.role === 'img') throw new Error('Meaningful inline SVG requires an explicit alt mapping.');
  const { className, children, ...attributes } = props;
  const svg = renderToStaticMarkup(React.createElement('svg', {
    ...attributes, xmlns: 'http://www.w3.org/2000/svg',
  }, children)).replaceAll('currentColor', '#ffffff');
  const filename = `abat-inline-${hash(svg)}.png`;
  const reference = `/api/media/file/${filename}`;
  if (!media.has(filename)) {
    media.set(filename, {
      source: `inline-svg:${hash(svg)}`, sourceFile: 'src/components (decorative inline SVG)',
      proposedFilename: filename, reference,
      uploadFile: `migration/cms/prepared/assets/${filename}`,
      transform: 'SVG -> PNG alpha mask; currentColor retained in CSS',
      altTexts: [''], usages: ['CSS decorative mask'], cmsMediaId: null, cmsFilename: null,
    });
    svgJobs.set(filename, { input: Buffer.from(svg) });
  }
  const viewBox = String(props.viewBox).split(/\s+/).map(Number);
  const name = `abat-icon-${hash(svg)}`;
  const width = props.width || viewBox[2];
  const height = props.height || viewBox[3];
  liftedStyles.set(name, `.${name}{width:${width}px;aspect-ratio:${width}/${height};mask-image:url("${reference}");-webkit-mask-image:url("${reference}")}`);
  return jsxRuntime.jsx('span', { className: ['abat-inline-icon', name, className].filter(Boolean).join(' '), 'aria-hidden': 'true' }, key);
}
function safeJSX(type, incoming, key, staticChildren = false) {
  const render = staticChildren ? jsxRuntime.jsxs : jsxRuntime.jsx;
  if (typeof type !== 'string') return render(type, incoming, key);
  if (type === 'svg') return inlineIcon(incoming, key);
  const props = { ...incoming };
  if (props.style) {
    props.className = [props.className, styleClass(props.style)].filter(Boolean).join(' ');
    delete props.style;
  }
  if (['main', 'header', 'footer', 'nav'].includes(type)) {
    if (type === 'nav') props.role = 'navigation';
    type = 'div';
  }
  if (type === 'img') props.src = mediaURL(props.src, props.alt ?? '');
  if (type === 'a' && props.href?.startsWith('/images/')) props.href = mediaURL(props.href, '', 'full-size link');
  return render(type, props, key);
}
function Image({ src, alt, fill, sizes, preload, priority, className, ...props }) {
  void sizes;
  return safeJSX('img', {
    ...props, src, alt,
    className: [fill ? 'abat-image-fill' : '', className].filter(Boolean).join(' ') || undefined,
    loading: preload || priority ? 'eager' : 'lazy', decoding: 'async',
  });
}
function Link(props) { return safeJSX('a', props); }

function loadCSS(filename) {
  if (styles.has(filename)) return styles.get(filename).classes;
  const prefix = `abat-${path.basename(filename, '.module.css')}-`;
  const classes = {};
  const ast = postcss.parse(fs.readFileSync(filename, 'utf8'));
  ast.walkRules(rule => {
    rule.selector = rule.selector.replace(/\.([a-zA-Z_][\w-]*)/g, (_, name) => {
      classes[name] = prefix + name;
      return `.${prefix}${name}`;
    });
  });
  styles.set(filename, { prefix, classes, ast });
  return classes;
}
const overrides = new Map([
  ['src/components/layout/MobileNavigation.tsx', 'MobileNavigation'],
  ['src/components/projects/ProjectGallery.tsx', 'ProjectGallery'],
  ['src/components/sections/ProjectsShowcase.tsx', 'ProjectsShowcase'],
]);
function load(filename) {
  if (filename.endsWith('.css')) return loadCSS(filename);
  if (modules.has(filename)) return modules.get(filename).exports;
  const override = overrides.get(relative(filename));
  if (override) return { [override]: load(path.join(directory, 'fallbacks.tsx'))[override] };
  const source = fs.readFileSync(filename, 'utf8');
  if (/^["']use client["']/m.test(source)) throw new Error(`Client component needs a fallback: ${relative(filename)}`);
  const loadedModule = { exports: {} };
  modules.set(filename, loadedModule);
  const compiled = ts.transpileModule(source, { fileName: filename, compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText;
  function localRequire(specifier) {
    if (specifier === 'react/jsx-runtime') return { ...jsxRuntime, jsx: safeJSX, jsxs: (type, props, key) => safeJSX(type, props, key, true) };
    if (specifier === 'next/link') return Link;
    if (specifier === 'next/image') return Image;
    if (specifier === 'next/navigation') return { notFound() { throw new Error('Unexpected notFound during export'); } };
    if (specifier === 'next/font/google') return { Manrope: () => ({ variable: '' }) };
    if (specifier === './globals.css') return {}; // Exported separately as :scope.
    if (specifier.startsWith('@/') || specifier.startsWith('.')) {
      const base = specifier.startsWith('@/') ? path.join(root, 'src', specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
      const target = [base, `${base}.ts`, `${base}.tsx`].find(file => fs.existsSync(file) && fs.statSync(file).isFile());
      if (!target) throw new Error(`Unresolved source import: ${specifier}`);
      return load(target);
    }
    if (specifier !== 'react') throw new Error(`Unexpected runtime dependency: ${specifier}`);
    return require(specifier);
  }
  new Function('require', 'module', 'exports', compiled)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
function adaptCSS(ast) {
  const result = ast.clone();
  result.walkAtRules(rule => { if (rule.name === 'keyframes') rule.remove(); });
  result.walkRules(rule => {
    if (rule.selector.includes('::backdrop')) { rule.remove(); return; }
    rule.selector = rule.selector.replace(/:root|\bhtml\b|\bbody\b/g, ':scope').replace(/\bsvg\b/g, '.abat-inline-icon');
  });
  result.walkDecls(declaration => {
    if (declaration.prop.startsWith('animation')) { declaration.remove(); return; }
    declaration.value = cssURLs(declaration.value);
    if (declaration.prop === 'font-family') declaration.value = declaration.value.replace('var(--font-manrope), ', '');
  });
  return result.toString();
}
function inspect(html) {
  const links = [], ids = [], headings = [], images = [];
  const text = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
  function visit(node) {
    const attrs = Object.fromEntries((node.attrs || []).map(attr => [attr.name, attr.value]));
    if (attrs.id) ids.push(attrs.id);
    if (node.tagName === 'a') links.push(attrs.href);
    if (node.tagName === 'img') images.push({ src: attrs.src, alt: attrs.alt });
    if (node.tagName === 'h1') headings.push(text(node).replace(/\s+/g, ' ').trim());
    for (const child of node.childNodes || []) visit(child);
  }
  visit(parseFragment(html));
  return { links, ids, headings, images };
}

const layoutMetadata = load(path.join(root, 'src/app/layout.tsx')).metadata;
const headerHTML = renderFragment(React.createElement(load(path.join(root, 'src/components/layout/Header.tsx')).Header));
const footerHTML = renderFragment(React.createElement(load(path.join(root, 'src/components/layout/Footer.tsx')).Footer));
const routes = [{ route: '/', file: 'src/app/page.tsx' }];
// Source routes are flat, with one explicitly supported nested project route.
for (const entry of fs.readdirSync(path.join(root, 'src/app'), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
  if (entry.isDirectory() && fs.existsSync(path.join(root, 'src/app', entry.name, 'page.tsx'))) {
    routes.push({ route: `/${entry.name}`, file: `src/app/${entry.name}/page.tsx` });
  }
}
const projectModule = load(path.join(root, 'src/app/proekty/[slug]/page.tsx'));
for (const params of projectModule.generateStaticParams()) {
  routes.push({ route: `/proekty/${params.slug}`, file: 'src/app/proekty/[slug]/page.tsx', params });
}
if (routes.length !== 14) throw new Error(`Expected 14 source routes, found ${routes.length}; review migration scope.`);
const pages = [];
for (const route of routes) {
  const page = load(path.join(root, route.file));
  const props = { params: Promise.resolve(route.params || {}) };
  const metadata = page.generateMetadata ? await page.generateMetadata(props) : page.metadata || {};
  const html = renderFragment(await page.default(props));
  const info = inspect(html);
  if (info.headings.length !== 1) throw new Error(`${route.route}: expected one source H1`);
  const metaTitle = typeof metadata.title === 'string'
    ? layoutMetadata.title.template.replace('%s', metadata.title)
    : metadata.title?.absolute || layoutMetadata.title.default;
  pages.push({
    path: route.route, source: route.file, name: route.route === '/' ? 'home' : route.route.slice(1), html, info,
    fields: {
      title: info.headings[0], slug: route.route === '/' ? 'home' : route.route.slice(1),
      pageType: route.route === '/' ? 'home' : 'regular', contentMode: 'code', _status: 'draft',
      seo: { metaTitle, metaDescription: metadata.description || layoutMetadata.description },
    },
  });
}

const shared = [], pageStyles = new Map(pages.map(page => [page.path, []]));
const stylesheetMap = [];
for (const [file, sheet] of styles) {
  const usedOn = pages.filter(page => page.html.includes(sheet.prefix));
  const layout = (headerHTML + footerHTML).includes(sheet.prefix);
  if (!layout && !usedOn.length) continue;
  const css = adaptCSS(sheet.ast);
  const isShared = layout || usedOn.length > 1;
  if (isShared) shared.push(css);
  else pageStyles.get(usedOn[0].path).push(css);
  stylesheetMap.push({ source: relative(file), target: isShared ? 'siteCSS' : `${usedOn[0].name}/pageCSS`, paths: usedOn.map(page => page.path) });
}
const siteCSS = [
  adaptCSS(postcss.parse(fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8'))),
  ...shared,
  ...[...liftedStyles].filter(([name]) => (headerHTML + footerHTML).includes(name) || pages.filter(page => page.html.includes(name)).length > 1).map(([, css]) => css),
  fs.readFileSync(path.join(directory, 'adaptations.css'), 'utf8'),
].join('\n');
const compiledSiteCSS = compileCustomCSS(siteCSS, 'site');
for (const page of pages) {
  const lifted = [...liftedStyles].filter(([name]) => page.html.includes(name) && !(headerHTML + footerHTML).includes(name) && pages.filter(item => item.html.includes(name)).length === 1).map(([, css]) => css);
  page.css = [...pageStyles.get(page.path), ...lifted].join('\n');
  page.compiledCSS = compileCustomCSS(page.css, 'page');
}

const knownFuturePages = new Set([
  "/o-kompanii",
  "/kontakty",
  "/uslugi/proektirovanie",
  "/uslugi/izgotovlenie-metallokonstrukciy",
  "/uslugi/montazh-metallokonstrukciy",
  "/uslugi/montazh-sendvich-paneley"
]);
const issues = new Map();
for (const page of pages) {
  const info = inspect(headerHTML + page.html + footerHTML);
  if (new Set(info.ids).size !== info.ids.length) throw new Error(`Duplicate HTML id on ${page.path}`);
  for (const href of info.links) {
    if (!href || (!href.startsWith('/') && !href.startsWith('#')) || href.startsWith('/api/media/file/')) continue;
    const url = new URL(href, `https://abat.invalid${page.path}`);
    const target = pages.find(item => item.path === url.pathname);
    const problem = !target ? 'Source target page is absent' : url.hash && !inspect(headerHTML + target.html + footerHTML).ids.includes(decodeURIComponent(url.hash.slice(1))) ? 'Missing fragment target' : null;
    if (problem) {
      if (!issues.has(href)) {
        const futureContent = !target && knownFuturePages.has(url.pathname);
        issues.set(href, {
          severity: futureContent ? 'INFO' : 'IMPORTANT',
          ...(futureContent ? { classification: 'known-future-abat-content-gap', migrationBlocker: false } : {}),
          href, problem: futureContent ? 'Known future ABAT content gap: page not created yet' : problem, affectedPaths: [],
        });
      }
      if (!issues.get(href).affectedPaths.includes(page.path)) issues.get(href).affectedPaths.push(page.path);
    }
  }
}
const records = preparePortableMedia(previousMedia, [...media.values()].sort((a, b) => a.reference.localeCompare(b.reference)));
// Only write after media identity and every HTML/CSS fragment passed validation.
write('header.html', headerHTML + '\n');
write('footer.html', footerHTML + '\n');
write('site.css', siteCSS.replace(/[\r\n]+$/, '') + '\n');
json('layout.json', { collection: 'layout-settings', fields: { header: { enabled: true, mode: 'code' }, footer: { enabled: true, mode: 'code' } }, files: { 'header.html': 'header.html', 'footer.html': 'footer.html', siteCSS: 'site.css' }, website: null });
for (const page of pages) {
  write(`pages/${page.name}.html`, page.html + '\n');
  write(`pages/${page.name}.css`, page.css.replace(/[\r\n]+$/, '') + '\n');
}
json('pages.json', pages.map(page => ({
  source: page.source, expectedPath: page.path, h1: page.info.headings[0], fields: page.fields,
  files: { html: `pages/${page.name}.html`, pageCSS: `pages/${page.name}.css` }, website: null,
})));
fs.mkdirSync(path.join(output, 'assets'), { recursive: true });
for (const [filename, job] of svgJobs) {
  await sharp(job.input, { density: 216 }).png().toFile(path.join(output, 'assets', filename));
}
// Reviewed decorative assets: administrative CMS Media.alt only, never rendered alt or SEO.
const decorativeMediaAlt = {
  "/images/directions/angar.jpg": "Декоративное изображение ангара",
  "/images/directions/angar-w.svg": "Иконка ангара",
  "/images/directions/building.jpg": "Декоративное изображение здания",
  "/images/directions/building-w.svg": "Иконка здания",
  "/images/turnkey/design.svg": "Иконка проектирования",
  "/images/advantages/experience.png": "Декоративная иллюстрация опыта работы",
  "/images/directions/factory-w.svg": "Иконка промышленного здания",
  "/images/advantages/full-cycle.svg": "Иконка полного цикла строительства",
  "/images/advantages/geography.svg": "Иконка географии работ",
  "/images/turnkey/handover.svg": "Иконка сдачи объекта",
  "/images/turnkey/installation.svg": "Иконка монтажа",
  "/images/turnkey/manufacturing.svg": "Иконка изготовления металлоконструкций",
  "/images/services/pane-w.svg": "Иконка сэндвич-панели",
  "/images/turnkey/turnkey-main.svg": "Иллюстрация строительства под ключ",
  "/images/directions/warehouse-w.svg": "Иконка склада",
  "/images/advantages/warranty.png": "Декоративная иллюстрация гарантии",
  "inline-svg:2d6bb1ef4f1f": "Декоративная иконка",
  "inline-svg:3e8692c4f823": "Декоративная иконка",
  "inline-svg:a121fa1eca84": "Декоративная иконка",
  "inline-svg:c7a111d53e9d": "Декоративная иконка"
};
for (const item of records) {
  const metadata = await sharp(path.join(root, item.uploadFile)).metadata();
  item.width = metadata.width; item.height = metadata.height;
  item.suggestedMediaAlt = item.altTexts.find(Boolean) || decorativeMediaAlt[item.source] || null;
  item.requiresMediaAlt = item.suggestedMediaAlt === null;
}
json('media.json', records);
json('css-map.json', stylesheetMap);
json('link-issues.json', [...issues.values()]);
json('validation.json', {
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  cmsContractCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: cmsRoot, encoding: 'utf8' }).trim(),
  contractHashes: Object.fromEntries([...contractFiles].map(file => [file, hash(fs.readFileSync(path.join(cmsRoot, file)))])),
  htmlFragmentsAccepted: pages.length + 2, cssStylesheetsAccepted: pages.length + 1,
  routes: pages.map(page => page.path), siteCSSCharacters: siteCSS.length,
  pageCSSCharacters: Object.fromEntries(pages.map(page => [page.path, page.css.length])),
  mediaFiles: records.length, rasterizedSVGs: svgJobs.size,
  unresolvedInternalLinkTargets: [...issues.values()].filter(issue => !issue.classification).length,
  knownFutureABATContentGaps: [...issues.values()].filter(issue => issue.classification === 'known-future-abat-content-gap').length,
  note: 'Offline structural validation only; no CMS server, suite, database, or production requests. Media URLs are proposed, unresolved references.',
});
// Review documents use the exact CMS-compiled CSS and wrapper structure. Never import them.
for (const page of pages) {
  const localize = text => {
    for (const item of records) text = text.replaceAll(item.reference, item.uploadFile.startsWith('public/') ? item.source : `/migration/cms/prepared/assets/${item.proposedFilename}`);
    return text;
  };
  const meta = renderToStaticMarkup(React.createElement(React.Fragment, null,
    React.createElement('title', null, page.fields.seo.metaTitle),
    React.createElement('meta', { name: 'description', content: page.fields.seo.metaDescription })));
  write(`review/${page.name}.html`, `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${meta}<style>body{margin:0} ${localize(compiledSiteCSS + page.compiledCSS)}</style></head><body><div class="public-site"><header class="public-header">${localize(headerHTML)}</header><main class="public-page"><div class="public-page-code">${localize(page.html)}</div></main><footer class="public-footer">${localize(footerHTML)}</footer></div></body></html>\n`);
}
console.log(`Prepared ${pages.length} pages, Header/Footer, ${records.length} assets (${svgJobs.size} PNG conversions). All fragments passed current CMS validators. ${[...issues.values()].filter(issue => issue.classification).length} known future ABAT page targets; ${records.filter(item => item.requiresMediaAlt).length} unresolved Media alt items.`);
