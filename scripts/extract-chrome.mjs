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
import { ROUTES_BY_LANG, CATEGORY_KEYS } from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --lang=en|de (default it — original flat CACHE_DIR/OUT_DIR/rewrite rules
// untouched; IT's WPML switcher hrefs now become tokens too, see Task 9 notes
// below, since all 3 languages are locally implemented as of this task).
const langArg = process.argv.find((a) => a.startsWith("--lang="));
const LANG = langArg ? langArg.slice("--lang=".length) : "it";
const CACHE_DIR = path.join(__dirname, LANG === "it" ? ".cache/html" : `.cache/html/${LANG}`);
const OUT_DIR = path.join(__dirname, LANG === "it" ? "../src/content/chrome" : `../src/content/chrome/${LANG}`);

const DOMAIN = "https://rigonivittorino.com";
const OTHER_LANGS = { it: ["en", "de"], en: ["it", "de"], de: ["it", "en"] }[LANG];

function inScopePrefixesFor(lang) {
  // No trailing slashes on any entry — matches the isImplemented check below
  // (`rel === p || rel.startsWith(`${p}/`)`), which needs the bare prefix to
  // correctly match both exact top-level hrefs and any subpath.
  const cfg = ROUTES_BY_LANG[lang];
  const strip = (s) => `/${lang}/${s}`.replace(/\/$/, "");
  const prefixes = [`/${lang}/`];
  for (const p of cfg.MAIN_PAGES) if (p) prefixes.push(strip(p));
  for (const p of cfg.BLANK_PAGES) prefixes.push(strip(p));
  for (const key of CATEGORY_KEYS) prefixes.push(strip(cfg.CATEGORY_SLUGS[key]));
  prefixes.push(strip(cfg.PRODUCT_BASE));
  return prefixes;
}

// Every route this rebuild actually implements for LANG. Any other
// rigonivittorino.com link (the EU rural-development funding disclosure page,
// legacy WP News post/category/tag pages excluded from this rebuild, etc.) is
// explicitly out of scope and MUST stay an absolute link to the live site —
// rewriting it to a local path would 404 since no such local route exists.
// The shared News link is handled separately below, not via this list, since
// it now points at the language-neutral /news/ route for every language.
const IMPLEMENTED_PAGE_PREFIXES = inScopePrefixesFor(LANG);

function rewriteUrl(u) {
  if (!u) return u;
  if (u.startsWith("//rigonivittorino.com")) return u.slice("//rigonivittorino.com".length);
  if (u.startsWith(DOMAIN)) {
    const rel = u.slice(DOMAIN.length);
    return rel === "" ? "/" : rel;
  }
  return u;
}

// Task 11: remove any link/button pointing at the external shop
// (rigonivittorinoshop.it) — user-requested removal, not a scrape-fidelity
// concern. Removes the whole `<li class="menu-item">` for nav items (desktop
// and mobile), or just the bare `<a>` for the footer's shopping-cart icon
// (which isn't wrapped in an `<li>`) — whichever applies. Both the desktop nav
// and the footer icon row are flex/inline-flowing (confirmed in
// public/wp-content/themes/geppa/style-custom.min.css: `ul.primary-menu` is a
// centered flexbox, `.footer-social-icons` is plain inline-flowing centered
// text), so removing an item needs no further layout fix — the rest
// re-center/re-flow on their own.
function removeShopLinks($, root) {
  root.find('a[href*="rigonivittorinoshop"]').each((i, el) => {
    const $el = $(el);
    const menuItem = $el.closest("li.menu-item");
    if (menuItem.length) {
      menuItem.remove();
    } else {
      $el.remove();
    }
  });
}

function rewriteLinks($, root) {
  root.find("a").each((i, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    if (!href) return;
    if (href === `${DOMAIN}/${LANG}/` || href === `${DOMAIN}/${LANG}` || href === `/${LANG}/` || href === `/${LANG}`) {
      $el.attr("href", `/${LANG}/`);
      return;
    }
    // Some of the live site's own links are already root-relative (e.g. the footer's
    // "/it/privacy-policy", no domain prefix, no trailing slash) rather than absolute.
    let rel;
    if (href.startsWith(DOMAIN)) rel = href.slice(DOMAIN.length);
    else if (href.startsWith(`/${LANG}/`)) rel = href;
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
  menuModal.find(".current-menu-item").removeClass("current-menu-item");
  menuModal.find("[aria-current='page']").removeAttr("aria-current");

  // Task 9: all 3 languages are now implemented locally, so the WPML switcher's
  // *other*-language links become BaseLayout-substituted tokens (resolved from
  // the page's own `otherLangUrls` prop) instead of the live external site —
  // this is the one place IT's own generated chrome intentionally changes too.
  for (const other of OTHER_LANGS) {
    const token = `__SWITCHER_${other.toUpperCase()}_URL__`;
    header.find(`.wpml-ls-item-${other} a`).attr("href", token);
  }
  // The current-language switcher item is a self-link — always the local home.
  header.find(`.wpml-ls-item-${LANG} a`).attr("href", `/${LANG}/`);

  // Shared News (Task 9): every language's News nav link points at the single
  // canonical /news/ route. DE's live nav has no News item at all (confirmed
  // live) — user decision: add one, matching EN/IT's structural pattern, since
  // this is new local UI chrome (not scraped content) rather than a translated
  // live string.
  const newsLink = header.find('a[href*="/news/"]').filter((i, el) => {
    const href = $(el).attr("href") ?? "";
    return href.endsWith("/news/") || href.endsWith("/news");
  });
  if (newsLink.length) {
    newsLink.attr("href", "/news/");
  } else if (LANG === "de") {
    const template = header.find(".menu-item").last();
    const newsLi = template
      .clone()
      .removeAttr("id")
      .attr("class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-news")
      .empty();
    newsLi.append(`<a href="/news/">News</a>`);
    template.after(newsLi);
  }

  removeShopLinks($, header);
  removeShopLinks($, menuModal);
  rewriteLinks($, header);
  rewriteLinks($, menuModal);
  const combined = header.prop("outerHTML") + "\n" + menuModal.prop("outerHTML");
  await writeFile(path.join(OUT_DIR, "header.html"), combined, "utf8");

  const footer = $("#site-footer").first();
  const footerNewsLink = footer.find('a[href*="/news/"]');
  footerNewsLink.attr("href", "/news/");
  removeShopLinks($, footer);
  rewriteLinks($, footer);
  await writeFile(path.join(OUT_DIR, "footer.html"), footer.prop("outerHTML"), "utf8");

  console.log(`Wrote ${path.relative(process.cwd(), OUT_DIR)}/header.html and footer.html`);
}

main();
