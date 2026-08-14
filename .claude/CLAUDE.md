@TODO.md 

# CLAUDE.md

## Purpose

This file contains permanent project rules for work on `rigonivittorino.com`'s rebuilt website (Italian,
English, German).

Task-specific instructions belong in `TODO.md`. Before starting work, read this file, then read `TODO.md`, identify the active task, and work only on that active task unless the user explicitly says otherwise.

## Project phases

- **Phase 1 (Tasks 1-12, complete):** a faithful rebuild of the original WordPress site, reaching visual
  and content parity with the live `rigonivittorino.com` for `/it/`, `/en/`, `/de/`. The live site was the
  source of truth throughout.
- **Phase 2 (current):** the improvement phase. The site may now intentionally diverge from the original
  live WordPress site — that divergence is the point, not a defect. Phase 1's frozen-work list in
  `TODO.md` still applies (see "Frozen work" below); Phase 2 tasks build on top of it rather than replacing
  it wholesale.

## Current project state

`TODO.md`'s "Completed / frozen project state" section is the single, authoritative, up-to-date list of
completed tasks and preserved constraints — it is not duplicated here, so the two files can't drift out of
sync. Read it before starting any work.

- Treat completed work as the approved, current state — not as something to reconcile against the old live
  site anymore.
- Do not modify completed pages, backend code, shared layouts, shared styles, routing, assets, animations, or behavior unless the active task strictly requires it.
- If a change could affect completed work outside the active task, first explain the need, list the affected files or folders, and obtain explicit user approval before making the change.
- Any folder not evidently related to the active task requires a written reason before it is touched.

## Source of truth

- The **current rebuilt site** (the state of `main`) is now the baseline every task works from — not the
  original live WordPress site. Do not "correct" a page back toward the old live site's design; that would
  itself be an unapproved, out-of-scope change.
- The original live site remains a useful *factual* reference — for wine specifications, company/contact
  details, legal text — since accuracy of real-world facts still matters even as presentation changes. It
  is no longer a *visual or structural* reference.
- Preserve visible text/content accuracy per language unless the active task explicitly changes copy. Do
  not translate between languages, invent facts, or silently rewrite copy outside the active task's scope.
- Do not make unscoped "drive-by" improvements. An active task authorizes its own named scope only —
  noticing something else that could be nicer is worth mentioning to the user, not fixing unasked.

## Design decisions require explicit approval before implementation

This is the central rule of Phase 2, and it exists for two reasons: (1) with no live site to match, visual
and UX choices are now genuinely subjective — only the user can decide taste; (2) Playwright/Chromium
cannot launch in this sandbox (confirmed, permanent limitation), so there is no way to self-verify a visual
change actually looks right before the user sees it.

- For any change that affects layout, styling, color, typography, imagery, animation, spacing, or new UI
  patterns: propose the change (what will change, why, and how — described precisely, with a text mock,
  markup/CSS sketch, or reference to something concrete when useful) and get explicit user approval before
  writing implementation code.
- Do not implement first and ask forgiveness after. If the active task's `TODO.md` entry already contains
  an approved, specific design decision, that counts as approval — re-confirm only if the entry is
  ambiguous or if you want to deviate from it.
- Exception: fixing a bug in an already-approved design (e.g., a CSS specificity issue breaking an intended
  layout) does not need re-approval — only *new* design decisions do.
- Purely functional/technical changes with no visible effect (performance, non-visible accessibility
  attributes, code cleanup, refactors) do not require this approval step, but still follow the normal scope
  and regression rules below.

## Verification rigor for behavior that can't be screenshot-tested

This project has repeatedly shipped scroll/animation/stacking code that looked correct on paper and turned
out not to work only after the user tested it live (see `IMPLEMENTATION_NOTES.md`'s hero-fade history for
the concrete case this section is drawn from). Playwright/Chromium cannot launch in this sandbox — that
limitation is permanent and no rule here changes it — but these practices catch more of that class of bug
before it ships, rather than after a live bug report:

