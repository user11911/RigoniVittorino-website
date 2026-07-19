# TODO.md

This file contains task-specific project work. `CLAUDE.md` contains permanent rules and must be followed for every task.

Detailed implementation history for completed tasks lives in `IMPLEMENTATION_NOTES.md`, not here — this file
stays focused on current/active work plus the compact status list below, per `CLAUDE.md`'s own "Discovery
before editing" step 4.

## Completed / frozen project state

The rebuilt Italian website is approved work. Do not reopen, refactor, redesign, or modify completed work unless the active task strictly requires it.

Completed or inactive work:

- Task 1: Italian website remake for `/it/`, main Italian pages, wine category pages, and product pages.
- Task 2: functional `/it/contatti/` backend/contact-form implementation with email, confirmation, captcha, and retained submissions.
- Task 3: paused/inactive visual-parity bug-fix task. Do not work on it unless the user explicitly reactivates it.
- Task 4: completed/inactive Italian News landing page at `/it/news/`. Superseded by Task 9's shared `/news/`.
- Task 5: completed/inactive Italian Dati societari page at `/it/dati-societari/`. Do not modify unless explicitly reactivated.
- Task 6: completed/inactive Cloudflare Web Analytics beacon + real `/it/privacy-policy/` page. Do not modify unless explicitly reactivated. Merged to `main` at commit `94209c1`.
- Task 7: completed/inactive fix for `ShareButtons.astro` URL-encoding (all 6 links, including Stumbleupon)
  and contact-form server-side length validation. Do not modify unless explicitly reactivated. Committed at
  `716b02a`, merged to `main`. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 8: completed/inactive fix for missing `bodyClass="singular missing-post-thumbnail"` on `chi-siamo`,
  `cantina`, and `contatti`. Do not modify unless explicitly reactivated. Committed at `03a0459`, merged to
  `main`. Detail: `IMPLEMENTATION_NOTES.md`.
- Task 9: completed/inactive build of `/en/` and `/de/` website trees (mirroring the Italian architecture,
  filled with real live English/German content), a shared language-neutral `/news/` page (with `/it/news/`
  kept as a 301 redirect), and country-based root `/` routing, plus a follow-up fix for missing hero
  captions and broken category-list links on the `/en/`/`/de/` landing pages. Do not modify unless
  explicitly reactivated. Committed at `05d2bb3` (build) and `202972d` (bug fixes), merged and pushed to
  `main`. Detail: `IMPLEMENTATION_NOTES.md`.

Preserved constraints from completed work:

- The live Italian website at `rigonivittorino.com/it` remains the source of truth for visible layout, typography, images, spacing, animation, navigation, footer, content, and responsive behavior.
- Preserve the approved rebuilt Italian site except where the active task requires a narrow change.
- English (`/en/`) and German (`/de/`) websites, the shared `/news/` page, and root `/` country
  routing are implemented (Task 9, frozen). Do not modify unless explicitly reactivated. Do not
  translate/correct/improve their content, or reopen the frozen Italian pages beyond Task 9's narrow
  language-switcher/shared-News wiring, without explicit reauthorization.
- Do not modify `rigonivittorinoshop.it`, ecommerce systems, cart, checkout, account, products, payments, or external shop behavior.
- Keep existing visible shop links pointing to `rigonivittorinoshop.it`.
- Do not modify Task 2 contact-backend code (`src/pages/api/contact.ts`, `src/lib/rate-limit.ts`,
  `src/lib/email.ts`, `src/lib/turnstile.ts`, the D1 migration); Task 7's narrow authorization to touch
  `src/lib/contact-validation.ts` is complete and frozen along with it.
- `/it/privacy-policy/` and Cloudflare Web Analytics are implemented (Task 6, frozen); do not modify unless
  explicitly reactivated.
- `/it/dati-societari/` (Task 5) is completed/frozen; do not modify it except to reuse its already-finalized company-identity text for reference.
- Do not work on Task 3 visual bugs or further News scope as part of this task.


