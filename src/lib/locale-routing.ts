// Pure decision logic for root "/" country-based routing (Task 9), kept
// separate from the page frontmatter so it's directly unit-testable — mirrors
// this codebase's existing convention (contact-validation.ts, news.ts).
export function resolveLocaleFromCountry(country: string | null | undefined): "it" | "de" | "en" {
  const normalized = (country ?? "").trim().toUpperCase();
  if (normalized === "IT") return "it";
  if (normalized === "DE") return "de";
  return "en";
}
