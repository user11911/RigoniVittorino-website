# CLAUDE.md

## Project goal

Rewrite and optimize the Italian version of `rigonivittorino.com/it` without changing its visible features, content, layout, imagery, animations, transitions, or user-facing behavior.

The live Italian website is the visual and content source of truth. Rebuild it with a modern implementation while preserving the current Italian site’s appearance and behavior as closely as possible.

A framework migration is allowed and encouraged because the current technology is obsolete. The migration must not result in a visibly different website.

## Core constraints

* Work only on the Italian version of the website.
* Rewrite all Italian pages in scope.
* Do not rewrite English or German pages.
* Do not rebuild or modify the external shop site.
* Do not rebuild or route News pages.
* Do not change visible Italian text.
* Do not translate, correct, modernize, summarize, or improve copy.
* Do not alter visible design, page layout, animations, transitions, hover states, scroll effects, header behavior, footer behavior, or responsive behavior.
* Do not replace original images with visually similar alternatives.
* Use the same pictures in the same places as the current website.
* Download and store the same public images, PDFs, and required static assets from the current site when needed. This is allowed and encouraged.
* Preserve external links to `rigonivittorinoshop.it`.
* SEO metadata can and should be cleaned up technically, provided visible content and visual behavior do not change.

## Acceptable visual tolerance

A very close match is acceptable, but the final product must not be recognizably different in design, layout, spacing, imagery, or animations.

The user will be highly dissatisfied if the final product feels redesigned, simplified, approximated, or visually different from the current website.

Treat visual parity as a primary requirement, not a secondary polish task.

## Pages in scope

Implement these Italian pages.

### Main Italian pages

* `/it/`
* `/it/chi-siamo/`
* `/it/cantina/`
* `/it/contatti/`

### Blank Italian legal/company pages

These routes must exist but render completely blank pages:

* `/it/privacy-policy/`
* `/it/dati-societari/`

Rules for these two pages:

* The route must be accessible.
* Do not return a 404.
* Do not redirect.
* Do not show header, footer, navigation, page title, placeholder text, loading text, “coming soon” text, or any other visible content.
* Do not copy, infer, rewrite, or generate legal/company content.
* Render a completely blank page.

### Wine category pages

* `/it/spumanti/`
* `/it/bianchi/`
* `/it/rossi/`
* `/it/affinati/`
* `/it/frizzanti-e-rosati/`
* `/it/passiti/`

### Prosecchi e Spumanti product pages

* `/it/i-nostri-vini/creativo-prosecco-millesimato-brut-doc-treviso/`
* `/it/i-nostri-vini/pinot-nero-spumante-millesimato-brut/`
* `/it/i-nostri-vini/creativo-prosecco-millesimato-brut-doc-treviso-magnum/`
* `/it/i-nostri-vini/pinot-nero-spumante-millesimato-brut-magnum/`
* `/it/i-nostri-vini/prosecco-950-extra-dry-doc-treviso/`
* `/it/i-nostri-vini/prosecco-rose-millesimato-brut-doc-treviso/`
* `/it/i-nostri-vini/glera-spumante-millesimato-extra-dry/`
* `/it/i-nostri-vini/anema-raboso-spumante-dolce/`

### Bianchi product pages

* `/it/i-nostri-vini/pinot-grigio-igt-veneto/`
* `/it/i-nostri-vini/chardonnay-igt-veneto/`
* `/it/i-nostri-vini/sauvignon-igt-veneto/`
* `/it/i-nostri-vini/suadente-glera-igt-veneto/`
* `/it/i-nostri-vini/incrocio-manzoni-igt-veneto/`
* `/it/i-nostri-vini/traminer-igt-veneto/`

### Rossi product pages

* `/it/i-nostri-vini/pinot-nero-igt-veneto/`
* `/it/i-nostri-vini/cabernet-igt-veneto/`
* `/it/i-nostri-vini/malbech-igt-veneto/`
* `/it/i-nostri-vini/merlot-igt-veneto/`
* `/it/i-nostri-vini/refosco-igt-veneto/`

### Affinati product pages

* `/it/i-nostri-vini/cabernet-sauvignon-affinato-in-botte-igt-veneto/`
* `/it/i-nostri-vini/merlot-affinato-in-botte-igt-veneto/`
* `/it/i-nostri-vini/profondo-cabernet-affinato-in-botte-igt-veneto/`
* `/it/i-nostri-vini/maiuscolo-pinot-nero-affinato-in-botte-igt-veneto/`

### Frizzanti e Rosati product pages

* `/it/i-nostri-vini/chardonnay-frizzante-igt-veneto/`
* `/it/i-nostri-vini/verduzzo-frizzante-igt-veneto/`
* `/it/i-nostri-vini/raboso-frizzante-igt-veneto/`
* `/it/i-nostri-vini/rosato-di-raboso-frizzante-everythings-coming-up-rose-igt-veneto/`

### Passiti product pages

* `/it/i-nostri-vini/complice-passito-igt-veneto/`
* `/it/i-nostri-vini/ciacola-passito-igt-veneto/`
* `/it/i-nostri-vini/raboso-passito/`

## Pages and systems excluded from this work

### Shop

Do not rebuild or modify:

* `rigonivittorinoshop.it`
* Any shop backend
* Any ecommerce checkout, cart, account, product, or payment page

