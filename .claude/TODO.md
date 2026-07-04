# TODO.md

This file contains task-specific project work. `CLAUDE.md` contains permanent rules and must be followed for every task.

## Task 1 - Completed and frozen: Italian website remake

Status: completed. Do not reopen, refactor, redesign, or modify this work unless the active task strictly requires it and the user explicitly approves the change first.

### Original Task 1 goal

Rewrite and optimize the Italian version of `rigonivittorino.com/it` without changing visible features, content, layout, imagery, animations, transitions, or user-facing behavior.

The live Italian website was the visual and content source of truth. The remake could use a modern framework, but the migration was not allowed to make the site visibly different.

### Task 1 completed scope

Main Italian pages:

- `/it/`
- `/it/chi-siamo/`
- `/it/cantina/`
- `/it/contatti/`

Blank Italian legal/company pages:

- `/it/privacy-policy/`
- `/it/dati-societari/`

Wine category pages:

- `/it/spumanti/`
- `/it/bianchi/`
- `/it/rossi/`
- `/it/affinati/`
- `/it/frizzanti-e-rosati/`
- `/it/passiti/`

Prosecchi e Spumanti product pages:

- `/it/i-nostri-vini/creativo-prosecco-millesimato-brut-doc-treviso/`
- `/it/i-nostri-vini/pinot-nero-spumante-millesimato-brut/`
- `/it/i-nostri-vini/creativo-prosecco-millesimato-brut-doc-treviso-magnum/`
- `/it/i-nostri-vini/pinot-nero-spumante-millesimato-brut-magnum/`
- `/it/i-nostri-vini/prosecco-950-extra-dry-doc-treviso/`
- `/it/i-nostri-vini/prosecco-rose-millesimato-brut-doc-treviso/`
- `/it/i-nostri-vini/glera-spumante-millesimato-extra-dry/`
- `/it/i-nostri-vini/anema-raboso-spumante-dolce/`

Bianchi product pages:

- `/it/i-nostri-vini/pinot-grigio-igt-veneto/`
- `/it/i-nostri-vini/chardonnay-igt-veneto/`
- `/it/i-nostri-vini/sauvignon-igt-veneto/`
- `/it/i-nostri-vini/suadente-glera-igt-veneto/`
- `/it/i-nostri-vini/incrocio-manzoni-igt-veneto/`
- `/it/i-nostri-vini/traminer-igt-veneto/`

Rossi product pages:

- `/it/i-nostri-vini/pinot-nero-igt-veneto/`
- `/it/i-nostri-vini/cabernet-igt-veneto/`
- `/it/i-nostri-vini/malbech-igt-veneto/`
- `/it/i-nostri-vini/merlot-igt-veneto/`
- `/it/i-nostri-vini/refosco-igt-veneto/`

Affinati product pages:

- `/it/i-nostri-vini/cabernet-sauvignon-affinato-in-botte-igt-veneto/`
- `/it/i-nostri-vini/merlot-affinato-in-botte-igt-veneto/`
- `/it/i-nostri-vini/profondo-cabernet-affinato-in-botte-igt-veneto/`
- `/it/i-nostri-vini/maiuscolo-pinot-nero-affinato-in-botte-igt-veneto/`

Frizzanti e Rosati product pages:

- `/it/i-nostri-vini/chardonnay-frizzante-igt-veneto/`
- `/it/i-nostri-vini/verduzzo-frizzante-igt-veneto/`
- `/it/i-nostri-vini/raboso-frizzante-igt-veneto/`
- `/it/i-nostri-vini/rosato-di-raboso-frizzante-everythings-coming-up-rose-igt-veneto/`

Passiti product pages:

- `/it/i-nostri-vini/complice-passito-igt-veneto/`
- `/it/i-nostri-vini/ciacola-passito-igt-veneto/`
- `/it/i-nostri-vini/raboso-passito/`

### Task 1 preserved requirements

- Visual parity with the live Italian website was primary.
- Existing Italian text, wine data, product details, images, PDFs, category ordering, shop links, share UI, header, footer, animations, and responsive behavior were to be preserved.
- SEO metadata could be cleaned technically only when visible content and visible behavior did not change.
- Assets were to be inventoried with original source URLs and local paths.
- `/it/privacy-policy/` and `/it/dati-societari/` were required to render completely blank pages: no header, footer, navigation, title, placeholder, loading text, or content.
- `rigonivittorinoshop.it` and all ecommerce systems were excluded, while visible shop links remained external.
- News was excluded entirely from routing and implementation.
- English and German pages were excluded.

