# ABAT → current CMS

This export-only representation adapts ABAT to the immutable CMS. The Next.js source remains the content authority. No importer, database write, production action, dependency change, or CMS change is included. The ABAT working tree was clean before migration preparation began. The migration package was created during that preparation and remains untracked.

## Rebuild the package

Run from the ABAT repository on `migration/cms`:

```sh
pnpm exec node migration/cms/export.mjs --cms-contract /Users/leo/Documents/Codex/2026-06-29/files-mentioned-by-the-user-you
```

The existing exporter reads four allowlisted pure CMS contract modules and their installed parser dependencies. It does not load Payload, configuration, routes, or database code. It validates all 16 HTML fragments and 15 stylesheets before emitting content. `prepared/validation.json` records source/contract revisions, contract hashes, routes, sizes, and counts. Review documents are inspection artifacts, never CMS inputs.

## Field and asset mapping

- `prepared/pages.json`: 14 pages (home, six construction pages, project index, six nested projects). `fields` supplies draft Code Mode values, with file references for `html` and `pageCSS`. Supply the actual local tenant relationship separately. `expectedPath`, `source`, `h1`, and `files` are migration metadata, not Payload fields.
- Home uses `pageType: home`, `slug: home`; regular pages retain the complete slash-separated slug, including `proekty/<slug>`. Let CMS derive `path`; verify against `expectedPath`.
- Existing rendered title, including the source title template, maps to `seo.metaTitle`; existing description maps to `seo.metaDescription`. The source H1 remains in HTML and supplies the editor title. The legacy CMS `seo.h1` field does not render a heading. No new SEO copy or canonical/robots/sitemap changes.
- `prepared/layout.json`: existing `layout-settings` collection, `header.mode`/`footer.mode` set to `code`, enabled, with HTML files mapped to `header.html` and `footer.html`; `site.css` maps to `siteCSS`.
- `prepared/css-map.json`: shared modules go to siteCSS; single-page modules go to pageCSS. Deterministic class names replace CSS Modules. Global selectors become `:scope`; inline styles become classes; unsupported keyframes are omitted. Responsive breakpoints remain. All stylesheet sizes fit the current 100,000-character limit.
- `prepared/media.json`: source/upload file, proposed filename/reference, transformations, dimensions, source alt variants, and unresolved CMS ID/filename. 59 files include 16 PNG conversions of SVG assets/icons; raster originals and source SVGs remain intact. Icons use PNG alpha masks with CSS currentColor. Preserve per-image HTML alt even when Media has a different descriptive alt.
- Proposed `/api/media/file/...` references are placeholders in the CMS-supported URL shape, not uploaded media. After local upload, record actual IDs/filenames and replace every reference in HTML and CSS, including full-image links and masks. Never assume CMS preserves the proposed filename. Do not prefix CSS media URLs with `/site/<slug>`.

## Compatibility findings

