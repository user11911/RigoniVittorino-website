// Task 66 (SEO): shared helper for building meta descriptions from real page
// data (wines.json/categories.json fields, never invented text) — used by the
// product and category page templates in all 3 languages so the truncation
// rule lives in exactly one place.

// ~155 chars is the commonly-cited safe length before Google starts
// truncating a meta description in search results (varies by pixel width in
// practice, but this is the standard rule-of-thumb ceiling).
const MAX_LENGTH = 155;

export function truncateDescription(text: string, maxLength = MAX_LENGTH): string {
  if (text.length <= maxLength) return text;
  // Cut at the last whole word before the limit, not mid-word.
  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1)}…`;
}

const SITE_ORIGIN = "https://rigonivittorino.com";

function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

// Product schema, built entirely from a wine's own real data (wines*.json —
// already shown on its own product page) — deliberately no `offers`/price:
// no price data exists anywhere in this project (the shop-online buttons were
// removed sitewide, Task 11), and schema.org's Product type doesn't require
// offers to be valid; inventing a price would be worse than omitting it.
export function buildProductJsonLd(wine: {
  title: string;
  productImage: string;
  tastingNoteParagraphs: string[];
  typologyLabel: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: wine.title,
    image: absoluteUrl(wine.productImage),
    description: wine.tastingNoteParagraphs[0],
    sku: wine.slug,
    category: wine.typologyLabel,
    brand: { "@type": "Brand", name: "Rigoni Vittorino" },
  };
}

// BreadcrumbList schema — `items` in top-to-bottom order (Home first), each
// `url` root-relative (converted to absolute here, same as everywhere else in
// this file) so callers can just pass the same paths they already use for
// real <a href> links.
export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
