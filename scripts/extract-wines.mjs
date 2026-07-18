// Parses every cached product page (custom post type "wines", hand-authored geppa
// theme template, NOT the Grids/Getwid page builder) into a structured record.
// This is the single source of truth for src/data/wines.json — never hand-typed.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import {
  PRODUCT_SLUGS,
  CATEGORY_PAGES,
  CATEGORY_BY_PRODUCT_GROUP,
  cacheFileFor,
  ROUTES_BY_LANG,
  CATEGORY_KEYS,
} from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --lang=en|de (default it, preserving the original file paths/behavior
// exactly for the zero-arg call — see routes.mjs's Task 9 notes).
const langArg = process.argv.find((a) => a.startsWith("--lang="));
const LANG = langArg ? langArg.slice("--lang=".length) : "it";
const CACHE_DIR = path.join(__dirname, LANG === "it" ? ".cache/html" : `.cache/html/${LANG}`);
const OUT_FILE = path.join(__dirname, LANG === "it" ? "../src/data/wines.json" : `../src/data/wines.${LANG}.json`);
const PRODUCT_BASE = LANG === "it" ? "i-nostri-vini" : ROUTES_BY_LANG[LANG].PRODUCT_BASE;
const categorySlugFor = (key) => (LANG === "it" ? key : ROUTES_BY_LANG[LANG].CATEGORY_SLUGS[key]);

// Field-label text is theme-template English/Italian/German copy, not CSS —
// confirmed via direct inspection of live EN/DE product pages that every CSS
// class used below (.wine-container, .wine-grado, .tipologia-row, etc.) is
// byte-identical across languages; only these <strong> label strings change.
const FIELD_LABELS = {
  it: { gradazione: "Gradazione:", coltivazione: "Coltivazione:", vinificazione: "Vinificazione:", resaMedia: "Resa Media:", abbinamenti: "Abbinamenti:", servizio: "Servizio:" },
  en: { gradazione: "Degree:", coltivazione: "Cultivation:", vinificazione: "Winemaking Process:", resaMedia: "Average Yield:", abbinamenti: "Pairings:", servizio: "Serving Temperature:" },
  de: { gradazione: "Alkoholgehalt:", coltivazione: "Weinbau:", vinificazione: "Weinherstellung:", resaMedia: "Ertrag:", abbinamenti: "Empfehlungen:", servizio: "Serviertemperatur:" },
};
const LABELS = FIELD_LABELS[LANG];

const DOMAIN = "https://rigonivittorino.com";
function rewriteUrl(u) {
  if (!u) return u;
  return u.startsWith(DOMAIN) ? u.slice(DOMAIN.length) : u;
}
function rewriteSrcset(srcset) {
  if (!srcset) return srcset;
  return srcset
    .split(",")
    .map((part) => {
      const [u, size] = part.trim().split(/\s+/);
      return [rewriteUrl(u), size].filter(Boolean).join(" ");
    })
    .join(", ");
}

function categoryForSlug(slug) {
  for (const [cat, slugs] of Object.entries(CATEGORY_BY_PRODUCT_GROUP)) {
    if (slugs.includes(slug)) return cat;
  }
  throw new Error(`No category found for slug ${slug}`);
}

function fieldText($, strongLabel) {
  const span = $(".tipologia-row .wine-specs").filter((i, el) => {
    return $(el).find("strong").text().trim() === strongLabel;
  });
  if (!span.length) return null;
  const clone = span.clone();
  clone.find("strong").remove();
  return clone.text().trim();
}

async function buildCardImageIndex() {
  // The category-grid thumbnail (a distinct WP-generated crop from the product's
  // own hero image) with its real srcset can only be read reliably off the
  // category pages themselves — reconstructing width descriptors by guesswork is
  // exactly the kind of thing that silently produces wrong srcset values.
  const index = new Map();
  const categoryPaths =
    LANG === "it" ? CATEGORY_PAGES : CATEGORY_KEYS.map((key) => `${categorySlugFor(key)}/`);
  const hrefRe = new RegExp(`${PRODUCT_BASE}/([a-z0-9-]+)/?$`);
  for (const cat of categoryPaths) {
    const html = await readFile(path.join(CACHE_DIR, cacheFileFor(cat)), "utf8");
    const $ = cheerio.load(html);
    $(".single-wine-container").each((i, el) => {
      const $el = $(el);
      const href = $el.find(".wine-image a").attr("href") ?? "";
      const slugMatch = href.match(hrefRe);
      if (!slugMatch) return;
      const img = $el.find(".wine-image img");
      index.set(slugMatch[1], {
        cardImageSrc: rewriteUrl(img.attr("src")),
        cardImageSrcset: rewriteSrcset(img.attr("srcset")),
        cardImageWidth: img.attr("width"),
        cardImageHeight: img.attr("height"),
      });
    });
  }
  return index;
}

async function main() {
  const cardImages = await buildCardImageIndex();
  const wines = [];
  for (const slug of PRODUCT_SLUGS) {
    const file = path.join(CACHE_DIR, cacheFileFor(`${PRODUCT_BASE}/${slug}/`));
    const html = await readFile(file, "utf8");
    const $ = cheerio.load(html);

    const title = $(".wine-container h1").first().text().trim();
    const productImage = rewriteUrl($(".wine-image img").first().attr("src"));
    // The live per-product CSS class driving .wine-cat-background/.wine-detail
    // color styling is the WP *taxonomy* slug, which for EN genuinely diverges
    // from the category *page*'s own route slug (e.g. page "sparkling" vs class
    // "prosecco-and-sparkling-wines", page "passiti" vs class "passiti-wines") —
    // confirmed by direct inspection, not assumed. Read straight off the live
    // page's own `.wine-glass.wine-detail` class list rather than hand-mapped,
    // so it's correct even if IT/EN/DE ever diverge further than already found.
    const detailClasses = ($(".wine-glass.wine-detail").first().attr("class") ?? "").split(/\s+/);
    const categoryClass = detailClasses.find((c) => c && c !== "wine-glass" && c !== "wine-detail");
    if (!categoryClass) throw new Error(`No category CSS class found for ${slug}`);
    const servingTempBadge = $(".wine-grado .contenuto-specs").first().text().trim();
    const glassIcon = $(".wine-glass img").first().attr("src");
    const foodIcon = $(".wine-food-ico img").first().attr("src");
    const categoryLogo = $(".wine-color-logo img").first().attr("src");
    const shopUrl = $(".buy-wine a.scheda-wine").first().attr("href");
    const pdfUrl = rewriteUrl($(".buttons-row .info-wine a.scheda-wine").first().attr("href"));
    const categoryLinkText = $(".tipologia-row a.category-link").first().text().trim();
    const categoryLinkHref = $(".tipologia-row a.category-link").first().attr("href");
    const tastingNoteParas = $(".wine-description-text p")
      .map((i, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    const gradazione = fieldText($, LABELS.gradazione);
    const coltivazione = fieldText($, LABELS.coltivazione);
    const vinificazione = fieldText($, LABELS.vinificazione);
    const resaMedia = fieldText($, LABELS.resaMedia);
    const abbinamenti = fieldText($, LABELS.abbinamenti);
    const servizio = fieldText($, LABELS.servizio);

    const card = cardImages.get(slug);
    if (!card) throw new Error(`No category-grid card image found for ${slug}`);

    const record = {
      slug,
      category: categoryForSlug(slug),
      // Only added for en/de — IT's existing template already uses `category`
      // directly as the CSS class (the two happen to always be identical for
      // IT), so its schema is left exactly as it was to avoid touching frozen
      // work for no functional reason.
      ...(LANG !== "it" ? { categoryClass } : {}),
      title,
      productImage,
      cardImageSrc: card.cardImageSrc,
      cardImageSrcset: card.cardImageSrcset,
      cardImageWidth: card.cardImageWidth,
      cardImageHeight: card.cardImageHeight,
      servingTempBadge,
      glassIcon,
      foodIcon,
      categoryLogo,
      shopUrl,
      pdfUrl,
      typologyLabel: categoryLinkText,
      typologyHref: categoryLinkHref,
      gradazione,
      coltivazione,
      vinificazione,
      resaMedia,
      abbinamenti,
      servizio,
      tastingNoteParagraphs: tastingNoteParas,
    };

    // Sanity check: every field must be present, nothing silently missing/null.
    const missing = Object.entries(record).filter(([k, v]) => v == null || v === "");
    if (missing.length) {
      console.warn(`WARNING: ${slug} missing fields:`, missing.map(([k]) => k));
    }

    wines.push(record);
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(wines, null, 2));
  console.log(`Wrote ${wines.length} wine records to ${path.relative(process.cwd(), OUT_FILE)}`);
}

main();
