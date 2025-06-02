/**
 * Utilitaire pour mapper les anciennes URLs d'images vers les nouvelles URLs avec fond transparent
 */

// Mapping des anciennes URLs vers les nouvelles URLs
export const IMAGE_URL_MAPPING: Record<string, string> = {
  // Anciennes URLs locales vers nouvelles URLs externes
  "/uploads/blanche.png":
    "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
  "/uploads/bleue.png":
    "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
  "/uploads/rouge.png":
    "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
  "/uploads/orange.png":
    "https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png",

  // Anciennes URLs alto-lille.fr/images/ vers nouvelles URLs
  "https://www.alto-lille.fr/images/blanche.png":
    "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
  "https://www.alto-lille.fr/images/bleue.png":
    "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
  "https://www.alto-lille.fr/images/rouge.png":
    "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
  "https://www.alto-lille.fr/images/orange.png":
    "https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png",

  // Anciennes URLs alto-lille.fr/uploads/ vers nouvelles URLs (au cas où)
  "https://www.alto-lille.fr/uploads/blanche.png":
    "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
  "https://www.alto-lille.fr/uploads/bleue.png":
    "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
  "https://www.alto-lille.fr/uploads/rouge.png":
    "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
  "https://www.alto-lille.fr/uploads/orange.png":
    "https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png",

  // URLs relatives (au cas où)
  "blanche.png":
    "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
  "bleue.png":
    "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
  "rouge.png":
    "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
  "orange.png":
    "https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png",
};

// Mapping inversé pour les URLs par couleur (pour retrouver la couleur depuis l'URL)
export const COLOR_URL_MAPPING: Record<string, string> = {
  Blanc:
    "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
  Bleu: "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
  Rouge:
    "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
  Orange:
    "https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png",
};

/**
 * Mappe une ancienne URL d'image vers la nouvelle URL correspondante
 * @param oldUrl L'ancienne URL d'image
 * @returns La nouvelle URL d'image ou l'URL originale si aucun mapping n'existe
 */
export function mapImageUrl(oldUrl: string): string {
  return IMAGE_URL_MAPPING[oldUrl] || oldUrl;
}

/**
 * Obtient l'URL d'image moderne pour une couleur donnée
 * @param color La couleur de la lampe
 * @returns L'URL de l'image correspondante
 */
export function getImageUrlForColor(color: string): string {
  return COLOR_URL_MAPPING[color] || COLOR_URL_MAPPING["Blanc"];
}

/**
 * Vérifie si une URL d'image nécessite une mise à jour
 * @param url L'URL à vérifier
 * @returns true si l'URL doit être mise à jour
 */
export function needsImageUpdate(url: string): boolean {
  return url in IMAGE_URL_MAPPING;
}

/**
 * Transforme automatiquement les URLs d'images dans un objet ProductVariation
 * @param variation La variation de produit
 * @returns La variation avec l'URL d'image mise à jour si nécessaire
 */
export function transformProductVariation(variation: any) {
  return {
    ...variation,
    imageUrl: mapImageUrl(variation.imageUrl),
  };
}

/**
 * Transforme automatiquement les URLs d'images dans un produit avec ses variations
 * @param product Le produit avec ses variations
 * @returns Le produit avec les URLs d'images mises à jour
 */
export function transformProductWithVariations(product: any) {
  return {
    ...product,
    variations: product.variations?.map(transformProductVariation) || [],
  };
}
