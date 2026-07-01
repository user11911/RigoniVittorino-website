# CLAUDE.md

## Project purpose

This repository is for rebuilding and improving the public website of `Rigoni Vittorino`, a wine company.

The website should include:

- A presentation / landing page for the company
- Product presentation pages for wines
- A polished, professional visual design inspired by the existing company website
- A simple, maintainable codebase suitable for future public deployment

The existing website is here:

`https://rigonivittorino.com`

Use the existing website as the primary visual and content reference. The goal is to preserve the company’s visual identity while improving structure, performance, responsiveness, accessibility, and maintainability.

## Important legal and ethical constraints

Do not copy proprietary source code from the existing website.

Do not bypass authentication, paywalls, bot protection, or access controls.

Only use content, images, logos, product descriptions, and brand assets if they are publicly available on the current company website or explicitly provided in this repository.

Do not invent legal, shipping, tax, alcohol-sale, or compliance claims.

Because the site concerns wine, build it as if it will eventually be public. Include sensible placeholders where needed for:

- Age confirmation / responsible drinking notice
- Privacy policy
- Terms and conditions
- Shipping and returns information
- Legal alcohol-sale disclaimers

Do not implement real payment processing, checkout, shipping logic, or customer data collection unless specifically instructed later.

## Preferred technical direction

If the repository already contains a framework or application structure, inspect it first and continue using the existing stack unless there is a strong reason not to.

If the repository is empty or does not have a clear stack, choose a simple, modern, maintainable static-site setup.

Preferred default:

- Astro
- TypeScript
- Plain CSS or a minimal CSS approach
- Static content/data files for products
- No unnecessary backend
- No unnecessary database
- No unnecessary authentication system
- No unnecessary complex state management

The website should be easy to edit later by a non-specialist developer.

Avoid overengineering.

## Workflow rules

Before writing code, inspect the repository and the existing website.

First produce a short implementation plan that includes:

1. The proposed stack
2. The site structure
3. Key pages/components
4. How the existing website will be visually analyzed
5. What assets/content are available and what is missing
6. The implementation sequence
7. The verification plan

After planning, proceed independently unless there is a blocking uncertainty.

Prefer completing the website in coherent stages rather than making scattered changes.

Avoid wasting context and tokens. Do not repeatedly restate the same plan. Do not create unnecessary files. Do not add generic boilerplate that is not used.

## Existing website analysis

When analyzing the existing website, identify:

- Visual style
- Typography
- Color palette
- Layout patterns
- Navigation structure
- Homepage sections
- Product presentation structure
- Imagery style
- Calls to action
- Footer content
- Mobile behavior
- Performance or accessibility weaknesses

Use this analysis to create an improved version, not a careless clone.

The rebuilt site should feel recognizably related to the original brand, but the code and implementation should be original and cleaner.

## Design requirements

The site should feel premium, elegant, and appropriate for a wine company.

Prioritize:

- Strong landing-page presentation
- Clear product hierarchy
- High-quality spacing and typography
- Responsive mobile layout
- Fast loading
- SEO-friendly structure
- Accessible navigation and content
- Simple future editing

Avoid:

- Generic startup-style design
- Overly flashy animations
- Heavy JavaScript where static HTML/CSS is enough
- Complicated component abstractions too early
- Unused dependencies
- Placeholder clutter

## Product structure

Represent wine products in a simple maintainable format.

If there is no existing structure, use a data-driven approach such as:

- `src/data/products.ts`
- `src/content/products/`
- JSON or Markdown content files

Each wine product should support fields such as:

- Name
- Category / type
- Vintage, if available
- Grape variety, if available
- Region / appellation, if available
- Description
- Tasting notes
- Pairing suggestions
- Bottle size
- Image
- Availability or call-to-action text

Do not invent factual product details. If details are missing, use clear placeholders or omit the field.

## Code quality rules

Keep the codebase small, clear, and consistent.

Use existing project conventions where they exist.

Use semantic HTML.

Keep components focused and readable.

Do not add dependencies unless they clearly reduce complexity or improve the final result.

Do not introduce a CMS, database, authentication system, shopping cart, payment provider, or server-side backend unless explicitly requested.

Do not store secrets, API keys, credentials, private tokens, or sensitive information in the repository.

Do not hardcode private local paths.

Do not use generated code that is difficult to maintain.

## Performance and SEO

Build the site with public launch in mind.

Include:

- Proper page titles
- Meta descriptions
- Semantic headings
- Open Graph metadata where appropriate
- Optimized image usage
- Responsive images if the chosen framework supports them cleanly
- Clean URLs
- Sitemap support if simple to add
- Robots.txt if appropriate

Keep JavaScript minimal.

The site should work well on mobile, tablet, and desktop.

## Accessibility

Use accessible HTML by default.

Requirements:

- Meaningful heading hierarchy
- Alt text for meaningful images
- Keyboard-accessible navigation
- Sufficient color contrast
- Clear focus states
- Avoid text embedded in images where possible
- Do not rely on color alone to communicate meaning

## Git and repository behavior

This repository is currently private and not shared with a team, but treat the work as if it will eventually be.

Before major changes, check the current git status.

Keep changes focused.

Do not delete existing files unless they are clearly obsolete or the reason is explained.

Do not rewrite git history.

Do not commit or push unless explicitly asked.

At the end of each task, summarize:

1. What was changed
2. Which files were added or modified
3. Which commands were run
4. Whether tests/build/lint passed
5. Any remaining issues or missing inputs

## Verification

Before claiming completion, run the relevant available commands.

If using Astro, expected commands are likely:

- `npm install` or the selected package manager equivalent
- `npm run dev`
- `npm run build`
- `npm run preview`

If a different stack is chosen, identify the correct commands and document them.

If no automated tests exist, at minimum verify:

- The site builds successfully
- Key pages render
- Product pages or product sections work
- Navigation works
- Mobile layout is reasonable
- No obvious console errors
- No broken internal links

## Definition of done

The project is done when:

- The website can be run locally from the repository
- The landing page is complete
- Product presentation is complete enough to demonstrate the intended structure
- The visual style is clearly inspired by the current company website
- The implementation is original, maintainable, and not overcomplicated
- The site is responsive
- The site builds successfully
- Future product/content updates are straightforward
- Missing content or legal/commercial details are clearly documented