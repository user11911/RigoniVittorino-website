export type Locale = "it" | "en" | "de";

export const locales: Locale[] = ["it", "en", "de"];

export const localeLabels: Record<Locale, string> = {
  it: "IT",
  en: "EN",
  de: "DE",
};

export const localePaths: Record<Locale, string> = {
  it: "/",
  en: "/en",
  de: "/de",
};

// Nav labels sourced from the live site's real EN/DE translations (WPML),
// fetched directly from rigonivittorino.com/en/ and /de/.
export const nav = {
  azienda: { it: "Azienda", en: "The Estate", de: "Unternehmen" },
  cantina: { it: "Cantina", en: "Winery", de: "Weinkeller" },
  vini: { it: "I nostri vini", en: "Our wines", de: "Unsere Weine" },
  shop: { it: "Shop Online", en: "Shop online", de: "Shop Online" },
  contatti: { it: "Contatti", en: "Contacts", de: "Contacts" },
  news: { it: "News", en: "News", de: "News" },
} satisfies Record<string, Record<Locale, string>>;

// Category names, also sourced from the real EN/DE site nav.
export const categoryNames: Record<string, Record<Locale, string>> = {
  spumanti: { it: "Spumanti", en: "Prosecco and Sparkling", de: "Schaumweine" },
  bianchi: { it: "Bianchi", en: "White Wines", de: "Weissweine" },
  rossi: { it: "Rossi", en: "Red Wines", de: "Rotweine" },
  affinati: { it: "Affinati", en: "Matured", de: "Gereift im Eichenfass" },
  "frizzanti-e-rosati": {
    it: "Frizzanti e Rosati",
    en: "Fizzy and Rosé",
    de: "Perlweine und Roseweine",
  },
  passiti: { it: "Passiti", en: "Passiti", de: "Strohweine" },
};

// Category tile descriptions are our own short summaries (the live site's
// category pages don't carry descriptive body text), so these are plain
// translations of our own IT copy, not sourced facts.
export const categoryDescriptions: Record<string, Record<Locale, string>> = {
  spumanti: {
    it: "Prosecco e spumanti millesimati, freschi e vivaci, ideali per aperitivi e brindisi.",
    en: "Vintage Prosecco and sparkling wines, fresh and lively, ideal for aperitifs and toasts.",
    de: "Jahrgangs-Prosecco und Schaumweine, frisch und lebendig, ideal für Aperitifs und Anstoße.",
  },
  bianchi: {
    it: "Vini bianchi eleganti e profumati, espressione dei terreni del Veneto orientale.",
    en: "Elegant, fragrant white wines, an expression of the soils of eastern Veneto.",
    de: "Elegante, duftende Weissweine, Ausdruck der Böden des östlichen Venetien.",
  },
  rossi: {
    it: "Rossi strutturati e versatili, adatti a pasti a base di carne e occasioni conviviali.",
    en: "Structured, versatile red wines, suited to meat-based meals and convivial occasions.",
    de: "Strukturierte, vielseitige Rotweine, passend zu Fleischgerichten und geselligen Anlässen.",
  },
  affinati: {
    it: "Rossi affinati in botte, con maggiore complessità e profondità aromatica.",
    en: "Red wines matured in oak, with greater complexity and aromatic depth.",
    de: "Im Eichenfass gereifte Rotweine mit mehr Komplexität und aromatischer Tiefe.",
  },
  "frizzanti-e-rosati": {
    it: "Vini frizzanti e rosati, freschi e informali, perfetti fuori pasto.",
    en: "Fizzy and rosé wines, fresh and casual, perfect outside of meals.",
    de: "Perlweine und Roseweine, frisch und unkompliziert, perfekt für zwischendurch.",
  },
  passiti: {
    it: "Vini da meditazione ottenuti da uve appassite, dolci e concentrati.",
    en: "Meditation wines made from dried grapes, sweet and concentrated.",
    de: "Meditationsweine aus getrockneten Trauben, süss und konzentriert.",
  },
};

// Generic UI chrome. Not site-sourced facts, so freely (but plainly) translated.
export const ui = {
  discover: { it: "Scopri", en: "Discover", de: "Entdecken" },
  backTo: { it: "Torna a", en: "Back to", de: "Zurück zu" },
  openMenu: { it: "Apri il menu", en: "Open menu", de: "Menü öffnen" },
  mainNav: {
    it: "Navigazione principale",
    en: "Main navigation",
    de: "Hauptnavigation",
  },
  responsibleDrinking: {
    it: "L'abuso di alcol è dannoso per la salute. Vendita riservata ai maggiori di 18 anni.",
    en: "Alcohol abuse is harmful to your health. Sale reserved for those over 18.",
    de: "Alkoholmissbrauch ist gesundheitsschädlich. Verkauf nur an Personen über 18 Jahren.",
  },
  legalInfo: {
    it: "Informazioni legali",
    en: "Legal information",
    de: "Rechtliche Hinweise",
  },
  privacyPolicy: { it: "Privacy Policy", en: "Privacy", de: "Privacy" },
  companyData: { it: "Dati societari", en: "Company Data", de: "Unternehmensdaten" },
  terms: { it: "Termini e condizioni", en: "Terms and Conditions", de: "Allgemeine Geschäftsbedingungen" },
  shipping: { it: "Spedizioni e resi", en: "Shipping and Returns", de: "Versand und Rücksendungen" },
  rightsReserved: {
    it: "Tutti i diritti riservati.",
    en: "All rights reserved.",
    de: "Alle Rechte vorbehalten.",
  },
} satisfies Record<string, Record<Locale, string>>;

