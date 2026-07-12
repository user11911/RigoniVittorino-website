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

Preserved constraints from completed work:

- The live Italian website at `rigonivittorino.com/it` remains the source of truth for visible layout, typography, images, spacing, animation, navigation, footer, content, and responsive behavior.
- Preserve the approved rebuilt Italian site except where the active task requires a narrow change.
- Do not modify English or German pages.
- Do not modify `rigonivittorinoshop.it`, ecommerce systems, cart, checkout, account, products, payments, or external shop behavior.
- Keep existing visible shop links pointing to `rigonivittorinoshop.it`.
- Do not modify Task 2 contact backend *code*; Task 6 below may only document its existing, unchanged behavior.
- `/it/privacy-policy/` is no longer required to remain blank. Task 6 below explicitly authorizes replacing the blank page with a real, accurate privacy/cookie policy.
- `/it/dati-societari/` (Task 5) is completed/frozen; do not modify it except to reuse its already-finalized company-identity text for reference.
- Do not work on Task 3 visual bugs or further News scope as part of this task.

## Task 6 - Active: add Cloudflare Web Analytics + a real `/it/privacy-policy/` page

Status: active.

### User request

Add cookieless analytics (Cloudflare Web Analytics) to the site. This surfaced a real, pre-existing gap:
`/it/contatti/` has been storing name/email/message plus a hashed IP in D1, and calling out to Turnstile and
Resend, since Task 2 — with zero privacy disclosure anywhere, because `/it/privacy-policy/` has been a
hard-locked blank page since Task 1. The user has given the explicit approval `CLAUDE.md` required to
unblock that page, and directed that this be treated as a real legal-disclosure fix, not just an
analytics side-note.

### User clarifications for Task 6

1. Analytics wiring: a manual Cloudflare Web Analytics beacon script added to the shared `BaseLayout.astro`,
   gated by a new `PUBLIC_*` env var — same pattern as the existing `PUBLIC_TURNSTILE_SITE_KEY` — not the
   automatic Cloudflare-dashboard zone toggle (that can't be scoped/excluded per-route and its behavior on a
   Workers-served zone isn't something this task can verify).
2. No real Cloudflare Web Analytics token exists yet. Provisioning one (Cloudflare dashboard → Analytics &
   Logs → Web Analytics → add site → copy token) is documented as a setup step for the site owner, the same
   treatment already given to the D1 `database_id` placeholder. Until provisioned, the beacon must no-op
   (render nothing) — same dry-run convention already used for `RESEND_API_KEY`.
3. The beacon must be suppressed outside production builds (`npm run dev` / `npm run preview`), so local/dev
   traffic never pollutes real analytics data.
4. `/it/privacy-policy/` no longer needs to stay blank — this explicitly supersedes the earlier blank-page
   rule for this one page.
5. The privacy-policy content must be self-hosted static text, not a re-embedded third-party widget. (The
   live site's own page has no real static text either — it only loads a third-party Iubenda widget
   client-side, so there is nothing to transplant verbatim the way every other page was built.)
6. Scope covers BOTH the new analytics AND the pre-existing, previously-undisclosed `/it/contatti/`
   data-handling gap — not analytics alone.
7. The drafted policy text is factual disclosure of this rebuild's actual behavior, not invented
   marketing/legal boilerplate — but it must be flagged clearly, and unmissably, as needing the site owner's/
   legal counsel's review before production launch. Do not present it as a substitute for legal sign-off.

### Task 6 authorization and relationship to earlier blank-page rules

This task explicitly supersedes the earlier requirement that `/it/privacy-policy/` remain completely blank.

This authorization applies only to `/it/privacy-policy/`, the smallest shared-layout change needed to
conditionally render the analytics beacon (`BaseLayout.astro`), and the smallest footer/nav change (if any)
needed to keep the existing Privacy link working — confirm during discovery whether any nav/footer change is
actually needed at all.

This task does NOT authorize modifying Task 2's contact-backend *code* (`/api/contact`, D1 schema,
rate-limiting, Turnstile verification, email sending). Task 6 may only document that code's existing,
unchanged behavior. If describing it accurately surfaces a genuine bug or gap (e.g., no retention/deletion
policy actually exists in code), flag it as a separate follow-up rather than fixing it here.

### Route scope

Implement:

