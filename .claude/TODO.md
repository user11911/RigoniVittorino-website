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
  live by the user** after 5 attempts (3 CSS scroll-snap variants failed on an unreliable-in-practice
  technique; a passive JS nudge-after-settle worked but felt disconnected; the final active scroll-jacking
  version, self-animated via `requestAnimationFrame` rather than delegated to the browser, is what shipped).
  Scrolling down into the section captures input and animates it to centered before releasing control back —
  a deliberately assertive interaction, by explicit request. Homepage, desktop/tablet only (≥769px). Do not
  modify unless explicitly reactivated. Not yet committed. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 19: completed/inactive follow-up polish — increased the pre-philosophy-section scroll spacing
  (Task 18's `margin-top` refinement) from 150px to 280px, and removed the hero's `v-rigoni-b-g.png`
  watermark logo (`.hero-slider__v-logo`) entirely, from every slide across all 3 languages. Do not modify
  unless explicitly reactivated. Not yet committed. Detail: `IMPLEMENTATION_NOTES.md`.

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
