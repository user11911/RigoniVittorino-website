// Screenshots the local build (must be served, e.g. `astro preview`) at the same
// breakpoints/pages as screenshot-baseline.mjs, for a visual before/after parity pass.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../docs/parity/rebuilt");
const LOCAL_BASE = process.env.LOCAL_BASE_URL || "http://localhost:4321/it/";

const BREAKPOINTS = [
  { name: "375w", width: 375, height: 900 },
  { name: "768w", width: 768, height: 1000 },
  { name: "1024w", width: 1024, height: 1000 },
  { name: "1440w", width: 1440, height: 1000 },
];

const PAGES = [
  { name: "home", path: "" },
  { name: "chi-siamo", path: "chi-siamo/" },
  { name: "cantina", path: "cantina/" },
  { name: "contatti", path: "contatti/" },
  { name: "spumanti-category", path: "spumanti/" },
  { name: "creativo-product", path: "i-nostri-vini/creativo-prosecco-millesimato-brut-doc-treviso/" },
  { name: "news", path: "news/" },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const consoleErrors = [];

  for (const bp of BREAKPOINTS) {
    const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(`${page.url()}: ${msg.text()}`);
    });
    for (const p of PAGES) {
      const url = `${LOCAL_BASE}${p.path}`;
      // domcontentloaded, not networkidle: /it/contatti/ embeds the Cloudflare
      // Turnstile widget, whose background network activity can keep the
      // connection "busy" indefinitely and make networkidle never resolve.
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1000);
      // force lazy-loaded images to load before capturing full-page screenshots
      await page.evaluate(async () => {
        const step = 600;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      const file = path.join(OUT_DIR, `${p.name}__${bp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`Saved ${path.relative(process.cwd(), file)}`);
    }
    await page.close();
  }

  await browser.close();

  if (consoleErrors.length) {
    console.log("\nConsole errors detected:");
    consoleErrors.forEach((e) => console.log(" -", e));
  } else {
    console.log("\nNo console errors detected.");
  }
}

main();
