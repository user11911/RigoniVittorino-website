# TODO.md

This file contains task-specific project work. `CLAUDE.md` contains permanent rules and must be followed for every task.

Detailed implementation history for completed tasks lives in `IMPLEMENTATION_NOTES.md`, not here — this file
stays focused on current/active work plus the compact status list below, per `CLAUDE.md`'s own "Discovery
before editing" step 4.

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
  fix was needed (unlike Task 11). Do not modify unless explicitly reactivated. Not yet committed. Detail:
  `IMPLEMENTATION_NOTES.md`.

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

## Task 13 - Active: homepage loading screen (white→black→landing page reveal)

Status: active.

### User request

Add a loading screen to the website that ensures the site is loaded before it's shown to the visitor. The
loading screen goes from white to black with a sliding effect from the center to both sides, showing the
Rigoni Vittorino logo (the one currently in the header, top left) centered on the black screen. Once the
site has loaded, the landing page is revealed through a sliding effect from both sides back to the center
of the same black screen.

### Design decisions confirmed with the user — do not re-litigate

Four genuine design ambiguities in the request were resolved via explicit questions before this task was
authorized, per `CLAUDE.md`'s Phase 2 "Design decisions require explicit approval before implementation"
rule:

1. **Reveal direction:** the black covering shrinks back inward — the exact reverse of the entry animation
   — so the landing page becomes visible first at the left/right edges, and the black disappears last at
   the center.
2. **Logo on black:** the current logo file (`/wp-content/uploads/2021/01/rigoni-vittorino.png`) is a black
   wordmark on a transparent background — invisible on a black screen except for its small Italian-flag
   stripe. **The user will supply a proper white/reversed version of the logo separately.** Do not invert
   the existing dark logo via CSS filter, and do not add a white plate/card behind it — both were offered
   and explicitly declined in favor of a real provided asset.
3. **Scope:** homepage only (`/it/`, `/en/`, `/de/`) — not every page on the site. **Updated after initial
   implementation:** plays only once per browser session (the first homepage load, in any language, of that
   session), not on every landing-page visit — tracked via a `sessionStorage` flag scoped to the origin, so
   seeing it on one language's homepage correctly skips it on the others afterward too. Resets when the
   tab/window closes (not permanent — deliberately not `localStorage`).
4. **Load trigger:** wait for the page's real assets to finish loading (the `window` `load` event), but
   never show the black screen for less than roughly 500ms even on instant/cached loads, so it doesn't read
   as a flash. Cap the wait with a safety maximum in case a real load event is ever delayed unexpectedly
   (see below).

### Where this lives (confirmed by direct investigation)

- The logo is `public/wp-content/uploads/2021/01/rigoni-vittorino.png` (confirmed via
  `src/content/chrome/header.html`) — viewed directly: black "RIGONI VITTORINO" wordmark on a transparent
  background with a small Italian-flag stripe underneath. No light/white/reversed version exists anywhere
  in the repo.
- All 3 homepage templates (`src/pages/it/index.astro`, `src/pages/en/index.astro`,
  `src/pages/de/index.astro`) are statically prerendered (`export const prerender = true`) and share
  `src/components/Hero.astro`, which renders 4 full-width background-image slides (~100-250KB each, all 4
  fetched eagerly regardless of which is visible) — this is the real "load" the screen is protecting
  against, since there's no server-side delay (the pages are static).
- `src/layouts/BaseLayout.astro` is the one shared layout every page renders through (header fragment →
  `<main><slot /></main>` → footer), and already supports optional per-page props (`bodyClass`,
  `mainClass`, `extraStyleFile`) — the natural place to add a new opt-in prop rather than hardcoding
  anything homepage-specific into the shared layout.