## Task 10 - Active: fix EN/DE profile font-size and landing-page wine-list formatting

Status: active.

### User request

Fix two visual regressions on the `/en/` and `/de/` sites built by Task 9:

1. On `/en/contatti/` and `/de/contacts/`, the team-profile "description" text renders at the same font
   size and style as the "role" text above it, instead of visibly smaller/distinct — as it correctly does
   on `/it/contatti/` and the live website.
2. On the `/en/` and `/de/` landing pages, the "Our collection" wine-type list renders as a disorganized,
   unformatted list instead of the properly arranged/styled list seen on `/it/` and the live website.

Also: if `.claude/rules/testing.md` doesn't require checking that `/en/`/`/de/` match their own live sites,
add that. Also check the `.claude/` instruction files themselves for issues/redundancies.

### Root cause (confirmed by direct investigation — not guesswork)

This project's static pages reuse verbatim-scraped WordPress markup. Some of that markup's styling comes
from a **page-specific inline `<style id="uagb-style-frontend-{postId}">` block embedded in that exact
page's own `<head>`** on the live site — containing CSS rules scoped to that page's own auto-generated
Gutenberg/UAGB block IDs (e.g. `.uagb-block-2d6a9619 p.uagb-team__desc{font-size:15px}`). This is the
*only* place `.uagb-team__desc`/`.uagb-team__prefix` font-size rules or the homepage `elenco-categorie`
list's grid/flex layout rules exist anywhere in this project's self-hosted CSS — confirmed via
`grep -rc "uagb-team__desc"` across every self-hosted CSS file: zero matches outside this per-page block.

