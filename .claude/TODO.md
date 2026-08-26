# TODO.md

This file contains task-specific project work. `CLAUDE.md` contains permanent rules and must be followed for every task.

Detailed implementation history for completed tasks lives in `IMPLEMENTATION_NOTES.md`, not here — this file
stays focused on current/active work plus the compact status list below, per `CLAUDE.md`'s own "Discovery
before editing" step 4.

## Active tasks

- **Task 68: pinned `vite` to `8.0.16` via an `overrides` entry in `package.json` — fixes a broken fresh
  install.** Discovered while verifying an unrelated content change: `npm ci && npm run build` (and
  `npm run check`) failed on a completely clean install with the exact version already resolved in the
  committed `package-lock.json` (`vite@8.1.3`) — `astro sync` couldn't resolve Astro's own
  `astro/tsconfigs/strict` package export, breaking `build`/`check` entirely, for anyone, on any machine,
  independent of Node version or any source-file change. Root-caused to a Vite 8.1.x regression (Node's own
  `require.resolve('astro/tsconfigs/strict')` succeeds; Vite's internal resolver does not). Tried 3
  alternatives before landing on `8.0.16`: `8.0.13` (Astro's declared floor, `^8.0.13`) fixes the build but
  keeps 2 disclosed Vite CVEs (Windows-only dev-server issues: `launch-editor` NTLMv2 hash disclosure,
  `server.fs.deny` bypass — irrelevant to this project's Cloudflare Workers production runtime, but still
  worth closing); `8.2.2` (latest) fixes the build and the CVEs but has a real `ERESOLVE` peer-dependency
  conflict with wrangler's `@cloudflare/vite-plugin` on a clean install — rejected. `8.0.16` fixes the build,
  patches both CVEs, and installs cleanly with zero peer-dependency conflicts. Verified on a from-scratch
  `rm -rf node_modules && npm install`: `build` succeeds, `test:unit` (47/47) passes, `check` shows only the
  same pre-existing unrelated issues as before this fix (`src/pages/api/contact.ts`'s `cloudflare:workers`
  types needing a one-time `npm run wrangler:types` run; an unused `locale` var in `src/pages/index.astro`).
  Only `package.json`/`package-lock.json` touched — no source files.
- **Task 66 (branch `SEO-opt`): SEO optimization — implemented, headless-verified, not yet confirmed live.**
  Hard constraint (`CLAUDE.md` Phase 3): no visual/appearance changes — verified throughout via before/after
  overflow sweeps and a visible-JSON-LD-text leak check, not just assumed safe. Discovery pass first
  (confirmed the actual gaps directly, not from memory: 0 of ~120 pages had a meta description; zero
  hreflang/sitemap/robots.txt/structured data anywhere; 94/103 `alt` attributes empty; `scripts/routes.mjs`
  confirmed stale — 2 magnum slugs Task 41 removed are still listed there, so sitemap generation deliberately
  does not depend on it). Six sub-parts, all landed:
  1. **`sitemap.xml`** — `@astrojs/sitemap`, auto-discovers real prerendered routes (not a hand-maintained
     list) rather than a custom endpoint, per `AskUserQuestion`. Excludes the root `/` and `/it/news/`
     redirects (confirmed present in the raw route manifest despite `prerender:false`, needed explicit
     filtering) and the intentionally-blank `/en/`+`/de/privacy-policy/`. 120 real URLs.
  2. **`robots.txt`** — allows all, disallows `/api/`, references the sitemap.
  3. **`hreflang`** — `<link rel="alternate">` tags in `BaseLayout`'s `<head>`, reusing the existing
     `otherLangUrls` prop (language switcher) rather than new plumbing — deliberately *not* reusing that
     prop's homepage-fallback behavior, so hreflang only ever declares true translated equivalents. Found and
     fixed a real pre-existing bug along the way: `/it/contatti/` never passed `otherLangUrls` at all (its
     EN/DE counterparts did), so its language switcher silently fell back to homepages.
  4. **Meta descriptions** — every page. Hand-written for the ~15 main pages, sourced from each page's own
     real content (caught an unverified "1950" founding-year claim before using it — the real content only
     supports "the 1950s", used that instead). Category/product pages (102) built from real per-item data
     (`wines*.json`, `categories*.json`) via a new tested helper, `src/lib/seo.ts`. Also completed Open Graph
     (`og:type`/`og:locale`/`og:image` — bottle photos on product pages/`og:description`) and `twitter:card`;
     added `noindex` to the 2 genuinely-blank privacy-policy pages only (confirmed IT's real one is excluded).
  5. **Structured data (JSON-LD)** — sitewide `Organization` (every field traced to a real, already-published
     fact; `address` deliberately partial — no street address is verified anywhere on the site, Task 50
     removed the contatti page's own address block, so nothing was invented to fill it). `Product` on all 84
     product pages (no `offers`/price — none exists, Task 11 removed shop links). `BreadcrumbList` on all 18
     category + 84 product pages.
  6. **Alt text** — 61 image instances across 16 files, all 3 languages. Actually looked at each real photo
     (not guessed from filenames) so gallery images are correctly distinguished from each other instead of
     duplicated generic text. Deliberately left empty: the decorative V-logo watermark, footer icon SVGs
     (paired with visible "Tel."/"Email:" text), and the homepage's 6 category-button bottle images (paired
     with adjacent category-name text) — filling these would itself be a WCAG anti-pattern (redundant alt
     text), not a gap.
  `check`/`test:unit` (47 passing, up from 42)/`build` all pass at every step. Cumulative visual-diff
  regression across all 6 parts: 40+36+48 = well over 100 checks across a dozen+ distinct page types × all 4
  required breakpoints, zero overflow, zero status issues, zero visible-JSON-LD-text leaks. **Not yet
  confirmed live by the user** — needs `npm run build && npx wrangler deploy` and a real look, same as every
  other visual/behavioral task this project.
- Task 65: footer phone-number text color — tried white (explicit request), then reverted back to black
  (default/original) after the user clarified their original report ("the phone number is black but should
  be white") actually meant the copyright/P.IVA line, not the WhatsApp phone number, which had been correctly
  readable (black on white) the whole time. Net code change: none — ends at the same state as before this
  task. The copyright/P.IVA line itself was checked 3 separate ways (local build, live deployed site via
  headless Chromium, screenshot) and found already correctly white/readable against the dark footer photo in
  every check; the user's described "black on black" for that element could not be reproduced, and remains
  genuinely unresolved/unconfirmed — revisit only if the user supplies their own screenshot showing the
  actual problem.
- Task 64: EU/Veneto rural-development funding-disclosure page, all 3 languages' footers — was an external
  link to `rigonivittorino.com`'s own copy of this legally-required disclosure page; now an internal page at
  `/it/complemento-di-sviluppo-rurale-per-il-veneto-2023-2027/` (same URL slug), per explicit request ("This
  copy must have the same exact content as it has legal importance"). Content fetched directly from the live
  page and verified byte-identical (every heading/paragraph compared programmatically, not eyeballed) before
  use — not paraphrased, not summarized. No EN/DE version exists on the live site either (its own footer
  links to this same `/it/` URL from every language), so none was invented here; all 3 language footers
  (`src/content/chrome/{,en/,de/}footer.html`) now point at the new internal page. New files:
  `src/content/main/complemento-di-sviluppo-rurale-per-il-veneto-2023-2027.html`,
  `src/pages/it/complemento-di-sviluppo-rurale-per-il-veneto-2023-2027/index.astro` (follows the existing
  `dati-societari` page's own established pattern). `check`/`test:unit`/`build` pass; confirmed headlessly
  that the built page serves 200, the funding-logos image loads, and all 3 language footers' links resolve to
  the new internal URL. **Confirmed via direct inspection, not yet explicitly signed off by the user as
  "looks right."**
- Task 63: hamburger/mobile-nav-toggle icon (site-wide, every page, all 3 languages) redesigned, mobile only
  — was Font Awesome's `fa-bars` glyph, gold (`#dcc59f`), 48px in a 70x70px box; now a custom 3-line black
  icon (26x26px box, 2px-thick bars), per explicit request ("black and more minimal... sleeker"), after an
  `AskUserQuestion` resolved a real style ambiguity (shrink the same icon vs. a genuinely different thin-line
  design — **user chose the thin-line redesign**). `<i class="fas fa-bars">` markup fully replaced with 3
  plain `<span>` bars in `header.html`/`en/`/`de/` (identical across all 3, confirmed via diff before
  editing) — old glyph markup is gone, not hidden. Desktop/tablet completely unaffected (this button is
  `display:none` there regardless, confirmed unchanged). Verified: menu still opens on click (functionality
  untouched), old FA glyph confirmed absent post-build, zero overflow across a multi-page/breakpoint sweep.
  **Headless-verified — not yet confirmed live.**
- Task 62: WhatsApp/email footer icons (site-wide, every page, all 3 languages) hidden on mobile only, text
  (phone number, email address) stays — per explicit request. Also zeroed a vendor `10px` left-indent on the
  text that existed only to clear the now-gone icon. Desktop/tablet confirmed unaffected (icons still
  `display:block`). **Headless-verified — not yet confirmed live.**
- Task 61: two mobile-only homepage changes, both measured (not assumed) before and after. (1) Hero video
  now fills the full viewport on mobile — was a fixed `420px` (~50% of a typical phone screen); now
  `calc(100dvh - header-height)`, so header+video together fill exactly one screen on load, matching the
  desktop `.hero-fixed-wrapper` behavior (confirmed via `AskUserQuestion` — user chose this over the simpler
  "video alone = 100dvh, ignoring the header" alternative). Required extending `Hero.astro`'s existing
  desktop-only header-height-measuring script to also run on mobile, decoupled from the desktop-only fade
  effect it used to be bundled with. Measured: header (129.75px) + hero (714.125px) = 843.875px against an
  844px viewport, confirmed on `/it/`, `/en/`, `/de/`. (2) Grape-photo → "La nostra collezione" gap cut ~90%
  per explicit request — measured the real gap first (104px, from 3 separate contributors: a photo's
  theme-default bottom margin, plus a Grids-plugin wrapper's double-consumed padding+margin — the same
  double-consumption mechanism Task 56 already found for padding, this time also present as margin), closed
  to 10px (90.4% reduction). Both changes `max-width:768px`-only; desktop (1440px) confirmed byte-identical
  to before. `check`/`test:unit`/`build` pass; zero overflow across a 7-page × 6-breakpoint sweep.
  **Headless-verified — not yet confirmed live.**

All of Tasks 21-60 below, plus Tasks 61-65 above, are now committed to `main` (`cdd8369`) and treated as
**Phase 2, complete** (see `CLAUDE.md`) — frozen baseline for Phase 3 (Task 66) unless a task explicitly
reopens one.

- Task 21: "Un vino che esalta i sensi" closing section (homepage, last content block before the footer) —
  background changed from a photo to solid black, and the gap that used to sit between the group and the
  footer is filled (extends `#site-footer`'s own background upward via a measured
  `--closing-gap-fill` custom property, after two earlier growing-the-section attempts failed live — see
  `IMPLEMENTATION_NOTES.md` for the full attempt history). **Both confirmed live by the user.** Known,
  disclosed tradeoff from that fix: the text/button group isn't literally centered within the combined black
  area (sits at the top of its own short box; the rest of the black comes from the footer's side).
  Follow-up addition: the "cantina production" photo (bottle with foam overflowing, the same image used
  right after this same text block on `/it/cantina/`) added to the left of the text
  (`.home-closing-section__image`, columns 1-6 desktop/tablet; stacks above the text on mobile automatically
  via the Grids plugin's own existing flex-column mobile behavior, no extra CSS needed), with gutter padding
  from the page edge and the text reusing this section's own existing spacing conventions (150px
  desktop/tablet, matching the text's own right-padding convention; 25px mobile, matching the section's own
  outer mobile padding). An initial sizing attempt (`object-fit:cover`) was reported live as cropping the
  photo — replaced by copying the "Dalla campagna al bicchiere" section's own image markup exactly
  (`<figure class="wp-block-image size-large">`, no custom CSS — the sitewide `height:auto;max-width:100%`
  rule scales it proportionally with zero cropping), and the closing section's paragraph got
  `has-small-font-size` to match that same reference section's text size. Net effect: less custom CSS than
  the previous round, not more. Photo then grown ~30% by shrinking its own gutter padding (150px→100px
  desktop/tablet, 25px→17px mobile) rather than any new sizing CSS, since the image already fills whatever
  content-box width its padding leaves available. User then reported it looked off-center and asked for a
  slight side crop + bigger size — diagnosed as a real bug (not cosmetic): the figure stretched to full
  column width via flex `align-items:stretch`, but the plain `<img>` inside it had no explicit width, so it
  rendered at its own smaller intrinsic size flush against the figure's start edge, leaving real asymmetric
  space. Fixed by giving the `<img>` itself `width:100%;aspect-ratio:4/3;object-fit:cover` — fills its
  figure (fixing the centering bug and making it bigger) and crops a modest amount off the sides (4:3 vs.
  the source's native ~3:2) while keeping the full bottle height in frame. Implemented across all 3
  languages; `check`/`test:unit`/`build`/route-smoke-test all pass; compiled output confirmed present in all
  3 languages, including confirming the image file itself serves (`200`). **Not yet confirmed live by the
  user** — per `CLAUDE.md`'s verification-rigor rules, do not mark this done/frozen until they've seen it.
  Detail:
  `IMPLEMENTATION_NOTES.md`.
  Follow-up: text/button group's column span narrowed from `--_ga-column:7/13` (6 columns) to `9/13` (4
  columns) to match "Dalla campagna al bicchiere"'s own text column span exactly — right edge kept anchored
  at column 13, narrowed from the left. Reported live as squeezed too much (title specifically shouldn't be
  squeezed at all) — **reverted entirely back to `7/13`** rather than guessing an intermediate width.
  `check`/`test:unit`/`build`/route-smoke-test all pass; `7/13` confirmed present in compiled output for all
  3 languages.
  Follow-up: photo grown ~25% (same padding-reduction lever as before: 100px→48px desktop/tablet, 17px→8px
  mobile), and the "Scopri di più" button nudged up (`margin-top:-10px`, scoped to `.bottone-centro
  .bottone-home` specifically, not the shared `.bottone-home` class, since that's also used by a second
  button in "Dalla campagna al bicchiere"). Also researched, per user question: `.bottone-home` is used
  **only twice, both on the homepage** (this button + "Dalla campagna al bicchiere"'s) — confirmed via grep
  across all of `src/content/main/`, not assumed — so a "site-wide" change to it currently only means these
  2 spots, genuinely low blast radius. `check`/`test:unit`/`build`/route-smoke-test all pass; both new values
  confirmed present in compiled output for all 3 languages.
  Follow-up: user asked to redesign this exact button — text and its background removed, only the arrow on
  its own grey background left, guaranteed square, kept exactly where it currently sits. Applied to *both*
  instances (interpreted as continuing the "site-wide, both spots" thread from the question above — stated
  this scope choice explicitly rather than assuming silently). `public/styles/site.css`:
  `.bottone-home`/`:hover` background removed, `width:auto!important` (needed to beat EN/DE's own inline
  `width:225px`/`268px` overrides, sized for their longer translated text), `.bottone-home i` given explicit
  equal `width`/`height:48px` (Font Awesome's arrow glyph isn't naturally square) with flex-centering.
  Accessibility: the icon is already `aria-hidden`, so deleting the visible text outright would have left
  the button with no accessible name at all — used `class="screen-reader-text"` (this codebase's existing
  visually-hidden-but-announced pattern, already used for the header logo) on both `<span>` labels instead
  of `display:none`, in all 3 languages. No positioning changes — the existing `.bottone-centro a.bottone-
  home{margin:auto}` centering and the other instance's own (rule-less) position are both left untouched.
  `check`/`test:unit`/`build`/route-smoke-test all pass; `screen-reader-text` confirmed on both button
  labels (distinguished from the 2 other pre-existing uses of that class) and the new CSS confirmed present,
  for all 3 languages.
  Follow-up: text/title block (`.bottone-centro`, not the image) pushed further down from the section's top
  edge — top margin doubled from `50px` to `100px` at every breakpoint (desktop/tablet/mobile), bottom
  margin values left unchanged. `check`/`test:unit`/`build`/route-smoke-test all pass; `100px` confirmed
  present in compiled output for all 3 languages.
  Follow-up: +20 more px on that same top margin (100px → 120px, every breakpoint), and the button pulled
  closer to the text — `.bottone-centro .bottone-home{margin-top}` doubled from `-10px` to `-20px`, reusing
  the same `20` unit specified for the margin change in the same message (no single unambiguous existing
  "convention" value applied here, so this was the most defensible, traceable choice — flagged for
  correction if a different value was meant). `check`/`test:unit`/`build`/route-smoke-test all pass; `120px`
  and `-20px` confirmed present in compiled output for all 3 languages.
  Follow-up (measured this time): user asked for the button's distance below the text to exactly match the
  title's distance above it. Traced the real value from the CSS rather than guessing again: h2's own
  `margin-bottom:3rem`, and this theme's `html{font-size:62.5%}` makes `1rem=10px` here, so that margin is
  exactly `30px`; confirmed `<p>` has zero margin anywhere in this theme (grepped, not assumed) — so 30px is
  the entire real gap. `.bottone-centro .bottone-home{margin-top}` changed from `-20px` to `30px` (flex
  items don't margin-collapse, so this reproduces the gap exactly). `check`/`test:unit`/`build`/
  route-smoke-test all pass; `30px` confirmed present in compiled output for all 3 languages.
- Task 22: site-wide footer (`src/content/chrome/footer.html`, `en/`, `de/` — shared by every page, not
  homepage-only) — swapped the footer's own company logo for the header/nav logo (they were two different
  files: an older sans-serif single-line wordmark vs. the current two-line serif one used everywhere else),
  and replaced the address block in the footer's icon row with a centered "go to contacts" link
  (`<h2 class="wp-block-heading"><a>`, reusing the site's real, currently-applied h2 styling — a flat 36px/
  Cormorant-serif rule that overrides the theme's own responsive sizing — for a guaranteed match with titles
  like "Dalla campagna al bicchiere", no new CSS needed) pointing at each language's real contact page
  (`/it/contatti/`, `/en/contatti/`, `/de/contacts/`, from `locale-equivalents.json`). Follow-up #1: gave
  the link the same hover treatment as the top nav bar's items — a light brown stripe across the bottom
  (`linear-gradient(0deg,#e2d1b4 45%,rgba(255,0,255,0) 30%)`, the nav's exact hover color/formula,
  deliberately not the visually-similar `#DCC59F` that stylesheet uses for the nav's active-page state
  instead). Follow-up #2 (correction): the phone/email columns were reported still visible — the original
  request's "address info" turned out to mean the whole contact block, not just the street address; both
  remaining columns removed, leaving only the "go to contacts" link in `.footer-icon-row`. Follow-up #3: the
  logo made a bit smaller (226×94 → 170×71, same aspect ratio) and pushed further from the top of the
  footer's content column via `.footer-row-logo{margin-top:40px}` (the theme's own `margin:auto` resolves
  top/bottom to 0 in normal flow, so there was no dedicated spacing there before). Follow-up #4
  (correction): user asked for the address/phone/email columns removed in follow-up #2 to come back
  *alongside* the "go to contacts" link, not instead of it — restored the original 3 columns (retrieved
  exactly from `git show HEAD:...`, not reconstructed from memory) with the contact link appended as a 4th
  column. Follow-up #5 (correction): user wanted the link *below* the 3 columns, not beside them as a 4th —
  moved it out of `.footer-icon-row` into its own centered line underneath (inline
  `style="text-align:center;margin-top:20px"`, matching this file's own pre-existing inline-style
  convention rather than adding a new CSS class). Follow-up #6: address column removed outright (not
  replaced this time) — `.footer-icon-row` now holds just phone and email, contact link still below it.
  Follow-up #7: phone/email icons swapped for two user-supplied SVGs (Font Awesome WhatsApp mark → phone,
  reply-arrow → email — the only sensible mapping), copied into `public/wp-content/uploads/2020/12/` as
  `rigoni-whatsapp.svg`/`rigoni-reply.svg` (new, untracked files — will need `git add`ing alongside the
  pre-existing `Cabernet-sauvignon-rigoni.png` gap whenever this work is committed), with explicit
  `width="52" height="52"` added since these SVGs have no intrinsic size and the container CSS doesn't
  constrain a bare `<img>`. Follow-up #8 (correction): user wanted the contact link back *inside*
  `.footer-icon-row` as a third column (reversing follow-up #5, now that address is gone the row is back to
  3 items: phone, email, contact link) rather than sitting below the row. Follow-up #9: user reported the
  link looked vertically off-center — real bug, not appearance: the row stretches all columns to equal
  height (`.footer-icon-row` has no `align-items`, defaults to `stretch`), but `.footer-icon-column` only
  centers content horizontally, so the link's shorter content sat pinned to the top of its now-taller,
  stretched box instead of centered in it. Fixed with a scoped `.footer-contact-column{justify-content:
  center}` (a second class added only to that column, not a change to the shared vendor `.footer-icon-
  column` rule). Also reordered the row to phone, contact link, email (contact link now 2nd, not 3rd).
  Follow-up #10: user reported it still shifted down, plus a second bug — the row doesn't line up under
  the logo. Found 2 concrete, different causes: (1) every h1/h2/h3 gets an asymmetric theme default margin
  (`6rem`/96px top, `3rem`/48px bottom) that a later rule only zeroes left/right, never top/bottom — the
  contact link is the only column built from an `<h2>` (phone/email are plain `<div>`s), so it alone
  carried that leftover push; fixed with `.footer-contact-column .wp-block-heading{margin:0}`. (2) the
  row's `justify-content:center` centers the *combined width* of all 3 columns, which only matches the
  row's true center when phone/email text are equal width — "Email: info@..." is longer than "Tel. +39...",
  so it was lopsided; fixed by switching the row to `display:grid;grid-template-columns:repeat(3,1fr)`
  (equal-width columns, correct regardless of text length), scoped to `min-width:769px` to match the
  vendor's own `max-width:768px` mobile override and avoid breaking mobile stacking. Both CSS-only, no
  markup changes. Follow-up #11: logo increased 40% (170×71 → 238×99, same aspect ratio).
  `check`/`test:unit`/`build`/route-smoke-test all pass; compiled output
  confirmed on both a homepage and a non-homepage page per language (confirming the sitewide reach is
  correct, not accidentally homepage-scoped); all 3 contact-page target URLs confirmed to return `200`
  directly; both new SVG files confirmed to actually serve (`200`, `image/svg+xml`). **Not yet confirmed
  live by the user** — per `CLAUDE.md`'s verification-rigor rules, do not mark this done/frozen until
  they've seen it. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 23: site-wide header/scroll polish, general (not homepage-only) scope. (1) Language switcher/social-
  icons pre-header bar restored — it was deliberately hidden site-wide (`display:none!important`) by an
  earlier task's "header never resizes on scroll" decision. (2) Site-wide overscroll "rubber-band" bounce
  disabled via `html{overscroll-behavior-y:none}` — applied to `html` since this project's own scroll-
  jacking code already relies on `window.scrollY`/`scrollTo` and is confirmed working live, establishing
  `html`/`window` as the real scroll root.
  Follow-up: refined the pre-header bar to be visible *only at the top*, not unconditionally, while keeping
  the logo permanently compact regardless of scroll — removed the override entirely rather than writing a
  new one, letting the vendor's own unmodified `.pre-header-inner{display:flex}` / `.sticky .pre-header-
  inner{display:none}` pair (site.js's `stickyHeader()` toggles `.sticky` at `scrollY>0`, no threshold) do
  this correctly on their own. Also added a slight fade between the backgrounds of 3 homepage section
  boundaries — **reported live as not looking good, removed entirely** (reverted to plain backgrounds, no
  replacement). Also reported live that the pre-header bar's hide-on-scroll looked "buggy" — real,
  structural cause: the vendor's hide rule uses `display:none`, a property CSS cannot transition/animate at
  all, so every prior round's version of this was always a hard instant cut. Fixed with a `max-height`+
  `opacity` transition instead (`header#site-header .pre-header-inner{overflow:hidden;max-height:60px;
  opacity:1;transition:max-height .35s ease,opacity .25s ease}` /
  `header#site-header.sticky .pre-header-inner{display:flex!important;max-height:0;opacity:0}` — the
  `display:flex!important` is required to keep the element in-layout so the transition has something to
  animate, defeating the vendor's own `display:none` on that state). `60px` is a safely-larger-than-content
  estimate, not measured.
  All changes in `public/styles/site.css` only, site-wide (applies to every page/language by construction).
  `check`/`test:unit`/`build`/route-smoke-test all pass; fade CSS confirmed completely absent from compiled
  output, footer background confirmed reverted to plain `#000`, new transition rules confirmed present.
  **Not yet confirmed live by the user** — per `CLAUDE.md`'s verification-rigor rules, do not mark this
  done/frozen until they've seen it. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 24: **removed entirely, per explicit user decision** ("the animation we were working currently on, I
  think it is best to remove it"). Was a second scroll-jacking "brake" (`initCollectionSectionBrake()` in
  `Hero.astro`) that smoothly centered "La nostra collezione" as the user scrolled near it — went through 2
  rounds of trigger-distance tuning (200px → 100px → 20px) before this final decision to drop it outright.
  `initCollectionSectionBrake()` deleted from `Hero.astro` in full; Task 18's own separate, older, already-
  confirmed-working brake for "Dalla campagna al bicchiere" (`initPhilosophySectionBrake()`) is untouched.
  In the same round, added site-wide `scroll-behavior: smooth` (`public/styles/site.css`, affects
  programmatic/anchor scrolls only — ordinary wheel/trackpad input is already natively smooth) —
  deliberately chosen over any custom JS inertia system as the low-complexity option. Caught and fixed a
  real interaction risk before it shipped: this new CSS property affects the 2-argument `window.scrollTo(x,
  y)` form, which is exactly what Task 18's still-active brake uses every animation frame — switched that
  call to the explicit object form with `behavior:"auto"` so it stays immune to the new site-wide setting
  and isn't fought by a browser-layered smooth-scroll on top of its own manual easing.
  `check`/`test:unit`/`build`/route-smoke-test all pass; brake confirmed fully removed (checked actual
  `<script>` tag contents, not just a raw string search, after an initial naive check gave a false positive);
  new CSS and the fixed `scrollTo` call both confirmed present in compiled output. Detail:
  `IMPLEMENTATION_NOTES.md`.
- Task 25: homepage-only, partial fix. User asked why there's a gap between the stacked sections' (Dalla
  campagna al bicchiere → La nostra collezione → Un vino che esalta i sensi) backgrounds and the viewport
  edge. Investigation found a real, confirmed cause for only the first: `.home-philosophy-section`'s own
  inline markup has a genuine 10px left/right margin (`--_gs-m-desktop:0 10px 60px 10px`, same 10px at
  tablet/mobile) that reveals the page's pale background at the edges. The other two sections have `0 0 0
  0` margin in their own markup, and the ancestor chain (`.post-inner`'s `width:90%` is scoped to
  `body.single-post`, doesn't apply here) shows no structural cause either — flagged this explicitly to the
  user as unresolved/possibly not a real bug for those two, rather than guessing a fix. Implemented only the
  confirmed fix: `public/styles/site.css`, `.home-philosophy-section .grids-s-w_i {margin-left:0;
  margin-right:0}` (longhand only, preserves the intentional 60px bottom spacing). `check`/`test:unit`/
  `build`/route-smoke-test all pass; rule confirmed present in compiled CSS. **Not yet confirmed live by the
  user, and explicitly only a partial fix** — per `CLAUDE.md`'s verification-rigor rules, do not mark this
  done/frozen until they've seen it, and don't assume the other two sections' gap (if any) is resolved by
  this. Follow-up: user confirmed the margin/gap is being accepted as-is (not chased further), but pointed
  out a consequence — the Task 21 gap-filler (`#site-footer::before`, full-bleed black, no side margin of
  its own) no longer visually matches the section above it now that the margin is staying. Changed its
  `background` from `#000` to `var(--footer-background-color)` (reuses the existing variable, not a
  hardcoded duplicate). Also reduced the footer logo's `margin-top` from `40px` to `20px` (no specific
  target given, a reasonable half-reduction estimate).
  `check`/`test:unit`/`build`/route-smoke-test all pass; both new values confirmed present in compiled CSS.
  Detail: `IMPLEMENTATION_NOTES.md`.
- Task 26: new hero tagline, homepage, all 3 languages (shared `Hero.astro`). Added centered text over the
  top hero image, "Dal 1950, Il segno di Vittorino" — same exact text in all 3 languages, deliberately not
  translated (reads as a fixed brand tagline; this project's rule is not to invent translations for
  single-language text). Styled to match the site's h2 titles exactly, but implemented as a plain `<p>` (not
  an actual `<h2>`) with the real h2 values declared explicitly (`font-family:var(--title-font-family)`,
  `font-weight:400`, `font-size:36px`) rather than adding a second/misplaced heading to the page for a pure
  styling match. Centered via `position:absolute`+transform within `.hero-slider`, white text with a soft
  shadow for legibility across the slider's varied photo backgrounds, `pointer-events:none` so it can't
  intercept clicks meant for the slider/dots. Noted for context (not treated as needing separate
  confirmation): Task 14 previously removed the hero's *original* per-slide animated captions — this is a
  different, simpler feature (one static tagline), not a reversal of that decision.
  Follow-up: placement confirmed good live; typography changed by explicit request — Cormorant serif/400/
  36px → `Arial, Helvetica, sans-serif`/`bold`/`56px`, a deliberate departure from "match the group titles"
  this time, not left partially reconciled with it. `56px` is a "noticeably bigger" estimate, no exact
  target given.
  Follow-up 2: user asked to scrape a specific rolex.com headline's font — `WebFetch` on 3 different
  rolex.com URLs and a Wayback Machine fallback all failed (403s / environment-blocked), confirmed
  genuinely, not assumed. User then supplied the exact font themselves via browser DevTools: "Neue Haas
  Grotesk Display Pro 65 Medium Italic" — a commercial/licensed typeface, not freely embeddable. Presented
  3 options via `AskUserQuestion`; **user chose "Inter, medium italic"** as the free approximation.
  `src/layouts/BaseLayout.astro`: added the Google Fonts `<link>` for Inter italic/500 (site-wide via the
  shared layout, though only used by the homepage tagline — flagged as a known minor side effect).
  `public/styles/site.css`: `font-family`→`"Inter", Arial, sans-serif`, `font-weight`→`500`, added
  `font-style: italic`; `56px` size unchanged (this request was about the typeface only).
  `check`/`test:unit`/`build`/route-smoke-test all pass; tagline text and its CSS rule confirmed present in
  compiled output for all 3 languages. **Not yet confirmed live by the user** — per `CLAUDE.md`'s
  verification-rigor rules, do not mark this done/frozen until they've seen it. Detail:
  `IMPLEMENTATION_NOTES.md`.
  Follow-up 3: user rejected the Inter/italic direction outright — reverted to match the group titles as
  originally requested, then increased size and forced a single line. `public/styles/site.css`:
  `font-family`→`var(--title-font-family)` (Cormorant, same as h2 titles), `font-weight`→`400`, `font-style:
  italic` removed, `font-size` 56px→`72px`, added `white-space: nowrap` (the only thing that structurally
  guarantees one line — font-size alone can't). Removed the now-meaningless `max-width: 90%` since nowrap
  overrides wrapping regardless. Added a `28px` override inside the existing `@media (max-width: 768px)`
  block so a 32-character phrase at 72px doesn't overflow narrow viewports while forced onto one line — this
  mobile value is an estimate, not verified against a real narrow-phone render (Playwright unavailable in
  this sandbox). `src/layouts/BaseLayout.astro`: removed the Inter Google Fonts `<link>` added in Follow-up
  2, now orphaned (grep-confirmed zero remaining references anywhere in `site.css`/`src/`).
  `check`/`test:unit`/`build` all pass; compiled `dist/client/styles/site.css` confirmed to contain the new
  rule verbatim (font-family/weight/size/nowrap + mobile 28px override) and the Inter `<link>` confirmed
  absent from all 3 languages' compiled homepage HTML. Fresh preview server + full route smoke test both
  pass (all IT/EN/DE routes, shared news, redirects). **Not yet confirmed live by the user** — the
  bigger-vs-single-line tension on narrow phones in particular needs their eyes before this is frozen.
  Follow-up 4: user asked (thinking ahead, not urgent) to make the tagline "even bigger", then mid-turn
  asked to change the typeface to "Roboto, regular 400" instead of matching the group titles. Combined both:
  `src/layouts/BaseLayout.astro` — added a Google Fonts `<link>` for Roboto weight 400 (same loading pattern
  as the existing Cormorant/Proza Libre links). `public/styles/site.css`: `.hero-slider__tagline` —
  `font-family` → `"Roboto", Arial, sans-serif` (no longer `var(--title-font-family)` — explicit departure
  from "match the group titles" per this new instruction), `font-weight` unchanged at `400` (already
  matched "regular"), `font-size` 72px→`96px` desktop, `28px→38px` mobile (same proportional bump, same
  nowrap/single-line guarantee and narrow-phone-overflow caveat as Follow-up 3, just larger).
  `check`/`test:unit`/`build` pass; compiled CSS and the Roboto `<link>` both confirmed present for all 3
  languages. Fresh preview + full route smoke test pass. **Not yet confirmed live by the user.**
  Follow-up 5 (final): user rejected the tagline outright ("delete this text altogether, I do not like it")
  — removed entirely. `src/components/Hero.astro`: deleted the `<p class="hero-slider__tagline">` element.
  `public/styles/site.css`: deleted the `.hero-slider__tagline` rule, its explanatory comment block, and its
  mobile `font-size` override inside the `max-width:768px` block (kept that block's unrelated
  `.hero-slider{height:420px}` rule, which predates the tagline and isn't part of this feature).
  `src/layouts/BaseLayout.astro`: removed the now-orphaned Roboto Google Fonts `<link>`. Grep-confirmed zero
  remaining references to `hero-slider__tagline`, the tagline text, or `family=Roboto` anywhere in `src/` or
  `site.css` before calling it done. `check`/`test:unit`/`build` pass; compiled `dist/client/styles/site.css`
  and all 3 languages' compiled homepage HTML confirmed to have zero matches for any of the above. Fresh
  preview + full route smoke test pass. Task 26 is now **removed entirely** — homepage hero is back to its
  Task 17/18 state with no tagline. Do not reintroduce a hero tagline unless explicitly reactivated.
- Task 27: loading screen (Task 13) polish — added a simple white spinning ring below the logo
  (`.loading-screen__spinner`, plain CSS border-ring technique, no new asset), fading in alongside the logo
  on the same timing. Also sped up the panel's entry/exit slide transitions on explicit request: entry
  600ms→350ms, exit 1200ms→650ms (both halved, same 1:2 entry:exit ratio preserved). JS timing constants in
  `src/components/LoadingScreen.astro` (`ENTRY_DURATION_MS`, `EXIT_DURATION_MS`) kept in sync with the
  matching CSS `transition-duration` values in `public/styles/site.css`; `MIN_BLACK_MS` (the static black
  dwell time, not a sliding animation) left unchanged since only "sliding animations" were asked to speed
  up. `check`/`test:unit`/`build` pass; compiled output confirmed for all 3 languages (spinner markup
  present, new CSS durations present, JS constant-folded values — 950/1350/6350 — verified to derive
  correctly from the new 350/650 constants). Fresh preview + full route smoke test pass. **Not yet confirmed
  live by the user.**
- Task 28: footer logo (homepage, all 3 languages, shared `footer.html`) animated. User asked to swap the
  static logo for "an animation ... most of the width of the viewport, but relatively thin vertically";
  presented 3 concrete options via `AskUserQuestion` (scrolling wordmark marquee, shimmer sweep over the
  existing logo, hand-drawn signature reveal — the last flagged as needing a vector logo that doesn't exist
  in this repo, only PNG/JPG). **User chose the shimmer sweep.** `public/styles/site.css`: `.footer-row-logo`
  restructured from a plain margin-only rule into a wide (`min(90vw,1100px)`), thin,
  `overflow:hidden;position:relative` band with the unchanged logo centered inside via flex, and a
  `::before` diagonal gradient (soft gold `rgba(220,197,159,...)`, reusing the site's own existing
  `--link-color-hover` tone — plain white would be near-invisible against the footer's white background)
  animated via `background-position` on a loop (`footer-logo-shimmer`, 5s, `ease-in-out infinite`) —
  disabled entirely under `prefers-reduced-motion: reduce`. The wide band (not the small logo itself) is
  what satisfies "most of the viewport width"; the logo image itself is untouched, matching what the chosen
  option's own preview described. No markup changes needed (pure CSS, `.footer-row-logo` wraps the same
  `<img>` in all 3 languages already). Follow-up (same message): `margin-top` reduced further, 20px→8px
  ("reduce it more", no specific value given — a small estimate, not measured, kept above 0 so the logo
  isn't flush against the footer's own top padding). `check`/`test:unit`/`build` pass; compiled CSS confirmed
  (`min(90vw, 1100px)`, `margin: 8px auto 0`, `footer-logo-shimmer` keyframes all present); footer markup
  confirmed unchanged in all 3 languages' compiled homepage HTML. Fresh preview + full route smoke test
  pass. **Not yet confirmed live by the user** — a moving gradient's visual timing/subtlety is exactly the
  kind of thing that needs real eyes on it, not just code review, per `CLAUDE.md`'s verification-rigor
  rules.
  Follow-up: widened from `min(90vw,1100px)` to full `100vw` per explicit "take up all of the width"
  request — standard `width:100vw`+`margin:calc(50% - 50vw)` full-bleed break-out, confirmed no
  `overflow:hidden` on any ancestor between it and `#site-footer` before relying on the technique.
- Task 29: footer text changes, shared `footer.html` (all 3 languages, every page — not homepage-only).
  (1) "Follow us" → "Why not follow us?" — this text was identical, untranslated English in all 3 language
  footers already (a pre-existing quirk from the original scrape, not something this task introduced), so
  the same literal replacement was applied to all 3 rather than treating it as a translation decision.
  (2) Removed the trailing `| Design by Geppa` credit/link (`https://www.geppa.it`) from the copyright line
  in all 3 languages, leaving `Copyright ... | Privacy | <Company Data equivalent>`.
  `check`/`test:unit`/`build` pass; compiled output confirmed for homepage *and* a non-homepage page
  (`chi-siamo`/`the-estate`/`unternehmen`) in all 3 languages — 0 remaining matches for "Follow us" or
  "Design by Geppa"/geppa.it, 1 match for the new text each — confirming the shared-footer change actually
  reached every page, not just the homepage. Fresh preview + full route smoke test pass. **Not yet confirmed
  live by the user.**
- Task 30: loading screen (Task 13/27) reveal redesigned — only the exit/reveal animation, not the entry.
  Changed from the panel shrinking horizontally back toward center (`scaleX 1->0`) to the panel, logo, and
  spinner all sliding vertically upward together and off the top of the viewport ("looks like a scroll
  down"), per explicit request. All 3 elements share one literal `transform: translateY(-110dvh)` value and
  the same `650ms ease-in-out` transition (one combined CSS selector, not 3 separately-typed numbers) so
  "the same speed" is structurally guaranteed, not just visually approximate. `-110dvh` for a small
  off-screen safety margin; `dvh` not `vh` matching this codebase's existing mobile-dynamic-toolbar
  convention (Hero.astro). Spinner markup restructured: outer `.loading-screen__spinner` (opacity + the new
  reveal transform) now wraps an inner `.loading-screen__spinner-ring` (the rotating border-ring) — required
  because a CSS `animation` and `transition` can't both drive the same element's `transform` at once (the
  animation wins outright), so the continuous rotation had to move onto its own element rather than share
  one with the new slide transform. No JS logic changed — `LoadingScreen.astro`'s `transitionend` listener
  still just checks `event.propertyName === "transform"` on the panel, which still fires under the new
  translateY-based transition. `check`/`test:unit`/`build` pass; compiled CSS confirmed
  (`translateY(-110dvh)` shared rule, `.loading-screen__spinner-ring` present) and markup confirmed nested
  correctly in all 3 languages. Fresh preview + full route smoke test pass. **Not yet confirmed live by the
  user** — motion timing/synchronization between 3 separate elements is exactly the kind of thing that needs
  real eyes, not just code review.

- Task 31: "Un vino che esalta i sensi" closing section (Task 21), desktop/tablet only — the photo now fills
  the section's full black area top-to-bottom instead of sitting inset with a gap above/below, per explicit
  request ("make the picture vertically fit with the borders of the section - the black background. Check
  for margins, padding to ensure this"). The gap was the image column's own `50px 0 50px 0`/`50px 0 25px 0`
  top/bottom margin (`--_ga-m-desktop`/`--_ga-m-tablet` in home.html/en/home.html/de/home.html) stacked on
  top of the section's own 50px padding; zeroed to `0 0 0 0` in all 3 languages, and `site.css`'s
  `.home-closing-section__image img` switched from a fixed `aspect-ratio:4/3` to `height:100%` so it tracks
  the row's actual height (already stretched to 100% by the Grids plugin's own
  `.grids-is-advanced>.grids-s-w_i>.grids-area{height:100%}` rule) instead of a ratio derived only from
  width. Filling that height at the column's original (half-page) width alone read as an oddly narrow
  vertical strip, so per the user's own anticipation ("on the right side, it may overflow to the text") the
  figure is widened by a fixed 80px past its grid column and allowed to bleed (`overflow:visible`) into the
  text column's own left portion — safe/low-risk because that column is `text-align:right`, so its left
  portion is normally empty space, and `#site-content`'s own `overflow:hidden` only clips at the page's
  outer edge, nowhere near this internal column boundary. A `figure::after` gradient fades the rightmost 20%
  of the photo to black (matching the section's own background) so the seam blends rather than hard-cutting,
  and `.bottone-centro` (the text column) got an explicit `position:relative;z-index:1` so text stays
  legible over the overlap even though DOM order already put it on top. Mobile unchanged (image still stacks
  above the text at its own fixed aspect-ratio; no side-by-side overlap to manage there — layout is a single
  stacked column, not the desktop/tablet 2-column grid this all applies to). `check`/`test:unit`/`build` all
  pass; compiled output confirmed in all 3 languages (`_ga-m-desktop:0 0 0 0` in the served HTML, the new
  `figure::after` rule present in the served CSS); fresh preview + route smoke test (`/`, `/it/`, `/en/`,
  `/de/`, `/it/cantina/`, `/it/contatti/`, `/it/privacy-policy/`, `/it/dati-societari/`, `/news/`) all pass.
  **Not yet confirmed live by the user** — this is exactly the kind of overlap/fade/z-index composition that
  needs real eyes, not just a CSS review.

- Task 32: site-wide (every page, every language) — fixed a ~20px gap between page content and the true
  left/right viewport edges, reported as making the site "look less clean," present everywhere except the
  header and footer. Root cause: the vendor theme gives every direct child of `.entry-content` that isn't a
  WP "wide"/"full"-aligned block `width:calc(100% - 4rem)` (a standard WordPress block-editor convention) —
  every page's content (`.grids-section` on the main pages, `.wines-row-container` on wine category pages)
  is exactly such a child, so all of them carried this 40px (auto-centered, ~20px/side) reservation, while
  `#site-header`/`#site-footer` sit outside `.entry-content` entirely and were never subject to it. Fixed in
  `site.css` with a verbatim copy of the theme's own selector (guarantees the override wins: identical
  specificity, `site.css` loads last) that sets `width:100%` instead. See `site.css`'s own comment for full
  detail, including the one known side effect (`/it/privacy-policy/`'s placeholder callout box now spans
  the full column width too — presentational only, not a change to its legal content). `check`/`test:unit`/
  `build` all pass; compiled CSS confirmed present and correctly ordered last of all stylesheets in the
  built HTML. Fresh preview + 12-route smoke test (`/`, `/it/`, `/en/`, `/de/`, `/it/chi-siamo/`,
  `/it/cantina/`, `/it/contatti/`, `/it/dati-societari/`, `/it/privacy-policy/`, `/it/bianchi/`, `/it/rossi/`,
  `/news/`) all pass. **Not yet confirmed live by the user** — a sitewide spacing change like this needs
  real eyes on a real screen to confirm it actually reads as "nicer," not just structurally correct.

- Task 33: "La nostra collezione" section (Task 20, homepage, all 3 languages — frozen, narrowly
  reactivated for this asset swap only). User supplied 5 new product photos (matching filenames exactly:
  `Raboso-Passito-rigoni.png`, `rigoni-prosecco-creativo.png`, `Incrocio-Manzoni-rigoni.png`, `Everything-
  coming-up-rose-rigoni.png`, `Pinot-Nero-rigoni.png`) to replace 5 of the section's 6 category-button bottle
  photos in `public/wp-content/uploads/2020/12/`, per an explicit, already-known issue: the Cabernet
  Sauvignon (Affinati) bottle rendered noticeably taller than the other 5 in the category row. Root cause,
  confirmed by measuring actual PNG dimensions (not guessed): `.collection-showcase__category img` is a
  fixed 200×266.67px (`aspect-ratio: 3/4`) box with `object-fit: contain` (see that rule's own Task 20
  comment for why `contain` over `cover`), so each bottle's *rendered* height depends on how tall its own
  source canvas is relative to its width, not on any per-category CSS. The old 5 replaced images were all
  600×650px canvases (width-constrained under `contain` → ~216px rendered height); the untouched Cabernet
  image is 637×1000px (height-constrained → the box's full 266.67px height) — that mismatch was the entire
  visible size difference. The 5 new images are all narrow, tall canvases (144–206px wide × 650px tall,
  aspect ratios ≈0.22–0.32) — narrower relative to height than the 3:4 box itself, so every one of them is
  now also height-constrained under `contain`, i.e. all render at the box's full height, matching Cabernet.
  Verified by computing the actual `contain` scale factor for all 6 images against the fixed box (not just
  assumed from the file dimensions) — confirms uniform full-height rendering across all 6 categories with
  zero markup/CSS changes, since the existing `<img>` tags reference these exact filenames already (a pure
  asset swap). Cabernet Sauvignon's own image was intentionally left untouched — no new file was supplied
  for it, and it didn't need one. `check`/`test:unit`/`build` all pass; confirmed byte-for-byte that the
  built `dist/` output serves the new files (not the old ones); fresh preview server, route smoke test
  across `/`, `/it/`, `/en/`, `/de/`, and all 6 category pages (`spumanti`/`bianchi`/`rossi`/`passiti`/
  `frizzanti-e-rosati`/`affinati`) — all pass. **Not yet confirmed live by the user** — whether the 5 new
  photos' own art direction (lighting, crop, bottle angle) actually "look better" together, as intended, can
  only be judged visually.

- Task 34: header (site-wide, every page/language). Two changes, both per explicit request. (1) Logo size:
  tried making it vary with the pre-header (language bar) visibility — bigger (130px) and centered at the
  top, back to compact 50px once scrolled — in 2 different layouts (two-row stacked header, then an overlay
  with the logo floated centered on top of the nav row). Both were rejected live in turn ("I do not like the
  big logo" after the two-row version; "This does not look good" after the overlay version, with an explicit
  "go back to the compact logo that we always had on this project"). Fully reverted to Task 25's original
  behavior: logo locked at its compact 50px size unconditionally, at every scroll position and screen size,
  no pre-header-tied variation — byte-identical to the pre-Task-34 rule. Per `CLAUDE.md`'s circuit-breaker
  rule (2 live rejections in a row for the same feature), this is now closed rather than a candidate for a
  third variant; a bigger/centered logo would need a fresh conversation about what specifically isn't
  working, not another positioning guess. (2) Desktop nav menu switched from ALL CAPS to normal sentence
  case — **not** reported as disliked, kept as-is. Investigation found the menu's *font-family* was already
  `var(--body-font-family)` (Proza Libre, matching the rest of the site) — a leftover
  `font-family:Merriweather` rule was dead (Merriweather is never actually loaded anywhere in this rebuild,
  and a more specific rule already sets the family directly on the `<li>`, which always wins over what it'd
  otherwise inherit). Flagged this to the user before touching anything; confirmed via a follow-up
  `AskUserQuestion` that the real, visible difference — `text-transform:uppercase` — should be removed too.
  See `site.css`'s own comments for the full history and cascade tracing. `check`/`test:unit`/`build` all
  pass at every round (4 verification passes total across the 2 logo attempts, the revert, and the font
  change); compiled CSS confirmed present/correct/fully-removed at each step; fresh preview + 6–8-route smoke
  tests all pass. **Logo: reverted to the known-good, previously-confirmed state — no further confirmation
  needed.** **Menu font/case: not yet confirmed live by the user.**

- Task 35: homepage hero background (all 3 languages) — the crossfading 4-photo carousel replaced with a
  single looping background video, per explicit request and a user-supplied file
  (`17999240-uhd_4096_2160_30fps.mp4`, 16.7MB, 4096×2160). Copied to `public/videos/hero-background.mp4`
  (new asset folder, alongside the existing `public/scripts`/`public/styles` precedent for non-scraped,
  project-authored assets — not `wp-content/uploads`, which is reserved for the original WP scrape).
  `Hero.astro`'s entire `slides` prop/dot-pagination/crossfade-timer system removed outright (not left dead
  next to the video) — `/en/`/`/de/` never actually diverged from `/it/`'s slide set (confirmed
  byte-identical, per Task 9's own original comment on that prop), so nothing language-specific was lost;
  their `index.astro` files' now-unused `slides` arrays and the prop pass-through were removed too. The
  first of the old 4 slide photos (`rigoni-s2-bottiglie.jpg`) is kept on as the `<video>`'s `poster`. Video
  autoplay is started from JS (not the `autoplay` HTML attribute) specifically so `prefers-reduced-motion:
  reduce` visitors never download it at all (`preload="none"` stays in place, poster-only) — matching this
  project's existing full-disable convention for that preference elsewhere (loading screen, Task 17/18).
  **Known, disclosed limitation:** this sandbox has no `ffmpeg`/video-transcoding tool available (confirmed
  — not installable without sudo either) and no way to extract a real poster frame or verify the video's
  exact duration/codec, so the file is used exactly as supplied, at its native 4K resolution/16.7MB size —
  larger than ideal for a hero background (typical web guidance: ~1080p, a few MB). Flagged to the user as
  a real, unaddressed tradeoff, not silently shipped; recommended they compress it (e.g. to 1080p H.264) on
  their own machine if load time turns out to matter, and the file can be swapped in place with no code
  changes needed either way, since nothing else depends on its exact encode. `check`/`test:unit`/`build` all
  pass; confirmed in compiled output that the video byte-matches the source file, serves with the correct
  `video/mp4` content-type, and the markup/CSS are correctly wired in all 3 languages; fresh preview + 7-route
  smoke test all pass. The 3 other original carousel photos (`rigoni-s3/s4/s5`) are now unused but were left
  in place, not deleted — flagged here for the user's awareness, not removed unasked. **Not yet confirmed
  live by the user** — video playback, framing/composition (no `object-position` tuning was possible without
  seeing it), and real-world load time all need to be seen, not just code-reviewed.

- Task 36 (superseded by Task 39 below — spumanti/bianchi no longer show label images, kept here for
  history only): `/spumanti/` and `/bianchi/` category-listing pages (all 3 languages — `/it/spumanti/`+
  `/it/bianchi/`, `/en/sparkling/`+`/en/white-wines/`, `/de/schaumweine/`+`/de/weissweine/`; 14 wine
  entries total: 8 spumanti incl. 2 magnum variants, 6 bianchi), scope explicitly limited to just these 2
  categories per request — every other category (rossi/affinati/passiti/frizzanti-e-rosati) unchanged.
  User-supplied bottle-label photos replace the bottle-photo + name-text card display with label-image-only
  (the label already shows the name). Mapped each of the 12 supplied label images to the correct wine by
  cross-referencing `src/data/wines.json`'s actual `category`/`slug` fields, not by guessing from filenames
  alone; the 2 magnum variants reuse their non-magnum counterpart's label (no separate magnum label was
  supplied, and none was needed — same design regardless of bottle size). Images resized (max 800px on the
  long side) and re-encoded as JPEG (quality 88) using this sandbox's available Pillow library — the
  originals were ~2MB PNGs each (~24MB total for 12); now ~50-107KB each (~830KB total), since the largest
  they're ever displayed at is 320px CSS-wide. `WineCard.astro` got a new optional `imageVariant` prop
  ("bottle" default / "label") controlling both whether `.wine-title` renders and a new modifier class on
  the image wrapper — defaults preserve today's exact behavior for every other category; only the
  `/spumanti/`+`/bianchi/` page templates (it/en/de) pass `imageVariant="label"`. New CSS
  (`.wine-image--label img`) gives label cards a fixed `4/3` box with `object-fit:contain`, reusing the same
  approach and reasoning already established (and user-approved) for Task 20's homepage collection buttons,
  since these 12 labels have very different native aspect ratios (~0.66 to ~2.09, measured) unlike the
  near-uniform bottle photos this replaces. `check`/`test:unit`/`build` all pass; confirmed in compiled
  output that all 6 target pages show the new label-only markup and every other category page (checked both
  IT and EN examples) is byte-unaffected; fresh preview + 15-route smoke test (including a wine product
  detail page, confirming that page's own separate `productImage` — untouched, out of scope — still serves
  correctly) all pass. **Not yet confirmed live by the user** — the fixed-box sizing/whitespace tradeoff for
  such varied label shapes is exactly the kind of thing that needs real eyes.

- Task 37: all 6 wine category-listing pages (all 3 languages — `/it/spumanti/`, `/it/bianchi/`,
  `/it/rossi/`, `/it/affinati/`, `/it/passiti/`, `/it/frizzanti-e-rosati/`, and their EN/DE equivalents),
  triggered by a report of a "sizeable gap" between the nav header and the page title on the spumanti/
  bianchi pages. Root cause: `src/pages/it/[categoria]/index.astro` (and its `en`/`de` `[category]`
  equivalents) never set `bodyClass` on `<BaseLayout>`, unlike every other content page (chi-siamo/cantina/
  contatti/dati-societari all pass `"singular missing-post-thumbnail"`). Two separate, unscoped vendor rules
  key off exactly those two classes' *absence* to add 8rem (80px) of top padding each —
  `body:not(.singular) main>article:first-of-type{padding:8rem 0 0}` and the base `.post-inner{padding-top:
  8rem}`, only zeroed by `.reduced-spacing.missing-post-thumbnail .post-inner{padding-top:0}` (this
  project's `reduced-spacing` is already sitewide, so only `missing-post-thumbnail` was ever the missing
  half) — stacking to up to 160px of unwanted gap, confirmed by reading the real cascade, not guessed. This
  page's own `.entry-header`/`<h1 class="entry-title">` is separately hidden entirely by an existing vendor
  rule (`header.entry-header...{display:none}`) since the colored category banner already shows the title
  a second time, so none of that missing padding was ever serving a visible purpose. Fixed by adding the
  exact same `"singular missing-post-thumbnail"` pair every other content page already uses — checked every
  other rule scoped to either class first for side effects (none apply to anything this template renders).
  Fixes every category via the shared template, not just spumanti/bianchi, since the missing bodyClass was a
  template-wide gap from the start. `check`/`test:unit`/`build` all pass; confirmed in compiled output that
  all 6 category pages (both languages checked further) now carry the added body classes; fresh preview +
  19-route smoke test (all 6 category pages × implied language coverage, homepage ×3, 4 other content pages,
  1 product detail page) all pass. **Not yet confirmed live by the user.**

- Task 38: `/rossi/` category-listing page (all 3 languages — `/it/rossi/`, `/en/red-wines/`,
  `/de/rotweine/`; 5 wines), scope explicitly limited to this 1 category per request — every other category
  unchanged. Three changes: (1) card images swapped from the low-resolution `cardImageSrc` thumbnails
  (191×300, upscaled/cropped WP-generated crops) to each wine's own higher-resolution `productImage` (the
  same photo the individual wine's own detail page already uses — confirmed identical crop/framing, just
  637×1000 native res instead of a small thumbnail, before swapping, not assumed); (2) `.wine-title` text
  removed so cards show only the bottle photo, per explicit request; (3) the grid goes from 3 columns to 2
  on tablet/laptop widths (`min-width:768px`) for bigger, more readable cards — mobile (1 column) untouched.
  Extended `WineCard.astro`'s existing `imageVariant` prop (Task 36) with a third value, `"bottle-large"` —
  a real bottle photo (not a label image) with no title and a bigger box; every other category's default
  `"bottle"` behavior is byte-unchanged. New CSS (`.wine-image--bottle-large img`) uses plain `width`+
  `height:auto` rather than Task 36's fixed-box/`object-fit:contain` technique — measured that all 5 red
  wines' higher-res photos share one consistent ~0.637 aspect ratio (same crop as the old thumbnails, just
  higher-res), so no shape-normalizing box is needed here, unlike the label images. `.wine-list-container--
  large` (new modifier class on the category page's own template, not WineCard) overrides the vendor's
  `≥879px` 3-column rule to match its own already-2-column `768-878px` rule. `check`/`test:unit`/`build` all
  pass; confirmed in compiled output that rossi (all 3 languages) shows the new high-res images/no-title/
  2-column markup and every other category page is byte-unaffected; fresh preview + 13-route smoke test
  (including a wine product detail page, confirming its own image field is untouched) all pass. **Not yet
  confirmed live by the user.**

- Task 39: extends Task 38's "rossi" treatment to every remaining wine category (all 3 languages) — the
  entire wine section now looks and behaves identically across all 6 categories. Explicit request "do the
  same operation as red wines for all the other categories," with an `AskUserQuestion` resolving one real
  ambiguity first: spumanti/bianchi already had Task 36's custom label-image treatment (praised as looking
  nice) — confirmed the user wants that *replaced* by plain higher-resolution bottle photos to match every
  other category exactly, not preserved alongside a grid-only update. Data: all 25 remaining wines (8
  spumanti incl. 2 magnum, 6 bianchi, 4 affinati, 4 frizzanti-e-rosati, 3 passiti) across all 3
  `wines*.json` files got the same `cardImageSrc`→`productImage` swap Task 38 did for rossi — verified
  every one of the higher-resolution files shares the same ~0.637 aspect ratio as rossi's (one outlier,
  Creativo Prosecco, is a larger 1200×1880 file but the *same* ratio — same crop, just even higher native
  resolution), so no per-category CSS variation was needed, confirming `bottle-large`'s existing
  plain-`width`+`height:auto` CSS (no `object-fit` box) already generalizes correctly. Code: the 3 category
  page templates' per-category `imageVariant` branching (Task 36/38's `LABEL_CATEGORIES`/
  `LARGE_BOTTLE_CATEGORIES` sets) collapsed to a single unconditional `imageVariant = "bottle-large"`, since
  every category now behaves identically — no more branch to maintain. `cardImageSrcset` (and the `sizes`
  attribute that was inert without it) removed entirely from `WineCard.astro` and all 3 templates, since
  every wine in `wines*.json` had that field deleted once every category converted, making the prop
  permanently unused. `WineCard.astro`'s `"label"`/plain-`"bottle"` variant code paths are themselves now
  unused by any caller but were left in place, not deleted — a recently-built, still-correct, documented
  capability, not legacy cruft. **Correction, caught before committing:** 11 of Task 36's 12 label JPEGs
  turned out to have silently overwritten pre-existing, already-committed Task 9 bottle photos that
  happened to share the exact same filenames (Task 36's own collision check was buggy — a plain `ls`, not a
  `git log` check, so it missed files that existed in git history). Confirmed those 11 filenames had zero
  remaining references anywhere once `cardImageSrcset` was deleted sitewide, then reverted all 11 to their
  original Task 9 content with `git restore --source=HEAD` — zero effect on anything live, pure correction.
  Only `public/wp-content/uploads/2021/01/creativo-v-rigoni.jpg` (no collision, genuinely new) remains as
  the one flagged-but-unused leftover. Full account in `IMPLEMENTATION_NOTES.md`'s Task 39 entry.
  `check`/`test:unit`/`build` all pass (one round of `check`
  errors from the `cardImageSrcset` removal, caught and fixed before the final pass — see
  `IMPLEMENTATION_NOTES.md`); confirmed in compiled output that all 18 category pages (6 categories × 3
  languages) show the new markup and zero old low-res image sources remain sitewide; fresh preview +
  23-route smoke test all pass. **Not yet confirmed live by the user.**

