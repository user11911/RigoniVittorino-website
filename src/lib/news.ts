// Minimal local shape (mirrors astro:content's CollectionEntry<"news">) so this
// filter/sort logic is testable with plain mock data — vitest's config doesn't wire
// up the astro:content virtual module, so importing its real type isn't resolvable
// outside an Astro build.
export interface NewsEntry {
  id: string;
  data: {
    title: string;
    date: Date;
    excerpt?: string;
    image?: string;
    draft: boolean;
  };
}

// Generic over T (constrained to the NewsEntry shape) rather than fixed to
// NewsEntry itself, so callers that pass real astro:content CollectionEntry<"news">
// values (which have extra fields like `collection`/`rendered` that `render()`
// needs) get those same richer types back out — not narrowed down to the plain
// NewsEntry shape, which would make `render(post)` fail to typecheck in
// src/pages/news/[slug]/index.astro. Pure filter+sort; no behavior change.
export function selectPublishedNews<T extends NewsEntry>(entries: T[]): T[] {
  return entries
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
