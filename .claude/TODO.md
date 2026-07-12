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