| Severity | Feature / exact existing constraint | Adaptation and remaining loss |
| --- | --- | --- |
| RESOLVED | Media requires nonempty alt; 20 reviewed assets are decorative | Neutral Russian administrative descriptions are supplied through `suggestedMediaAlt`, mapped to CMS `Media.alt` at upload. All 20 now have `requiresMediaAlt: false`. This metadata is neither rendered alt nor SEO copy; source `alt=""` and `aria-hidden` remain unchanged. |
| IMPORTANT | HTML allowlist excludes buttons, dialog, details/summary, inputs, scripts, inline style and SVG | Export uses allowed fragments and classes. Mobile menu stays expanded below 1200px; taller header replaces modal, focus trap, Escape and scroll lock. Footer content preserved. Navigation uses div with navigation role; CMS supplies header/footer/main landmarks. |
| IMPORTANT | No arbitrary JavaScript | Gallery thumbnails open full images; no in-page lightbox, keyboard sequence, or active-image switching. Showcase renders every project in a horizontal scroll-snap track with anchor navigation; no scripted carousel. All photos remain reachable. |
| IMPORTANT | CSS allows only media URLs and fragment URLs; @font-face and @import prohibited; Media excludes font uploads | Existing Arial/sans-serif fallback replaces next/font Manrope. Typography and line wrapping differ. No external CDN or sanitizer bypass. |
| IMPORTANT | Code Mode HTML is rendered directly, without tenant/preview link rewriting | Preserve root-relative source paths. On `/site/<slug>` and preview these links leave that prefix. Test navigation on an existing supported LOCAL tenant host, or use separately prepared local-only link substitutions; never save preview prefixes as canonical content. |
| INFO — known future content gaps | Six ABAT pages have not been created yet; these are not migration blockers | See link-issues.json: /o-kompanii, /kontakty, /uslugi/proektirovanie, /uslugi/izgotovlenie-metallokonstrukciy, /uslugi/montazh-metallokonstrukciy, /uslugi/montazh-sendvich-paneley. All existing links are preserved exactly. No placeholder pages, link removal or rewriting. These are future ABAT content work, not migration prerequisites. |
| MINOR | Media excludes image/svg+xml; HTML excludes foreign namespaces | Rasterized at 3x; possible loss of vector crispness at extreme zoom. Original assets retained. |
| MINOR | @keyframes is outside the CSS at-rule allowlist | Removed export animations. CSS transitions/responsive layout remain. Desktop sticky wrapper includes utility bars, differing from the source header behavior. |

Generic CMS observations only: direct Code Mode link rendering, lack of native disclosure tags, font restrictions, and required Media alt for decorative resources. No platform change proposed or implemented here.

## Next safe LOCAL step

1. Review these adaptations. No BLOCKING migration issues remain; the 20 decorative Media descriptions are resolved and the six future pages are non-blocking content gaps. Inspect desktop/mobile renderings in the local CMS before considering fidelity verified.
2. Use an authorized local tenant and the existing admin workflow. Upload mapped assets only to that tenant, record actual filenames/IDs, resolve references, and validate the resolved HTML/CSS with the unchanged contract.
3. Populate local layout fields and create the 14 pages as drafts using the mappings. This package itself performs no writes. Verify one H1, existing metadata, all nested routes, asset loading, mobile navigation, gallery links, and CSS against the real CMS layout/Preview and local tenant host.
4. Keep production and publication outside this task. Do not import review/*.html or unresolved media references.

## Validation and final state (2026-09-08)

- Existing exporter: 14 pages, 16 accepted HTML fragments, 15 accepted CSS stylesheets, 59 mapped assets, 16 PNG conversions; six known future ABAT content gaps (non-blocking). React emits non-fatal list-key warnings during static export; no executable React runtime is emitted.
- `pnpm build`: passed, including TypeScript and all expected static/nested routes. `pnpm lint`: passed after correcting exporter variable names.
- `git diff --check`: passed. Tracked diff empty; all migration files remain untracked, so ordinary git diff does not display them. Exporter, fallbacks, adaptations and generated manifests were inspected directly.
- `package.json` and lockfiles unchanged. Branch remains `migration/cms`, HEAD `fb86902c65dbd9bb5fa6fbb4e46ffeba386ed670`; final short status `?? migration/`. No commit, push, merge, rebase or branch switch.
- Allowed CMS repository started and ended clean. No CMS edits, suite runs, server requests or database writes. Protected worktree and parent directory were not accessed.
- Changes in this session: refined `export.mjs` (deduplicated link report, lint-safe loader variables, SVG key forwarding), `adaptations.css` (explicit gallery anchor display), regenerated `prepared/` artifacts, added this README. Existing `fallbacks.tsx` retained.
- Browser comparison and actual local CMS draft import remain unperformed. Structural acceptance is not a claim of pixel-perfect fidelity or successful media upload.

## Metadata correction validation

The exporter retains explicit descriptions for the 20 reviewed decorative assets, and explicitly classifies only the six known future page paths as non-blocking. Other unexpected missing targets remain IMPORTANT. Upload `suggestedMediaAlt` as administrative `Media.alt`; never propagate it into rendered HTML. No CMS records were written.
