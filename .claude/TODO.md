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
- Task 9: completed/inactive build of `/en/` and `/de/` website trees (mirroring the Italian architecture,
  filled with real live English/German content), a shared language-neutral `/news/` page (with `/it/news/`
  kept as a 301 redirect), and country-based root `/` routing, plus a follow-up fix for missing hero
  captions and broken category-list links on the `/en/`/`/de/` landing pages. Do not modify unless
  explicitly reactivated. Committed at `05d2bb3` (build) and `202972d` (bug fixes), merged to `main`.

Preserved constraints from completed work:

- The live Italian website at `rigonivittorino.com/it` remains the source of truth for visible layout, typography, images, spacing, animation, navigation, footer, content, and responsive behavior.
- Preserve the approved rebuilt Italian site except where the active task requires a narrow change.
- English (`/en/`) and German (`/de/`) websites, the shared `/news/` page, and root `/` country
  routing are implemented (Task 9, frozen). Do not modify unless explicitly reactivated. Do not
  translate/correct/improve their content, or reopen the frozen Italian pages beyond Task 9's narrow
  language-switcher/shared-News wiring, without explicit reauthorization.
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

## Task 9 - Complete: English and German website versions, shared News, root language routing

Status: complete. Committed at `05d2bb3` (build) and `202972d` (post-completion bug fixes), merged and
pushed to `main`. No task is currently active — confirm scope with the user before
starting new work.

### Summary

Built `/en/` and `/de/` route trees mirroring the current Italian architecture (data-driven wine
category/product pages, transplanted-HTML static pages, shared `BaseLayout`), filled with real live
English/German content captured directly from `rigonivittorino.com/en/` and `/de/` (never translated or
invented). Moved the shared News landing page to a language-neutral `/news/`, with `/it/news/` kept as a
301 redirect. Implemented country-based root `/` routing via the `CF-IPCountry` request header. Added a
working language switcher (WPML-derived, now pointing at local routes for all 3 languages) via a token-
substitution scheme in `BaseLayout`.

### Architecture decisions

- **Content pipeline**: `scripts/routes.mjs`/`fetch-pages.mjs`/`extract-wines.mjs`/`extract-chrome.mjs`/
  `extract-main-content.mjs`/`extract-assets.mjs` all gained a `--lang=<it|en|de>` flag (default `it`,
  verified byte-identical output for the zero-arg IT case after refactor — see Known issues below for one
  exception). New `scripts/extract-categories.mjs` generates `categories.en.json`/`categories.de.json` from
  each live category page's own `<h1 class="category-title">`.
- **Shared News**: `src/pages/news/index.astro` (moved from `it/news/`, unchanged internals — same content
  collection, `lang="it"` per user decision since its only real content today is Italian).
  `src/pages/it/news/index.astro` is now a thin on-demand page (`Astro.redirect("/news/", 301)`), the same
  on-demand pattern already used by `src/pages/api/contact.ts`. No `/en/news/`/`/de/news/` routes exist —
  neither language had one locally before, so their nav links straight to `/news/`.
- **Root routing**: `src/pages/index.astro`, on-demand, reads `Astro.request.headers.get("cf-ipcountry")`
  (gated on `import.meta.env.PROD`, mirroring `BaseLayout`'s existing Analytics-beacon gating — this is what
  makes local dev/preview fall back to `/en/` automatically). Decision logic extracted to
  `src/lib/locale-routing.ts` (`resolveLocaleFromCountry`), unit-tested. 302 (not 301), plus explicit
  `Cache-Control: no-store` — the target varies per visitor and must never be cached as permanent.
- **`BaseLayout`**: new `lang` prop (default `"it"`, so every un-migrated call renders byte-identically) and
  `otherLangUrls` prop, which substitutes `__SWITCHER_{EN,DE,IT}_URL__` tokens written into each language's
  generated header/footer by `extract-chrome.mjs`, falling back to that language's homepage when a page
  doesn't supply a specific equivalent.
- **Cross-language route equivalence**: `src/data/locale-equivalents.json` for the ~6 static pages and 6
  categories (their slugs are genuinely translated per language — confirmed via live sitemaps, so a real
  map was unavoidable there). Wine products need no such map — slugs are confirmed byte-identical across
  it/en/de — the equivalent URL is computed inline as `/${lang}/wines/${slug}/` (IT keeps `i-nostri-vini`).
- **Category CSS class vs. route slug**: discovered during implementation (not assumed) that the WordPress
  taxonomy slug driving `.wine-cat-background`/`.wine-detail` color CSS is a *different* string from the
  category page's own route slug for 2 of 6 English categories (route `sparkling` vs. CSS class
  `prosecco-and-sparkling-wines`; route `passiti` vs. CSS class `passiti-wines`). Fixed by reading the real
  class directly off each live page (`categoryClass` in `wines.en/de.json`, `cssClass` in
  `categories.en/de.json`) rather than assuming route slug == CSS class.
- **DE News nav item**: live German nav has no News link at all (Italian/English both do) — per explicit
  user decision, added one locally (`extract-chrome.mjs` inserts a new `<li>` matching the EN/IT structural
  pattern), documented as new UI chrome, not scraped content.
