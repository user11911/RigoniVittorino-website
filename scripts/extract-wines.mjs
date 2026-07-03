// Parses every cached product page (custom post type "wines", hand-authored geppa
// theme template, NOT the Grids/Getwid page builder) into a structured record.
// This is the single source of truth for src/data/wines.json — never hand-typed.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import { PRODUCT_SLUGS, CATEGORY_PAGES, CATEGORY_BY_PRODUCT_GROUP, cacheFileFor } from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, ".cache/html");
const OUT_FILE = path.join(__dirname, "../src/data/wines.json");

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
  for (const cat of CATEGORY_PAGES) {
    const html = await readFile(path.join(CACHE_DIR, cacheFileFor(cat)), "utf8");
    const $ = cheerio.load(html);
    $(".single-wine-container").each((i, el) => {
      const $el = $(el);
      const href = $el.find(".wine-image a").attr("href") ?? "";
      const slugMatch = href.match(/i-nostri-vini\/([a-z0-9-]+)\/?$/);
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
    const file = path.join(CACHE_DIR, cacheFileFor(`i-nostri-vini/${slug}/`));
    const html = await readFile(file, "utf8");
    const $ = cheerio.load(html);

    const title = $(".wine-container h1").first().text().trim();
    const productImage = rewriteUrl($(".wine-image img").first().attr("src"));
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

    const gradazione = fieldText($, "Gradazione:");
    const coltivazione = fieldText($, "Coltivazione:");
    const vinificazione = fieldText($, "Vinificazione:");
    const resaMedia = fieldText($, "Resa Media:");
    const abbinamenti = fieldText($, "Abbinamenti:");
    const servizio = fieldText($, "Servizio:");

    const card = cardImages.get(slug);
    if (!card) throw new Error(`No category-grid card image found for ${slug}`);

    const record = {
      slug,
      category: categoryForSlug(slug),
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