- **Prefer correct-by-construction over correct-if-reasoning-holds.** When two implementations achieve the
  same visible result, prefer the one whose correctness follows from a structural guarantee (e.g. an
  element's own background always painting behind its own content) over one that depends on winning a
  z-index/stacking-context/specificity contest against another element. If the correct-by-construction
  option is rejected for a specific reason, state that reason.
- **Measure, don't assume, for any position-derived number.** A numeric threshold, buffer, or timing value
  computed from the real structure of the page (element positions, heights, distances between sections)
  must be derived from the actual content files being modified, not a plausible-sounding round number —
  state the real measurements used in the response, so the derivation can be sanity-checked without running
  a browser.
- **Use a fixed status vocabulary and mean it**: "Implemented — logic/output verified [how], not yet
  confirmed live" vs. "Confirmed working (user-verified)." Never mark a visible/behavioral change as
  done/completed/frozen in `TODO.md` on the strength of static checks alone — it stays in the first state
  until the user confirms it live, or explicitly accepts it without confirming.
- **Circuit breaker after repeated live failures.** If the same feature has been live-tested and reported
  broken twice in a row, don't make a third incremental patch to the same architecture. Lay out 2-3
  genuinely different approaches, or ask targeted diagnostic questions, before touching code again.
- **Flag pattern reuse explicitly.** If a new fix structurally resembles an approach that already failed
  live for the same feature, say so directly and state why this attempt is expected to avoid the same
  failure, rather than silently reintroducing something similar to what didn't work.

This applies to the same category of change as "Design decisions require explicit approval" above —
layout, styling, animation, scroll/interaction behavior — not to backend or content-only work.

## Frozen work

Phase 1's completed tasks (see `TODO.md`) remain the frozen baseline in Phase 2 too:

- Do not reopen, restyle, or functionally change frozen work unless the active task explicitly names it.
- Reopening one frozen area for restyling does not imply permission to touch any other frozen area.
- Functional/backend behavior of frozen features (contact form backend, D1 storage, captcha, rate
  limiting) must not change unless a task explicitly targets it — even if the task is restyling that page's
  visible appearance.
- The absence of shop links (Task 11) and social-share counts/links (Task 12) remains in force; do not
  re-add either unless a future task explicitly reverses that decision.

## Scope boundaries

- Work only within the active task's named scope in `TODO.md` unless the user explicitly says otherwise.
- Do not rebuild or modify `rigonivittorinoshop.it`, its backend, ecommerce system, cart, checkout, accounts, products, or payments — this always applies, regardless of what this site's own presentation looks like.
- `/it/privacy-policy/` and `/it/dati-societari/` are implemented (Tasks 5-6); their legal/factual content
  must not change without explicit authorization, even under a general "restyle the site" task — restyling
  their presentation is fine if scoped, rewriting their factual/legal content is not.
- News remains a single shared `/news/` page across languages (Task 9) unless a task explicitly changes
  that architecture.

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
2. Inspect the current implementation of every page the active task touches, plus any reference the user
   supplied (a description, mockup, inspiration link, or explicit design decision already recorded in
   `TODO.md`).
3. Identify the smallest safe set of files and folders needed for the active task.
4. Record material findings, assumptions, risks, and any uncertainty in `IMPLEMENTATION_NOTES.md` or the closest existing project notes file.
5. Do not begin broad changes until the active task scope, affected files, and (for visible changes) the
   approved design decision are all clear.

## Visual regression control

- "Regression" in Phase 2 means an unintended change to something outside the active task's scope — not
  divergence from the old live site, which is now expected wherever a task intends it.
- Preserve the current, approved appearance and behavior of everything not named in the active task.
- Since Playwright/Chromium cannot launch in this sandbox, non-trivial visible changes cannot be
  self-verified with a screenshot here. Substitute markup/CSS diffs precise enough to review, and say so
  plainly rather than claiming a visual confirmation that wasn't actually performed. Encourage the user to
  check the change locally (`npm run dev`/`preview`) or on a deployed preview before merging.
- Detailed regression and testing requirements live in `.claude/rules/testing.md` — follow that file's
  requirements for any task touching visible pages, for every implemented language, rather than duplicating
  the specifics here.

## Testing requirements

Run the relevant checks available in the repository, such as install, lint, typecheck, unit tests, integration tests, production build, preview, and route smoke tests.

If a command is unavailable, document that it is unavailable rather than inventing a result.

For backend tasks, test both success and failure cases, including validation, spam protection, email sending behavior, data retention behavior, and missing environment variables.

## Final response requirements

At completion, report:

- Summary of what changed and why (referencing the approved design decision, when the task was visible).
- Files changed.
- Files or folders touched that were not obviously task-related, with reasons.
- Backend or integration choices, environment variables, and setup steps, if the active task touched backend or integrations.
- Tests and commands run, with results.
- For visible changes: a precise enough description of the result for the user to review and approve,
  since automated screenshot verification is unavailable here.
- Confirmation that work outside the active task's scope, and all frozen work, was not modified.
- Known limitations, risks, or unresolved configuration items.