- No animation library exists in this project (`package.json` has none). All existing motion is plain CSS
  `@keyframes`/`transition` (e.g. `.hero-slider__caption`'s entrance animation in `public/styles/site.css`)
  plus small vanilla-JS (`public/scripts/site.js`, or a component's own inline `<script>`, as in
  `Hero.astro`) — and existing motion already respects `@media (prefers-reduced-motion: reduce)`. Follow
  both conventions: no new dependency, and reduced-motion support.
- The root `/` route (`src/pages/index.astro`) is an on-demand (not prerendered) country-redirect with no
  visible content of its own — not in scope; "the landing page" means the per-language homepages.

### Technical approach

- New component `src/components/LoadingScreen.astro`: a full-viewport `position: fixed` black element using
  `transform: scaleX()` with `transform-origin: center` (`scaleX(0)` = a 0-width line at the horizontal
  center, `scaleX(1)` = full width). Animating `0 → 1` reproduces "white to black, sliding from the center
  to both sides"; animating back `1 → 0` right before removal reproduces "sliding from both sides to the
  center" as the *exact reverse* of the entry, per the confirmed design decision. The logo sits centered on
  top as a separate element with its own independent opacity fade-in/fade-out — it must not be
  scaled/squished by the panel's `scaleX`.
- Add an optional `showLoadingScreen?: boolean` prop to `BaseLayout.astro` (default `false`, matching the
  existing prop pattern). When `true`, render `<LoadingScreen />` as the very first child of `<body>`,
  before the header fragment — this makes it visually cover the header too (a true full-page splash) and
  avoids any ancestor `transform`/`filter` accidentally scoping the `position: fixed` overlay to less than
  the full viewport (confirm at implementation time that nothing on `BaseLayout`'s ancestor chain sets
  either property).
- Only `src/pages/it/index.astro`, `src/pages/en/index.astro`, `src/pages/de/index.astro` pass
  `showLoadingScreen={true}` — no other page.
- Script behavior (in `LoadingScreen.astro`'s own `<script>`, following `Hero.astro`'s pattern of a
  per-component inline script): while active, set `body { overflow: hidden }` and mark the rest of the page
  `aria-hidden="true"` (and `inert` if supported) so keyboard/screen-reader users can't reach content that
  isn't visually revealed yet; wait for `window`'s `load` event AND a minimum ~500ms timer (whichever
  finishes later); also start a safety maximum timeout (~5s) that forces the reveal even if `load` never
  fires, so a single broken/slow asset can never permanently trap a visitor behind a black screen; on
  reveal, animate the panel back to `scaleX(0)`, then remove `aria-hidden`/`inert`, restore normal
  `overflow`, and remove the loading-screen element from the DOM entirely (not just hide it).
- `@media (prefers-reduced-motion: reduce)`: skip the sliding/scaling animation entirely, matching this
  project's existing convention (`.hero-slider__caption`) of jumping straight to the end state — decide the
  simplest correct reduced-motion behavior at implementation time (e.g. show the landing page immediately
  without the black-screen theatrics) and document the choice made.

### Logo asset — blocking sub-item, do not substitute

The user will supply a proper white/reversed version of the Rigoni Vittorino wordmark, expected alongside
the original at `public/wp-content/uploads/2021/01/` (exact filename to be confirmed with whatever is
actually provided). **If this asset does not exist yet when implementation begins, build and verify
everything else in this task, then stop and explicitly ask the user for the file** rather than
inverting/recoloring the existing dark logo or substituting a placeholder — both were explicitly declined
as options for this task.

### Route/file scope

Implement:

- `src/components/LoadingScreen.astro` — new component (markup, script).
- `src/layouts/BaseLayout.astro` — new optional `showLoadingScreen` prop, default `false`.
- `src/pages/it/index.astro`, `src/pages/en/index.astro`, `src/pages/de/index.astro` — pass
  `showLoadingScreen={true}`.
- `public/styles/site.css` — new CSS for the loading screen, following this file's existing conventions
  (see the "Hero" section for the established style: scoped class names, a documented
  `prefers-reduced-motion` block).
- The logo asset itself, once supplied by the user (see above).

Do not implement or modify:

- Any other page — this is homepage-only, per the user's confirmed scope decision above.
- `Hero.astro`'s own slider/crossfade/caption behavior, or any other existing component's behavior — this
  task only adds a new overlay that sits on top; it does not change how the homepage's existing content
  loads or renders underneath.
- Anything in the frozen-work list above (shop links, share buttons, contact-form backend,
  privacy/dati-societari pages, News).

### Testing and validation

- `npm run check`, `npm run test:unit`, `npm run build`.
- Route smoke test (`scripts/route-smoke-test-curl.mjs`) — confirm the 3 homepage routes still return 200
  and no other route's markup changed.
- Curl/grep-based confirmation that the new loading-screen markup appears only on `/it/`, `/en/`, `/de/` and
  nowhere else (e.g. wine pages, contact, news, privacy pages).
- Confirm the `prefers-reduced-motion` CSS block is present and structured the same way as the existing
  `.hero-slider__caption` one.
- Since Playwright/Chromium cannot launch in this sandbox (confirmed, permanent limitation — see
  `IMPLEMENTATION_NOTES.md`), the actual animation timing/visual result cannot be self-verified here. Per
  `CLAUDE.md`'s Phase 2 rules, describe the result precisely (markup/CSS/script behavior) and explicitly ask
  the user to check it locally (`npm run dev`/`preview`) before merging — do not claim visual confirmation
  that wasn't possible.

### Required Task 13 deliverables

- Summary of the implementation and how it maps to each of the 4 confirmed design decisions above.
- Files changed.
- Explicit status of the logo asset: used, or still pending from the user (with what to do once it's
  supplied).
- Confirmation no other page or existing component's behavior was touched.
- Commands run and results.
- Known limitations (expected: no pixel-level visual/animation-timing confirmation, per the Playwright gap
  above — ask the user to verify locally).
