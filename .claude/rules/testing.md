# testing.md

## Visual parity requirements

Test at these viewport widths:

* 375px mobile
* 768px tablet
* 1024px small desktop
* 1440px desktop

## Content parity requirements

Before final delivery, verify, for every implemented language (`/it/`, `/en/`, `/de/`):

* Every scoped route renders.
* `/it/privacy-policy/` renders the real privacy/cookie policy page (see TODO.md Task 6) — no longer blank.
  `/en/privacy-policy/` and `/de/privacy-policy/` are intentionally blank (Task 9), matching their live
  pages exactly — confirm they still match that live blank state, not that they show content.
* `/it/dati-societari/`, `/en/company-data/`, and `/de/firmen-daten/` render correctly.
* Every wine category page contains the same wines in the same order as that language's own live category
  page.
* Every wine product page contains the exact same visible text and values as that language's own live
  product page — do not compare English/German text against the Italian source, or vice versa.
* Every visible image appears in the same place as the original.
* Header labels and destinations, including the language switcher, match each language's own live site.
* Footer content and visual layout match each language's own live site.
* Shop links point to `rigonivittorinoshop.it`.
* Contact page visually matches its own language's live page even if backend submission is not
  implemented — including that the team-profile "description" text renders visibly smaller/distinct from
  the "role" text above it, not the same size (a regression found and fixed on `/en/`/`/de/` in Task 10 —
  verify it doesn't recur).
* The wine-type list on the `/en/`/`/de/` landing pages ("Our collection") renders as a properly formatted,
  arranged list — not disorganized/unstyled (the other half of Task 10's fix).
* News renders identically at the shared `/news/` route regardless of which language's nav linked to it;
  `/it/news/` redirects there rather than rendering its own copy.

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

Also create or run a route smoke test covering every scoped route. Each scoped route must return a valid page without console errors. News is a single shared route (`/news/`, with `/it/news/` redirecting to it, since Task 9) reachable from every language — include it in the smoke test; do not test per-language News duplicates, since none exist. Do not extend News scope (posts, archives, tags, detail pages) beyond what's already implemented unless the active task explicitly authorizes it.

## Required final deliverables

At completion, provide:

* Summary of framework/architecture used.
* List of files changed.
* List of pages implemented.
* List of pages intentionally blank.
* List of pages/systems excluded.
* Asset inventory with original source URLs and local paths.
* Wine route inventory.
* Page-by-page parity checklist.
* Before/after screenshots for representative pages and responsive breakpoints.
* Commands run and results.
* Known differences, if any.
* Notes on any unavailable third-party scripts, assets, PDFs, forms, or behavior.
* Confirmation that shop links remain external.
* Confirmation that News routing matches the active task scope, including any shared News route, redirects, aliases, or exclusions.

For each scoped page type, compare the rewritten site against that page's own language's current live site
(never cross-compare English/German against the Italian source, or vice versa):

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

The final delivery must include a page-by-page parity checklist with before/after screenshots. These should be used to confirm work quality before submitting