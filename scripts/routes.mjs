// Canonical list of in-scope Italian routes, taken from .claude/CLAUDE.md.
// Used by every scraping/testing script so there is exactly one source of truth.

export const MAIN_PAGES = ["", "chi-siamo/", "cantina/", "contatti/"];

export const BLANK_PAGES = ["privacy-policy/", "dati-societari/"];

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
  for (const p of CATEGORY_PAGES) routes.push({ path: p, kind: "category" });
  for (const slug of PRODUCT_SLUGS)
    routes.push({ path: `i-nostri-vini/${slug}/`, kind: "product", slug });
  return routes;
}

export function cacheFileFor(routePath) {
  const safe = routePath === "" ? "_home" : routePath.replace(/\/$/, "").replace(/\//g, "__");
  return `${safe}.html`;
}