### Task 1 contact page state

Task 1 produced `/it/contatti/` as a visually matching static page. At that stage, the contact form did not need backend functionality. That limitation is superseded by Task 2 only for `/it/contatti/` and its required backend/configuration/testing.

## Task 2 - Completed and frozen: make `/it/contatti/` functional with backend email, confirmation, captcha, and retention

Status: completed. Do not reopen, refactor, redesign, or modify this work unless the active task strictly requires it and the user explicitly approves the change first.

### User request

Add backend functionality to the existing `/it/contatti/` page so the contact form works as intended. The current project is the completed Italian remake from Task 1. The previous remake is frozen except for strictly necessary changes required for this task.

### Non-negotiable constraints for Task 2

- Do not modify completed Task 1 work unless strictly necessary for contact form functionality.
- Do not change the visual appearance of the existing website unless strictly necessary.
- Do not change unrelated pages, routes, shared layout, shared styling, assets, animations, or navigation without explicit user approval.
- Before touching any folder that is not evidently related to `/it/contatti/`, backend/API handling, environment configuration, database/storage, email sending, captcha, tests, or documentation, provide a reason and obtain explicit approval if the change may affect completed work.
- Keep `/it/privacy-policy/` completely blank for now, even if the contact form requires GDPR-related handling elsewhere.
- Continue excluding News routing and all shop systems.
- Keep all existing visible shop links pointing to `rigonivittorinoshop.it`.
- Do not hardcode secrets or sensitive information.

### Discovery required before implementation

Before coding:

1. Inspect the current repository structure, framework, package manager, routing, styling system, existing contact page code, build scripts, tests, and deployment assumptions.
2. Inspect the live `rigonivittorino.com/it/contatti/` page and determine the intended fields, labels, validation states, contact details, map behavior, phone/email links, opening/contact information, and any existing GDPR or consent language.
3. Compare the current local `/it/contatti/` page with the live page.
4. Identify every existing field in the contact form. Use those fields; do not invent new fields unless required for captcha, consent, or backend operation.
5. Determine whether address, phone, email, map, external links, or opening/contact details are currently static or non-working. Make them function correctly if they are intended to be interactive on the live site.
6. Decide the backend approach only after inspecting the project and deployment model.
7. Record findings, chosen approach, assumptions, and risks in `IMPLEMENTATION_NOTES.md` or the closest existing project notes file.

### Backend requirements

Build the optimal backend for the current project, prioritizing convenience, low cost, maintainability, public deployment readiness, and ability to support future scope expansions.

Expected behavior:

- Submit the contact form from `/it/contatti/` to a server-side endpoint.
- Validate all required fields on the server.
- Preserve the existing form fields and labels from the site.
- Send an email notification containing the submitted contact message.
- Send a confirmation email to the sender.
- Retain submitted contact data in persistent storage.
- Protect the endpoint against spam and abuse.
- Return safe, user-appropriate success and error responses.
- Keep the page visually consistent with the existing design.

Recipient details:

- Final recipient email address or addresses will be determined later.
- Implement recipient configuration through environment variables, for example `CONTACT_RECIPIENT_EMAIL` or `CONTACT_RECIPIENT_EMAILS`.
- Do not block implementation because final recipient values are unknown.
- Provide `.env.example` placeholders and setup documentation.

Email requirements:

- Use a production-suitable email provider or SMTP transport selected after inspecting the project and deployment model.
- Keep provider credentials in environment variables only.
- Include both notification email and sender confirmation email.
- Use the submitted sender email as reply-to when supported and safe.
- Do not expose provider errors or secrets to the frontend.
- Provide a safe local/test mode, mock transport, or documented dry-run path so tests can run without real credentials.

Data retention requirements:

- Store submitted contact data persistently.
- Choose a storage approach appropriate to the detected stack and likely deployment. Favor simple, low-cost, production-suitable options.
- Store only what is needed: submitted fields, timestamp, status, and minimal operational metadata.
- Avoid unnecessary sensitive metadata. If IP or user-agent are retained for abuse prevention, document why and minimize or hash where practical.
- Provide schema, migration, or setup steps as appropriate.
- Document how retained submissions can be reviewed or exported if the chosen stack supports it.

