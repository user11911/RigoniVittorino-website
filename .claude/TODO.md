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

Preserved constraints from completed work:

- The live Italian website at `rigonivittorino.com/it` remains the source of truth for visible layout, typography, images, spacing, animation, navigation, footer, content, and responsive behavior.
- Preserve the approved rebuilt Italian site except where the active task requires a narrow change.
- Do not modify English or German pages.
- Do not modify `rigonivittorinoshop.it`, ecommerce systems, cart, checkout, account, products, payments, or external shop behavior.
- Keep existing visible shop links pointing to `rigonivittorinoshop.it`.
- Do not modify Task 2 contact-backend code, except that Task 7 below narrowly authorizes adding
  server-side length validation to `src/lib/contact-validation.ts`. No other Task 2 file may be touched.
- `/it/privacy-policy/` and Cloudflare Web Analytics are implemented (Task 6, frozen); do not modify unless
  explicitly reactivated.
- `/it/dati-societari/` (Task 5) is completed/frozen; do not modify it except to reuse its already-finalized company-identity text for reference.
- Do not work on Task 3 visual bugs or further News scope as part of this task.


## Task 7 - Active: fix ShareButtons and contact-form validation bugs

Status: active.

### User request

Fix two known, previously-reported bugs that were identified during an earlier full-project bug review but
never actioned, because every task since then stayed narrowly scoped to its own goal:

1. `ShareButtons.astro`'s share links aren't URL-encoded.
2. The contact form's server-side validation has no max-length caps matching the client's `maxlength`
   attributes.

### Bug 1 — `ShareButtons.astro` missing URL-encoding

- File: `src/components/ShareButtons.astro`.
- Problem: the `title` and `url` props are interpolated directly into the `mailto:`, Facebook, Twitter,
  Reddit, and LinkedIn share URLs without `encodeURIComponent()`. Currently dormant — no current wine title
  contains `&`, `#`, `?`, or similar — but will silently produce a broken share link the moment one does.
- Fix: wrap `title` and `url` with `encodeURIComponent()` at all 5 interpolation sites.
- No visual or markup change: same links, same targets, same rendered appearance — only the generated
  `href` values become correctly encoded.

### Bug 2 — contact form missing server-side length validation

- File: `src/lib/contact-validation.ts` (`validateContactFields()`).
- Problem: validation checks presence and email format but not length, even though the client form
  (`src/content/main/contatti.html`) declares `maxlength="400"` on `your-name`/`your-email` and
  `maxlength="2000"` on `your-message`. A direct POST to `/api/contact` bypasses the client's `maxlength`
  entirely. This also runs against `CLAUDE.md`'s own rule: "Validate and sanitize all user input on the
  server, even when client-side validation exists."
- Fix: add max-length checks to `validateContactFields()` mirroring the client's declared limits exactly —
  name ≤ 400, email ≤ 400, message ≤ 2000 — with Italian error copy consistent with the file's existing
  style (e.g. the existing `"Questo campo è obbligatorio."` pattern). Exact wording is a judgment call to
  finalize during implementation, not fixed here.
- Extend `src/lib/contact-validation.test.ts` to cover the new boundary: exactly at the limit (valid), one
  character over (invalid, correct error key).

### Authorization and relationship to earlier constraints

This task narrowly supersedes the "do not modify Task 2 contact-backend code" constraint, but only for the
additive length-cap validation in `src/lib/contact-validation.ts` described above. No other Task 2 file
(`src/pages/api/contact.ts`, `src/lib/rate-limit.ts`, `src/lib/email.ts`, `src/lib/turnstile.ts`, the D1
migration) may be touched unless a build/runtime issue strictly requires it — if so, document why.

### Route/file scope

Implement:

- `src/components/ShareButtons.astro`
- `src/lib/contact-validation.ts` (and its test file)

Do not implement or modify:

- Any other Task 2 backend file.
- `/it/dati-societari/`, `/it/privacy-policy/`, Cloudflare Web Analytics, News, shop, or Task 3 visual fixes.
- Any component or page not named above.
- Field names, the honeypot mechanism, the email-format regex, or which fields are required/optional.

### Non-negotiable constraints

- No visual/behavioral change to `ShareButtons` beyond correct URL-encoding.
- No change to required/optional fields, the honeypot check, or the email regex.
- Error message copy matches the existing Italian style already used in the file.
- Touch only the files named above.

### Discovery required before implementation

1. Read `CLAUDE.md`, then this `TODO.md`, confirm Task 7 is the only active task.
2. Re-read `src/components/ShareButtons.astro`, `src/lib/contact-validation.ts`, and
   `src/lib/contact-validation.test.ts` in full before editing.
3. Reconfirm the client's exact `maxlength` values against `src/content/main/contatti.html` at
   implementation time, in case the content has changed since this was written.

### Implementation requirements

- Add `encodeURIComponent()` around `title`/`url` at all 5 share-link interpolation sites in
  `ShareButtons.astro`.
- Add length checks to `validateContactFields()`, extending the existing `ValidationResult`/`errors` shape.
- Add tests for the new boundary conditions described above.

### Testing and validation

- `npm run check`, `npm run test:unit` (existing 31 tests + new length-validation tests), `npm run build`.
- Confirm `git diff` touches only the files named in scope.
- Confirm Task 2's other backend files, Task 3, Task 5, Task 6, and News remain untouched.

### Required Task 7 deliverables

- Summary of both fixes.
- Files changed.
- New/updated tests and their results.
- Confirmation no unrelated files were touched.
- Commands run and results.
- Known limitations, if any (e.g. exact error-message wording as a judgment call, flagged for review).
