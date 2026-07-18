// Canonical list of in-scope Italian routes, taken from .claude/CLAUDE.md.
// Used by every scraping/testing script so there is exactly one source of truth.

// Task 5 moved dati-societari/ here from BLANK_PAGES — it's a real content page now.
export const MAIN_PAGES = ["", "chi-siamo/", "cantina/", "contatti/", "dati-societari/"];

export const BLANK_PAGES = ["privacy-policy/"];

// Task 4 — News landing page only (no post/detail/category/tag/archive routes).
export const NEWS_PAGES = ["news/"];

export const CATEGORY_PAGES = [
  "spumanti/",
  "bianchi/",
  "rossi/",
  "affinati/",
  "frizzanti-e-rosati/",
  "passiti/",
];

export const PRODUCT_SLUGS = [
  // Prosecchi e Spumanti
  "creativo-prosecco-millesimato-brut-doc-treviso",
  "pinot-nero-spumante-millesimato-brut",
  "creativo-prosecco-millesimato-brut-doc-treviso-magnum",
  "pinot-nero-spumante-millesimato-brut-magnum",
  "prosecco-950-extra-dry-doc-treviso",
  "prosecco-rose-millesimato-brut-doc-treviso",
  "glera-spumante-millesimato-extra-dry",
  "anema-raboso-spumante-dolce",
  // Bianchi
  "pinot-grigio-igt-veneto",
  "chardonnay-igt-veneto",
  "sauvignon-igt-veneto",
  "suadente-glera-igt-veneto",
  "incrocio-manzoni-igt-veneto",
  "traminer-igt-veneto",
  // Rossi
  "pinot-nero-igt-veneto",
  "cabernet-igt-veneto",
  "malbech-igt-veneto",
  "merlot-igt-veneto",
  "refosco-igt-veneto",
  // Affinati
  "cabernet-sauvignon-affinato-in-botte-igt-veneto",
  "merlot-affinato-in-botte-igt-veneto",
  "profondo-cabernet-affinato-in-botte-igt-veneto",
  "maiuscolo-pinot-nero-affinato-in-botte-igt-veneto",
  // Frizzanti e Rosati
  "chardonnay-frizzante-igt-veneto",
  "verduzzo-frizzante-igt-veneto",
  "raboso-frizzante-igt-veneto",
  "rosato-di-raboso-frizzante-everythings-coming-up-rose-igt-veneto",
  // Passiti
  "complice-passito-igt-veneto",
  "ciacola-passito-igt-veneto",
  "raboso-passito",
];

export const CATEGORY_BY_PRODUCT_GROUP = {
  spumanti: PRODUCT_SLUGS.slice(0, 8),
  bianchi: PRODUCT_SLUGS.slice(8, 14),
  rossi: PRODUCT_SLUGS.slice(14, 19),
  affinati: PRODUCT_SLUGS.slice(19, 23),
  "frizzanti-e-rosati": PRODUCT_SLUGS.slice(23, 27),
  passiti: PRODUCT_SLUGS.slice(27, 30),
};

export const BASE_URL = "https://rigonivittorino.com/it/";

export function allRoutes() {
  const routes = [];
  for (const p of MAIN_PAGES) routes.push({ path: p, kind: "main" });
  for (const p of BLANK_PAGES) routes.push({ path: p, kind: "blank" });
  for (const p of NEWS_PAGES) routes.push({ path: p, kind: "news" });
  for (const p of CATEGORY_PAGES) routes.push({ path: p, kind: "category" });
  for (const slug of PRODUCT_SLUGS)
    routes.push({ path: `i-nostri-vini/${slug}/`, kind: "product", slug });
  return routes;
}