Captcha and anti-spam requirements:

- Add visible captcha protection. A visible captcha is accepted and encouraged, provided it does not break the page's visual appearance.
- Prefer a low-cost, privacy-conscious, production-suitable captcha provider compatible with the chosen stack, such as Cloudflare Turnstile or another justified option.
- Store captcha keys in environment variables only.
- Validate captcha server-side.
- Consider adding non-visual anti-spam safeguards such as honeypot fields, rate limiting, and basic abuse throttling if they do not alter the visible design.

GDPR/privacy requirements:

- Base GDPR and privacy behavior on the existing live site.
- Do not populate or alter `/it/privacy-policy/`; it must remain blank for now.
- If the live contact form has consent text or a privacy checkbox, preserve it exactly and make it functional.
- If legally relevant details are missing from the existing site, document the gap and implement only the minimal technical support needed without inventing legal copy.
- Do not add visible legal text that changes the design unless it already exists on the live page or is strictly necessary for the form to function.

Frontend/contact page requirements

- Keep the existing `/it/contatti/` page visually unchanged except for necessary functional states.
- Preserve field layout, labels, button text, map placement, address, phone number, email, opening/contact information, typography, spacing, and responsive behavior.
- Make intended interactive items work, including form submission, clickable phone/email links, map embed/link behavior, validation states, success states, and failure states.
- Use existing validation text from the live site if present.
- If the existing site lacks visible success/error copy, add minimal Italian messages that match the current visual language and do not visually redesign the page.
- Keep accessibility improvements invisible or visually equivalent.

### Suggested implementation approach

Do not blindly follow this section if repository inspection shows a better fit. Use it as a default decision framework.

- If the project uses Next.js or a similar full-stack framework, prefer a framework-native server route/action for submission.
- If the project is static-only, choose the smallest reliable backend-compatible extension that preserves deployment simplicity.
- Prefer a serverless-compatible endpoint when deployment is likely to be Vercel, Netlify, or similar.
- Prefer a simple managed database/storage option if persistent retention is required and the project has no existing database.
- Avoid introducing a large custom server unless clearly justified.
- Keep provider choices swappable through small adapter modules where practical.

### Testing and validation for Task 2

Run all relevant existing commands and add tests where appropriate.

Required verification:

- Contact form renders unchanged at 375px, 768px, 1024px, and 1440px.
- Required field validation works.
- Invalid email validation works.
- Captcha required/failure path works.
- Successful submission path works.
- Notification email is generated or sent through test transport.
- Sender confirmation email is generated or sent through test transport.
- Submission is retained in persistent storage or test storage.
- Missing environment variables fail safely and are documented.
- Spam/rate-limit/honeypot protections work if implemented.
- `/it/privacy-policy/` remains completely blank.
- `/it/dati-societari/` remains completely blank.
- News routes remain excluded.
- Shop links remain external.
- No unrelated page has a visual regression.

Use available tools such as unit tests, integration tests, route smoke tests, Playwright/browser tests, production build, local preview, screenshots, and log inspection. If a tool or command is unavailable, document that clearly.

### Required Task 2 deliverables

At completion, provide:

- Backend architecture summary and reason for the chosen backend, email provider, storage, and captcha approach.
- Files changed.
- Any non-obvious folders touched, with reasons.
- Environment variables required, with `.env.example` placeholders.
- Setup steps for email, captcha, storage, migrations, and deployment.
- Confirmation that no secrets were committed.
- Confirmation that sender confirmation email is implemented.
- Confirmation that notification recipient is environment-configured and can be set later.
- Confirmation that submissions are retained.
- Confirmation that `/it/privacy-policy/` and `/it/dati-societari/` remain blank.
- Confirmation that News remains excluded and shop links remain external.
- Commands run and results.
- Contact-form test evidence, including success, failure, captcha, email, and retention paths.
- Visual parity evidence for `/it/contatti/` at the required breakpoints.
- Evidence that unrelated completed pages were not modified or visually regressed.
- Known limitations or remaining user-provided configuration needed before production launch.

## Task 3 - Active: fix remaining visual parity bugs from the Italian remake

Status: active.

### User request

Fix visual bugs remaining from Task 1 in the rebuilt Italian landing website. Task 3 is a visual-parity correction task, not a redesign and not a backend task.

