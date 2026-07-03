@TODO.md 

# CLAUDE.md

## Purpose

This file contains permanent project rules for work on the rebuilt Italian website for `rigonivittorino.com/it`.

Task-specific instructions belong in `TODO.md`. Before starting work, read this file, then read `TODO.md`, identify the active task, and work only on that active task unless the user explicitly says otherwise.

## Current project state

- Task 1, the Italian website remake, is completed and frozen.
- Treat the existing project as approved work.
- Do not modify completed pages, shared layouts, shared styles, routing, assets, animations, or behavior unless the active task strictly requires it.
- If a change could affect completed work, first explain the need, list the affected files or folders, and obtain explicit user approval before making the change.
- Any folder not evidently related to the active task requires a written reason before it is touched.

## Source of truth

- The live Italian website at `rigonivittorino.com/it` remains the source of truth for visible content, layout, images, animations, behavior, contact details, forms, and responsive appearance.
- The rebuilt site must not look redesigned, simplified, approximated, or visibly different from the live Italian site.
- Preserve visible Italian text exactly unless the active task explicitly requires new functional messages.
- Do not translate, correct, modernize, summarize, or improve existing copy.
- Do not change URLs, route structure, visible navigation, footer layout, typography, spacing, colors, image placement, hover states, scroll effects, or animation timing unless the active task strictly requires it and the user approves.

## Scope boundaries

- Work only on the Italian website unless the active task explicitly says otherwise.
- Do not rebuild or modify English or German pages.
- Do not rebuild or modify `rigonivittorinoshop.it`, its backend, ecommerce system, cart, checkout, accounts, products, or payments.
- Preserve visible shop links and keep them pointing to `rigonivittorinoshop.it`.
- Do not implement, route, migrate, or rebuild News pages, archives, tags, categories, detail pages, or CMS data.
- `/it/privacy-policy/` and `/it/dati-societari/` must remain accessible but completely blank unless the user later gives explicit approval to change that rule.

## Security and data handling

- Never hardcode secrets, credentials, API keys, SMTP passwords, database passwords, private tokens, or sensitive configuration.
- Use environment variables and provide safe placeholder names in `.env.example` or equivalent documentation.
- Treat the site as a public production website.
- Validate and sanitize all user input on the server, even when client-side validation exists.
- Prefer minimal data collection and document any retained user data.
- Do not expose stack traces, raw provider errors, secrets, or sensitive internals to users.

## Backend and integration principles

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

- Preserve the approved visual result from Task 1.
- For any page affected by the active task, compare before and after at these widths: 375px, 768px, 1024px, and 1440px.
- Verify header, footer, navigation, typography, spacing, form layout, images, animations, hover states, scroll behavior, and responsive behavior.
- Use screenshots or other repeatable evidence to prove that unrelated pages were not visually changed.

## Testing requirements

Run the relevant checks available in the repository, such as install, lint, typecheck, unit tests, integration tests, production build, preview, route smoke tests, and browser tests.

If a command is unavailable, document that it is unavailable rather than inventing a result.

For backend tasks, test both success and failure cases, including validation, spam protection, email sending behavior, data retention behavior, and missing environment variables.

## Final response requirements

At completion, report:

- Summary of what changed.
- Files changed.
- Files or folders touched that were not obviously task-related, with reasons.
- Backend or integration choices and why they were selected.
- Environment variables and setup steps.
- Tests and commands run, with results.
- Visual parity evidence for affected pages.
- Confirmation that completed Task 1 work was not modified except where strictly necessary.
- Known limitations, risks, or unresolved configuration items.