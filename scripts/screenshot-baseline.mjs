// Captures baseline screenshots of the LIVE site for representative pages at the 4
// required breakpoints (per .claude/rules/testing.md), for later before/after parity
// comparison against the rebuilt site (see screenshot-compare.mjs).
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BASE_URL } from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../docs/parity/baseline");

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
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  for (const bp of BREAKPOINTS) {
    const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
    for (const p of PAGES) {
      const url = `${BASE_URL}${p.path}`;
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      // dismiss cookie banner if present so it doesn't obscure every shot
      try {
        await page.getByRole("button", { name: /accetta/i }).click({ timeout: 3000 });
        await page.waitForTimeout(500);
      } catch {
        // no banner, fine
      }
      await page.waitForTimeout(500);
      // force lazy-loaded images to load before capturing full-page screenshots
      await page.evaluate(async () => {
        const step = 600;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1500); // let hero/animations settle
      const file = path.join(OUT_DIR, `${p.name}__${bp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`Saved ${path.relative(process.cwd(), file)}`);
    }
    await page.close();
  }

  await browser.close();
}

main();
