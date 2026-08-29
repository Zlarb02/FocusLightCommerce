import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  // Arrondir le prix à l'entier et formater sans décimales
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateOrderNumber(orderId: number): string {
  return `FC-${new Date().getFullYear()}${orderId.toString().padStart(4, "0")}`;
}

// Rupture de stock : le prix n'est jamais affiché pour un produit épuisé
// (produits ajoutés au catalogue avant que leur prix soit fixé).
export function isVariationOutOfStock(variation: {
  stock: number | null;
}): boolean {
  return (variation.stock ?? 0) <= 0;
}

export function isProductOutOfStock(product: {
  variations?: Array<{ stock: number | null }>;
}): boolean {
  if (!product.variations || product.variations.length === 0) return true;
  return product.variations.every((v) => isVariationOutOfStock(v));
}

/**
 * Traduit le nom d'une couleur selon la langue actuelle
 * @param colorName - Nom de la couleur en français (Bleu, Rouge, Orange, Blanc)
 * @param t - Fonction de traduction du contexte LanguageContext
 * @returns Nom de la couleur traduit
 */
export function translateColor(
  colorName: string,
  t: (key: string) => string
): string {
  const colorKey = colorName.toLowerCase();
  const translationKey = `colors.${colorKey}`;
  return t(translationKey);
}

/**
 * Filtre les images d'une variation en excluant la première image.
 * La première image est réservée pour les affichages qui n'utilisent qu'une seule image.
 * Cette fonction retourne les images pour les sliders et cards e-commerce.
 *
 * @param images - Tableau des images de la variation
 * @returns Tableau des images excluant la première (pour sliders/cards)
 */
export function getSliderImages(images: Array<{ url: string; order: number }>) {
  if (!images || images.length <= 1) {
    return [];
  }

  // Trier les images par ordre et exclure la première
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  return sortedImages.slice(1); // Exclure la première image
}
