# TODO.md

This file contains task-specific project work. `CLAUDE.md` contains permanent rules and must be followed for every task.

## Completed / frozen project state

The rebuilt Italian website is approved work. Do not reopen, refactor, redesign, or modify completed work unless the active task strictly requires it.

Completed or inactive work:

- Task 1: Italian website remake for `/it/`, main Italian pages, wine category pages, and product pages.
- Task 2: functional `/it/contatti/` backend/contact-form implementation with email, confirmation, captcha, and retained submissions.
- Task 3: paused/inactive visual-parity bug-fix task. Do not work on it unless the user explicitly reactivates it.
- Task 4: completed/inactive Italian News landing page at `/it/news/`. Do not extend News work unless the user explicitly asks.

Preserved constraints from completed work:

- The live Italian website at `rigonivittorino.com/it` remains the source of truth for visible layout, typography, images, spacing, animation, navigation, footer, content, and responsive behavior.
- Preserve the approved rebuilt Italian site except where the active task requires a narrow change.
- Do not modify English or German pages.
- Do not modify `rigonivittorinoshop.it`, ecommerce systems, cart, checkout, account, products, payments, or external shop behavior.
- Keep existing visible shop links pointing to `rigonivittorinoshop.it`.
- Do not modify Task 2 contact backend behavior unless the active task makes it strictly necessary.
- `/it/privacy-policy/` must remain accessible and completely blank for this task.
- `/it/dati-societari/` is no longer required to remain blank. The active task below explicitly authorizes replacing the blank page with the live Dati societari page.
- Do not work on Task 3 visual bugs or further News scope as part of this task.

## Task 5 - Active: add the Italian Dati societari page at `/it/dati-societari/`

Status: active.

### User request

Add the `/it/dati-societari/` site to the existing project, based on the one in the live site. Link all existing placeholders that are supposed to link to this page to the new `/it/dati-societari/` page.

### User clarifications for Task 5

1. Task 4 is now inactive and completed.
2. `/it/dati-societari/` must now match the live page and must no longer be blank.
3. `/it/privacy-policy/` must remain completely blank for this task.
4. Every existing placeholder link to Dati societari must be updated so it links to `/it/dati-societari/`.
5. The visible typo on the live page, `Az. Agr..`, must be corrected in the rebuilt page to `Az. Agr.`.

### Task 5 authorization and relationship to earlier blank-page rules

This task explicitly supersedes earlier requirements that `/it/dati-societari/` remain blank.

This authorization applies only to `/it/dati-societari/` and to the smallest shared navigation/footer/link changes required to make existing Dati societari placeholders point to that page.

This task does not authorize changing `/it/privacy-policy/`. Privacy Policy must remain fully blank: no header, footer, navigation, title, placeholder, loading text, or content.

### Route scope

Implement:

- `/it/dati-societari/`

Do not implement or modify:

- `/it/privacy-policy/`, except to verify it remains completely blank.
- English or German Dati societari equivalents.
- News detail pages, archives, tags, categories, feeds, or extra News scope.
- Ecommerce/shop systems.
- Contact backend behavior.
- Task 3 visual fixes.
- Wine data, product details, contact details, or unrelated page content.

### Source of truth

The live Italian page at `https://www.rigonivittorino.com/it/dati-societari/` is the source of truth for visible layout, typography, spacing, page structure, header, navigation, footer relationship, contact blocks, responsive behavior, metadata, and company-data content.

The live page currently includes:

- Heading: `Dati societari`
- Company name to render with corrected typo: `Az. Agr. Rigoni Vittorino Società Agricola SNC`
- `P.Iva: 03225340268`
- `REA: TV – 229330`
- `Capitale Sociale: €192.810,56`
- `Mail @pcert.it: agricolarigonisnc@legalmail.it`
- Address block:
  - `Via Malintrada 17, 31040`
  - `Gorgo al Monticano (TV) - Italia`
  - Google Maps link if present on the live page
- `Tel. +39 0422.746459`
- `Email: info@rigonivittorino.com`
- Follow/social section if present on the live page
- Normal site header/navigation/footer if present on the live page

Preserve all visible text exactly except for the explicitly authorized correction from `Az. Agr..` to `Az. Agr.`.

### Non-negotiable constraints

- Do not redesign the website.
- Match the live page as closely as possible.
- Do not invent, modernize, rewrite, translate, or expand company/legal copy.
- Do not add new legal copy.
- Do not add placeholder text.
- Do not make `/it/privacy-policy/` visible or populated.
- Do not change unrelated pages except for required Dati societari link updates.
- Do not change footer/header styling except as required to link Dati societari correctly.
- Do not alter shop links.
- Do not touch backend, email, captcha, database, retention, or environment configuration unless a build/runtime issue requires it. If touched, document the reason.
- Keep accessibility improvements invisible or visually equivalent.
- If the live page uses icons/images for address, phone, email, or social items, reuse the existing local asset strategy. Copy only assets required by the Dati societari page and record original source URLs and local paths.

