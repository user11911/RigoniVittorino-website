# testing.md

## Visual parity requirements

Test at these viewport widths:

* 375px mobile
* 768px tablet
* 1024px small desktop
* 1440px desktop

## Content parity requirements

Before final delivery, verify:

* Every scoped route renders.
* `/it/privacy-policy/` renders a completely blank page.
* `/it/dati-societari/` renders a completely blank page.
* News routes are not implemented in the new app routing.
* Every wine category page contains the same wines in the same order.
* Every wine product page contains the exact same visible Italian text and values.
* Every visible image appears in the same place as the original.
* Header labels and destinations match the original, except excluded News routing must not be implemented.
* Footer content and visual layout match the original, while legal/company routes open as blank pages.
* Shop links point to `rigonivittorinoshop.it`.
* Contact page visually matches even if backend submission is not implemented.
* No English or German pages were rewritten.

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

Also create or run a route smoke test covering every scoped route. Each scoped route must return a valid page without console errors, except News routes must not be part of the implemented route set.

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
* Confirmation that News was excluded from routing.

For each scoped page type, compare the rewritten site against the current live site:

* Header
* Desktop navigation
* Mobile navigation
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