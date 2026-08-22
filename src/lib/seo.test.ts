import { describe, expect, it } from "vitest";
import { buildBreadcrumbJsonLd, buildProductJsonLd, truncateDescription } from "./seo";

describe("truncateDescription", () => {
  it("returns short text unchanged", () => {
    expect(truncateDescription("A short description.")).toBe("A short description.");
  });

  it("truncates long text at a whole word, under the max length", () => {
    const long =
      "Colore giallo paglierino luminoso, perlage fine e persistente, profumi di fiori e frutta a polpa bianca. Alla degustazione si mostra secco, fresco, fine ed equilibrato.";
    const result = truncateDescription(long);
    expect(result.length).toBeLessThanOrEqual(155);
    expect(result.endsWith("…")).toBe(true);
    expect(result.endsWith(" …")).toBe(false);
  });

  it("respects a custom max length", () => {
    const result = truncateDescription("one two three four five", 10);
    expect(result).toBe("one two…");
  });
});

describe("buildProductJsonLd", () => {
  it("builds valid Product schema with no offers/price, absolute image URL", () => {
    const result = buildProductJsonLd({
      title: "Pinot Grigio",
      productImage: "/wp-content/uploads/2021/01/pinot-grigio.jpg",
      tastingNoteParagraphs: ["Fresh and dry."],
      typologyLabel: "Bianchi",
      slug: "pinot-grigio-igt-veneto",
    });
    expect(result["@type"]).toBe("Product");
    expect(result.name).toBe("Pinot Grigio");
    expect(result.image).toBe("https://rigonivittorino.com/wp-content/uploads/2021/01/pinot-grigio.jpg");
    expect(result.description).toBe("Fresh and dry.");
    expect(result).not.toHaveProperty("offers");
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("builds a BreadcrumbList with 1-indexed positions and absolute URLs", () => {
    const result = buildBreadcrumbJsonLd([
      { name: "Home", url: "/it/" },
      { name: "Bianchi", url: "/it/bianchi/" },
    ]);
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(result.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rigonivittorino.com/it/" },
      { "@type": "ListItem", position: 2, name: "Bianchi", item: "https://rigonivittorino.com/it/bianchi/" },
    ]);
  });
});
