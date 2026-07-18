// Task 9: generates src/data/categories.<lang>.json for en/de from each cached
// category page's own <h1 class="category-title"> (confirmed identical markup
// pattern across it/en/de). IT's src/data/categories.json was hand-authored
// (only 6 entries) before this script existed and is intentionally left alone
// — this script only ever writes categories.en.json / categories.de.json.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import { CATEGORY_KEYS, ROUTES_BY_LANG, cacheFileFor } from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const langArg = process.argv.find((a) => a.startsWith("--lang="));
const LANG = langArg ? langArg.slice("--lang=".length) : null;
if (LANG !== "en" && LANG !== "de") {
  console.error("Usage: node extract-categories.mjs --lang=en|de");
  process.exit(1);
}

const CACHE_DIR = path.join(__dirname, `.cache/html/${LANG}`);
const OUT_FILE = path.join(__dirname, `../src/data/categories.${LANG}.json`);
// Reused as-is across languages — a generic decorative icon, not language content.
const SHARED_CATEGORY_LOGO = "/wp-content/uploads/2020/12/V-rigoni-bianco.png";

async function main() {
  const cfg = ROUTES_BY_LANG[LANG];
  const categories = [];
  for (const key of CATEGORY_KEYS) {
    const slug = cfg.CATEGORY_SLUGS[key];
    const html = await readFile(path.join(CACHE_DIR, cacheFileFor(`${slug}/`)), "utf8");
    const $ = cheerio.load(html);
    const title = $("h1.category-title").first().text().trim();
    if (!title) throw new Error(`No category-title found for ${LANG}/${slug}`);
    // The live .wine-cat-background CSS color class is the WP taxonomy slug,
    // which for EN genuinely diverges from this page's own route slug (e.g.
    // route "sparkling" vs class "prosecco-and-sparkling-wines") — confirmed by
    // direct inspection. Read straight off the page rather than hand-mapped.
    const bgClasses = ($(".wine-cat-background").first().attr("class") ?? "").split(/\s+/);
    const cssClass = bgClasses.find((c) => c && c !== "wine-cat-background");
    if (!cssClass) throw new Error(`No category CSS class found for ${LANG}/${slug}`);
    // `key` is the neutral, language-independent category key (matches IT's own
    // slug, and `wines.<lang>.json`'s `category` field) — needed because `slug`
    // itself is genuinely translated per language and can't be used to filter
    // wines by category the way IT's identical slug/key happens to allow.
    categories.push({ slug, key, cssClass, title, navLabel: title, categoryLogo: SHARED_CATEGORY_LOGO });
  }
  await writeFile(OUT_FILE, JSON.stringify(categories, null, 2));
  console.log(`Wrote ${categories.length} categories to ${path.relative(process.cwd(), OUT_FILE)}`);
}

main();