- `/it/privacy-policy/` (replace `BlankLayout` with real content).
- Analytics beacon: a conditional script addition in the shared `BaseLayout.astro`.

Do not implement or modify:

- `/it/dati-societari/` (Task 5, completed/frozen) — read-only reference for its company-identity text.
- English or German privacy-policy equivalents.
- News detail pages, archives, tags, categories, feeds, or extra News scope.
- Ecommerce/shop systems.
- Contact-backend code (`/api/contact`, `src/lib/rate-limit.ts`, `src/lib/email.ts`, `src/lib/turnstile.ts`,
  the D1 migration) — read-only reference for documentation purposes only.
- Task 3 visual fixes.
- Wine data, product details, or unrelated page content.

### Source of truth / requirements — analytics beacon

- Confirm Cloudflare's current official manual-beacon snippet (script URL + `data-cf-beacon` token attribute
  shape) against Cloudflare's own docs at implementation time — do not guess at or assume the exact format.
- Token comes from a new public env var (e.g. `PUBLIC_CF_ANALYTICS_TOKEN`), documented in `.env.example`
  with an empty/placeholder default, following the same pattern as `PUBLIC_TURNSTILE_SITE_KEY`.
- If the token is unset, the beacon must not render at all (dry-run/no-op, matching `RESEND_API_KEY`'s
  existing convention).
- The beacon must render only for production builds — confirm `import.meta.env.PROD` (or equivalent)
  actually distinguishes `astro dev`/`astro preview` from a production `astro build` output before relying
  on it as the gating condition.
- Reconfirm, against Cloudflare's current documentation (not assumed from general reputation), that Web
  Analytics truly sets no cookies and needs no consent banner before writing that claim into the privacy
  policy.

### Source of truth / requirements — `/it/privacy-policy/` content

Must accurately describe:

1. **Cloudflare Web Analytics**: cookie-free, aggregated page-view/traffic metrics via a JS beacon, no
   cross-site tracking, no cookie/localStorage use, data processed by Cloudflare.
