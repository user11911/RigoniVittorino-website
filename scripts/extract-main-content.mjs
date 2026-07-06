// Extracts the <main> content of the 4 grids-builder-driven main pages verbatim
// (this is the highest-fidelity way to reproduce their page-builder markup — see
// the "Visual fidelity strategy" in the plan) and rewrites in-scope asset URLs to
// the local paths produced by extract-assets.mjs. The homepage's RevSlider block is
// stripped out here because it's replaced by a custom Hero.astro component (the
// original RevSlider markup also contains a dead, permanently-clipped slide layer
// referencing a different winery — see IMPLEMENTATION_NOTES.md — which must not be
// reproduced regardless).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, ".cache/html");
const OUT_DIR = path.join(__dirname, "../src/content/main");

const DOMAIN = "https://rigonivittorino.com";

const PAGES = [
  { name: "home", file: "_home.html", stripRevslider: true },
  { name: "chi-siamo", file: "chi-siamo.html" },
  { name: "cantina", file: "cantina.html" },
  { name: "contatti", file: "contatti.html" },
  // Task 5: was blank in earlier completed work, now authorized to match the live
  // page. Unlike the other 4 pages, its grids-section/grids-area inline styles are
  // identical across desktop/tablet/mobile (no responsive variation), and its
  // entry-header (auto-generated "Dati societari" H1) is already hidden by an
  // existing self-hosted CSS rule (header.entry-header.has-text-align-center
  // .header-footer-group{display:none}) — confirmed against the live site's own
  // rendered output, so no extra markup changes are needed to match it.
  { name: "dati-societari", file: "dati-societari.html", fixTypo: true },
];

// The one text correction TODO.md's Task 5 explicitly authorizes — the live page
// itself has this typo (double period). Kept as an explicit, documented replace
// here (rather than hand-edited into generated output) so it survives re-running
// this script against a fresh scrape.
const TYPO_FIX = {
  from: "Az. Agr.. Rigoni Vittorino Società Agricola SNC",
  to: "Az. Agr. Rigoni Vittorino Società Agricola SNC",
};

function rewriteUrl(u) {
  if (!u) return u;
  if (u.startsWith("//rigonivittorino.com")) return u.slice("//rigonivittorino.com".length);
  if (u.startsWith(DOMAIN)) return u.slice(DOMAIN.length);
  return u;
}

function rewriteAssetsIn($, root) {
  root.find("img, source").each((i, el) => {
    const $el = $(el);
    for (const attr of ["src", "data-src"]) {
      const v = $el.attr(attr);
      if (v) $el.attr(attr, rewriteUrl(v));
    }
    const srcset = $el.attr("srcset");
    if (srcset) {
      const rewritten = srcset
        .split(",")
        .map((part) => {
          const [u, size] = part.trim().split(/\s+/);
          return [rewriteUrl(u), size].filter(Boolean).join(" ");
        })
        .join(", ");
      $el.attr("srcset", rewritten);
    }
  });
  root.find("a").each((i, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    // Only rewrite links into our own uploads/theme assets (e.g. PDF/image links).
    // Real page links (chi-siamo, cantina, contatti, i-nostri-vini/...) are left
    // as absolute rigonivittorino.com URLs on purpose EXCEPT for in-scope internal
    // pages, which should be root-relative so they resolve to the local build.
    if (href && href.startsWith(DOMAIN)) {
      const rel = href.slice(DOMAIN.length);
      if (rel.startsWith("/wp-content/")) {
        $el.attr("href", rel);
      } else if (
        rel === "/it/" ||
        rel.startsWith("/it/chi-siamo") ||
        rel.startsWith("/it/cantina") ||
        rel.startsWith("/it/contatti") ||
        rel.startsWith("/it/i-nostri-vini") ||
        rel.startsWith("/it/spumanti") ||
        rel.startsWith("/it/bianchi") ||
        rel.startsWith("/it/rossi") ||
        rel.startsWith("/it/affinati") ||
        rel.startsWith("/it/frizzanti-e-rosati") ||
        rel.startsWith("/it/passiti") ||
        rel.startsWith("/it/dati-societari")
      ) {
        $el.attr("href", rel);
      }
      // everything else (news, shop, external) is left as the original absolute URL
    }
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const p of PAGES) {
    const html = await readFile(path.join(CACHE_DIR, p.file), "utf8");
    const $ = cheerio.load(html);
    const article = $("main article").first();

    if (p.stripRevslider) {
      article.find(".wp-block-themepunch-revslider").remove();
    }

    rewriteAssetsIn($, article);

    let out = article.prop("outerHTML");
    if (p.fixTypo) out = out.replaceAll(TYPO_FIX.from, TYPO_FIX.to);
    await writeFile(path.join(OUT_DIR, `${p.name}.html`), out, "utf8");
    console.log(`Wrote ${p.name}.html (${out.length} bytes)`);
  }
}

main();
