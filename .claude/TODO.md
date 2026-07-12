# TODO.md

This file contains task-specific project work. `CLAUDE.md` contains permanent rules and must be followed for every task.

## Completed / frozen project state

The rebuilt Italian website is approved work. Do not reopen, refactor, redesign, or modify completed work unless the active task strictly requires it.

Completed or inactive work:

- Task 1: Italian website remake for `/it/`, main Italian pages, wine category pages, and product pages.
- Task 2: functional `/it/contatti/` backend/contact-form implementation with email, confirmation, captcha, and retained submissions.
- Task 3: paused/inactive visual-parity bug-fix task. Do not work on it unless the user explicitly reactivates it.
- Task 4: completed/inactive Italian News landing page at `/it/news/`. Do not extend News work unless the user explicitly asks.
- Task 5: completed/inactive Italian Dati societari page at `/it/dati-societari/`. Do not modify unless explicitly reactivated.
- Task 6: completed/inactive Cloudflare Web Analytics beacon + real `/it/privacy-policy/` page. Do not modify unless explicitly reactivated. Merged to `main` at commit `94209c1`.
- Task 7: completed/inactive fix for `ShareButtons.astro` URL-encoding (all 6 links, including Stumbleupon)
  and contact-form server-side length validation. Do not modify unless explicitly reactivated. Committed at
  `716b02a`, merged to `main`.
- Task 8: completed/inactive fix for missing `bodyClass="singular missing-post-thumbnail"` on `chi-siamo`,
  `cantina`, and `contatti` (all three confirmed via `scripts/.cache/html/` to carry these classes live,
  matching `dati-societari` exactly). Do not modify unless explicitly reactivated. Committed at `03a0459`,
  merged to `main`.

Preserved constraints from completed work:

- The live Italian website at `rigonivittorino.com/it` remains the source of truth for visible layout, typography, images, spacing, animation, navigation, footer, content, and responsive behavior.
- Preserve the approved rebuilt Italian site except where the active task requires a narrow change.
- Do not modify English or German pages.
- Do not modify `rigonivittorinoshop.it`, ecommerce systems, cart, checkout, account, products, payments, or external shop behavior.
- Keep existing visible shop links pointing to `rigonivittorinoshop.it`.
- Do not modify Task 2 contact-backend code (`src/pages/api/contact.ts`, `src/lib/rate-limit.ts`,
  `src/lib/email.ts`, `src/lib/turnstile.ts`, the D1 migration); Task 7's narrow authorization to touch
  `src/lib/contact-validation.ts` is complete and frozen along with it.
- `/it/privacy-policy/` and Cloudflare Web Analytics are implemented (Task 6, frozen); do not modify unless
  explicitly reactivated.
- `/it/dati-societari/` (Task 5) is completed/frozen; do not modify it except to reuse its already-finalized company-identity text for reference.
- Do not work on Task 3 visual bugs or further News scope as part of this task.


## Task 8 - Complete: fix missing `bodyClass` on chi-siamo, cantina, and contatti

Status: complete. Committed at `03a0459`, merged to `main`. No task is currently active — confirm scope
with the user before starting new work.

### Summary

