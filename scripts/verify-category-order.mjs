// Verifies that the product order encoded in routes.mjs (taken from CLAUDE.md) matches
// the actual order products appear in on each live category page.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORY_PAGES, CATEGORY_BY_PRODUCT_GROUP, cacheFileFor } from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, ".cache/html");

async function main() {
  let allMatch = true;
  for (const cat of CATEGORY_PAGES) {
    const slug = cat.replace(/\/$/, "");
    const file = path.join(CACHE_DIR, cacheFileFor(cat));
    const html = await readFile(file, "utf8");
    const matches = [...html.matchAll(/i-nostri-vini\/([a-z0-9-]+)\//g)].map((m) => m[1]);
    const seen = [...new Set(matches)];
    const expected = CATEGORY_BY_PRODUCT_GROUP[slug];
    const match = JSON.stringify(seen) === JSON.stringify(expected);
    console.log(`\n=== ${slug} === match=${match}`);
    console.log("live order:    ", seen);
    console.log("expected order:", expected);
    if (!match) allMatch = false;
  }
  console.log(allMatch ? "\nAll categories match." : "\nMISMATCH FOUND.");
  process.exitCode = allMatch ? 0 : 1;
}

main();
