export interface Category {
  slug: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    slug: "spumanti",
    name: "Spumanti",
    description:
      "Prosecco e spumanti millesimati, freschi e vivaci, ideali per aperitivi e brindisi.",
  },
  {
    slug: "bianchi",
    name: "Bianchi",
    description:
      "Vini bianchi eleganti e profumati, espressione dei terreni del Veneto orientale.",
  },
  {
    slug: "rossi",
    name: "Rossi",
    description:
      "Rossi strutturati e versatili, adatti a pasti a base di carne e occasioni conviviali.",
  },
  {
    slug: "affinati",
    name: "Affinati",
    description:
      "Rossi affinati in botte, con maggiore complessità e profondità aromatica.",
  },
  {
    slug: "frizzanti-e-rosati",
    name: "Frizzanti e Rosati",
    description:
      "Vini frizzanti e rosati, freschi e informali, perfetti fuori pasto.",
  },
  {
    slug: "passiti",
    name: "Passiti",
    description:
      "Vini da meditazione ottenuti da uve appassite, dolci e concentrati.",
  },
];