`chi-siamo`, `cantina`, and `contatti` never got the `bodyClass="singular missing-post-thumbnail"`
treatment Task 5 discovered and applied to `dati-societari`. Confirmed via `scripts/.cache/html/{chi-siamo,
cantina,contatti}.html` that all three live pages' `<body>` carry exactly the same `singular
missing-post-thumbnail` classes as `dati-societari` did — no per-page variation. Added the identical
`bodyClass="singular missing-post-thumbnail"` prop to all three, following the exact pattern already used
in `src/pages/it/dati-societari/index.astro`.

### Files changed

- `src/pages/it/chi-siamo/index.astro`
- `src/pages/it/cantina/index.astro`
- `src/pages/it/contatti/index.astro`

### Verification performed

- `npm run test:unit`: 37/37 passed. `npm run check`: 0 errors. `npm run build`: succeeded, all routes
  prerendered.
- Rendered-HTML diff (local preview, before vs. after) for all three routes confirms the *only* change is
  the `<body>` class attribute gaining `singular missing-post-thumbnail` — no other markup, content, or
  structure changed.
- `git diff --stat` confirms only the three files above changed (plus this TODO.md entry).
- Confirmed via `dist/client/.../parent-style.min.css` that the CSS rules described in the original
  background section (`:not(.singular) main>article:first-of-type{padding:4rem 0 0}` and
  `.reduced-spacing.missing-post-thumbnail .post-inner{padding-top:0}`) are present and now correctly gated
  for these three pages, matching `dati-societari`.

### Known limitation

Playwright's Chromium can't launch in this sandboxed environment (missing system libs, e.g. `libnspr4.so`,
and no passwordless `sudo` to install them) — visual-breakpoint screenshots and the Playwright-based route
smoke test (`npm run test:routes`) could not be run. Substituted: `curl` confirmed HTTP 200 on all three
routes, and the rendered-HTML diff gave markup-level proof no unintended change occurred. Pixel-level
visual comparison at 375/768/1024/1440px was never actually performed. After this was reported, the user
replied "treat everything as verified and completed" without further detail — recorded here as a directive
to close out Task 8 on the verification already done, not as evidence the pixel-level check happened or
was individually reviewed. If genuine visual parity at those breakpoints matters later, it still hasn't
been checked.
## Task 9 - Active: build English and German website versions, shared News, and root language routing

Status: active.

### User request

Build the English and German versions of the website in the project:

- `/en/` is the English website.
- `/de/` is the German website.
- English and German pages must replicate the current approved Italian page architecture and structure.
- English and German pages must be filled with the respective English and German content from the current live website.
- Do not create new content.
- Do not infer, translate, improve, summarize, correct, or fill missing text with likely content.
- If live English or German content is missing, broken, duplicated, untranslated, mixed-language, or visibly inconsistent, reproduce the live content/behavior as-is where the route is in scope and document the issue.
- Make the News page shared across all languages instead of limited to `/it/`.
- Any News button/link in Italian, English, or German navigation must bring the user to the common shared News page.
- The root route `/` must route users by country:
  - Italy -> `/it/`
  - Germany -> `/de/`
  - all other countries -> `/en/`
- Claude must inspect the repository and deployment setup, reason about the available options, and choose the best implementation route rather than assuming one prematurely.

### Scope authorization

This task explicitly supersedes the permanent Italian-only, “do not modify English or German pages,” and “do not extend News work” restrictions only for the minimum work required to implement:

- `/en/`
- `/de/`
- root `/` country-based language routing
- shared News landing page routing
- navigation links/buttons that point all languages to the shared News page
- shared multilingual utilities/components/data needed to keep the implementation maintainable
- language switcher links needed by the implemented pages

Do not use this authorization to refactor, redesign, or reopen the approved Italian website except where strictly required for:

- shared News routing
- multilingual navigation/language switching
- root country routing
- shared component/data extraction necessary to avoid brittle duplicated code

Any touched Italian page must retain the approved Italian visual result and content unless the change is strictly required to link to the shared News page.

### Core architecture requirement

English and German pages must follow the architecture and structure of the current approved Italian implementation, not the legacy live WordPress architecture.

Use the current Italian implementation as the structural model for:

- route organization
- page types
- layout/component hierarchy
- wine category pages
- wine product pages
- header/navigation structure
- footer structure
- contact page structure
- static page structure
- asset organization, where practical

Use the live English and German website only as the source of the visible language-specific content, images, labels, links, and ordering.

Do not copy legacy WordPress implementation patterns into the rebuilt project unless they are already part of the current approved architecture or are necessary to reproduce visible behavior.

### Source of truth

For this task, the source of truth is split:

- Structure/architecture: current approved Italian project implementation.
- Italian visible content/layout: existing approved rebuilt `/it/` implementation, except for narrow shared News/navigation changes authorized by this task.
- English visible content: current live English pages on `rigonivittorino.com/en/...`.
- German visible content: current live German pages on `rigonivittorino.com/de/...`.
- Shared News: current project’s existing News landing page content/structure, adapted so it is shared across languages.
- Root route: the user’s country-routing requirement in this task.

Do not translate from Italian into English or German. Do not backfill missing English/German content from Italian unless the live English/German page itself visibly uses that Italian content.

### Shared News requirement

The existing project News page must become shared among all languages.

Claude must inspect the current project and determine the best route for the shared News page. Acceptable outcomes include, but are not limited to:

- moving the current `/it/news/` implementation to a language-neutral route such as `/news/`
- keeping a canonical shared implementation and redirecting language-specific News URLs to it
- preserving `/it/news/` as a compatibility redirect to the shared News route

Claude must choose the option that best fits the existing framework, routing model, SEO behavior, maintainability, and user navigation.

Requirements:

- News must no longer be conceptually limited to `/it`.
- Italian, English, and German News navigation/buttons must bring users to the common shared News page.
- Do not implement News posts, News detail pages, archives, tags, categories, CMS feeds, or dynamic News systems unless already present and required by the existing shared News landing page.
- Do not invent News content.
- Preserve the visible content of the current project News landing page unless a route-neutral adjustment is strictly necessary.
- Document the final canonical News route and any redirects/aliases.
- Add route smoke tests for the canonical shared News route and any retained redirects/aliases.

### Live route discovery

Before implementation, discover and record the live English and German route inventory.

Use multiple discovery methods where possible:

- live navigation links
- footer links
- language switcher links
- sitemap or WordPress-generated indexes if available
- linked wine category pages
- linked wine product pages
- relevant crawled pages already visible through search
- direct inspection of live `/en/` and `/de/`

For every candidate route, classify it as:

- implemented local page
- canonical route redirected to another local route
- excluded unreachable/legacy route
- excluded duplicate route
- unavailable/broken live route

Do not assume the English, German, and Italian live route sets are identical.

### Required local page model

English and German pages should replicate the current Italian page architecture and route structure wherever the Italian project already has an equivalent page type.

Implement English and German equivalents for the approved Italian site architecture, including:

- landing page
- company/about page
- winery/cellar page
- contact page
- wine category pages
- wine product pages
- privacy policy page, if the Italian architecture includes it and live English/German content exists
- company-data/legal-details page, if the Italian architecture includes it and live English/German content exists
- any other currently implemented Italian page type that has a live English/German content equivalent

Do not implement legacy English/German routes solely because they exist on the live WordPress site if they do not correspond to the current approved Italian architecture, unless they are visibly reachable and necessary for parity. Prefer canonical redirects for legacy or duplicate-looking routes when that best fits the project.

### Live-content capture rules

Before coding each English or German page:

1. Fetch the current live page for that exact language and route.
2. Save or document the source URL used.
3. Capture all visible text exactly as rendered, including capitalization, spelling, punctuation, accents, apparent typos, mixed-language fragments, and duplicated text.
4. Capture visible image source URLs and map them to local asset paths.
5. Capture header, desktop navigation, mobile navigation, footer, language switcher, links, product/category ordering, and page-specific layout.
6. Treat the live page’s visible language-specific content as canonical even if it appears linguistically wrong.
7. Document unavailable assets, third-party scripts, forms, PDFs, embedded content, or broken links.

### Root `/` routing requirement

Implement `/` so that it sends users to the proper language landing page:

- Italy -> `/it/`
- Germany -> `/de/`
- all other countries -> `/en/`

Claude must inspect the repository and deployment configuration before choosing how to implement this. Prefer the best native option for the detected project and hosting model.

Requirements:

- Prefer a deployment-platform country signal when available, such as a Cloudflare request country header if the project actually runs in a Cloudflare request context.
- If no reliable server/request country signal is available, reason through the alternatives and choose the least invasive, most maintainable option.
- Do not use browser geolocation permission prompts.
- Do not collect, store, or log precise location.
- Do not add a third-party geolocation tracking service unless there is no reasonable native option and the user approves it first.
- Preserve direct access to `/it/`, `/en/`, `/de/`, and the shared News route.
- Avoid redirect loops.
- Provide a safe local/development fallback that defaults to `/en/`.
- Document production assumptions and local fallback behavior.
- Add tests or smoke checks for Italy, Germany, and default/other-country cases.

### Maintainability requirements

Build the multilingual site so it is easy to edit and understand:

- Prefer clear language-specific content/data files over hardcoded duplicated page markup when practical.
- Reuse existing approved layouts/components when doing so does not alter the Italian result.
- If shared components need to become multilingual, make the language/content inputs explicit.
- Keep route names, content keys, image names, and component names readable.
- Do not over-engineer a CMS, translation framework, or dynamic content system unless the repository already has one.
- Keep implementation simple enough for a professional maintainer without deep coding experience.
- Document how a maintainer can update English/German page text, wine data, and shared News links later.

### Links and language switching

- Language switcher links must point to the equivalent implemented route when an equivalent exists.
- If an equivalent route does not exist in that language, use the nearest valid landing page for that language and document the reason.
- All Italian, English, and German News links/buttons must point to the shared News page or to a redirect/alias that resolves to the shared News page.
- Shop links must remain external and continue pointing to `rigonivittorinoshop.it`.
- Do not modify the shop, cart, checkout, account, ecommerce products, payments, or any external shop behavior.
- Footer privacy and company-data links must use the language-specific live destinations when implemented; otherwise document the exact live behavior and chosen local behavior.
- Do not create placeholder pages with invented content.

### Frozen work not to reopen

Do not modify the completed Italian site, contact backend, Cloudflare Web Analytics, Italian privacy policy, Italian company-data page, ShareButtons, contact validation, prior body-class fixes, or Task 3 visual issues except where the active multilingual/shared-News task strictly requires a narrow shared-routing, shared-component, navigation, or language-switching adjustment.

Do not modify `rigonivittorinoshop.it`, ecommerce systems, cart, checkout, account, products, payments, or external shop behavior.

Do not implement News detail pages, News archives, News tags, News categories, dynamic CMS behavior, or News posts unless already required by the current shared News landing implementation.

### Discovery checklist before editing

Before making code changes, record in `IMPLEMENTATION_NOTES.md` or the closest existing project notes file:

- Repository structure relevant to multilingual routes.
- Framework and package manager.
- Existing route implementation pattern.
- Existing shared layout/component/data patterns.
- Existing asset organization.
- Existing tests/build scripts.
- Deployment target evidence relevant to root country routing.
- Existing Italian page architecture to be mirrored.
- Existing News implementation and recommended shared News route strategy.
- Live English route inventory.
- Live German route inventory.
- Planned local English route inventory.
- Planned local German route inventory.
- Routes to redirect, exclude, or leave unimplemented, with reasons.
- The smallest set of files expected to change.
- Any live pages or assets that cannot be fetched.
- Any content contradictions or missing language equivalents.
- Reasoning for the chosen country-routing implementation.
- Reasoning for the chosen shared-News routing implementation.

### Validation requirements

Run all relevant available commands, including install if dependencies are not installed, typecheck, lint, unit tests, route smoke tests, browser tests, production build, and local preview where available.

Create or update a route smoke test covering:

- every implemented `/en/` route
- every implemented `/de/` route
- every affected `/it/` route
- root `/` routing behavior
- canonical shared News route
- any retained News redirects or aliases
- existing `/it/` scoped routes, to confirm they still return valid pages

For root routing, test or simulate at least:

- country = IT -> `/it/`
- country = DE -> `/de/`
- country = US -> `/en/`
- country unset locally -> `/en/`

For visual parity and regression control, compare representative English and German pages against the live site at:

- 375px
- 768px
- 1024px
- 1440px

Also verify that affected Italian pages still match the approved local Italian implementation except for the intentional shared-News navigation/routing changes.

At minimum, include representative screenshots for:

- English landing page
- German landing page
- one English wine category page
- one German wine category page
- one English wine product page
- one German wine product page
- English contacts page
- German contacts page
- shared News page
- one affected Italian page showing the News navigation now points to the shared News page

If browser screenshot tooling cannot run, document the exact failure and substitute the strongest available checks, such as rendered HTML diffs, curl smoke tests, build output, route smoke tests, and manual source comparisons. Do not claim pixel-level visual parity unless screenshots or browser comparison were actually performed.

### Final delivery requirements

At completion, report:

- Summary of architecture and multilingual implementation.
- Summary of shared News implementation and canonical News route.
- Files changed.
- Files or folders touched outside the obvious multilingual/root-routing/shared-News scope, with reasons.
- Full English route inventory implemented.
- Full German route inventory implemented.
- Routes redirected, excluded, or intentionally not implemented, with reasons.
- Root-routing implementation details, alternatives considered, chosen approach, and production assumptions.
- Asset inventory with live source URLs and local paths.
- Page-by-page content/parity checklist.
- Wine category and product route inventory by language.
- Shared News route inventory, including redirects/aliases.
- Before/after or live/local screenshots for representative pages and required breakpoints.
- Commands run and results.
- Known differences from the live site.
- Unavailable assets, scripts, PDFs, forms, third-party behavior, or backend behavior.
- Confirmation that shop links remain external.
- Confirmation that no new content was invented.
- Confirmation that completed Italian work was not modified except where strictly necessary.