export function cacheFileFor(routePath) {
  const safe = routePath === "" ? "_home" : routePath.replace(/\/$/, "").replace(/\//g, "__");
  return `${safe}.html`;
}

// --- Task 9: multilingual route registry -----------------------------------
// Everything above this line is untouched and remains the IT-only, zero-arg
// default every existing script/consumer already relies on. Everything below
// is additive: a lang-parameterized registry used only by callers that opt in
// via a --lang= flag (see fetch-pages.mjs et al.). Confirmed via direct live
// sitemap checks (wp-sitemap-posts-page-1.xml, wp-sitemap-posts-wines-1.xml)
// during Task 9 planning: product slugs are IDENTICAL across it/en/de; static
// page and category slugs are genuinely translated per language; the live DE
// site has no News page/nav item at all (IT/EN both do).

// Neutral, language-independent category keys (IT's own slugs, reused as the
// stable cross-language key — matches CATEGORY_BY_PRODUCT_GROUP above).
export const CATEGORY_KEYS = [
  "spumanti",
  "bianchi",
  "rossi",
  "affinati",
  "frizzanti-e-rosati",
  "passiti",
];

export const LANGS = ["it", "en", "de"];

export const ROUTES_BY_LANG = {
  it: {
    BASE_URL: "https://rigonivittorino.com/it/",
    MAIN_PAGES: MAIN_PAGES,
    BLANK_PAGES: BLANK_PAGES,
    PRODUCT_BASE: "i-nostri-vini",
    CATEGORY_SLUGS: Object.fromEntries(CATEGORY_KEYS.map((k) => [k, k])),
    // The shared /news/ page (Task 9) replaces /it/news/; /it/news/ becomes a
    // redirect stub, not a scraped page — no local EN/DE News pages are built.
    HAS_LOCAL_NEWS_NAV: true,
  },
  en: {
    BASE_URL: "https://rigonivittorino.com/en/",
    MAIN_PAGES: ["", "the-estate/", "winery/", "contatti/", "company-data/"],
    BLANK_PAGES: ["privacy-policy/"],
    PRODUCT_BASE: "wines",
    CATEGORY_SLUGS: {
      spumanti: "sparkling",
      bianchi: "white-wines",
      rossi: "red-wines",
      affinati: "matured",
      "frizzanti-e-rosati": "fizzy-and-rose",
      passiti: "passiti",
    },
    HAS_LOCAL_NEWS_NAV: true,
  },
  de: {
    BASE_URL: "https://rigonivittorino.com/de/",
    MAIN_PAGES: ["", "unternehmen/", "weinkeller/", "contacts/", "firmen-daten/"],
    BLANK_PAGES: ["privacy-policy/"],
    PRODUCT_BASE: "wines",
    CATEGORY_SLUGS: {
      spumanti: "schaumweine",
      bianchi: "weissweine",
      rossi: "rotweine",
      affinati: "gereift-im-eichenfass",
      "frizzanti-e-rosati": "perlweine-und-roseweine",
      passiti: "strohweine",
    },
    // Confirmed live: the DE site has no News page/nav item at all. Task 9
    // adds one locally anyway (user decision, documented in TODO.md) so this
    // flag only controls whether the *scrape* should expect one live — it
    // never did, so extract-chrome.mjs adds the DE News <li> by hand.
    HAS_LOCAL_NEWS_NAV: false,
  },
};

export function allRoutesForLang(lang) {
  const cfg = ROUTES_BY_LANG[lang];
  if (!cfg) throw new Error(`Unknown lang ${lang}`);
  const routes = [];
  for (const p of cfg.MAIN_PAGES) routes.push({ path: p, kind: "main" });
  for (const p of cfg.BLANK_PAGES) routes.push({ path: p, kind: "blank" });
  for (const key of CATEGORY_KEYS) {
    const slug = cfg.CATEGORY_SLUGS[key];
    routes.push({ path: `${slug}/`, kind: "category", categoryKey: key });
  }
  for (const slug of PRODUCT_SLUGS)
    routes.push({ path: `${cfg.PRODUCT_BASE}/${slug}/`, kind: "product", slug });
  return routes;
}
