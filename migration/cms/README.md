# ABAT → current CMS

This export-only representation adapts ABAT to the immutable CMS. The Next.js source remains the content authority. No importer, database write, production action, dependency change, or CMS change is included. The ABAT working tree was clean before migration preparation began. The migration package was created during that preparation and remains untracked.

## Rebuild the package

Run from the ABAT repository on `migration/cms`:

```sh
pnpm exec node migration/cms/export.mjs --cms-contract /Users/leo/Documents/Codex/2026-06-29/files-mentioned-by-the-user-you
```

The exporter reads six allowlisted pure CMS contract modules (including the interaction contract and its pure form-schema dependency) and their installed parser dependencies. It does not load Payload, configuration, routes, or database code. It validates all 16 HTML fragments and 15 stylesheets before emitting content. `prepared/validation.json` records source/contract revisions, contract hashes, routes, sizes, and counts. Review documents are inspection artifacts, never CMS inputs.

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
| RESOLVED — P2 | Mobile navigation | Original burger and responsive panel use a closed modal with 1200px dismissal, backdrop, Escape, focus containment/return, scroll lock and native link navigation. Panel entry uses the original opacity/24px translation and motion tokens through state CSS. Desktop header markup is unchanged. |
| RESOLVED — P2/P2.1 | Showcase and project galleries | Indexed owners synchronize images, thumbnails and modal lightboxes. Showcase photos reset on project changes. Original circular controls, wrapping and project progress remain; migration-only numbered links are removed. Swipes use 52px, ratios 1.25/1 and duration 0. No tenant JavaScript is emitted. |
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

## Managed Interactions adaptation — 2026-09-09

Regenerated once against read-only CMS main `662b46a`. Its `selection.ts` adds scoped MouseEvent click suppression for a stable button/link after a recognized swipe; the old contrary paragraph in MANAGED_INTERACTIONS_FORMS.md is stale. The source interaction components remain unchanged; `fallbacks.tsx` now authors declarative P2/P2.1 markup instead of expanded-menu and image-link fallbacks.

`preserve-media.mjs` retains local `cmsMediaId`/`cmsFilename` by exact composite identity: source, sourceFile, uploadFile, transform, proposedFilename and reference. Duplicate source identities and any inventory/identity difference stop the exporter before output writes. This is local regeneration safety, not a portable media design. All 59 existing resolved pairs survived unchanged; no assets were added. Arrow/close strokes use CSS geometry to avoid adding image inventory. Existing importer files were not changed or executed.

Focused verification: all 16 HTML fragments and 15 stylesheets passed the current CMS validators; every emitted data attribute is checked against validManagedAttribute; no script or inline handler is emitted. IDs, references, owner counts, initial active/inert state, 1200px menu dismissal, four showcase projects and six project galleries were checked. Mapping preservation was tested with reordered entries and rejection of duplicate, changed and missing identities. Pages/SEO/layout manifests, footer, desktop header outside the mobile subtree, and page content outside the showcase/gallery subtrees match the pre-edit snapshot exactly. The six known future-content gaps remain unchanged. git diff --check passed. Existing React static-render list-key warnings remain non-fatal.

Validation is structural, not a browser/pixel-fidelity certification. Review HTML intentionally has no CMS runtime and is not an interactive standalone preview. Existing font/rasterization restrictions, omitted imageReveal keyframe fades and desktop sticky-wrapper difference remain; the mobile panel animation is restored with transitions. Runtime gesture boundaries/cancellation and modal initial-container focus remain CMS-owned. No CMS import, build, full suite, database mutation, commit or push was performed.

## Portable Media manifest and local state

This supersedes in-manifest mapping retention. `prepared/media.json` is the portable 59-record inventory, with both CMS resolution fields always null. `.state/media.json` stores installation-specific mappings and target metadata and is ignored by `migration/cms/.gitignore`. Do not transfer state to another installation.

The shared `preserve-media.mjs` module joins exact source/sourceFile/uploadFile/transform/proposedFilename/reference identities, independent of array order. It rejects missing, duplicate, stale or mismatched identities and duplicate IDs/filenames. Export emits portable records without reading or writing state. Content tools resolve state in memory, verify all 59 database records, and recheck state for changes before writes.

The Media first importer still requires an empty target and now refuses existing state. A later authorized apply publishes all 59 actual mappings atomically without overwriting existing state or rewriting the manifest. Existing compensating rollback applies to import failures before state publication. No apply was executed.

Transition: all 59 existing pairs were saved and read back exactly before manifest clearing; reconstruction afterward matched the original records. No database was accessed during transition. Mapping SHA-256: `5e271a352a6d91eb0dcf9e3a8760f89c355b76e01af5f3462fe50b16f88d519f`.

Dry runs: import-content verified all 59 Media, then correctly refused first import because Website 6 is active; draft-Website/zero-Pages/empty-Layout guards remain. update-content passed with 59 Media, Layout 3, 14 target Pages and zero writes; Page 27 (`/smoke-test`) was ignored. No unrelated prepared content was regenerated.
