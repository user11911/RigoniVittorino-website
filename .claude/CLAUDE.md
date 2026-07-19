@TODO.md 

# CLAUDE.md

## Purpose

This file contains permanent project rules for work on the rebuilt Italian website for `rigonivittorino.com/it`.

Task-specific instructions belong in `TODO.md`. Before starting work, read this file, then read `TODO.md`, identify the active task, and work only on that active task unless the user explicitly says otherwise.

## Current project state

`TODO.md`'s "Completed / frozen project state" section is the single, authoritative, up-to-date list of
completed tasks and preserved constraints — it is not duplicated here, so the two files can't drift out of
sync. Read it before starting any work.

- Treat the existing project as approved work.
- Do not modify completed pages, backend code, shared layouts, shared styles, routing, assets, animations, or behavior unless the active task strictly requires it.
- If a change could affect completed work outside the active task, first explain the need, list the affected files or folders, and obtain explicit user approval before making the change.
- Any folder not evidently related to the active task requires a written reason before it is touched.

## Source of truth

- The live Italian website at `rigonivittorino.com/it` remains the source of truth for visible content, layout, images, animations, behavior, contact details, forms, and responsive appearance for the Italian pages.
- Since Task 9, the live English (`rigonivittorino.com/en`) and German (`rigonivittorino.com/de`) sites are each the source of truth for their own visible language-specific content — never translate from Italian, and never backfill missing English/German content from Italian.
- The rebuilt site must not look redesigned, simplified, approximated, or visibly different from each page's own live-language source.
- Preserve visible text exactly as scraped, per language, unless the active task explicitly requires new functional messages.
- Do not translate, correct, modernize, summarize, or improve existing copy in any language.
- Do not change URLs, route structure, visible navigation, footer layout, typography, spacing, colors, image placement, hover states, scroll effects, or animation timing unless the active task strictly requires it and the user approves.

## Scope boundaries

- Work only within the active task's named scope in `TODO.md` unless the user explicitly says otherwise.
- `/en/` and `/de/` are implemented (Task 9, frozen) — do not rebuild, redesign, translate, or reopen them
  beyond what the active task in `TODO.md` explicitly authorizes. See `TODO.md`'s preserved constraints for
  the exact current boundary.
- Do not rebuild or modify `rigonivittorinoshop.it`, its backend, ecommerce system, cart, checkout, accounts, products, or payments.
- Preserve visible shop links and keep them pointing to `rigonivittorinoshop.it`.
- News is implemented as a single shared `/news/` page across all languages (Task 9, frozen), with
  `/it/news/` kept as a redirect alias. Do not implement News posts, detail pages, archives, tags,
  categories, or CMS data unless the active task in `TODO.md` explicitly authorizes it.
- `/it/privacy-policy/` and `/it/dati-societari/` are implemented and frozen (Tasks 6 and 5). `/en/privacy-policy/` and `/de/privacy-policy/` are intentionally blank, matching their live pages exactly (Task 9) — populating them with real content needs the same kind of explicit user authorization Task 6 required for the Italian page.

## Security and data handling

- Never hardcode secrets, credentials, API keys, SMTP passwords, database passwords, private tokens, or sensitive configuration.
- Use environment variables and provide safe placeholder names in `.env.example` or equivalent documentation when backend or integration work requires them.
- Treat the site as a public production website.
- Validate and sanitize all user input on the server, even when client-side validation exists.
- Prefer minimal data collection and document any retained user data.
- Do not expose stack traces, raw provider errors, secrets, or sensitive internals to users.
- Any privacy/cookie policy content on this site must accurately describe the rebuild's actual current data processing (not the original WordPress site's stack, which used different tools) and must be flagged for the site owner's/legal counsel's review before production launch — AI-drafted policy text is not a substitute for legal sign-off.

## Backend and integration principles

- Apply this section only when the active task touches backend, storage, email, captcha, deployment configuration, or external integrations.
- Prefer simple, maintainable, low-cost, production-suitable backend choices that fit the detected framework and deployment model.
- Use framework-native server/API features when they are reliable and compatible with the project.
- Do not add a separate backend service unless it is clearly justified by the active task.
- Make future expansion possible without overbuilding the current task.
- Document every required environment variable, provider account, migration, and deployment step.

## Discovery before editing

Before changing code for any task:

1. Inspect the repository structure, package manager, framework, routing, styling system, build scripts, tests, and existing documentation.
2. Inspect the relevant live Italian pages and current local implementation.
3. Identify the smallest safe set of files and folders needed for the active task.
4. Record material findings, assumptions, risks, and any uncertainty in `IMPLEMENTATION_NOTES.md` or the closest existing project notes file.
5. Do not begin broad changes until the active task scope and affected files are clear.

## Visual parity and regression control

- Preserve the approved visual result from completed work except where the active task explicitly requires a correction.
- Detailed visual-parity breakpoints and checklists live in `.claude/rules/testing.md` — follow that file's
  requirements for any task touching visible pages, for every implemented language, rather than duplicating
  the specifics here.
- Use screenshots, recordings, or other repeatable evidence to prove that affected defects were fixed and unrelated pages were not visually changed.

## Testing requirements

Run the relevant checks available in the repository, such as install, lint, typecheck, unit tests, integration tests, production build, preview, route smoke tests, and browser tests.

If a command is unavailable, document that it is unavailable rather than inventing a result.

For backend tasks, test both success and failure cases, including validation, spam protection, email sending behavior, data retention behavior, and missing environment variables.

## Final response requirements

At completion, report:

- Summary of what changed.
- Files changed.
- Files or folders touched that were not obviously task-related, with reasons.
- Backend or integration choices, environment variables, and setup steps, if the active task touched backend or integrations.
- Tests and commands run, with results.
- Visual parity evidence for affected pages and defects.
- Confirmation that completed work was not modified except where strictly necessary for the active task.
- Known limitations, risks, or unresolved configuration items.