The current project is the completed Italian remake from Task 1 plus the completed `/it/contatti/` backend from Task 2. Completed work remains frozen except for the specific visual corrections listed in this task and the smallest supporting changes required to implement them safely.

### Target defects to fix

1. Some pictures do not format accurately at different viewport sizes. In particular, the main images on main pages such as `/it/cantina/` and `/it/chi-siamo/` appear to zoom instead of matching the original responsive behavior.
2. The Luis Sepulveda quotation stretches inadequately on mobile.
3. On `/it/contatti/`, the spacing between images and their descriptions is too low.
4. Some pictures can be zoomed through site-level interactions, while they should not be zoomable. Check every plausible site-level zoom mechanism, including hover zoom, click-to-zoom, lightbox/gallery behavior, carousel zoom, CSS transforms, draggable/openable image behavior, image-component defaults, and third-party slider settings. Do not treat browser or operating-system accessibility zoom as a defect.
5. Picture slider buttons and carousel controls have an inadequate strange shape wherever they appear. The wine image slider controls are an example, not a limit on the scope. Find and fix every malformed instance across the Italian site.
6. The main landing page lacks the animation present on the original live Italian website. Claude must rely entirely on inspecting the live website to determine the expected animation.

### Non-negotiable constraints for Task 3

- Do not redesign the website.
- Do not make approximate aesthetic improvements that are not grounded in the live Italian source website.
- Do not change Italian text, wine data, contact details, URLs, navigation, footer content, shop links, legal blank pages, News exclusion, or ecommerce boundaries.
- Do not modify Task 2 backend behavior, data retention, captcha, email sending, or environment configuration unless a visual fix on `/it/contatti/` strictly requires frontend-only integration cleanup.
- Do not use `user-scalable=no`, maximum-scale viewport restrictions, or any accessibility-hostile method to prevent browser/device page zoom. The requirement that pictures should not be zoomable refers only to site-level image zoom behavior. Check and correct all site-level zoom mechanisms, including hover transforms, click handlers, lightboxes/galleries, CSS scale, carousel options, draggable/openable image behavior, and image-component defaults.
- Do not replace image assets unless inspection proves the local asset is wrong. If an image asset is replaced, document the original source URL and local path.
- Do not invent new animations. Inspect the live Italian website and reproduce its landing-page animation as closely as possible, including animated elements, timing, direction, easing, trigger, delay, repeat behavior, and responsive behavior.
- Keep all fixes responsive and verify them at 375px, 768px, 1024px, and 1440px.

### Allowed scope for Task 3

Task 3 explicitly authorizes changes only where needed to fix the listed visual defects:

- `/it/` landing page code, styles, and animation logic.
- `/it/chi-siamo/` page code and styles related to responsive main-image behavior and the Luis Sepulveda quotation.
- `/it/cantina/` page code and styles related to responsive main-image behavior.
- `/it/contatti/` frontend layout/styles related to image-description spacing only.
- Wine category and product page components/styles if they contain defective picture slider buttons, carousel controls, or site-level image zoom behavior.
- Shared image, hero, quote, carousel/slider, animation, or responsive style utilities only when the defect is implemented through shared code or when malformed carousel buttons/controls recur through shared components.

If a shared component or global stylesheet must be changed, first identify every route likely to be affected, keep the change narrowly targeted, and include regression evidence for those routes.

### Discovery required before implementation

Before coding:

1. Read `CLAUDE.md`, then this `TODO.md`, and confirm Task 3 is the only active task.
2. Inspect the repository structure, package manager, framework, routing, styling system, animation libraries, carousel/slider libraries, image components, build scripts, and tests.
3. Inspect the live Italian website at the affected routes and record the expected behavior for each listed defect.
4. Inspect the current local implementation at the affected routes and compare it with the live site.
5. Capture or otherwise record before-state evidence for the affected defects at 375px, 768px, 1024px, and 1440px where applicable.
6. Determine whether the image formatting issue is caused by `object-fit`, `object-position`, aspect ratio, container height, overflow, transforms, responsive breakpoints, image component defaults, or carousel configuration. Fix the actual cause; do not mask it with arbitrary CSS.
7. Search for all types of image zoom behavior across the affected Italian site, including CSS hover scale, click handlers, lightbox/gallery configuration, carousel zoom options, transform utilities, draggable/openable image behavior, image-component defaults, and third-party library settings. Remove only the unwanted site-level zoom behavior and do not restrict browser accessibility zoom.
8. Search for all malformed carousel or slider button/control instances across the Italian site. Do not stop at the wine slider example if the same defect appears elsewhere or is implemented through shared code.
9. Determine the original landing-page animation behavior entirely from the live Italian website: animated elements, initial state, trigger, duration, delay, easing, repeat behavior, responsive behavior, and reduced-motion behavior if present.
10. Record findings, chosen approach, assumptions, affected files, and risks in `IMPLEMENTATION_NOTES.md` or the closest existing project notes file.

