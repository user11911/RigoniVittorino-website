// Extracts the WordPress/block-editor generated <style> blocks from <head> that the
// self-hosted vendor CSS depends on (CSS custom properties like --link-color,
// --title-font-family, global block-library rules, etc). Verified byte-for-byte
// identical across every page type (main/category/product) except two which are
// genuinely page-specific (UAGB per-block generated CSS on home + contatti) — see
// scripts/.cache verification notes in IMPLEMENTATION_NOTES.md.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, ".cache/html");
const PUBLIC_STYLES_DIR = path.join(__dirname, "../public/styles");
const MAIN_CONTENT_DIR = path.join(__dirname, "../src/content/main");

const GLOBAL_STYLE_IDS = [
  "wp-img-auto-sizes-contain-inline-css",
  "wp-emoji-styles-inline-css",
  "wp-block-library-inline-css",
  "wp-block-heading-inline-css",
  "wp-block-image-inline-css",
  "wp-block-paragraph-inline-css",
  "classic-theme-styles-inline-css",
  "getwid-blocks-inline-css",
  "global-styles-inline-css",
  "style-custom-inline-css",
  "twentytwenty-style-inline-css",
  "custom-background-css",
  "uagb-style-conditional-extension",
  // Missed in the original Task 1 pass — this is the block that actually
  // reassigns the generic --_gs-d/--_gs-min-height/etc. custom properties from
  // their -tablet/-mobile values at the right breakpoints. Without it every
  // .grids-section permanently falls back to its -desktop values regardless of
  // viewport width (see IMPLEMENTATION_NOTES.md Task 3 for the visible symptoms
  // this caused). Confirmed byte-identical across every page type.
  "grids-frontend-inline-css",
];

const PAGE_SPECIFIC = [
  { page: "home", file: "_home.html", id: "uagb-style-frontend-2" },
  { page: "contatti", file: "contatti.html", id: "uagb-style-frontend-953" },
];

async function main() {
  await mkdir(PUBLIC_STYLES_DIR, { recursive: true });

  const homeHtml = await readFile(path.join(CACHE_DIR, "_home.html"), "utf8");
  const $ = cheerio.load(homeHtml);
  const parts = [];
  for (const id of GLOBAL_STYLE_IDS) {
    const content = $(`#${id}`).html();
    if (content == null) {
      console.warn(`WARNING: style block #${id} not found on homepage`);
      continue;
    }
    parts.push(`/* ${id} */\n${content.trim()}`);
  }
  await writeFile(path.join(PUBLIC_STYLES_DIR, "wp-global.css"), parts.join("\n\n") + "\n");
  console.log(`Wrote public/styles/wp-global.css (${GLOBAL_STYLE_IDS.length} blocks)`);

  for (const { page, file, id } of PAGE_SPECIFIC) {
    const html = await readFile(path.join(CACHE_DIR, file), "utf8");
    const $$ = cheerio.load(html);
    const content = $$(`#${id}`).html();
    if (content == null) {
      console.warn(`WARNING: ${id} not found on ${page}`);
      continue;
    }
    await writeFile(path.join(MAIN_CONTENT_DIR, `${page}-extra-style.css`), content.trim() + "\n");
    console.log(`Wrote src/content/main/${page}-extra-style.css`);
  }
}

main();
