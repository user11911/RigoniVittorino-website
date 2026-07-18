// Fetches rendered HTML for every in-scope route from the live site and caches it
// under scripts/.cache/html/. Every later extraction script reads from this cache
// so we only hit the live site once per page.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allRoutes, cacheFileFor, BASE_URL, allRoutesForLang, ROUTES_BY_LANG } from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --lang=en|de (default it, preserving the original unprefixed cache path
// exactly — see scripts/routes.mjs's Task 9 notes on why IT stays untouched).
const langArg = process.argv.find((a) => a.startsWith("--lang="));
const LANG = langArg ? langArg.slice("--lang=".length) : "it";
const CACHE_DIR = path.join(__dirname, LANG === "it" ? ".cache/html" : `.cache/html/${LANG}`);
const routes = LANG === "it" ? allRoutes() : allRoutesForLang(LANG);
const base = LANG === "it" ? BASE_URL : ROUTES_BY_LANG[LANG].BASE_URL;

async function fetchWithRetry(url, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (parity-scrape-bot)" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });
  const results = [];
  for (const route of routes) {
    const url = `${base}${route.path}`;
    process.stdout.write(`Fetching ${url} ... `);
    try {
      const html = await fetchWithRetry(url);
      const file = cacheFileFor(route.path);
      await writeFile(path.join(CACHE_DIR, file), html, "utf8");
      console.log(`OK (${html.length} bytes) -> ${file}`);
      results.push({ ...route, url, status: "ok", bytes: html.length, file });
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      results.push({ ...route, url, status: "error", error: err.message });
    }
  }
  await writeFile(
    path.join(CACHE_DIR, "_manifest.json"),
    JSON.stringify(results, null, 2),
  );
  const failed = results.filter((r) => r.status !== "ok");
  console.log(`\nDone. ${results.length - failed.length}/${results.length} fetched.`);
  if (failed.length) {
    console.log("FAILED routes:", failed.map((f) => f.path));
    process.exitCode = 1;
  }
}

main();
