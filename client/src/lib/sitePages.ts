/**
 * Modèle de contenu des pages annexes (Livraison, Retours, FAQ, Mentions
 * légales, Politique de confidentialité, CGV).
 *
 * Volontairement pauvre en types de blocs : Anatole doit pouvoir tout changer
 * sans se demander lequel choisir. Un titre, un paragraphe, une liste à puces,
 * un bloc question/réponse, un encadré, une image — ça couvre les six pages.
 */

/** Un texte est toujours bilingue ; l'anglais vide retombe sur le français. */
export interface Phrase {
  fr: string;
  en: string;
}

export type SiteBlock =
  | { id: string; type: "heading"; level: 2 | 3; text: Phrase }
  | { id: string; type: "paragraph"; text: Phrase }
  | { id: string; type: "list"; items: Phrase[] }
  | {
      id: string;
      type: "faq";
      items: Array<{ question: Phrase; answer: Phrase }>;
    }
  | { id: string; type: "callout"; text: Phrase }
  | { id: string; type: "image"; src: string; alt: Phrase };

export type SiteBlockType = SiteBlock["type"];

export interface SitePage {
  slug: string;
  route: string;
  label: string;
  title: Phrase;
  blocks: SiteBlock[];
}

export const BLOCK_LABELS: Record<SiteBlockType, string> = {
  heading: "Titre de section",
  paragraph: "Paragraphe",
  list: "Liste à puces",
  faq: "Questions / réponses",
  callout: "Encadré",
  image: "Image",
};

/** Texte à afficher : l'anglais s'il existe, le français sinon. */
export function phrase(p: Phrase | undefined, language: string): string {
  if (!p) return "";
  if (language === "en") return p.en.trim() || p.fr;
  return p.fr;
}

/** Identifiant de bloc unique et lisible, pour les ajouts depuis la gestion. */
export function newBlockId(slug: string): string {
  return `${slug}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function emptyBlock(type: SiteBlockType, slug: string): SiteBlock {
  const id = newBlockId(slug);
  const empty: Phrase = { fr: "", en: "" };
  switch (type) {
    case "heading":
      return { id, type, level: 2, text: { ...empty } };
    case "list":
      return { id, type, items: [{ ...empty }] };
    case "faq":
      return {
        id,
        type,
        items: [{ question: { ...empty }, answer: { ...empty } }],
      };
    case "image":
      return { id, type, src: "", alt: { ...empty } };
    case "callout":
    case "paragraph":
    default:
      return { id, type: type as "paragraph", text: { ...empty } };
  }
}
