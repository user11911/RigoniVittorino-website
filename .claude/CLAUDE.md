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
- **Phase 2 (Tasks 13-65, complete):** the improvement phase. The site intentionally diverged from the
  original live WordPress site's design — homepage hero/video, chi-siamo/cantina, contatti, wine product
  pages, footer, header/nav, loading screen, and a large mobile-experience pass. Phase 1's frozen-work list
  in `TODO.md` still applies (see "Frozen work" below); Phase 2's own completed work is now frozen the same
  way — see "Frozen work" below.
- **Phase 3 (Task 66, complete per the user):** SEO optimization, with one hard constraint that overrides the
  normal Phase 2 "propose a design, get approval" workflow: **no visual/appearance changes of any kind.**
  Nothing a visitor sees on the rendered page — layout, spacing, color, typography, imagery, animation,
  visible copy/wording — may change as part of this phase. This is achievable because real SEO work is
  almost entirely non-visual:
  - **In scope, and does not require design approval** (still follows the normal scope/regression/testing
    rules elsewhere in this file): meta descriptions, canonical URLs, `hreflang` alternate-language tags,
    `sitemap.xml`, `robots.txt`, structured data / JSON-LD (Organization, Product, BreadcrumbList, etc.),
    Open Graph/Twitter Card tags, image `alt` text (renders nothing visually — read by screen readers and
    crawlers only), semantic HTML corrections that don't change any element's applied CSS (e.g. fixing a
    heading level while keeping its existing visual class/styling), and non-visual performance work (resource
    hints like `preload`/`preconnect`, `robots`/indexing directives) — but not the same class of change this
    project already did once for a genuinely different reason (Task: hero video compression), since that
    touches a real user-facing asset and isn't itself an SEO deliverable.
  - **Out of scope for this phase, even if it would plausibly help SEO too:** anything that changes how a
    page looks or reads — restructuring visible content, rewording visible copy, adding/removing/resizing
    visible elements, changing which heading level is used for something if that would change its rendered
    size/weight, or "while I'm in here" content rewrites. If a genuine SEO fix seems to require a visual
    change to work correctly, stop and ask rather than choosing the visual change unasked — do not silently
    treat "it's for SEO" as pre-approval for a design change the way Phase 2's normal workflow would otherwise
    require anyway.
  - Content-accuracy rules from "Source of truth"/"Scope boundaries" below still apply in full — e.g. a meta
    description must describe the page's real, current content; structured data must state real, accurate
    facts (prices, addresses, org names) sourced from this project's own already-established data
    (`src/data/*.json`, existing page content), not invented.

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

This is the central rule of Phase 2, and it exists because with no live site to match, visual and UX
choices are now genuinely subjective — only the user can decide taste. (Playwright/Chromium *can* now
launch in this sandbox with a one-time library fix — see "Headless browser verification" below — so this
rule is about taste, not about an inability to self-verify.)

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

## Headless browser verification

Chromium fails to launch out of the box in this sandbox (missing `libnspr4.so`, `libnss3.so`,
`libasound2` — confirmed in earlier sessions and long treated as a permanent limitation), but there's no
passwordless `sudo` needed to fix it: `apt-get download <pkg>` fetches a `.deb` without root, and `dpkg -x`
extracts it locally. `scripts/enable-playwright-libs.sh` automates this (downloads once per fresh
sandbox/job, a few seconds) — `source` it, then any script using Playwright's `chromium.launch()` works,
including the project's own dormant `scripts/route-smoke-test.mjs`. Found and fixed live during Task 54
round 3 (see `IMPLEMENTATION_NOTES.md`) — use this for real layout/overflow measurements
(`getBoundingClientRect`, `scrollWidth`/`clientWidth`, `getComputedStyle`) instead of hand-parsing CSS
cascade order by text search, which is slow and error-prone (a text-search heuristic for "nearest preceding
`@media`" produced a wrong conclusion that round — see that entry). Screenshots work too
(`page.screenshot()`) for a quick visual sanity check, though this is still not the same as a real device
for touch/gesture behavior, font rendering quirks, or anything network/tunnel-related.

## Verification rigor for behavior that can't be screenshot-tested

This project has repeatedly shipped scroll/animation/stacking code that looked correct on paper and turned
out not to work only after the user tested it live (see `IMPLEMENTATION_NOTES.md`'s hero-fade history for
the concrete case this section is drawn from). Headless Chromium now works in this sandbox (see above) for
layout/CSS verification, which closes off a lot of that failure class — but it still isn't a real device,
so treat these practices as still applying to anything touch/gesture/animation-timing/network-dependent,
where a headless check can look right and still not be what a real device does:

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

Phase 1's and Phase 2's completed tasks (see `TODO.md`) remain the frozen baseline in Phase 3 too — Phase
3's own "no visual/appearance changes" rule above makes this closer to automatic than in prior phases (an
SEO task shouldn't be touching visible layout/styling at all), but the scope rules below still apply to any
non-visual behavior of frozen features (e.g. don't restructure a frozen page's HTML beyond what's needed for
the active SEO task, even though that wouldn't visibly change anything):

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
- Headless Chromium can verify layout/overflow/computed-style facts directly (see "Headless browser
  verification" above) — use it for non-trivial visible changes rather than reasoning from CSS text alone.
  It's still not a real device: say plainly when something is headless-verified vs. confirmed live, and
  still encourage the user to check touch/gesture/animation-dependent changes locally (`npm run dev`/
  `preview`) or on a deployed preview.
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
- For visible changes: a precise enough description of the result for the user to review and approve, and
  the headless-verified facts (measurements, screenshots) where used — still distinct from live
  confirmation on a real device.
- Confirmation that work outside the active task's scope, and all frozen work, was not modified.
- Known limitations, risks, or unresolved configuration items.