- **Contact form on EN/DE**: wired to the same shared, frozen `/api/contact` backend as IT (same manual
  `id="contact-form"`/`action="/api/contact/"` edit Task 2 applied to IT — not automatable by the scrape
  pipeline, since it's a one-time hand edit per `IMPLEMENTATION_NOTES.md`). The honeypot field's WPCF7-
  generated name differs per form instance (IT `mail-9`, EN `mail-557`, DE `mail-2`) — renamed EN/DE's to
  `mail-9` to match the frozen `contact-validation.ts`'s hardcoded field name (a non-visible, non-linguistic
  attribute rename, not a translation). Field names `your-name`/`your-email`/`your-message`/`acceptance-698`
  are already identical across languages. Per user decision: page-level success/failure status text (not
  frozen — lives in each page's own inline script) is genuinely translated per language; the frozen
  backend's field-level validation-tip strings stay Italian on all three languages' forms.
- **Live mixed-language content preserved as-is** (not corrected): EN/DE `/contatti|contacts/` pages both
  have an aria-label of `"Modulo di contatto"` (EN, Italian) / `"Contact form"` (DE, English); EN's contact
  route is literally `/en/contatti/` (Italian word); DE's is `/de/contacts/` (English word); DE's shop link
  points at `/en/` shop; both EN/DE company-data pages carry the exact same `"Az. Agr.."` double-period typo
  Task 5 fixed for IT (left unfixed here — that was a narrow, IT-specific authorization, not a general one);
  EN/DE homepages both contain a verbatim untranslated Italian paragraph about Amarone; both EN/DE contact
  pages carry a legacy Google reCAPTCHA legal notice paragraph even though this project's actual spam
  protection is Cloudflare Turnstile (an existing live-site inconsistency, reproduced not invented).

### Files changed

Modified (all additive/narrow, no visual change to unmodified callers): `scripts/routes.mjs`,
`fetch-pages.mjs`, `extract-wines.mjs`, `extract-chrome.mjs`, `extract-main-content.mjs`,
`extract-assets.mjs`; `src/layouts/BaseLayout.astro`; `src/components/WineCard.astro`, `Hero.astro`;
`src/content/chrome/header.html` (switcher tokens + News link, 3-line diff); 8 existing `/it/` page files
(added `lang="it"` + `otherLangUrls` props only).

New: `scripts/extract-categories.mjs`, `route-smoke-test-curl.mjs`; `src/lib/locale-routing.ts` (+ test);
`src/data/{wines,categories}.{en,de}.json`, `locale-equivalents.json`; `src/content/chrome/{en,de}/`,
`src/content/main/{en,de}/`; `src/pages/index.astro`, `src/pages/news/index.astro`; full `src/pages/en/` and
`src/pages/de/` trees (home, about/cantina/contact/company-data equivalents, `privacy-policy` (blank —
see below), one `[category]` dynamic file generating 6 category pages each, one `wines/[slug]` dynamic file
generating 30 product pages each). 167 new asset files in `public/` (mostly EN/DE PDF tech sheets — WPML
shares one media library, so most images were already present from the IT scrape; `extract-assets.mjs` now
skips anything already downloaded).

### Route inventories

- **EN implemented**: `/en/`, `/en/the-estate/`, `/en/winery/`, `/en/contatti/`, `/en/company-data/`,
  `/en/privacy-policy/` (blank, see below), `/en/{sparkling,white-wines,red-wines,matured,fizzy-and-rose,
  passiti}/` (6), `/en/wines/<slug>/` (30, identical slugs to IT). Legacy `/en/news/` (a real live WP page)
  intentionally NOT implemented locally — News is shared at `/news/` instead, per the task's own instruction
  not to replicate legacy routes that don't match the current architecture.
- **DE implemented**: `/de/`, `/de/unternehmen/`, `/de/weinkeller/`, `/de/contacts/`, `/de/firmen-daten/`,
  `/de/privacy-policy/` (blank), `/de/{schaumweine,weissweine,rotweine,gereift-im-eichenfass,
  perlweine-und-roseweine,strohweine}/` (6), `/de/wines/<slug>/` (30). No local `/de/news/` — the live DE
  site never had a News page or nav item at all.
- **Shared**: `/news/` (canonical), `/it/news/` (301 redirect alias, only remaining language-specific News
  URL).
- **Root**: `/` (302, country-routed).
- **Excluded/not implemented**: legacy WP `/en/news/` (superseded by shared News); anything not in the
  current approved Italian architecture (no News archives/tags/detail pages for any language, unchanged).

### Known limitations / gaps (documented, not glossed over)

- **No pixel-level visual comparison at 375/768/1024/1440px was performed.** Playwright's Chromium cannot
  launch in this sandbox (missing `libnspr4.so`, no passwordless `sudo` — the identical, pre-existing
  limitation hit on a prior task in this same repo). Substituted: full `curl`-based route smoke test
  (`scripts/route-smoke-test-curl.mjs`, all it/en/de/news/root routes + redirects + country-routing
  variants — all passing) and direct live-vs-local text/markup comparison for representative pages (EN home,
  DE product page, EN tasting-note paragraph — confirmed byte-identical to live). Do not treat this as
  pixel-level visual parity — it wasn't performed.
- ~~Hero slider captions for `/en/`/`/de/` were initially omitted~~ — **fixed** (user-reported bug). Found
  a reliable, no-browser-needed source: the WordPress REST API (e.g.
  `https://rigonivittorino.com/en/wp-json/wp/v2/pages/178`) exposes each page's raw block content,
  including the RevSlider `<rs-layer data-type="text">` blocks with the real caption text — sidesteps the
  live-Playwright-render requirement entirely. Cross-checked against IT's own page this way: reproduces
  `Hero.astro`'s existing hardcoded IT captions exactly, confirming the method. Real EN/DE captions are now
  in `src/pages/en/index.astro` / `src/pages/de/index.astro`. The slide-dot `aria-label` remains in Italian
  for all 3 languages (a screen-reader-only decorative label, not requested to be fixed, not re-verified via
  this same method).
- **`/en/privacy-policy/` and `/de/privacy-policy/` are genuinely blank**, matching the live pages exactly
  (confirmed: both only load a client-side Iubenda widget, no real static text — the same state IT's page
  was in before Task 6's explicit, separately-authorized legal-text drafting). Populating them with real
  EN/DE legal text is out of scope here and would need the same kind of explicit authorization Task 6
  required for IT.
- Full one-by-one live verification of all ~30 products/6 categories was not performed beyond the sitemap-
  based slug/count match — per explicit user decision, this was accepted as sufficient; no discrepancies
  were found during the actual per-page scrape/build that followed.

### Post-completion fix: landing-page category-list links (user-reported bug)

The homepage's `elenco-categorie` wine-type CTA list (6 links, e.g. "PROSECCO AND SPARKLING") had broken
hrefs, confirmed by diffing the raw live scrape — genuinely broken on the live site itself, not something
Task 9 introduced, but in 3 different ways per language:

- **IT**: missing the `/it/` prefix entirely (`href="/spumanti/"`) — a pre-existing Task 1 bug, found while
  investigating the reported EN/DE issue; user confirmed in scope to fix too.
- **EN**: 2 of 6 links used the WordPress *taxonomy* slug instead of the actual category *page* route slug
  (`/en/prosecco-and-sparkling-wines/` instead of the real page `/en/sparkling/`; same for `passiti-wines`
  vs. `passiti`) — confirmed these taxonomy-slug URLs are genuine 404s on the live site too. One link had a
  stray double slash (`/en//fizzy-and-rose/`).
- **DE**: one link (`schaumweine`) was missing its trailing slash.

Fixed generically (not just patched for the 2 known EN cases) in `scripts/extract-main-content.mjs`: a new
`normalizeCategoryHref()` maps any recognized category route slug *or* taxonomy `cssClass` (already
captured per-language in `categories.<lang>.json`) to the canonical `/<lang>/<slug>/` form, regardless of
missing prefix/slash quirks. Regenerated `home.html` for all 3 languages — diff confirmed to touch *only*
the 6 category hrefs per file, nothing else. All 18 links (6 × 3 languages) now curl-verified to return 200
and land on the matching category page.

### Testing and validation performed

- `npm run check`: 0 errors (65 files). `npm run test:unit`: 42/42 passed (37 pre-existing + 5 new
  `locale-routing.test.ts`). `npm run build`: succeeds, all it/en/de/news static routes prerendered, `/`
  and `/it/news/` correctly on-demand.
- `node scripts/route-smoke-test-curl.mjs` against `npm run preview`: every implemented it/en/de route (123
  total) → 200; `/news/` → 200; `/it/news/` → 301 → `/news/`; `/` with `cf-ipcountry: IT|DE|US|<none>` → 302
  to `/it/|/de/|/en/|/en/` respectively. All passing.
- Confirmed no unintended regression: IT's `src/data/wines.json`/`categories.json` byte-identical after the
  pipeline refactor (git diff empty); IT's `src/content/main/contatti.html` — accidentally regressed once by
  a naive re-run of `extract-main-content.mjs` (silently reverting Task 2's manual contact-form wiring),
  caught immediately via this same diff-check habit, and restored via `git checkout` before proceeding.
  IT's `header.html`/`footer.html` show only the intended 3-line diff (switcher tokens + News link).
- Manual content-parity spot checks: EN home, DE product page title, EN tasting-note paragraph, IT nav News
  link — all confirmed matching live source exactly (or, for the shared News link, matching the new
  intentional target).

### Confirmation

No shop/ecommerce/checkout code touched. No News detail/archive/tag pages implemented for any language. No
Task 2 backend files reopened except the two already-frozen, explicitly-scoped touch points (contact-form
wiring pattern replicated per-language, honeypot field renamed for backend compatibility — both non-content,
non-visual, technically necessary). No invented content — every gap above is either omitted (captions) or
left genuinely blank (privacy policy), never fabricated.
