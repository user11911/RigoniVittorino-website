# testing.md

## Regression requirements

Test at these viewport widths, for every page the active task's change could plausibly affect:

* 375px mobile
* 768px tablet
* 1024px small desktop
* 1440px desktop

The comparison target is the site's own current state (before the active task's change), not the original
live WordPress site — Phase 2 tasks are expected to diverge from that. Confirm:

* The scoped change matches what was proposed and approved (see `CLAUDE.md`'s "Design decisions require
  explicit approval" rule) — not a guess at what might look nice.
* Nothing outside the active task's scope changed. If a shared layout, component, or stylesheet was
  touched, check every page that includes it, not just the page the task was aimed at.
* Nothing in the frozen-work list (`TODO.md`) was altered, unless the active task explicitly names it.

## Content and functional accuracy requirements

Before final delivery, verify, for every implemented language (`/it/`, `/en/`, `/de/`) touched by the
active task:

* Every scoped route still renders.
* Real-world facts (wine specifications, company/contact details, legal text) are unchanged unless the
  active task explicitly authorized changing them — restyling a page must not alter what it says.
* Frozen functional behavior is unchanged: contact form submission/validation/spam-protection, the absence
  of shop links (Task 11) and social-share counts/links (Task 12), and shared News routing (`/news/`,
  `/it/news/` redirect), unless the active task explicitly targets one of these.
* `/it/privacy-policy/` and `/it/dati-societari/` still render their real content (only restyled if that was
  the scoped task); `/en/privacy-policy/` and `/de/privacy-policy/` remain intentionally blank unless a
  task explicitly authorizes populating them.
* The language switcher and navigation still point to the correct equivalent page in each language.

## Testing and validation

Run all relevant available commands in the repository, such as:

* Install command for the detected package manager
* Typecheck
* Lint
* Unit tests
* Integration tests
* Production build
* Local preview or smoke test

If commands are unavailable, document that they are unavailable.

Also run the route smoke test covering every scoped route. Each scoped route must return a valid page
without console errors.

## Required final deliverables

At completion, provide:

* Summary of the change and the design decision it implements (referencing where it was approved).
* List of files changed.
* Confirmation that pages/areas outside the active task's scope are unchanged.
* Confirmation that frozen work (`TODO.md`) is unchanged, unless explicitly reauthorized.
* Commands run and results.
* For visible changes: a description precise enough for the user to review and approve, or a link to a
  local/deployed preview — since Playwright/screenshot verification is unavailable in this sandbox. Be
  explicit that this substitutes for, and does not equal, actual pixel-level visual confirmation.
* Known differences or limitations, if any.

For each page type touched by the active task, confirm (against the site's own prior state, not the
original live site):

* Header
* Desktop navigation
* Mobile navigation
* Language switcher
* Hero sections
* Image placement
* Typography
* Spacing
* Wine category grids
* Product cards
* Product detail pages
* Contact page layout
* Footer
* Hover states
* Scroll effects
* Animations
* Transitions
* Responsive behavior
