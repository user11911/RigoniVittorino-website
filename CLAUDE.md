## Current correction priority

The previous implementation is not satisfactory. The next task is to bring the website closer to the original company website.

Main problems to fix:

- Images are incorrectly formatted or displayed.
- The visual design does not sufficiently follow the original website.
- Some text was invented and may be false.
- The site does not preserve the original content structure.
- Pictures and other assets are missing or not exploited adequately.
- The language switcher / multilingual functionality is missing.

## Source-of-truth rules

The existing company website is the source of truth for:

- Brand identity
- Layout direction
- Navigation structure
- Product names
- Product descriptions
- Company text
- Available languages
- Images and visual hierarchy

Do not invent factual text.

Do not invent product details, wine descriptions, awards, company history, certifications, shipping claims, prices, or legal claims.

If information is not available from the original website or from files provided in this repository, mark it as `TODO: verify` or omit it.

## Image rules

Images must be consistently formatted.

Requirements:

- Use correct aspect ratios.
- Avoid stretching or distortion.
- Use responsive image sizing.
- Use object-fit/object-position where appropriate.
- Product images should have a consistent presentation.
- Landing-page images should match the original website’s visual hierarchy.
- All meaningful images need alt text.

## Multilingual rules

The website must support the same languages as the original website.

Implement language switching in a simple maintainable way.

Do not translate freely unless explicitly asked. Prefer using original website text in each language where available.

If a translation is missing, mark it clearly as `TODO: verify translation`.

## Other missing features

Check for all the missing features of the current implementation that are present in the actual website and include them in the latest issue.

## Finish rules

Claude must not claim the task is finished until all relevant checks have been completed.

Before finishing, Claude must:

1. Run the appropriate local verification commands.
2. Confirm that the site builds successfully.
3. Check that the main pages render correctly.
4. Check that images are not distorted, stretched, or broken.
5. Check that the layout works on desktop and mobile sizes.
6. Check that navigation links work.
7. Check that the language switcher works for all supported languages.
8. Check that no invented or unverifiable factual text remains, on any language supported.
9. Check that all visible product/company text comes from the original website or is clearly marked as `TODO: verify`.
10. Check that no secrets, API keys, private tokens, or local machine paths were added.

If using Astro, run at minimum:

- `npm run build`
- `npm run preview` if manual preview is needed

If using another stack, identify and run the equivalent build command.

## Completion report

At the end of every task, Claude must provide a concise completion report with:

1. Summary of what changed
2. Files added or modified
3. Design issues fixed
4. Image/layout issues fixed
5. Content removed or corrected
6. Language support changes
7. Commands run and their results
8. Remaining issues, missing assets, or content requiring human verification

Claude must clearly distinguish between:

- Completed work
- Work that could not be verified
- Assumptions made
- TODOs requiring human input

Claude must not say the website is complete if:

- The build fails
- Images are broken or badly formatted
- The language switcher is missing or non-functional
- Text has been invented
- The design still clearly diverges from the original website without explanation
- Important pages are placeholders
- Required verification commands were not run

If a verification step cannot be completed, Claude must explain exactly why and what the user should check manually.