2. **Contact form (`/it/contatti/`)**: what's collected (name, email, message), where it's stored
   (Cloudflare D1, this site's own database), that the submitter's IP is hashed with a salt and never stored
   raw (per `src/lib/rate-limit.ts`), why (spam/abuse rate-limiting), and retention — do not assert a
   retention/deletion period that isn't actually implemented in code; if none exists, say so honestly or
   flag it as needing a real decision rather than inventing a plausible-sounding figure.
3. **Cloudflare Turnstile**: third-party captcha verification call to Cloudflare on form submission.
4. **Resend**: third-party transactional email API used to send the notification/confirmation emails, which
   necessarily transmits the submitted name/email/message to Resend's servers.
5. Standard structural elements expected of an Italian/GDPR-facing policy: data-controller identity (reuse
   the real company details already implemented in Task 5's `/it/dati-societari/` — `Az. Agr. Rigoni
   Vittorino Società Agricola SNC`, address, P.IVA), purposes/legal basis per processing activity, data
   subject rights, a contact point for privacy requests, and a reference to the Italian Garante per la
   protezione dei dati personali.

Constraints on this content:

- Must NOT reproduce the live site's Iubenda-hosted text (not scrapable/available, and would describe a
  different stack — GTM, reCAPTCHA — that this rebuild doesn't use).
- Must NOT invent unrelated marketing/company copy beyond what's factually necessary for disclosure.
- Should render through the shared `BaseLayout` like a normal content page (consistent with
  `chi-siamo`/`cantina`/`dati-societari`), not a special blank template — there is no live static markup to
  match exactly this time, so use the site's own established page conventions as the visual reference.
- Must prominently flag (in the delivered notes, and ideally in the page itself) that this text was drafted
  from the site's actual technical behavior and needs the site owner's/legal counsel's review before it can
  be relied upon in production.
- Any field that's genuinely unknown (e.g. a designated DPO) must be left as an explicit placeholder for the
  site owner, never a fabricated plausible-sounding answer.

### Non-negotiable constraints

- Do not modify Task 2's contact-backend code or behavior.
- Do not modify `/it/dati-societari/` (Task 5) beyond reading its finalized text for reuse.
- Do not re-open Task 3 (paused) or expand Task 4/News.
- Do not add cookies, GTM, reCAPTCHA, or any tracking beyond the single Cloudflare Web Analytics beacon.
- Do not fabricate a retention period, DPO name, or legal basis that isn't actually true of this
  implementation.
- Do not present the drafted policy as legally final.
- Keep shop links external and unaffected.
- Visual parity checks (375px, 768px, 1024px, 1440px) apply to the new privacy-policy page like every other
  implemented page.

### Discovery required before implementation

1. Read `CLAUDE.md`, then this `TODO.md`, and confirm Task 6 is the only active task.
2. Locate the existing Privacy link(s) in `src/content/chrome/footer.html` (and header, if applicable) and
   confirm where they already point.
3. Re-read `src/pages/api/contact.ts`, `src/lib/rate-limit.ts`, `src/lib/email.ts`, `src/lib/turnstile.ts`,
   and `migrations/0001_contact_submissions.sql` to describe current data handling accurately — do not
   describe it from memory or assumption.
4. Check Cloudflare's current official documentation for the exact Web Analytics manual-beacon snippet and
   confirm the no-cookies claim before writing either into code or policy text.
5. Confirm the chosen prod/dev detection mechanism (e.g. `import.meta.env.PROD`) actually distinguishes
   `astro dev`/`astro preview` from a production `astro build`.
6. Record findings, the drafted policy text, assumptions, and open questions in a new `IMPLEMENTATION_NOTES.md`
   "Task 6" section, following the existing per-task format.

### Implementation requirements

- Add `PUBLIC_CF_ANALYTICS_TOKEN` to `.env.example` (empty/placeholder) with a comment on how to obtain a
  real one and that its absence is a normal, supported dry-run state.
- In `BaseLayout.astro`, conditionally render the Web Analytics beacon only when the token is set AND the
  build is production. Document the exact condition used.
- Replace `src/pages/it/privacy-policy/index.astro`'s `<BlankLayout />` with real content via the shared
  `BaseLayout`/existing content-page pattern, covering everything listed above.
- Add a new "Task 6" section to `IMPLEMENTATION_NOTES.md` (architecture, files changed, testing, known
  limitations, and an explicit "needs legal review before launch" callout).

### Testing and validation

In addition to the project's standard checks (install, typecheck, unit tests, production build, route smoke
test):

- `/it/privacy-policy/` renders successfully and is no longer blank.
- `/it/privacy-policy/` visually reviewed at 375px, 768px, 1024px, and 1440px against the site's own page
  conventions (no live page to diff against, since this is new content).
- The analytics beacon does NOT render during `npm run dev` / `npm run preview`.
- The analytics beacon does NOT render when `PUBLIC_CF_ANALYTICS_TOKEN` is unset, even in a production
  build.
- The analytics beacon DOES render in a production build when the token is set (a placeholder/dummy token
  value is acceptable if a real one isn't available yet).
- Route smoke test covers `/it/privacy-policy/`. If Playwright can't run in the current environment
  (system-library gap already identified separately), document that limitation rather than skipping
  silently.
- `/it/dati-societari/` confirmed unaffected (still matches Task 5's delivered state).
- Task 2 contact-backend code confirmed byte-for-byte unmodified (diff check).
- Shop links confirmed still external.
- Production build succeeds; typecheck and unit tests pass.

### Required Task 6 deliverables

At completion, provide:

- Summary of what changed (privacy-policy content + analytics beacon).
- Files changed.
- The full drafted Italian privacy-policy text, with an unmissable note that it requires the site owner's/
  legal counsel's review before production launch.
- Confirmation of exactly what data practices are disclosed (contact form D1/IP-hash/Turnstile/Resend,
  Cloudflare Web Analytics) and confirmation nothing was invented/assumed beyond what the code actually
  does.
- The env var(s) added, with setup-step documentation for obtaining a real Cloudflare Web Analytics token.
- Confirmation the beacon is suppressed in dev/preview and when the token is unset.
- Visual evidence for the new privacy-policy page at all four breakpoints.
- Confirmation that Task 2 backend, Task 3, Task 4, and Task 5 were not modified beyond what's explicitly
  authorized here.
- Commands run and results, including any tooling gaps documented rather than silently skipped.
- Known limitations/open items — especially any placeholder fields awaiting real business input (DPO
  contact, exact retention policy, etc.).