However:

* Keep visible shop links exactly where they appear in the current Italian site.
* Shop links must continue pointing to `rigonivittorinoshop.it`.
* Do not remove shop buttons or navigation items just because the shop is excluded.

### News

Do not rebuild, implement, modify, migrate, or route:

* `/it/news/`
* Italian news listing pages
* Italian news detail pages
* News archives, categories, tags, pagination, or CMS data

News should be excluded entirely from the new app’s routing.

If the original visible navigation contains a News link, preserve the visual navigation layout, but do not implement a local News route. If needed, leave the link as a non-owned link or document the handling in `IMPLEMENTATION_NOTES.md`.

## Contact page

The `/it/contatti/` page must visually match the current site.

For this phase, visual parity is enough. The contact form does not need full backend functionality unless working credentials and backend endpoints already exist in the repository.

Preserve:

* Field layout
* Labels
* Button text
* Map placement
* Address
* Phone number
* Email
* Opening/contact information
* Visual validation states if present in the current frontend
* Spacing, typography, and responsive behavior

Do not invent a new backend submission flow.

## SEO and metadata

SEO metadata can and should be cleaned up technically.

Allowed:

* Improve malformed metadata.
* Add missing canonical metadata when appropriate.
* Normalize Open Graph/Twitter metadata.
* Add structured data only if it reflects the current page content exactly.
* Improve technical SEO without visible design changes.

Not allowed:

* Changing visible page titles, headings, text, or labels.
* Rewriting product descriptions.
* Adding marketing copy.
* Adding new visible sections for SEO.
* Adding visible breadcrumbs unless already present.
* Changing URLs.

## Asset handling

* Download and store current public images, PDFs, icons, and required static assets from the live website when needed.
* Preserve the same image for the same page section or product.
* Preserve image order, placement, crop, apparent size, aspect ratio, and responsive behavior.
* Preserve wine bottle/product imagery exactly.
* Preserve linked technical sheets/PDFs for wines.
* Do not use replacement stock images.
* Do not upscale, retouch, recolor, crop differently, or compress images in a way that visibly changes them.
* Use modern image optimization only when visual output remains effectively identical.

Create an asset inventory that maps each downloaded asset to its original live URL and the local path used in the rewritten project.

## Discovery workflow before editing

Before rewriting code:

1. Inspect the existing repository structure, framework, package manager, routing, data source, styling system, asset pipeline, and build scripts.
2. Inspect the live Italian website page by page.
3. Build a complete route inventory for all Italian pages in scope.
4. Build a wine inventory from the live site and verify every category and product page.
5. Build an asset inventory for all images, PDFs, fonts, icons, and scripts needed for visual parity.
6. Capture baseline screenshots from the live site.
7. Inspect the live HTML, CSS, JavaScript behavior, animations, hover states, transitions, mobile menu, sliders, form states, and responsive behavior.
8. Record findings and any uncertainty in `IMPLEMENTATION_NOTES.md`.

Do not begin broad rewrites until the route, content, and asset inventories are clear.

## Implementation rules

* Framework migration is allowed and encouraged.
* Prefer a modern, maintainable architecture.
* Use shared components for header, footer, wine category grids, wine cards, product pages, contact sections, and repeated layout patterns.
* Use data-driven wine/product content where practical.
* Keep rendered output equivalent to the live Italian site.
* Preserve URL paths exactly.
* Preserve trailing slash behavior if the current deployment depends on it.
* Preserve product page fields exactly.
* Preserve wine category ordering exactly.
* Preserve header navigation layout exactly.
* Preserve mobile navigation behavior exactly.
* Preserve footer layout and visible links exactly, except that blank legal/company pages must render fully blank when opened.
* Preserve language-switcher visibility and layout if present.
* Preserve external social links.
* Preserve external shop links.
* Preserve PDF/scheda tecnica links.
* Preserve share buttons and visible sharing UI if present.
* Do not silently remove third-party behavior. If a third-party script is unavailable or obsolete, reproduce the visible behavior locally or document the limitation.

## Wine product page content rules

For each wine page, preserve every visible value exactly as it appears on the current Italian site.
Do not correct spelling, capitalization, punctuation, apostrophes, accent marks, measurements, or product naming.

## Optimization rules

Optimize only when the visible and interactive result remains effectively identical.

Allowed optimizations:

* Migrate away from obsolete technology.
* Remove unused code after verifying no scoped page depends on it.
* Replace duplicated markup with shared components.
* Split large bundles.
* Lazy-load non-critical images while preserving layout dimensions.
* Add explicit image dimensions to prevent layout shift.
* Use modern responsive image techniques.
* Minify, tree-shake, and defer non-critical JavaScript.
* Consolidate repeated CSS when computed visual styles remain equivalent.
* Improve semantic HTML where it does not alter layout or visible output.
* Improve accessibility invisibly, such as alt text and ARIA, when this does not change the design.

Disallowed optimizations:

* Changing design direction.
* Changing spacing, typography, colors, font weights, breakpoints, layout grids, image crops, button styles, animation timing, easing, hover behavior, or scroll effects.
* Replacing original images.
* Removing content or links because they seem obsolete.
* Removing shop links.
* Implementing News.
* Making contact forms functionally different unless already supported.
* Collapsing separate product pages into one URL.
* Creating visibly generic framework components that do not match the original.
