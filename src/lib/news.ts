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

export function selectPublishedNews(entries: NewsEntry[]): NewsEntry[] {
  return entries
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