### Implementation requirements

- Make the smallest code and style changes that fix the listed visual bugs.
- Prefer component-level or route-level fixes over global CSS changes unless the broken behavior is genuinely shared.
- Preserve the visual identity of the current approved rebuild while correcting it toward the live original.
- Preserve existing responsive breakpoints unless inspection shows they are the direct cause of a listed defect.
- Preserve accessibility. For animations, respect existing reduced-motion handling if present; if no reduced-motion handling exists, add it only if it does not visibly alter normal behavior.
- For the Luis Sepulveda quotation, fix mobile layout with appropriate width, max-width, wrapping, font-size, line-height, margins, or container behavior. Preserve the text exactly.
- For `/it/contatti/`, adjust only the spacing between the relevant images and descriptions unless inspection proves a shared spacing bug affects that section.
- For slider buttons and carousel controls, find every malformed instance across the Italian site and match the original button shape, size, position, icon alignment, hover/focus states, and hit area as closely as possible.
- For landing-page animation, restore the missing original behavior based solely on live-site inspection, without changing static layout, copy, images, navigation, or footer.
- Avoid broad dependency changes. Add or replace dependencies only if the existing stack cannot reproduce the original behavior safely, and document why.

### Testing and validation for Task 3

Run all relevant existing checks and add targeted tests only where appropriate.

Required verification:

- `/it/` landing page shows the original-style animation and still matches the original static layout at 375px, 768px, 1024px, and 1440px.
- `/it/chi-siamo/` main image formats correctly at 375px, 768px, 1024px, and 1440px.
- `/it/chi-siamo/` Luis Sepulveda quotation no longer stretches inadequately on mobile.
- `/it/cantina/` main image formats correctly at 375px, 768px, 1024px, and 1440px.
- `/it/contatti/` image-description spacing is corrected without changing contact-form backend behavior.
- All malformed slider buttons and carousel controls across the Italian site have the correct shape, size, position, and interaction states. The wine slider is only an example and is not the full scope.
- Site-level picture zoom behavior is checked across all plausible mechanisms and removed where inappropriate, without disabling browser/device accessibility zoom.
- Header, footer, navigation, typography, colors, shop links, share UI, and route structure remain unchanged except where the active visual defect directly required a narrow adjustment.
- `/it/privacy-policy/` remains completely blank.
- `/it/dati-societari/` remains completely blank.
- News routes remain excluded.
- Shop links remain external and continue pointing to `rigonivittorinoshop.it`.
- Task 2 contact backend behavior still works or is not touched; if touched, run the relevant contact-form regression checks.
- Production build succeeds.

Use screenshots, browser tests, Playwright traces, videos, or other repeatable evidence when available. If a verification tool is unavailable, document the limitation clearly and provide the strongest available alternative evidence.

### Required Task 3 deliverables

At completion, provide:

- Summary of each visual defect fixed.
- Files changed.
- Any shared components or global styles touched, with reasons and affected routes.
- Before/after visual evidence for affected routes at the required breakpoints.
- Landing-page animation evidence based on the live Italian website, preferably a short recording or a precise description of verified animated behavior if recording is unavailable.
- Confirmation that all plausible site-level image zoom mechanisms were checked, unwanted site-level image zoom was removed, and browser accessibility zoom was not disabled.
- Confirmation that `/it/contatti/` backend behavior was not modified, or regression evidence if any contact frontend/backend integration was touched.
- Confirmation that `/it/privacy-policy/` and `/it/dati-societari/` remain blank.
- Confirmation that News remains excluded and shop links remain external.
- Commands run and results.
- Known limitations, risks, or items requiring user review.