### Discovery required before implementation

Before coding:

1. Read `CLAUDE.md`, then this `TODO.md`, and confirm Task 5 is the only active task.
2. Inspect the repository structure, package manager, framework, routing, styling system, shared layout, footer/navigation components, asset conventions, metadata conventions, build scripts, tests, and existing documentation.
3. Inspect the current local `/it/dati-societari/` implementation and confirm it is blank or placeholder-like before changing it.
4. Inspect the live `/it/dati-societari/` page at `https://www.rigonivittorino.com/it/dati-societari/`.
5. Inspect the live Italian header/footer/navigation and determine how the Dati societari link appears.
6. Search the entire local project for every placeholder or non-link intended to point to Dati societari. This must include footer, shared navigation, legal/company links, text links, route constants, sitemap/metadata references if present, tests, and any hardcoded placeholders.
7. Determine the live `/it/dati-societari/` layout at 375px, 768px, 1024px, and 1440px.
8. Identify whether any assets are required. If yes, copy them locally using the project’s existing asset strategy and record original source URLs and local paths.
9. Record findings, chosen approach, assumptions, affected files, link inventory, and risks in `IMPLEMENTATION_NOTES.md` or the closest existing project notes file.

### Implementation requirements

- Build `/it/dati-societari/` so it visually and behaviorally matches the live Italian page.
- Render the normal header/navigation/footer if the live page does so.
- Correct only the authorized typo in the company-name line: render `Az. Agr. Rigoni Vittorino Società Agricola SNC`.
- Preserve all other live text exactly.
- Make email, phone, map, and social links functional if they are functional on the live page.
- Use existing shared components/layouts only when that is how comparable Italian pages are implemented.
- Keep route, metadata, and styling changes narrowly scoped.
- Update every existing Dati societari placeholder link so it points to `/it/dati-societari/`.
- If a placeholder appears in shared footer/navigation, update the shared source once rather than patching each route separately.
- Preserve existing footer text and layout except for making the Dati societari target correct.
- Preserve `/it/privacy-policy/` as a truly blank page.

### Testing and validation

Run all relevant existing checks and add targeted tests only where appropriate.

Required verification:

- `/it/dati-societari/` exists and renders successfully.
- `/it/dati-societari/` visually matches the live page at 375px, 768px, 1024px, and 1440px.
- The company-name line uses the corrected text: `Az. Agr. Rigoni Vittorino Società Agricola SNC`.
- All other visible company/legal text matches the live page.
- Every existing local Dati societari placeholder/link points to `/it/dati-societari/`.
- Header/navigation/footer remain visually unchanged except for the required Dati societari link behavior.
- `/it/privacy-policy/` remains completely blank: no header, footer, navigation, title, placeholder, loading text, or content.
- `/it/news/` remains completed/inactive and is not expanded.
- No News detail routes are added.
- Task 2 contact backend behavior is not modified. If any contact-adjacent file is touched, run relevant contact regression checks.
- Task 3 visual-parity work is not modified.
- Shop links remain external and continue pointing to `rigonivittorinoshop.it`.
- Existing Italian routes from completed work still build and route correctly.
- Production build succeeds.
- Relevant lint/typecheck/test commands succeed, or unavailable commands are documented as unavailable.

Use screenshots, Playwright/browser tests, route smoke tests, local preview, production build output, or other repeatable evidence where available. If a verification tool is unavailable, document that limitation and provide the strongest available alternative evidence.

### Required Task 5 deliverables

At completion, provide:

- Summary of the implemented `/it/dati-societari/` scope.
- Confirmation that `/it/dati-societari/` is no longer blank and matches the live page.
- Confirmation that `/it/privacy-policy/` remains completely blank.
- Confirmation that the company-name typo was corrected from `Az. Agr..` to `Az. Agr.`.
- List of every Dati societari placeholder/link found and how it was updated.
- Files changed.
- Any shared components, layouts, global styles, route utilities, metadata utilities, or asset folders touched, with reasons and affected routes.
- Asset inventory for any Dati societari assets copied locally, with original live source URLs and local paths. If no assets were copied, state that no new assets were required.
- Visual parity evidence for `/it/dati-societari/` at 375px, 768px, 1024px, and 1440px.
- Link/navigation evidence showing that Dati societari links now point to `/it/dati-societari/`.
- Confirmation that shop links remain external and continue pointing to `rigonivittorinoshop.it`.
- Confirmation that Task 2 contact backend behavior was not modified, or regression evidence if any contact-adjacent file was touched.
- Confirmation that Task 3 was not worked on.
- Confirmation that Task 4 News was not expanded.
- Commands run and results.
- Known limitations, risks, or user-review items.