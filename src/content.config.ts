import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Content model for /it/news/ (Task 4). A future editor adds a real post by
// creating a new Markdown file in src/content/news/ with this frontmatter shape —
// no layout code needs to change. See src/content/news/_esempio-bozza.md for a
// worked (draft-only, never production-visible) example.
const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
