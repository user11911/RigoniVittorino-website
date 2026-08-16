# TODO.md

This file contains task-specific project work. `CLAUDE.md` contains permanent rules and must be followed for every task.

Detailed implementation history for completed tasks lives in `IMPLEMENTATION_NOTES.md`, not here — this file
stays focused on current/active work plus the compact status list below, per `CLAUDE.md`'s own "Discovery
before editing" step 4.

## Active tasks

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
