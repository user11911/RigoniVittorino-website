// Extracts the site header/footer chrome verbatim from the homepage (verified
// identical across templates except per-page active-nav-state and per-page WPML
// language-switcher URLs — see plan notes). Active-state is re-applied client side
// per page (see Header.astro's inline script) so one canonical partial can serve
// every page. WPML EN/DE links are pointed at the live site's language homepages
// since English/German pages are out of scope for this rebuild.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, ".cache/html");
const OUT_DIR = path.join(__dirname, "../src/content/chrome");

const DOMAIN = "https://rigonivittorino.com";

// Every route this rebuild actually implements. Any other rigonivittorino.com link
// (News, the EU rural-development funding disclosure page, etc.) is explicitly out
// of scope and MUST stay an absolute link to the live site — rewriting it to a local
// path would 404 since no such local route exists.
const IMPLEMENTED_PAGE_PREFIXES = [
  "/it/chi-siamo",
  "/it/cantina",
  "/it/contatti",
  "/it/privacy-policy",
  "/it/dati-societari",
  "/it/i-nostri-vini",
  "/it/spumanti",
  "/it/bianchi",
  "/it/rossi",
  "/it/affinati",
  "/it/frizzanti-e-rosati",
  "/it/passiti",
];

function rewriteUrl(u) {
  if (!u) return u;
  if (u.startsWith("//rigonivittorino.com")) return u.slice("//rigonivittorino.com".length);
  if (u.startsWith(DOMAIN)) {
    const rel = u.slice(DOMAIN.length);
    return rel === "" ? "/" : rel;
  }
  return u;
}

function rewriteLinks($, root) {
  root.find("a").each((i, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    if (!href) return;
    if (href === `${DOMAIN}/it/` || href === `${DOMAIN}/it` || href === "/it/" || href === "/it") {
      $el.attr("href", "/it/");
      return;
    }
    // Some of the live site's own links are already root-relative (e.g. the footer's
    // "/it/privacy-policy", no domain prefix, no trailing slash) rather than absolute.
    let rel;
    if (href.startsWith(DOMAIN)) rel = href.slice(DOMAIN.length);
    else if (href.startsWith("/it/")) rel = href;
    else return; // external (shop, social, geppa.it...) untouched
    const isImplemented = IMPLEMENTED_PAGE_PREFIXES.some((p) => rel === p || rel.startsWith(`${p}/`));
    if (!isImplemented) return; // News, funding page, etc. — leave as absolute external link
    const withSlash = rel.endsWith("/") ? rel : `${rel}/`;
    $el.attr("href", withSlash);
  });
  root.find("img").each((i, el) => {
    const $el = $(el);
    const src = $el.attr("src");
    if (src) $el.attr("src", rewriteUrl(src));
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
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const html = await readFile(path.join(CACHE_DIR, "_home.html"), "utf8");
  const $ = cheerio.load(html);

  const header = $("#site-header").first();
  // The mobile-menu modal (".menu-modal") is a SIBLING of #site-header in the
  // original DOM, not nested inside it — easy to miss since visually it reads as
  // "part of the header". twentytwenty.min.js's toggle code looks it up via
  // document.querySelector('.menu-modal') at click time, so omitting it doesn't
  // error at load, it throws (and silently no-ops the toggle) only once a visitor
  // actually opens the mobile menu — caught via an interactive Playwright check,
  // not just a static HTML/console-error smoke test.
  const menuModal = header.next(".menu-modal");

  // Neutralize active-state markers baked into the homepage's own nav (home is
  // "current" there) so the partial is a true generic template; Header.astro's
  // client script re-applies the correct one per page.
  header.find(".current-menu-item").removeClass("current-menu-item");
  header.find("[aria-current='page']").removeAttr("aria-current");
  header.find(".wpml-ls-item-en a").attr("href", "https://rigonivittorino.com/en/");
  header.find(".wpml-ls-item-de a").attr("href", "https://rigonivittorino.com/de/");
  menuModal.find(".current-menu-item").removeClass("current-menu-item");
  menuModal.find("[aria-current='page']").removeAttr("aria-current");
  rewriteLinks($, header);
  rewriteLinks($, menuModal);
  const combined = header.prop("outerHTML") + "\n" + menuModal.prop("outerHTML");
  await writeFile(path.join(OUT_DIR, "header.html"), combined, "utf8");

  const footer = $("#site-footer").first();
  rewriteLinks($, footer);
  await writeFile(path.join(OUT_DIR, "footer.html"), footer.prop("outerHTML"), "utf8");

  console.log("Wrote src/content/chrome/header.html and footer.html");
}

main();