- Task 40: native cross-document View Transition (browser-level, not Astro's ClientRouter/SPA routing —
  this stays a fully static, prerendered multi-page site) between the spumanti category page's wine cards
  and each wine's own product page — the bottle image now morphs smoothly into its new position/size across
  the navigation instead of an instant cut. Scoped to spumanti only for now, per explicit request ("only do
  prosecchi e spumanti... for now"), presented as the recommended option out of 3 alternatives discussed
  first (native cross-document transitions vs. Astro's ClientRouter — rejected as too risky given how much
  bespoke scroll/animation JS this site has — vs. a manual JS/sessionStorage FLIP approach). Implementation:
  `BaseLayout.astro`'s new opt-in `enableViewTransitions` prop emits the required
  `<meta name="view-transition" content="same-origin">` tag only on pages that need it (never sitewide —
  that would give *every* navigation a default whole-page cross-fade, a real, unscoped animation change);
  `WineCard.astro`'s new optional `viewTransitionName` prop and matching inline style on the product page's
  own bottle `<img>` give the *same* `view-transition-name` to what is, since Task 38/39, already the same
  underlying image file at two sizes, so there's no source-image mismatch for the browser's automatic
  interpolation to paper over. Reduced-motion visitors get the animation fully disabled (not just slowed),
  matching this project's existing convention elsewhere. No JS was added — the browser handles the entire
  transition natively; on browsers without cross-document View Transition support (Safari, Firefox, as of
  this writing), the meta tag/`view-transition-name` are simply inert and navigation works exactly as
  before. `check`/`test:unit`/`build` all pass; confirmed in compiled output that the meta tag and matching
  `wine-bottle-<slug>` names are present and identical between the spumanti category page and each of its 8
  wines' product pages (all 3 languages), and completely absent from every other category page and every
  non-spumanti product page; fresh preview + 14-route smoke test all pass. **Not yet confirmed live by the
  user** — this is a genuinely new animation effect that needs to be seen in a supporting browser (Chrome/
  Edge) to judge whether it reads as smooth/correct, especially given this sandbox can't run a browser at
  all to self-check the actual transition.

- Task 41: removed the 2 magnum-bottle wines (`creativo-prosecco-millesimato-brut-doc-treviso-magnum`,
  `pinot-nero-spumante-millesimato-brut-magnum`, both spumanti) entirely from the site, per explicit request
  ("they are the same as their equivalent, it gives no extra information to show them"). Deleted both
  entries from all 3 `wines*.json` files (confirmed via `grep` these were the only references anywhere in
  `src/` before removing — no hardcoded links, no sitemap). Removing the JSON entries alone was sufficient:
  the category pages filter from these files (so spumanti now shows 6 wines instead of 8) and the product
  detail pages are generated via `getStaticPaths()` mapping over the same array (so both magnum product
  pages simply stop being generated — confirmed their URLs now correctly 404). The 2 magnum-specific
  product images (`creativo-magnum-v-rigoni-e1611075125873.jpg`, `pinot-nero-magnum-v-rigoni-
  e1611075622852.jpg`) are now unused — left in place, flagged here, not deleted, matching this project's
  established convention; their PDF spec sheets were already shared with the non-magnum wines, so nothing
  there is orphaned. `check`/`test:unit`/`build` all pass; confirmed in compiled output that both magnum
  product pages are absent from `dist/` and spumanti's card count dropped from 8 to 6 in all 3 languages;
  fresh preview + route smoke test (including confirming the old magnum URLs now 404) all pass.

- Task 42: homepage hero video (all 3 languages), two related changes prompted by the user asking "is there
  something not working?" about briefly glimpsing what looked like the old carousel. (1) The `<video>`'s
  `poster` attribute (one of the original 4 carousel photos) removed per explicit request ("can you just
  have a white background as the static fallback") — replaced with plain `background-color:#fff` on
  `.hero-slider__video` (matching `.loading-screen`'s own white), not a substitute image, since the video
  fills the box completely the instant it can render a frame either way. (2) A real, found bug, not just a
  request: `LoadingScreen.astro`'s reveal timing was decoupled from whether the hero video had actually
  started playing — `MIN_DISPLAY_MS` is a floor timed from script start, not gated on video readiness, so on
  a slow-enough connection (a real risk given the hero video is still uncompressed/16.7MB, per Task 35's own
  disclosed limitation) the loading screen could finish and reveal a page whose video was still showing its
  fallback — the loading screen's own stated purpose (hiding exactly that kind of in-progress load state)
  defeated by its own timing. Fixed by having `onLoaded()` also wait for the hero video's `canplay`/`error`
  event (or resolve immediately if no video is present, or it's already `readyState >= HAVE_FUTURE_DATA`) in
  addition to the existing minimum-display floor, both racing against the pre-existing `MAX_WAIT_MS`
  absolute backstop so a video that never loads still can't trap a visitor indefinitely. This is a bug fix
  in Task 13/27/30's already-approved loading-screen behavior, not a new design decision, so didn't need
  fresh design approval per `CLAUDE.md`'s own stated exception for that case. Also confirmed and explained,
  not fixed (nothing was actually broken here): the loading screen intentionally only plays once per browser
  session (`sessionStorage`-gated, Task 13's own approved design) — a repeat homepage visit within the same
  session skips it entirely by design, which is the other plausible explanation for what was briefly seen.
  `check`/`test:unit`/`build` all pass; confirmed in compiled output that the `poster` attribute is gone,
  `background-color:#fff` is present, and the new `canplay`/`HAVE_FUTURE_DATA` logic is present, in all 3
  languages; fresh preview + 8-route smoke test all pass. **Not yet confirmed live by the user** — same
  caveat as Task 40: whether this actually eliminates the visible flash on a real slow connection can't be
  verified in this sandbox at all, only reasoned through.

- Task 43: reordered the 6 spumanti wine product pages' layout (all 3 languages), scope explicitly limited
  to spumanti for now per request. Now on its 3rd live-feedback round. Current state: bottle + title + spec
  icons occupy their original position; everything that follows — flavor description, winemaking-process
  description (`vinificazione`), and the remaining short fields (gradazione/coltivazione/resa
  media/abbinamenti/servizio) + PDF button — all live inside `.description`, the single column beside the
  bottle (round 3 moved the short-fields block, `.wine-other-info`, back inside `.description`; round 2 had
  left it as a separate full-width block below, per an earlier, more literal reading of "under both of
  them" that round 3's "keep all info on the right side" superseded). The bottle image (`.wine-image`) is
  now `position:sticky` (desktop/tablet only, `min-width:769px`) so it stays visible while the now much
  taller description column scrolls past it — relies on CSS Grid's default `align-items:stretch` giving
  `.wine-image` a tall cell to scroll within, no JS; its own `max-height` is additionally capped to
  `min(780px, calc(100vh - 120px))` in that same scope, per a live follow-up that a short viewport must
  never crop the sticky bottle. The flavor text now sits directly *on top of* the Rigoni V-logo (round 2's
  `float:left` wrap-beside approach is replaced with `position:absolute` logo behind + `position:relative;
  z-index` text in front — same low-opacity `filter:invert(1)` recolor from round 2, unchanged) per an
  explicit "on top, not beside" correction. `.description`'s pre-existing, unscoped `#f8f8f8` background
  (twentytwenty-style.min.css, present on every category, not introduced by this task) is overridden to
  white, scoped to spumanti only via a new `.wine-spumanti` class on `<article>` (also used to scope the
  sticky-bottle rules, since `.wine-image`/`.description` are otherwise unscoped vendor selectors shared by
  every category). Flavor paragraphs (not the process paragraph) get `font-style:italic`. No new text was
  written anywhere across any round — every word was already in `wines*.json`, only relocated/restyled.
  Every other category's product pages render byte-identical to before this task — confirmed directly in
  `dist/`, not assumed, in all 4 rounds. Round 4 (live feedback: "the pictures do not seem to stick at
  all... delete the type: info... as it is obvious"): the sticky bottle genuinely wasn't sticking — root
  cause was `#site-content{overflow:hidden}` (twentytwenty-style.min.css, every page), which breaks
  `position:sticky` on any descendant since the sticky scrollport ends up clipped. Fixed by passing a new
  `bodyClass="wine-spumanti"` prop to `BaseLayout` (existing mechanism, reused) from the 3 product templates,
  so `body.wine-spumanti #site-content{overflow:visible}` overrides it scoped to only these 18 pages — every
  other page keeps the clip unchanged. Also dropped the "Tipologia"/"Type"/"Charakter" line from
  `.wine-other-info`'s field list for spumanti only (redundant given page/category context, per request) —
  the non-spumanti tipologia-row keeps it, unchanged. Round 5 (live: "still not sticky", asked whether a
  working sticky bottle would then overlap the footer): the `overflow:hidden` fix from round 4 was
  necessary but not sufficient — the actual remaining blocker was CSS Grid's default `align-items:stretch`
  stretching `.wine-image`'s own box to match `.description`'s full height, which leaves *zero slack* for a
  sticky element to move through (a stretched box already equals its container's height by definition) —
  it just renders at the top and scrolls normally, indistinguishable from `position:static`, matching "not
  sticky at all" exactly. Fixed with `align-self:start` on `.wine-image` (standard, required companion to
  `position:sticky` in every documented "sticky sidebar beside long content" pattern), which keeps its box
  at its own natural height, leaving real slack within the row to stick through. This also answers the
  footer question directly: the row's own height (and thus the sticky stop point) is still bounded by
  `.description`'s height, comfortably inside `.wine-container` — the footer is a sibling of `#site-content`
  at the body-grid level, entirely outside this row, so the bottle structurally cannot reach it regardless.
  `check`/`test:unit`/`build` all pass at every round; fresh preview + route smoke tests pass each round (23
  routes this round, including the homepage and chi-siamo as controls the `#site-content` override must not
  affect). Round 6 (live: "empty space between the header and actual content, which suddenly disappears
  when I scroll down... residue of animation"; plus "add some space between the title, the stickers, and
  the text"): root-caused the gap to Task 40's *root* view transition, which had never been explicitly
  styled — the browser's default behavior doesn't just cross-fade, it animates the root snapshot's own
  width/height from the outgoing page's captured size to the incoming page's, and since the spumanti
  category page and a wine's own product page are very different heights, that resize animation was
  visible mid-flight as a blank gap below the header until it finished growing (or a scroll forced a
  repaint) — inherent to Task 40 itself, not something Task 43's later CSS introduced. Fixed with the
  standard technique for this: `::view-transition-old(root), ::view-transition-new(root) { animation: none;
  }`, which swaps the (visually-identical, shared) chrome instantly while leaving the actually-requested
  named `wine-bottle-*` bottle-morph transition fully untouched. Also added small (+10px each), explicitly
  scoped spacing bumps for "premium feel": `.description h1`'s bottom margin (title → spec icons) and
  `.specs-row`'s bottom margin (spec icons → flavor text), both otherwise-unscoped vendor rules, overridden
  under `.wine-spumanti` only. `check`/`test:unit`/`build` all pass; fresh preview + 23-route smoke test
  (same set as round 5) all pass. Round 6's own fix, while a real improvement, turned out not to be the
  cause of the gap — live re-test still showed it, and diagnostic questions (confirmed: happens on a direct
  load with no click-through, ruling out the view-transition entirely; happens on non-spumanti wine pages
  too, ruling out every spumanti-scoped change in this task) narrowed it to a sitewide mechanism whose
  visual effect only shows up on wine pages. Round 7: root cause is `stickyHeader()`'s `.sticky` toggle
  doing two things with mismatched timing on first scroll — `position:fixed` (instant, unanimatable) and
  `.pre-header-inner`'s collapse (animated over 0.35s, Task 25) — for that 0.35s window the still-collapsing
  fixed header covers a strip of the content `#site-content` just shifted into, then uncovers it as the
  pre-header finishes collapsing, reading as "a gap closing." This is a sitewide mechanism (every page has
  it) but only visually obvious where the top content is blank/white (a bottle photo) rather than full-bleed
  (hero video, chi-siamo's imagery) — matching "only on wine pages" exactly. Fixed by removing the pre-header
  transition specifically on wine product pages via `body:has(article.single-wines) header#site-header
  .pre-header-inner{transition:none}` (`.single-wines` is on every wine product page's `<article>`
  unconditionally, spumanti or not) — the collapse becomes instant, synchronized with `position:fixed`'s own
  instant switch, eliminating the timing-mismatch window entirely. Every other page's header keeps its
  existing smooth 0.35s collapse (Task 25/34's own prior decision), unchanged. `check`/`test:unit`/`build`
  all pass; fresh preview + 8-route smoke test (including a non-spumanti wine page and 4 non-wine controls)
  all pass. Round 7's live re-test: "still the same issue" — the user then clarified the bug is not wine-page-
  specific at all: on *every* page, there's a downward jump when the language switcher (pre-header) collapses
  on first scroll; wine pages *additionally* show their own separate white space between the top of the page
  and the content, on top of that shared jump. Round 7's fix, scoped only to wine pages, was therefore both
  too narrow and treating a symptom (the animation timing) rather than the actual mechanism. Round 8: found
  the real mechanism — `#site-header` lives in `body`'s own CSS Grid (`grid-area:header`), and `.sticky`
  switches it to `position:fixed` (vendor rule), which is an instant, unanimatable change that removes the
  header from grid flow the moment it happens, instantly collapsing the grid's header row and shifting all
  following content up by the header's *full* previous height — well before `.pre-header-inner`'s own 0.35s
  collapse (Task 25) has even started animating. Fixed at the source, not by chasing the timing further:
  `header#site-header.sticky { position: sticky }` overrides the vendor's `position:fixed`. A sticky element
  never leaves flow, so it keeps contributing its real, current height to the grid row at all times — the
  existing pre-header collapse animation now naturally carries the content along with it frame-by-frame
  instead of the content jumping to its end state before the animation starts. This removes the jump on every
  page, with no per-page scoping needed (round 7's `body:has(article.single-wines)` patch was removed
  outright, superseded). The end visual state (header pinned to the top while scrolling) is unchanged — only
  the transition into that state is fixed — so this is a bug fix of Task 25/34's existing approved behavior,
  not a new design decision. `check`/`test:unit`/`build` all pass; compiled CSS confirmed (`position: sticky`
  present, `body:has(article...)` fully gone); fresh preview + 8-route smoke test (a spumanti wine page in all
  3 languages, a non-spumanti wine page, plus homepage/chi-siamo/cantina/category-page controls) all pass.
  **Not yet confirmed live by the user.** The separate wine-page-specific white space (on top of the now-fixed
  jump) has not yet been root-caused — nothing in this task's own CSS obviously explains it, and it needs
  either a screenshot or one more precise detail (e.g. whether it's present before any scroll at all, on the
  very first frame of load) once the user can check whether it's still there after this round's fix.

- Task 44: extended Task 43's spumanti product-page layout to every wine category (bianchi, rossi, affinati,
  frizzanti-e-rosati, passiti — all 3 languages), by explicit request ("implement the wine page layout on all
  the other categories... the wine page layout is that which we worked on in the prosecchi e spumanti
  categories"), once approved for spumanti. Confirmed first that every one of the 28 wines across all 6
  categories carries both `tastingNoteParagraphs` and `vinificazione` (`wines.json`, not assumed) — no data
  gap that would have forced a partial rollout, so the full set was implemented rather than only bianchi/rossi.
  The 3 product templates' `isSpumanti`-gated branch (the new layout) is now the *only* branch — the old,
  pre-Task-43 layout (flat label:value list including "Tipologia"/"Type"/"Charakter", plus a separate
  full-width flavor box further down) is removed outright, not kept as a second, now-dead code path. The
  "Tipologia"/"Type"/"Charakter" line is dropped from every category's info list, for the same reason it was
  dropped for spumanti (redundant given the category page you arrived from). `isSpumanti` itself is kept, but
  now only gates Task 40's cross-document View Transition (still explicitly spumanti-only, unrelated to this
  task, unchanged) — nothing else. Every `.wine-spumanti`-scoped rule in site.css is rescoped to `.single-wines`
  (present unconditionally on every wine product `<article>`) instead; the `#site-content{overflow:visible}`
  fix, which needs to reach an ancestor of `<article>`, switched from the now-removed `bodyClass="wine-spumanti"`
  prop to `body:has(article.single-wines)` (the same technique already proven in Task 43 round 7). No values
  (spacing, sticky offsets, colors, italics) changed from the approved spumanti design — only what they're
  scoped to. `check`/`test:unit`/`build` all pass (0 errors/warnings, the one pre-existing unrelated `locale`
  hint only). Confirmed directly in `dist/`, all 6 categories × 3 languages (one representative wine per
  category, 18 pages checked): `.single-wines` class present, `wine-tasting-section`/`wine-process-section`/
  `wine-other-info` present, `text-wine-container`/`wine-color-logo` (the old layout's markup) absent,
  "Tipologia"/"Type"/"Charakter" absent. Confirmed Task 40's View Transition scoping is untouched: exactly 18
  pages (6 spumanti wines × 3 languages) carry `view-transition-name`, matching before this task exactly. Fresh
  preview + full route smoke test: all 84 wine product pages (28 wines × 3 languages) plus 11 non-wine controls
  (homepages, chi-siamo, cantina, all 6 category listing pages) — 95 routes, 0 failures. **Not yet confirmed
  live by the user** — this is a visual layout change and this sandbox cannot screenshot it, consistent with
  every other visual task this session.

- Task 45: two follow-up polish items on the (now shared, Task 43/44) wine product-detail page. (1) The
  serving-temp badge's text (`.contenuto-specs`, a leftover vendor `lustria`/600 font) now uses
  `var(--body-font-family)`/400 — the same font the header menu itself resolves to. Also asked whether badge
  content (text + the glass/food SVG icons) should turn white on a dark-enough badge background: measured
  all 6 category colors against the W3C contrast-ratio formula for both black and white — black wins on
  every one, even the more saturated tones (rossi/affinati/frizzanti-e-rosati) — so none are "dark enough" by
  the numbers. Presented this to the user directly; they chose to keep black everywhere over their own
  visual instinct, so this is a confirmed no-op, not an oversight — no conditional-color CSS was added, since
  nothing in today's palette would ever trigger it. (2) `.wine-other-info` (the short remaining fields +
  "SCHEDA TECNICA"/"PRODUCT SHEET"/"WEINBESCHREIBUNG" PDF button) is now a native `<details>` element,
  collapsed by default, behind a `<summary>` toggle labeled "Altre informazioni"/"Other info"/"Weitere
  Informationen" — no JS, matching this project's preference for native disclosure widgets over hand-rolled
  ones. Per live follow-up on the toggle's look ("minimal and elegant... just text, with an arrow that
  changes direction... like a closed and open folder"): plain text, no background fill, small triangle that
  rotates 90° (right → down) on open, browser's own default marker suppressed so only that one arrow shows.
  `check`/`test:unit`/`build` all pass (0 errors/warnings, the one pre-existing unrelated `locale` hint).
  Confirmed in `dist/`, one wine per category × 3 languages (18 pages): `<details>` present, correct
  per-language label, collapsed by default (no `open` attribute), `.tipologia-row`/`.buttons-row` both
  inside. Fresh preview + full route smoke test: same 95-route set as Task 44, 0 failures. **Not yet
  confirmed live by the user** — the toggle's open/close interaction and arrow rotation need a real browser,
  consistent with every other visual/interactive task this session.

  Round 2 (live feedback): "I do not want the 'other info' text to be in caps lock" — dropped
  `text-transform:uppercase` (and its accompanying `letter-spacing`) from `.wine-other-info__toggle`; the
  labels themselves were already sentence-case in the markup, so removing the CSS transform was sufficient.
  "I do not like the triangle... a bigger icon that looks like this >" — swapped the small filled-triangle
  glyph for a literal `>` character at 20px/700-weight (up from 10px), same 90°-rotate-on-open behavior.
  Also asked to check the SCHEDA TECNICA button, suspected broken: static inspection alone (HTML/CSS diff)
  didn't surface anything, so asked the user what "broken" looked like rather than guessing — answer: "the
  background of the button icon overflows." Root-caused: `.arrowBtn` (vendor CSS) only overrides
  `padding-top`, leaving the other 3 sides to fall through to the theme's generic `button{padding:1.1em
  1.44em}` reset (sized for a text button, not this small icon square); combined with `.arrowBtn`'s own
  `height:100%`, resolved against `.scheda-wine`'s definite grid-row height (a context that only exists on
  this page — the same `.arrowBtn` class is reused unscoped in `WineCard.astro`'s card list, but in a
  non-grid context where `height:100%` is a no-op, so that usage was correctly left untouched), the icon's
  inherited padding needs more vertical room than the row provides, pushing the button's own dark background
  past the row's bounds. Fixed with `padding:0` (explicit on all 4 sides now) plus flexbox centering,
  scoped to `.scheda-wine .arrowBtn` only — a structural fix (center via flex, not a re-tuned padding
  number) so the same class of bug can't recur if the row's height changes again later. `check`/`test:unit`/
  `build` all pass; confirmed in compiled CSS: no bare unscoped `.arrowBtn` rule exists, only the correctly
  scoped one. Fresh preview + full 95-route smoke test, 0 failures. **Not yet confirmed live by the user.**

- Task 46: `/it/contatti/` (+ `/en/contatti/`, `/de/contacts/`) team section redesign — explicit request:
  white page background instead of the current grey, the 3 team members (Stefano/Michele/Annamaria) turned
  into rounded cards carrying that same grey as their own background, all 3 visible side by side on desktop,
  one at a time with a horizontal swipe on mobile (viewport "sticking" to the current card, i.e. scroll-snap),
  and more breathing room between each card's photo/name/role/description. CSS-only — no content-HTML
  changes on any of the 3 pages. The background lives in a WordPress Grids-plugin custom property
  (`--_gs-bg-desktop`/`-tablet`/`-mobile`, read by a `::before` pseudo-element, set inline in the scraped
  HTML) on a `.titolo-pagine` section — that class is shared with chi-siamo/cantina's own title sections, so
  the override is scoped by each language's own unique WordPress post ID (`#post-953` IT, `#post-1566` EN,
  `#post-1770` DE). The 3 team-member blocks (`.wp-block-uagb-team.uagb-team__outer-wrap` and everything
  inside) are confirmed unique to this section sitewide and identical across all 3 languages, so the card
  styling itself (`background:#ede9e4`, `border-radius:20px`, `padding:50px 30px`, plus spacing bumps) needed
  no per-page scoping. Card equal-height relies on a structural guarantee already in the Grids plugin
  (`--_ga-row:1/7` + `align-self:stretch;height:100%`) rather than a re-tuned min-height. Mobile
  (`max-width:768px`) overrides the vendor's own `.grids-s-w_i{flex-direction:column}` stacking, scoped via
  `.grids-s-w_i:has(> .contatti-team)`, to `flex-direction:row` + native `scroll-snap-type:x mandatory` — not
  a JS port of the landing page's vertical scroll-jacking brake, a deliberately simpler, standard mechanism
  for the same "settles on one card" result. `check`/`test:unit`/`build` all pass; confirmed in compiled
  `dist/`: correct post IDs matched, 3 card blocks per page across all 3 languages; confirmed chi-siamo/
  cantina's own title sections are unaffected. Fresh preview + 10-route smoke test all pass. **Confirmed
  working live by the user** ("Everything works as intended. good.") — this is the first visual task this
  session to reach that status rather than staying at "not yet confirmed."

- Task 47: contatti page follow-up polish, 5 parts. (1) Each card's email now sits at the exact same height
  across all 3 cards ("more of an ordered feeling") — the mailto link (previously just the last line of the
  bio paragraph, so its height varied with bio length) is pulled out of flow and anchored to a fixed
  `bottom:30px` on the card, which only lines up reliably because Task 46 already forces the 3 cards to equal
  height; the card gets matching `padding-bottom` so bio text of any length can't collide with it, and a
  `border-top` gives it a quiet "footer" separation. (2) The photo between the team cards and the contact-
  info/form section had gone invisible — root-caused to a scraped `-100px` overlap margin (a WP block-editor
  trick) on both the team section's own bottom margin and the photo section's own top margin, tuned against
  Task 46's *shorter, transparent* predecessor section; Task 46's taller, opaque white section now pulls the
  photo up behind itself instead of just tucking under it. Fixed by zeroing both sides of the overlap (the
  `.titolo-pagine` bottom margin, and the photo's own `grids-section` top margin, the latter targeted
  structurally via `:has(> .grids-s-w_i > .grids-area > figure.wp-block-image)` since it carries no unique
  class, combined with each language's own post ID so no other page's own photos are affected) — a bug fix of
  Task 46's own layout, not a new design decision. (3) That photo is now the user-supplied
  `cantina-rigoni-cortile.jpg` (converted from the supplied PNG, 1448×1086), replacing
  `cantina-rigoni-outside.jpg` everywhere it was referenced across all 3 languages; the old multi-size
  `srcset` was dropped (single `src`, matching how other single-use photos in this project are already
  handled) rather than generating new resized copies for the new image. (4) The intro paragraph next to the
  form and all 3 team members' bios were rewritten for a more professional register, in all 3 languages —
  confirmed scope via `AskUserQuestion` (bios included, not just the general copy) before touching real
  business content; no facts, names, roles, or contact details changed, each language's own existing meaning
  preserved (the German intro paragraph says something substantively different from IT/EN's — an invitation
  to visit vs. an offer to answer enquiries — left as its own message rather than unified, since reconciling
  that would be inventing content change beyond "more professional wording"). (5) The "Be Social" heading and
  its Facebook/Instagram/LinkedIn icon links are removed entirely (real deletion, not `display:none`) from
  all 3 contatti pages' content — footer's own separate social icons (`src/content/chrome/footer.html`) are
  untouched, confirmed still present in compiled output. `check`/`test:unit`/`build` all pass; confirmed in
  compiled `dist/` across all 3 languages: new photo present, old photo reference gone, "Be Social"/
  `getwid-social-links` gone, all 3 mailto links present, footer social icons still present; confirmed chi-
  siamo's own photos are unaffected by the structural `:has()` selector. Fresh preview + 10-route smoke test,
  new image confirmed loading (200). **Not yet confirmed live by the user.**

- Task 48: contatti spacing/photo follow-up. Two leftover blank-space gaps, both traced to specific,
  pre-existing vendor spacing values, not anything introduced by Task 46/47: (1) top-of-page-to-cards and
  part of cards-to-picture came from a scraped `--_ga-m-desktop:75px 0 75px 0` on the `.titolo-pagine`
  section's direct-child wrapper (untouched since the original site, no class of its own — targeted
  structurally via the section's own child combinator, same post-ID scoping as every other Task 46/47
  override) — reduced to 20px top/bottom. (2) The rest of cards-to-picture was a separate, much larger
  `100px` bottom *padding* on `.titolo-pagine` itself (`--_gs-p-desktop`) — not the negative-margin overlap
  Task 47 already fixed (that only hid the photo; this padding is plain reserved space, never touched) —
  reduced to 20px, matching the margin trim so neither gap ends up visually tighter than the other. Also: a
  white-to-transparent fade (`linear-gradient`, 100px tall) added to the top edge of the photo via a
  `::before` on `figure.wp-block-image` (pseudo-elements don't render on `<img>` itself), and the photo
  resized to 90% width, centered — `figure.wp-block-image` (both the sizing and the fade) is scoped by each
  language's own post ID, since it's a generic WordPress core class that chi-siamo/cantina's own unrelated
  photos also use. `check`/`test:unit`/`build` all pass; confirmed all 4 new declarations present in
  compiled CSS; fresh preview (own instance — a pre-existing, unrelated preview session on this machine was
  left running untouched, per this project's process-hygiene convention) + 10-route smoke test, all pass.
  **Not yet confirmed live by the user.**

- Task 49: removed the photo between the cards and the contact-info/form section outright (explicit
  request, superseding Task 48's fade/resize work on it) — the whole `grids-section`/`grids-s-w_i`/
  `grids-area`/`figure` chain deleted from all 3 content files, plus the now-fully-unused
  `cantina-rigoni-cortile.jpg` asset and Task 47/48's dead CSS for it (visibility fix, fade, resize — all
  removed rather than left matching nothing). "No blank space except for the necessary" between cards and
  the contact section: rather than reduce two stacked paddings further, removed the redundancy — the
  contact-info/form section already carries its own pre-existing `40px` top padding (untouched, its own
  purpose, unrelated to this task), so `.titolo-pagine`'s own bottom padding (previously trimmed to 20px in
  Task 48 specifically to leave room for the photo) goes to `0`; the one remaining gap is exactly that
  section's own 40px, not two paddings added together. The separate top-of-page-to-cards margin fix from
  Task 48 is untouched (unrelated to the photo). `check`/`test:unit`/`build` all pass; confirmed in compiled
  `dist/`: photo/figure markup gone from all 3 languages (the one remaining `<figure>` match on the page is
  an unrelated footer funding-logos banner, confirmed by reading its own context), 3 team cards still
  present per language, dead CSS rules confirmed gone from compiled output. Fresh preview + 10-route smoke
  test, all pass. **Not yet confirmed live by the user.**

- Task 50: contact section reflow (explicit request). The intro paragraph + "Email:" line are pulled out of
  the old left column into their own new full-width `.grids-area` (`.contatti-intro`, a hand-added marker
  class matching how `.contatti-team` was already scraped in) placed *before* the two-column row —
  `column:2/12` (the combined span of both columns below it), `row:1/2`, with hours/form shifted from
  `row:1/4` to `row:2/5` so they sit after it instead of overlapping it. The address block is deleted
  outright (not the "left column" alone — no other placement was named for it), and the now-orphaned spacer
  that used to separate email/social from hours goes with it. The lone remaining "Orari"/"Opening Hours"
  block (new `.contatti-hours` marker class) is centered — `justify-content:center;align-items:center` on
  top of `.grids-area`'s own existing vendor `display:flex;flex-direction:column` — within "the remaining
  space," which in practice is the row's real height, set by the *form* column next to it (the taller of the
  two). Google Map: height increased 300px→480px (width was already `100%` of its column, already
  "increased" as far as that axis goes); a `40px` top padding added to its own section, which previously had
  literal zero padding/margin separating it from the section above. `check`/`test:unit`/`build` all pass;
  confirmed in compiled `dist/` across all 3 languages: new intro/hours areas present with correct row
  values, form's own row shifted to match, "Indirizzo"/"Address"/"Adresse" gone entirely, map CSS present.
  Fresh preview (own instance — a pre-existing, unrelated preview session on this machine, again on `pts/4`,
  left running untouched) + 10-route smoke test, all pass. **Not yet confirmed live by the user.**

- Task 51: 3 quick follow-ups on Task 50. (1) The "Email:" paragraph under the intro is deleted outright
  from all 3 content files — `.contatti-intro` now holds only the intro paragraph. (2) Hours and form swap
  sides — only each element's own `--_ga-column` value is swapped (`.contatti-hours` 2/7→8/12, the form's own
  area 8/12→2/7); DOM order is untouched, which is fine since hours has no focusable content that could
  create a confusing tab-order jump ahead of the form; each element keeps its own padding/spacing as-is,
  since those were tuned for content, not column position. (3) "Move opening hours back to the top, instead
  of center" — reverses `.contatti-hours`'s `justify-content:center` (the vertical axis "top" vs "center"
  actually describes) to `flex-start`, matching the vendor's own default in effect; `align-items:center`
  (horizontal centering) is kept, since "top instead of center" only ever described vertical position.
  `check`/`test:unit`/`build` all pass; confirmed in compiled `dist/` across all 3 languages: email paragraph
  gone, hours now at column 8/12, form now at column 2/7, `.contatti-hours` rule confirmed `flex-start`.
  Fresh preview (own instance — the same pre-existing `pts/4` session left untouched again) + 10-route smoke
  test, all pass. **Not yet confirmed live by the user.**

- Task 52: bottom padding added below the intro paragraph ("the text"), "to give more of a premium feel" —
  same modest-bump convention used elsewhere for this exact reason (Task 43 round 6's precedent).
  `.contatti-intro`'s own padding was `0 10px 0 10px` (zero bottom) since Task 50 first created it; now
  `0 10px 30px 10px`. `check`/`test:unit`/`build` all pass; confirmed in compiled CSS. Fresh preview +
  5-route smoke test, all pass. **Not yet confirmed live by the user.**

- Task 53 (branch `phone-opt`): first mobile-experience fixes, following a code-level audit (no live device
  available in this sandbox) that flagged 3 candidate issues; explicit request to fix the first, add a
  new phone-only feature for the second, and fix the third only if it turned out easy. (1) The Google Map's
  480px height (Task 50) was never scoped to a breakpoint, so it applied on phones too, where a full-width,
  480px-tall map dominates the screen — added a `max-width:768px` override capping it to `220px`. (2) A
  phone-only *auto-advancing* carousel for the 3 contatti team cards, layered on top of the existing manual
  swipe (Task 46's scroll-snap, untouched) rather than replacing it: `public/scripts/site.js`, a new
  `autoSwipeContattiCards()` IIFE matching the file's existing pattern (self-guarding, no-ops on any page
  without the carousel). Finds the same container via the identical selector site.css already uses
  (`.grids-s-w_i:has(> .contatti-team)`) so CSS and JS are provably talking about the same element; advances
  every 5s via `scrollTo({behavior:"smooth"})`, wrapping back to the first card at the end; respects
  `prefers-reduced-motion` (skips the feature entirely, not just slows it down); stops for good on the
  visitor's first real touch/pointer interaction, rather than fighting a manual swipe or silently resuming
  later; only runs inside the `max-width:768px` breakpoint, re-evaluated live via `matchMedia` so it
  correctly starts/stops across a resize/rotation, not just once at page load. (3) Confirmed easy: the
  "form first, hours second" question turned out to need no CSS at all — desktop uses explicit
  `--_ga-column`/`--_ga-row` placement (order-independent), while mobile falls back to a plain flex-column
  stack that follows DOM order — so just reordering the two `.grids-area` blocks in the scraped HTML (form
  before hours) fixes mobile stacking order with zero effect on desktop's already-explicit positions.
  `check`/`test:unit`/`build` all pass (0 errors/warnings, the one pre-existing unrelated `locale` hint);
  `node --check` on `site.js` separately, since `astro check` doesn't cover plain `public/` JS. Confirmed in
  compiled `dist/`: form precedes hours in all 3 languages' markup, the mobile map-height media query is
  present, `autoSwipeContattiCards` is in the compiled `site.js`. Fresh preview + 10-route smoke test, all
  pass; confirmed `/scripts/site.js` itself serves 200 with the correct JS content-type. **Not yet confirmed
  live by the user** — this is the first genuinely interactive (not just responsive-layout) mobile behavior
  this session, and touch/gesture behavior is exactly the kind of thing that needs a real device.

- Task 54 (branch `phone-opt`): sideways-scroll fix, the first finding confirmed on a real phone (via a
  `localtunnel` tunnel to a local preview server — the `astro preview --allowed-hosts` flag was needed for
  Vite's host-checking to accept the tunnel's hostname, hit and fixed live). Deliberately did *not* reach for
  the obvious blanket `overflow-x:hidden` on `html`/`body`: per the CSS Overflow spec, setting `overflow-x`
  to anything but `visible` also forces `overflow-y` non-`visible` on that same element (the "paired axis"
  rule), and any ancestor with non-`visible` overflow breaks `position:sticky` inside it — the exact bug Task
  43 round 4 already found and fixed once this session. `html`/`body` are ancestors of both this site's sticky
  elements (header, wine bottle), so that reflex fix would have silently undone two already-hard-won fixes.
  Root-caused instead: the vendor theme's own `#site-content{overflow:hidden}` already clips horizontal
  overflow in the main content area on every page except wine pages (deliberately, for the sticky bottle) —
  header and footer, both siblings of `#site-content`, have no such protection. Grepped for `100vw` (the
  classic source of this exact bug) and found exactly one hit: `.footer-row-logo`'s own full-bleed shimmer
  breakout, in the footer, present on every page — matching a persistent, not page-specific, complaint.
  Confirmed footer is not an ancestor of either sticky element (safe to clip, unlike the header, which
  couldn't safely get this either — its desktop nav dropdown needs to visually extend past its own box).
  Fixed with `footer#site-footer{overflow-x:hidden}`, plus `overscroll-behavior-x:none` added to the
  existing `html{overscroll-behavior-y:none}` rule for symmetry (removes any residual horizontal
  bounce/rubber-band gesture too, not just genuine overflow). `check`/`test:unit`/`build` all pass; confirmed
  both new declarations present in compiled CSS, and confirmed `position:sticky` still present twice
  (header + wine bottle, unaffected). Fresh preview — same server the user's phone tunnel was already
  pointed at, restarted in place on the same port so the existing tunnel kept working without needing to be
  re-run — + 10-route smoke test, all pass. **Awaiting live re-confirmation from the same phone that reported
  the original bug.**

- Task 54 round 2 (branch `phone-opt`): the footer fix above was real but insufficient — user re-tested live
  and reported "issue is still there, sides are not locked." Rather than guessing a third blind fix, shipped
  a temporary on-page diagnostic (`debugOverflowTemporary()` in `site.js`, outlined offending elements in red
  and listed their exact measurements in a fixed bottom panel, since the reporting phone has no devtools
  access) and had the user re-test with it live. It surfaced two concrete, unrelated overflow sources with
  exact pixel measurements, both now root-caused and fixed, both scoped in `site.css`:
  1. **Hamburger toggle, 15px right-overflow.** The vendor theme only ever hides the desktop inline menu
     (`.header-navigation-wrapper`/`.primary-menu-wrapper`) behind `@media(max-width:782px){.admin-bar
     .overlay-header ...}` — a body-class combination from logged-in WordPress admin views that doesn't exist
     on this static rebuild — so the full desktop menu was never actually removed from layout on mobile, only
     visually redundant next to the separate `.menu-modal` mobile overlay. As a flex child demanding its own
     `width:100%`, it forced `.header-inner` wider than the viewport, dragging the absolutely-positioned
     `.nav-toggle` (positioned `right:0` relative to that too-wide box) past the true edge with it. Confirmed
     via `src/content/chrome/header.html` that `.header-navigation-wrapper` holds only the desktop nav (the
     hamburger button and the mobile modal are both elsewhere in the DOM), so hiding it below the theme's own
     already-established desktop breakpoint (`@media (max-width: 999px) { .header-navigation-wrapper: none }`,
     matching the theme's own `min-width:1000px` reveal threshold) cannot affect either.
  2. **Homepage philosophy section, 10px right-overflow** on every text element inside it. It's the only
     `.grids-section.alignfull` sitewide with a non-zero margin (confirmed by checking every `alignfull`
     section in every content file) — but the Grids plugin only ever wires its width-adjustment custom
     property to `min-width` (a non-binding floor), never an actual `width`/`max-width` cap, so the theme's
     own `.alignfull{width:100%}` always won, and the section rendered at full container width *plus* its own
     10px+10px margin on top — the classic explicit-width-plus-explicit-margin overflow. Fixed by scoping
     `.home-philosophy-section.alignfull{width:calc(100% - 20px)}` to just this section.
  Removed the temporary diagnostic script once both fixes were confirmed in the build. `check`/`test:unit`/
  `build` all pass (0 errors, same one pre-existing unrelated hint); `node --check` on `site.js` separately.
  Confirmed in compiled `dist/`: `debug-overflow-panel`/`debugOverflowTemporary` fully absent, both new CSS
  rules (`999px` breakpoint, `.home-philosophy-section.alignfull`) present in compiled `site.css`,
  `autoSwipeContattiCards` still intact. Restarted the preview server in place on the same port (4321) so the
  user's existing tunnel keeps working; confirmed via `curl` with a synthetic tunnel `Host` header that both
  the page and the updated CSS serve correctly before asking for a re-test. **Not yet confirmed live** —
  awaiting the user's phone re-test of both fixes.

- Task 54 round 3 (branch `phone-opt`): round 2 was reported still broken live ("still the same problem"),
  plus a new symptom (no images/video loading). Investigated the loading symptom first: confirmed via direct
  `curl` that the local preview server serves every asset correctly (200, full bytes, including the 17MB
  hero video) but ignores `Range` request headers entirely (always 200 + full body, never 206) — a known
  local Wrangler/Workers dev-server limitation, not a code bug; likely the real explanation for mobile video
  failing to play over a bandwidth-constrained free tunnel. Documented as a probable testing-environment
  artifact, not chased further as a code fix.
  For the overflow issue (now failed twice live in a row — `CLAUDE.md`'s circuit breaker applies), the user
  correctly identified that both round-1 and round-2 fixes were too narrow: a page-wide right margin/padding
  persists on every page. Rather than guess a third narrow patch, **fixed the sandbox's Playwright/Chromium
  limitation itself** — Chromium was failing to launch only because of 3 missing shared libraries
  (`libnspr4.so`, `libnss3.so`, `libasound2`), fixable without root via `apt-get download` + `dpkg -x` (see
  `scripts/enable-playwright-libs.sh`, and `CLAUDE.md`'s new "Headless browser verification" section — this
  changes verification capability for *all* future tasks, not just this one).
  With real `getComputedStyle`/`getBoundingClientRect` access, found two real, previously-wrong conclusions:
  (1) round 2's `.header-navigation-wrapper` fix was based on a text-search heuristic that misread the
  vendor CSS's brace nesting — that wrapper was *already* unconditionally `display:none`, never gated behind
  `.admin-bar.overlay-header` as concluded; the fix was harmless but not the actual cause. (2) The real cause
  was the geppa child theme's `.nav-toggle .toggle-icon,.nav-toggle svg{width:70px;height:70px}` (mobile
  breakpoint) never being matched by a corresponding size increase on `.nav-toggle`'s own box — leaving a
  79px button trying to fit a 70px icon inside only ~31px of padding-reduced content space, a plain
  self-contained box-model bug with no relation to header width at all. Fixed with a `.header-inner
  .nav-toggle{padding:0}` override at the same breakpoint (needed the extra `.header-inner` for specificity
  parity with the vendor's own `.header-inner .toggle` rule — a plain `.nav-toggle{padding:0}` compiled fine
  but silently lost the cascade regardless of load order, caught only by measuring computed padding directly
  rather than assuming source order would decide it).
  Verified numerically (not just visually) via headless Chromium: `document.documentElement.scrollWidth -
  clientWidth` is `0` on every one of 9 representative routes (home, contatti, chi-siamo, cantina, en, de,
  news, a wine category page, a wine product page) at all 5 required breakpoints (375/414/768/1024/1440px) —
  45 checks, zero overflow anywhere. Also ran the project's own previously-dormant
  `scripts/route-smoke-test.mjs` (never runnable before this round) — 40/43 routes pass; the 3 failures are
  pre-existing `routes.mjs` test-fixture issues unrelated to this task (an `/it/privacy-policy/` blank-page
  misclassification, two stale wine slugs with a `-magnum` suffix that 404) and were left alone, out of
  scope for Task 54.
  Removed the temporary diagnostic script from `site.js` (no longer needed now that headless verification
  works). `check`/`test:unit`/`build` all pass. Restarted preview on the same port again; confirmed via curl
  that the diagnostic script is fully gone and the final CSS is being served. **Headless-verified as fixed
  across every required breakpoint and a representative page sample — still awaiting final live phone
  confirmation**, per `CLAUDE.md`'s status vocabulary (headless verification is strong evidence but isn't
  the same as a real device).

- Task 55 (branch `phone-opt`), two requests, both mobile-only:
  1. **Sitewide mobile content margin.** Measured via headless browser (not assumed): every page type's
     main content container spanned left=0/right=0 of the viewport at mobile widths — confirmed on contatti,
     chi-siamo, cantina, a wine category page, and a wine product page. Root cause: Task 32 removed a
     *desktop* 40px reservation sitewide (correct there — it looked unintentional with no visible container)
     using `.entry-content>*:not(.alignwide):not(.alignfull):not(.alignleft):not(.alignright):not(.is-style-
     wide){width:100%}` — that same rule also zeroed out mobile, where the effect reads as content crammed
     against the phone's bezel instead of clean. Fixed at `max-width:768px` by reusing Task 32's own selector
     verbatim (so alignfull/alignwide sections stay edge-to-edge as designed) plus the two other top-level
     containers that selector never covered (`.wines-row-container` for wine category pages, `.wine-container`
     for wine product pages, per Task 32's own comment) — 16px each side, `box-sizing:border-box` set
     explicitly on the latter two to guarantee no width-plus-padding overflow (the exact class of bug fixed
     sitewide in Task 54).
  2. **Homepage "Un vino che esalta i sensi..." section only occupying the left half on mobile.** Confirmed
     via the actual inline style (`src/content/main/home.html`) that `.bottone-centro`'s `--_ga-p-desktop`,
     `-tablet`, and `-mobile` were all identically `0 150px 0 0` — unlike its sibling `.home-closing-
     section__image`, which does carry a genuinely different mobile value, this column's padding was never
     actually authored for mobile at all, just copied through. The Grids plugin already collapses this
     section to a single stacked column at `max-width:768px`, so `.bottone-centro` was already full-width
     there — the unreduced 150px right padding was the only thing still visually confining the text to the
     left portion. Reduced to match the sibling's own mobile inset (8px) at the same breakpoint the layout
     itself collapses at, so desktop/tablet (where the 150px gap makes sense next to the 2-column layout) are
     completely untouched.
  Verified both numerically and visually via headless Chromium (`scripts/enable-playwright-libs.sh`):
  measured real content elements (not just container boxes) sitting at the intended left offset on every
  page type at mobile widths, confirmed zero change above the 768px breakpoint on all of them, and confirmed
  desktop's `.bottone-centro` padding is still exactly `150px` (byte-identical to before). Screenshots
  (`.bottone-centro` cropped, mobile vs. desktop) show the heading/paragraph/button now spanning the
  available width on mobile while desktop is visually unchanged. Full regression sweep (9 pages × 5
  breakpoints, the same suite from Task 54) still shows zero overflow anywhere — these additions didn't
  reintroduce it. `check`/`test:unit`/`build` all pass. **Headless-verified — not yet confirmed live.**

- Task 55 follow-up: user correctly reported the margin was missing specifically on the landing page, and
  asked for explicit confirmation the changes are mobile-only, not global. Found via Chrome DevTools
  Protocol's `CSS.getMatchedStylesForNode` (through the headless browser — inspecting the real matched-rule
  list rather than assuming source order, the same specificity trap already hit once this session on the
  nav-toggle fix): the geppa child theme carries its own pre-existing rule,
  `@media(max-width:767px){:root body.home .entry-content>*:not(...){width:auto}}` — one class more specific
  than the round-1 fix's selector (`body.home` vs. plain `body`), so it always won on the homepage
  specifically regardless of load order; every other page lacks the `.home` body class and was unaffected by
  it, which is exactly why the fix worked everywhere except there. Fixed with a homepage-specific rule
  matching that exact selector and its `767px` breakpoint.
  Re-verified comprehensively across all 9 representative routes at 6 widths (414/767/768/769/1024/1440):
  every page — including the homepage now — shows exactly `left:16px/right:16px` at ≤768px and exactly
  `left:0/right:0` at ≥769px, with zero `scrollWidth` overflow throughout. This is direct confirmation the
  changes are strictly mobile/tablet-scoped: at 769px and above, every single page measures byte-identical
  to its pre-Task-55 state. (Along the way, found `/news/` renders a genuinely empty `<main id="site-
  content">` in this local preview regardless of wait time — a pre-existing, unrelated issue; `TODO.md`
  already flags News scope as out of bounds for unrelated tasks, so left untouched.) `check`/`test:unit`/
  `build` all pass again. Screenshot re-confirms both Task 55 fixes together on the homepage: the closing
  section itself now sits inset from the phone edges, and its text still uses the section's full available
  width.

- Task 56 (branch `phone-opt`), 4 homepage spacing/layout fixes, mobile-only (`max-width:768px`, desktop/
  tablet completely untouched — verified numerically, see below):
  1. **Hero video → "Dalla campagna al bicchiere" gap** reduced from ~283px to ~231px. Two contributors
     found via `CSS.getMatchedStylesForNode`: an empty spacer section's 40px bottom padding, and the vendor
     theme's own generic `.alignfull{margin-top:5rem}` rule (unconditional, not part of the Grids plugin's
     per-instance system at all — explains why Task 54's per-instance override never touched it). Both
     reduced, not zeroed: the remaining ~231px is mostly the section's own decorative graphic (which the
     title overlaps into via a deliberate negative margin), not truly blank space.
  2. **Philosophy title/paragraphs/button "stuck to the right"** — confirmed the text column had an
     unreduced desktop value (`padding-left:80px;padding-right:0`, meant to sit text beside a graphic in the
     2-column desktop layout) plus `text-align:left`, which on the mobile single-column layout pushed text
     hard right with 80px of dead space on its left. Replaced with a small symmetric inset and
     `text-align:center` (also centers the button).
  3. **Grape photo → "La nostra collezione" gap** reduced from ~276px to ~88px. Found a second Grids-plugin
     mechanism along the way: the plugin's `.grids-s-w_i` (inner wrapper) independently consumes the exact
     same padding/margin custom properties as expected on the outer `.grids-section`, so overriding the
     outer box's padding alone only ever fixes part of it — the wrapper needs its own direct override too
     (custom-property inheritance to the wrapper didn't visibly apply the way `getComputedStyle` suggested it
     should; a direct `padding-top` override on the actual wrapper element was used instead of continuing to
     chase why).
  4. **Bottle photo → "Un vino che esalta i sensi" gap**, reduced from ~156px to 24px (`.bottone-centro`'s
     own unreduced desktop `margin-top:120px`), plus a new bottom-20% fade on the photo itself
     (`linear-gradient(to bottom, transparent, #000)`, mirroring the existing desktop-only horizontal fade's
     technique from Task 31) so the now-tighter transition into the title reads as designed.
  Verified via headless Chromium throughout, not just visually: measured all 4 gaps precisely, confirmed
  `document.documentElement.scrollWidth` overflow stays `0` across 8 representative pages × 6 breakpoints
  (375/414/768/769/1024/1440px — the same regression suite from Tasks 54-55), and explicitly re-confirmed
  desktop (1440px) computed values for every touched property (`padding-left:80px`, `text-align:left`,
  `padding-right:150px`, `margin-top:120px`) are byte-identical to before this task. Confirmed the fix
  applies on `/en/` and `/de/` homepages too (same shared component structure), not just `/it/`.
  `check`/`test:unit`/`build` all pass. **Headless-verified — not yet confirmed live** on the user's phone.

- Task 57 (branch `phone-opt`), 3 more requests, mobile-only (`max-width:768px`), desktop/tablet verified
  untouched:
  1. **Hero video bottom-20% fade** — same `::after` gradient technique as Task 56's bottle-photo fade,
     added to `.hero-slider` (already `position:relative;overflow:hidden`). Fades to white
     (`linear-gradient(to bottom, transparent, #fff)`), not black — corrected live after an initial version
     used black (copied directly from the bottle-photo fade without reconsidering that the hero sits above
     a white page background, not a black section like the bottle does).
  2. **Hero → philosophy gap, reduced further** past Task 56's 231px. Measuring every element in the gap
     (not just the ones already touched) found two more contributors Task 56 missed: `.post-inner{padding-
     top:5rem}` (`parent-style.min.css`, unconditional at every width — the theme has its own zero-override
     for pages without a hero thumbnail, `.reduced-spacing.missing-post-thumbnail`, but the homepage
     correctly doesn't carry that class since it has its own video), and the empty spacer's *inner*
     `.grids-area.content-grid`, which still had its own unreduced 40px bottom padding (Task 56 only fixed
     the outer section, not this nested area — the same "two separate consuming elements" shape found in
     that task's Grids-plugin discovery). Both fixed via `body.home`-scoped overrides so the sitewide
     `.post-inner` rule (relied on by other pages) isn't touched. Gap now ~139px, down from ~283px
     originally across both rounds.
  3. **chi-siamo (+ EN `/en/the-estate/`, DE `/de/unternehmen/`) — sticky "V" watermark.** First attempt
     (a JS-driven fixed-position/placeholder swap, kept sticky all the way to the photo gallery further down
     the page) was reported back as wrong and needlessly complex — superseded below, see the follow-up
     entry for the corrected, much simpler version actually shipped.
  Verified headlessly throughout: hero fade screenshot shows a real bottom fade; the hero-to-title gap
  measured 139px after the fix. Full regression sweep (10 pages × 6 breakpoints, including the correct EN/DE
  chi-siamo routes — the obvious `/en/chi-siamo/` guess actually 404s, the real EN/DE routes were found via
  `scripts/routes.mjs`) shows zero overflow anywhere. Explicitly re-confirmed on desktop (1440px) that the
  hero's `::after` fade has no content (media query correctly excludes it). `check`/`test:unit`/`build` all
  pass. **Headless-verified — not yet confirmed live** on the user's phone.

- Task 57 follow-up (branch `phone-opt`): user clarified the sticky-V scope was much smaller than built —
  "remain sticky in the first text, until the first picture" (the "I nostri vigneti" photo right after the
  first text section, not the gallery further down), and asked for the JS-driven approach to be replaced
  with something simpler, explicitly noting the opacity fix wasn't needed (text was already readable).
  Removed `initChiSiamoStickyV()` from `site.js` entirely. With the range now bounded to just the first
  section (V and its paragraph are the only two children of the same flex-column `.grids-s-w_i`), plain CSS
  `position:sticky` does the whole job on its own — no JS, no placeholder, no scroll listener: sticky's own
  natural range (bounded by the element's nearest block-level ancestor) happens to end exactly where that
  shared parent does, right before "I nostri vigneti" begins.
  `.v-rigoni-bg:has(img[src*="V-rigoni-bianco"])` scopes this to chi-siamo's own V specifically (confirmed
  the same filename is reused verbatim on all 3 languages) without affecting the homepage's differently-
  named `.v-rigoni-bg` graphic. `top:104px` matches this page's own sticky (scrolled) header height,
  measured directly.
  This alone didn't stick at all when tested live — `#site-content{overflow:hidden}`
  (`twentytwenty-style.min.css`, unconditional at every width) is an ancestor of the V and breaks
  `position:sticky` for anything inside it, the exact same mechanism already documented in this project for
  the desktop-only wine-bottle fix (Task 43 round 4), just tripping again here on mobile since that existing
  fix only reverses the clipping for desktop wine-product pages. Added the equivalent reversal scoped to
  chi-siamo only (`body:has(.chi-siamo-gallery) #site-content{overflow:visible}`, mobile-only), preserving
  Task 54's sitewide mobile overflow-clipping safety net everywhere else.
  Verified live at multiple scroll positions (not just implemented and assumed correct): the V's `top`
  correctly clamps at 104px while stuck, releases cleanly with no overlap once "I nostri vigneti"'s photo is
  scrolling into view, confirmed identically on `/en/the-estate/` and `/de/unternehmen/`, and confirmed
  desktop (1440px) is completely unaffected (`.v-rigoni-bg` stays `position:relative`, `#site-content` keeps
  its original `overflow:hidden`). Full 10-page × 6-breakpoint overflow sweep still clean — the scoped
  `overflow:visible` reversal didn't reopen anything. `check`/`test:unit`/`build` all pass.
  **Headless-verified — not yet confirmed live.**

- Task 58 (branch `phone-opt`): 3 chi-siamo styling requests (mobile-only, continuing that scope) plus one
  wine-page fix added mid-message ("in the specific wine pages, ensure the V logo sits behind the flavor
  text, as currently it sits above it").
  **Chi-siamo's sticky-V section:**
  1. **White background.** The cream color isn't a plain `background-color` — the Grids plugin paints it via
     a `.grids-s-w_i::before` pseudo-element (confirmed via computed style: checking the section's own
     `backgroundColor` read transparent; the real `#ede9e4` only showed up on the `::before`). Overridden
     there, scoped to `.titolo-pagine:has(.v-rigoni-bg)` (unique to this section — the homepage's own
     philosophy section has a different structure entirely, so this can't leak there).
  2. **Reduced the ~50px gap** between that background's edge and the V's own visible top (measured, not
     assumed — traced to the wrapping `.grids-area`'s own margin) down to 16px, matching the small-inset
     convention already established in Tasks 55-56.
  3. **Grey V instead of white**, so it's still visible now that the background is white too (white-on-white
     would've been invisible). Reused the homepage's own pre-made grey asset (`V-rigoni-grigio.png`, same
     graphic, confirmed near-identical aspect ratio to the white one already in use) via `content:url(...)`
     on the `<img>` rather than editing the HTML content files in all 3 languages — keeps this purely
     CSS-scoped to mobile, no `<picture>`/`srcset` rework needed.
  **Wine product pages, V-behind-text:** traced to a mobile-only override (`@media(max-width:768px)`) that
  reset `.wine-tasting-section__logo` to `position:static`, which made it render as its own separate block
  *above* the tasting-note paragraph instead of overlapping *behind* it — the desktop treatment (absolute,
  low z-index, text layered in front, per the component's own existing comment) was correct and untouched
  the whole time; only mobile had regressed to a different, simpler stacked layout at some earlier point.
  Removed the `position`/`margin`/`z-index` parts of that override, keeping only the mobile-appropriate
  `width:80px` (down from desktop's 140px) — the base rules now apply at every width, so desktop needed no
  change at all here (it was never broken).
  Verified via computed style (not just visual) that all three chi-siamo changes and the wine-page fix are
  live on mobile and confirmed absent/unchanged on desktop (1440px): chi-siamo's background/image/margin all
  read back to their original pre-task values, and the wine logo stays 140px/absolute/z-index:0 as always.
  Confirmed the chi-siamo changes apply identically on `/en/the-estate/` and `/de/unternehmen/`. Full 10-page
  × 6-breakpoint overflow sweep still clean. `check`/`test:unit`/`build` all pass.
  **Headless-verified — not yet confirmed live.**

- Task 59 (branch `phone-opt`), mobile-only, continuing that scope (the cantina request didn't repeat it
  explicitly, but a desktop screenshot confirmed that page's bottle photo looks intentional and clean there
  — only mobile crops it strangely, so desktop stays untouched, matching every other task this session):
  1. **Sticky V, smaller/top-left, releasing earlier.** It was rendering ~362px wide (near full container
     width) because of the Grids plugin's own `align-self:stretch` default on flex-column children —
     overridden to `align-self:flex-start` plus `width:90px`, which both shrinks it and stops it stretching
     to fill the row, anchoring it at the flex container's start (left) edge. For "increased bottom spacing
     instead of following the text to the end": added `margin-bottom:220px` directly on the sticky element
     itself — `position:sticky` only runs out of room when the containing block's *remaining* space is less
     than the sticky element's own margin box, so a real margin-bottom on the element directly shortens how
     long it sticks, releasing with room to spare rather than right at the paragraph's end. Verified with a
     fine-grained scroll trace (every 100px, not just a few spot checks) — sticks cleanly from ~400px to
     ~900px of scroll, then releases with no residual overlap.
  2. **cantina (+ EN `/en/winery/`, DE `/de/weinkeller/`) — removed the overflowing bottle photo.** Its
     wrapping section carries `--_gs-m-desktop:-280px 0 200px 0` — a large negative top margin, identical at
     every breakpoint in the source markup. A desktop screenshot confirmed this reads as an intentional,
     clean overlap there (wide layout, plenty of room) — the same value crops the same photo awkwardly
     close and isolated on mobile's much narrower layout, matching "sits strangely." `display:none` at
     `max-width:768px`, scoped via the image's own *unsuffixed* src
     (`cantina-rigoni-vittorino-produzione.jpg`) rather than the bare filename — the *homepage's* closing
     section reuses this exact same photo at a *sized* variant
     (`cantina-rigoni-vittorino-produzione-1024x682.jpg`), confirmed directly in both pages' markup, so this
     can't accidentally hide the homepage's own bottle section (kept intentionally in Tasks 56-57).
  Verified via computed style that both fixes are live on mobile and confirmed unchanged on desktop (1440px):
  chi-siamo's V stays its natural desktop width with `margin-bottom:0`, cantina's bottle section stays
  `display:block`. Confirmed both apply identically across all 3 languages. Full 12-page × 6-breakpoint
  overflow sweep (added the 2 new cantina-equivalent routes to the existing suite) still clean.
  `check`/`test:unit`/`build` all pass.
  **Headless-verified — not yet confirmed live.**

- Task 60 (branch `phone-opt`), mobile-only: the sticky V mechanism removed entirely, replaced with the
  same "logo behind text" overlap technique already approved for the wine product pages. User reported both
  the stickiness itself and a large empty gap between the V and text before scrolling — both traced to one
  root cause: the V was a normal in-flow sibling of the paragraph, always occupying its own real vertical
  space above the text regardless of sticky/static; stickiness only ever changed *when* that space stopped
  scrolling, never removed it.
  Replaced with `position:absolute` on the V (`top:-20px;left:0;z-index:0`, matching the wine page's own
  `.wine-tasting-section__logo` offset for visual consistency between the two treatments) plus
  `position:relative;z-index:1` on the sibling paragraph — the V comes out of flow entirely, so the
  paragraph becomes the sole in-flow child and starts right where the container does, no gap left to create
  the "buggy" look. Deleted the now-unneeded sticky-specific rules (the `position:sticky`/`top:104px` block,
  the `align-self:flex-start`/`margin-bottom:220px` release-tuning block, and the chi-siamo-scoped
  `#site-content{overflow:visible}` exception — sticky's overflow-breaking trap doesn't apply to
  `position:absolute`, so that exception was pure dead weight once sticky was gone, and removing it restores
  Task 54's full sitewide mobile overflow safety net there too).
  This alone put the V *below* the text instead of overlapping its top-left corner — found via CDP's
  matched-styles list (not the Grids custom-property system this time) that the paragraph had its own
  pre-existing `margin-top:-140px` from a genuinely mobile-only vendor rule
  (`@media(max-width:768px){.v-rigoni-bg+div{margin-top:-140px}}`, geppa theme's own CSS) — presumably
  written for the page's original, simpler in-flow V design before this session's changes. Neutralized to
  `margin-top:0` for this new layout specifically; confirmed via computed style that desktop was never
  affected by that vendor rule in the first place (its own margin-top reads `0px` natively, no override
  needed there).
  Verified via computed style at load (not just after scrolling, since there's nothing scroll-dependent left
  to check) that the V renders `position:absolute` and stays that way regardless of scroll position on both
  `/it/chi-siamo/` and `/it/cantina/`, and confirmed the same on all 4 EN/DE equivalents. Full 12-page ×
  6-breakpoint overflow sweep still clean. `check`/`test:unit`/`build` all pass.
  **Headless-verified — not yet confirmed live.**

## Completed / frozen project state

The rebuilt Italian website is approved work. Do not reopen, refactor, redesign, or modify completed work unless the active task strictly requires it.

As of this task, the project has entered **Phase 2: the improvement phase** — see `CLAUDE.md` for the
updated rules governing intentional, approved divergence from the original live site. The frozen-work list
below still applies unchanged; Phase 2 tasks build on top of it.

Completed or inactive work:

- Task 1: Italian website remake for `/it/`, main Italian pages, wine category pages, and product pages.
- Task 2: functional `/it/contatti/` backend/contact-form implementation with email, confirmation, captcha, and retained submissions.
- Task 3: paused/inactive visual-parity bug-fix task. Do not work on it unless the user explicitly reactivates it.
- Task 4: completed/inactive Italian News landing page at `/it/news/`. Superseded by Task 9's shared `/news/`.
- Task 5: completed/inactive Italian Dati societari page at `/it/dati-societari/`. Do not modify unless explicitly reactivated.
- Task 6: completed/inactive Cloudflare Web Analytics beacon + real `/it/privacy-policy/` page. Do not modify unless explicitly reactivated. Merged to `main` at commit `94209c1`.
- Task 7: completed/inactive fix for `ShareButtons.astro` URL-encoding (all 6 links, including Stumbleupon)
  and contact-form server-side length validation. Committed at `716b02a`, merged to `main`. Note:
  `ShareButtons.astro` itself was later deleted entirely by Task 12 — this entry is historical. Detail:
  `IMPLEMENTATION_NOTES.md`.
- Task 8: completed/inactive fix for missing `bodyClass="singular missing-post-thumbnail"` on `chi-siamo`,
  `cantina`, and `contatti`. Do not modify unless explicitly reactivated. Committed at `03a0459`, merged to
  `main`. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 9: completed/inactive build of `/en/` and `/de/` website trees (mirroring the Italian architecture,
  filled with real live English/German content), a shared language-neutral `/news/` page (with `/it/news/`
  kept as a 301 redirect), and country-based root `/` routing, plus a follow-up fix for missing hero
  captions and broken category-list links on the `/en/`/`/de/` landing pages. Do not modify unless
  explicitly reactivated. Committed at `05d2bb3` (build) and `202972d` (bug fixes), merged and pushed to
  `main`. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 10: completed/inactive fix for EN/DE contact-page profile description font-size (matched the role
  text; should be smaller) and the homepage wine-type list formatting (was disorganized/unstyled) — both
  traced to Task 9 reusing Italian-specific page-scoped CSS for EN/DE instead of extracting each language's
  own. Do not modify unless explicitly reactivated. Committed at `9685010`, merged and pushed to `main`.
  Detail: `IMPLEMENTATION_NOTES.md`.
- Task 11: completed/inactive removal of every Shop Online link/button (desktop nav, mobile menu, footer
  icon, product-page buy button) across all 3 languages. Per explicit user decision, the product page's
  6-column icon-row grid was deliberately left unchanged, leaving visible empty space in columns 4-6 at
  desktop widths — a known, accepted outcome, not a bug. Do not modify unless explicitly reactivated.
  Committed at `67da275`, pushed to `origin/shop-online` (not yet merged to `main`). Detail:
  `IMPLEMENTATION_NOTES.md`.
- Task 12: completed/inactive removal of all social-share counts and share links (the entire
  `ShareButtons.astro` component, used only on the 3 wine product pages) — including deleting the now-
  orphaned component file and the sitewide `BaseLayout.astro` stylesheet link it alone required. No layout
  fix was needed (unlike Task 11). Do not modify unless explicitly reactivated. Merged to `main`. Detail:
  `IMPLEMENTATION_NOTES.md`.
- Task 13: completed/inactive homepage-only loading screen (white → black → landing page reveal), plays
  once per browser session via `sessionStorage`. Do not modify unless explicitly reactivated. Merged to
  `main`. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 14: completed/inactive removal of the homepage hero carousel's caption text/containers (full
  removal, including orphaned CSS) and the Luis Sepúlveda citation overlay on
  `/it/cantina/`, `/en/winery/`, `/de/weinkeller/`. Do not modify unless explicitly reactivated. Not yet
  committed. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 15: completed/inactive dead-code/complexity audit. Tier 1 (typechecker-flagged unused params) fixed
  directly. Tier 2 findings were all reviewed and approved by the user for removal: orphaned share-button
  CSS/JS left behind by Task 12's `ShareButtons.astro` removal (`public/styles/site.css`,
  `public/scripts/site.js`) plus its unlinked vendor CSS file, and the Phase 1 live-site parity-screenshot
  infrastructure (`docs/parity/`, `scripts/screenshot-baseline.mjs`, `scripts/screenshot-compare.mjs`, and
  their now-dangling `package.json` script entries) — all deleted. Do not modify unless explicitly
  reactivated. Committed at `a653155`, pushed to `origin/new-landing-page-2` (not yet merged to `main`).
  Detail: `IMPLEMENTATION_NOTES.md`.
- Task 16: completed/inactive header fix — the header ("up menu") no longer changes size on scroll. Per
  explicit user decision, it now always shows its compact/"scrolled" appearance (50px logo, language-
  switcher/social-icons pre-header bar hidden) at every scroll position and screen width; only its
  `position: fixed` pinning while scrolling is unchanged. Site-wide (`public/styles/site.css`), not
  homepage-only. Do not modify unless explicitly reactivated. Not yet committed. Detail:
  `IMPLEMENTATION_NOTES.md`.
- Task 17: completed/inactive full-viewport hero with a fully-opaque, reversible white fade — **confirmed
  working live by the user.** The hero now fills the viewport below the header (never overlapping it) and
  turns fully white right before "Dalla campagna al bicchiere" would appear, reversible by scrolling back
  up. Replaced the fully-discarded prior landing-page-redesign attempt at the same effect. Homepage only,
  desktop/tablet only (≥769px). Do not modify unless explicitly reactivated. Not yet committed. Detail:
  `IMPLEMENTATION_NOTES.md`.
- Task 18: completed/inactive scroll-jacking brake into "Dalla campagna al bicchiere" — **confirmed working
  live**, including a trigger-timing refinement (engages as soon as the user starts scrolling down, ~30px
  threshold, rather than waiting for the section to already be nearly in view; animation duration now scales
  with distance, 400-1200ms, so the now-often-longer slide never looks like a blur or drags). 5 implementation
  attempts total before landing on a working technique — see `IMPLEMENTATION_NOTES.md` for the full history
  (CSS scroll-snap turned out unreliable in practice; the working version self-animates via
  `requestAnimationFrame` rather than delegating to the browser). Homepage, desktop/tablet only (≥769px). Do
  not modify unless explicitly reactivated. Not yet committed.
- Task 19: completed/inactive follow-up polish — increased the pre-philosophy-section scroll spacing
  (Task 18's `margin-top` refinement) from 150px to 280px, and removed the hero's `v-rigoni-b-g.png`
  watermark logo (`.hero-slider__v-logo`) entirely, from every slide across all 3 languages. Do not modify
  unless explicitly reactivated. Not yet committed. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 20: completed/inactive "La nostra collezione" redesign — **confirmed working live.** Centered
  heading/text, 2-column carousel+category-list layout replaced by 6 category image-buttons in a horizontal
  row (mapping verified against `src/data/wines.json`/`categories*.json`, not guessed). Went through several
  live-reported fixes: a `position: relative` bug that made the whole section invisible (the Grids plugin's
  background pseudo-element painted in front of it); bigger/tighter-grouped images; a heading centering +
  font-size fix (a theme CSS specificity conflict was silently overriding the centering); an image swap
  (Affinati button) with a follow-up `object-fit: contain` fix after the swapped-in image's different native
  framing caused visible cropping. Removed the now-fully-orphaned Getwid image-slider CSS/JS as a direct
  consequence. Homepage, all 3 languages, all screen sizes. Do not modify unless explicitly reactivated. Not
  yet committed.

**⚠ `public/wp-content/uploads/2020/12/Cabernet-sauvignon-rigoni.png` (used by Task 20) is untracked in
git** — a pre-existing gap (51/52 other files in that directory are tracked; this one was never `git add`ed)
that predates this project's work but is now load-bearing. Must be staged alongside other changes next time
this work is committed, or the image will be missing on a fresh clone/deploy.

**Known open issue (found during Task 12 verification, pre-existing, not caused by Task 12, not yet
fixed):** root `/` country-based routing (Task 9) always redirects to `/en/` in this sandbox's local
`astro preview`, regardless of the `cf-ipcountry` header sent — reproduced on the clean last-committed
state before Task 12 too, so it predates Task 12. Not investigated further since no active task has
authorized touching root-routing code. See `IMPLEMENTATION_NOTES.md` Task 12 for how this was confirmed.

Preserved constraints from completed work:

- The live Italian website at `rigonivittorino.com/it` remains the source of truth for visible layout, typography, images, spacing, animation, navigation, footer, content, and responsive behavior.
- Preserve the approved rebuilt Italian site except where the active task requires a narrow change.
- English (`/en/`) and German (`/de/`) websites, the shared `/news/` page, and root `/` country
  routing are implemented (Task 9, frozen). Do not modify unless explicitly reactivated. Do not
  translate/correct/improve their content, or reopen the frozen Italian pages beyond Task 9's narrow
  language-switcher/shared-News wiring, without explicit reauthorization.
- Do not modify `rigonivittorinoshop.it`, ecommerce systems, cart, checkout, account, products, payments, or external shop behavior.
- This site no longer has any links or buttons pointing to `rigonivittorinoshop.it` (Task 11, frozen) — do
  not re-add them, and do not "fix" the resulting empty space in the product-page icon row's columns 4-6,
  which is a deliberate, user-confirmed outcome, not a bug. Both changes require explicit reauthorization.
- Do not modify Task 2 contact-backend code (`src/pages/api/contact.ts`, `src/lib/rate-limit.ts`,
  `src/lib/email.ts`, `src/lib/turnstile.ts`, the D1 migration); Task 7's narrow authorization to touch
  `src/lib/contact-validation.ts` is complete and frozen along with it.
- `/it/privacy-policy/` and Cloudflare Web Analytics are implemented (Task 6, frozen); do not modify unless
  explicitly reactivated.
- `/it/dati-societari/` (Task 5) is completed/frozen; do not modify it except to reuse its already-finalized company-identity text for reference.
- Do not work on Task 3 visual bugs or further News scope as part of this task.