Task 1/Task 2 captured this block for the Italian pages into `src/content/main/home-extra-style.css` and
`contatti-extra-style.css` (referenced via each page's `extraStyleFile` prop on `BaseLayout`). Task 9 built
`/en/` and `/de/` equivalents but reused these same two **IT-specific** files verbatim
(`extraStyleFile="home-extra-style.css"` / `"contatti-extra-style.css"` on the EN/DE pages too) — an
oversight, not a deliberate choice. Since English and German pages are separate WordPress page instances,
their block IDs are completely different from Italian's and from each other (confirmed by direct
inspection of each language's own cached scrape):

- Contatti team-profile blocks: IT `efaa6bd2`/`2d6a9619`/`72e6c065`, EN `0357eb0c`/`1f6735d2`/`2596b0a6`/
  `3a5ba4de`/`bed9513f`, DE `17384929`/`6bdbf101`/`b8d8d3e7`/`c28081f7`/`f50a2397`.
- Homepage `elenco-categorie` (wine-type list) block: IT `2c399198`, EN `a2dba6df`, DE `13e23b96`.

So the IT-specific CSS selectors in the reused files never match EN/DE's markup, and neither bug has any
fallback anywhere else — the font-size split and the list's layout formatting are entirely undefined for
EN/DE, silently falling back to unstyled defaults. This exactly matches both reported symptoms.

Each language's own raw cached scrape already contains its **own**, correctly-scoped
`<style id="uagb-style-frontend-*">` block in `<head>` — confirmed present at
`scripts/.cache/html/en/contatti.html`, `de/contacts.html`, `en/_home.html`, `de/_home.html`. It was simply
never extracted for anything but Italian.

### Scope authorization

This task authorizes touching the EN/DE equivalents of `home-extra-style.css`/`contatti-extra-style.css`
and the scrape/extraction script(s) that generate them, and the EN/DE page files that reference them
(`src/pages/en/index.astro`, `src/pages/de/index.astro`, `src/pages/en/contatti/index.astro`,
`src/pages/de/contacts/index.astro`). It does not authorize touching the Italian equivalents of these
files (`src/content/main/home-extra-style.css`, `contatti-extra-style.css`, `src/pages/it/index.astro`,
`src/pages/it/contatti/index.astro`) — those are already correct and frozen.

### Route/file scope

Implement:

- A scripted extraction step (extend `scripts/extract-main-content.mjs` or add a small new script) that
  pulls each page's own `<style id="uagb-style-frontend-*">` block(s) out of `<head>` in the raw cache, per
  language, for the `home` and `contatti`/`contacts` pages only.
- New per-language extra-style files: e.g. `home-extra-style.en.css`, `home-extra-style.de.css`,
  `contatti-extra-style.en.css`, `contatti-extra-style.de.css` (exact naming is an implementation judgment
  call — follow this project's existing naming conventions, e.g. the `wines.en.json`/`wines.de.json`
  pattern already used elsewhere).
- `src/pages/en/index.astro`, `src/pages/de/index.astro`, `src/pages/en/contatti/index.astro`,
  `src/pages/de/contacts/index.astro` — update `extraStyleFile` to reference the new per-language file.

Do not implement or modify:

- Any Italian page, layout, or content file.
- Any other EN/DE page (the-estate/unternehmen, winery/weinkeller, company-data/firmen-daten,
  privacy-policy, category/product pages) — this task is scoped to exactly the two affected page types.
- The shop, News, contact-backend, or root-routing code.

### Non-negotiable constraints

- This must be a scripted, reproducible extraction (survives re-running the scrape pipeline), not a one-off
  hand-copy — matching this project's existing convention that generated content comes from scripts, not
  manual edits to committed output.
- No change to any other visual aspect of the affected pages — only the description/role font-size
  differentiation and the wine-list formatting should change.
- Do not invent CSS values — the fix is to correctly extract and wire up EN/DE's own already-live,
  already-correct CSS, not to guess replacement values.

### Discovery required before implementation

1. Read `CLAUDE.md`, then this `TODO.md`, confirm Task 10 is the only active task.
2. Re-read `src/content/main/home-extra-style.css`, `contatti-extra-style.css`, and the EN/DE page files
   named above in full.
3. Confirm the exact `<style id="uagb-style-frontend-*">` block boundaries in each raw cached scrape
   (`scripts/.cache/html/en/_home.html`, `de/_home.html`, `en/contatti.html`, `de/contacts.html`) before
   writing extraction logic — there may be more than one such block per page (e.g. one for the team
   block, one for the contact-form styler, one for the Google Map embed on the contatti page), and all of
   them need to be captured together for the page to still work.

### Implementation requirements

- Extraction logic outputs a valid CSS file per language per page, containing that page's own
  `<style id="uagb-style-frontend-*">` content (concatenated if there are multiple blocks), unmodified
  except for necessary CSS-syntax cleanup (e.g. stripping the `<style>` tag wrapper itself).
- EN/DE page files reference their new per-language file instead of the shared IT one.

### Testing and validation

- `npm run check`, `npm run test:unit`, `npm run build`.
- Route smoke test (`scripts/route-smoke-test-curl.mjs`).
- Since Playwright/Chromium cannot launch in this sandbox (confirmed, pre-existing, see
  `IMPLEMENTATION_NOTES.md` Task 8/9), visual rendering cannot be screenshotted here. Substitute: curl the
  rendered `/en/contatti/`/`/de/contacts/`/`/en/`/`/de/` HTML and confirm (a) the new per-language CSS file
  is linked/inlined, (b) it contains the expected `.uagb-team__desc`/`.uagb-team__prefix`/
  `.elenco-categorie`-related selectors matching that page's own block IDs. Do not claim pixel-level visual
  confirmation that wasn't performed.
- Diff each regenerated/changed file to confirm only the intended CSS-file-reference change occurred, no
  unrelated regression (apply the same before/after diff discipline documented in `IMPLEMENTATION_NOTES.md`
  Task 9, where a naive re-run of the extraction pipeline twice silently reverted an unrelated manual edit).

### Required Task 10 deliverables

- Summary of the fix and confirmation of the root cause.
- Files changed.
- Confirmation no unrelated files (Italian pages, other EN/DE pages) were touched.
- Commands run and results.
- Known limitations (expected: no pixel-level visual confirmation, per the Playwright gap above).
