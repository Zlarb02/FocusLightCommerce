import type { CSSProperties } from "react";

import fallback from "./productColors.fallback.json";

/**
 * Registre des couleurs produit.
 *
 * Une couleur, c'est un nom de variation (« Bleu », « Vert olive »…) et la
 * pastille qui l'illustre dans les sélecteurs. Le registre vit dans
 * `data/productColors.json` et s'édite depuis la gestion (Stocks → variation) :
 * ajouter une couleur au catalogue ne demande donc plus de toucher au code.
 *
 * Le JSON embarqué ici n'est qu'un repli, comme `contexts/translations.json` :
 * l'API gagne toujours dès qu'elle répond.
 */
export interface ProductColor {
  /** Image de la pastille (téléversée dans Médias, ou fichier de `public/`). */
  swatchUrl?: string;
  /** Aplat utilisé quand aucune pastille n'est fournie. */
  hex?: string;
}

export type ProductColorMap = Record<string, ProductColor>;

export interface ResolvedProductColor {
  name: string;
  /** Chaîne vide si la couleur n'a pas (encore) de pastille. */
  swatchUrl: string;
  hex: string;
}

/** Gris neutre d'une couleur encore dépourvue de pastille et de teinte. */
export const NEUTRAL_COLOR_HEX = "#E5E7EB";

export const fallbackProductColors = fallback as ProductColorMap;

/**
 * Une couleur inconnue du registre ne prend PAS l'apparence d'une autre : elle
 * reçoit un aplat neutre. Retomber sur « Blanc » faisait passer les nouvelles
 * couleurs pour des lampes blanches.
 */
export function resolveProductColor(
  colors: ProductColorMap,
  name: string
): ResolvedProductColor {
  const entry = colors[name];
  return {
    name,
    swatchUrl: entry?.swatchUrl ?? "",
    hex: entry?.hex || NEUTRAL_COLOR_HEX,
  };
}

/** Style de fond d'une pastille : l'image si elle existe, sinon l'aplat. */
export function swatchStyle(color: ResolvedProductColor): CSSProperties {
  if (color.swatchUrl) {
    return {
      backgroundImage: `url(${color.swatchUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: color.hex };
}