// Homepage-specific copy. IT is the original site copy already used on `/`.
// EN/DE hero + philosophy paragraphs are the site's own real translated text,
// fetched directly from rigonivittorino.com/en/ and /de/ (WPML). The
// cantina-teaser blurb has no direct EN/DE source on the live site (it's our
// own addition on the IT homepage too), so it's a plain, fact-free translation.
export const home = {
  heroEyebrow: {
    it: "Dal 1950, tre generazioni di famiglia",
    en: "Since 1950, three generations of family",
    de: "Seit 1950, drei Generationen einer Familie",
  },
  heroTitle: {
    it: "Dalla campagna al bicchiere",
    en: "From the vineyards to the glass",
    de: "Von den Weinbergen zum Glas",
  },
  heroSubtitle: {
    it: "Vini veneti coltivati e vinificati con passione a Gorgo al Monticano, nel cuore della Marca Trevigiana.",
    en: "Veneto wines grown and made with passion in Gorgo al Monticano, in the heart of the Marca Trevigiana.",
    de: "Venetische Weine, mit Leidenschaft angebaut und gekeltert in Gorgo al Monticano, im Herzen der Marca Trevigiana.",
  },
  heroCta: {
    it: "Scopri i nostri vini",
    en: "Discover our wines",
    de: "Unsere Weine entdecken",
  },
  philosophyEyebrow: {
    it: "La nostra filosofia",
    en: "Our philosophy",
    de: "Unsere Philosophie",
  },
  philosophyHeading: {
    it: "Il controllo dell'intera filiera",
    en: "Control of the entire supply chain",
    de: "Kontrolle über die gesamte Lieferkette",
  },
  philosophyBody: {
    it: "Dalla vigna alla bottiglia, seguiamo ogni fase della produzione con cura artigianale e tecnologia enologica moderna. Quasi 100 ettari vitati tra Malintrada, Cessalto, Chiarano e Motta di Livenza danno vita a vini che raccontano il territorio veneto.",
    en: "“From the vineyards to the glass” is our philosophy. Our vineyards cover an area of almost 100 hectares located in one of the best wine districts of the Northern Italian region. The connection with the land and the territory is strong and intimate. Thanks to the careful supervision of the entire production chain and the utilization of the best winemaking techniques, our wines will indulge you.",
    de: "„Von den Weinbergen zum Glas“ ist unsere Philosophie. Unsere Weinberge umfassen eine Fläche von fast 100 Hektar und befinden sich in einem der besten Weinviertel der norditalienischen Region. Die Verbindung mit dem Land und dem Territorium ist stark und eng. Dank der sorgfältigen Überwachung der gesamten Produktionskette und der Verwendung der besten Weinbereitungstechniken werden dich unsere Weine verwöhnen.",
  },
  philosophyCta: {
    it: "Scopri l'azienda",
    en: "Discover the estate",
    de: "Das Weingut entdecken",
  },
  selectionEyebrow: { it: "Selezione", en: "Selection", de: "Auswahl" },
  selectionHeading: { it: "I nostri vini", en: "Our wines", de: "Unsere Weine" },
  categoriesEyebrow: { it: "Categorie", en: "Categories", de: "Kategorien" },
  categoriesHeading: {
    it: "Esplora per tipologia",
    en: "Explore by type",
    de: "Nach Weintyp entdecken",
  },
  cantinaEyebrow: { it: "La cantina", en: "The winery", de: "Der Weinkeller" },
  cantinaHeading: {
    it: "Oltre 3.500 mq dedicati alla qualità",
    en: "Over 3,500 sqm dedicated to quality",
    de: "Über 3.500 m² für Qualität",
  },
  cantinaBody: {
    it: "La nostra cantina unisce tradizione e tecnologia per garantire il massimo rispetto delle uve in ogni fase della vinificazione.",
    en: "Our winery combines tradition and technology to ensure the utmost respect for the grapes at every stage of vinification.",
    de: "Unser Weinkeller vereint Tradition und Technologie, um die Trauben in jeder Phase der Weinbereitung bestmöglich zu respektieren.",
  },
  cantinaCta: {
    it: "Scopri la cantina",
    en: "Discover the winery",
    de: "Den Weinkeller entdecken",
  },
  metaDescription: {
    it: "Cantina Rigoni Vittorino: vini veneti di famiglia, dalla campagna al bicchiere. Scopri spumanti, bianchi, rossi e passiti.",
    en: "Rigoni Vittorino winery: family Veneto wines, from the vineyards to the glass. Discover sparkling, white, red and dessert wines.",
    de: "Weingut Rigoni Vittorino: venetische Familienweine, von den Weinbergen zum Glas. Entdecken Sie Schaumweine, Weiss-, Rot- und Dessertweine.",
  },
  translationNotice: {
    en: "This page is available in English. Other pages are currently in Italian only.",
    de: "Diese Seite ist auf Deutsch verfügbar. Andere Seiten sind derzeit nur auf Italienisch.",
  },
} satisfies Record<string, Partial<Record<Locale, string>>>;
