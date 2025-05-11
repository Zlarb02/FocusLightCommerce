import { useState, useEffect } from "react";
import { ProductVariation, ProductWithSelectedVariation } from "@shared/schema";

/**
 * Hook personnalisé pour gérer la sélection de produits avec variations
 * Extrait la logique métier du composant pour faciliter les tests et la réutilisation
 */
export function useProductSelection(
  variations: ProductVariation[],
  productName: string,
  productDescription: string,
  basePrice: number
) {
  const [selectedVariation, setSelectedVariation] =
    useState<ProductWithSelectedVariation | null>(null);

  // Sélectionner une variation par défaut quand les variations sont chargées
  useEffect(() => {
    if (variations.length > 0 && !selectedVariation) {
      // Priorité à la variation "Blanc" si elle existe, sinon prendre la première
      const defaultVariation =
        variations.find((v) => v.variationValue === "Blanc") || variations[0];

      // Créer un ProductWithSelectedVariation à partir de la variation
      const selectedProduct: ProductWithSelectedVariation = {
        ...defaultVariation,
        productName,
        productDescription,
        basePrice,
      };

      setSelectedVariation(selectedProduct);
    }
  }, [
    variations,
    selectedVariation,
    productName,
    productDescription,
    basePrice,
  ]);

  // Fonction pour changer de variation sélectionnée
  const handleVariationSelect = (variation: ProductVariation) => {
    const selectedProduct: ProductWithSelectedVariation = {
      ...variation,
      productName,
      productDescription,
      basePrice,
    };

    setSelectedVariation(selectedProduct);
  };

  return {
    selectedVariation,
    setSelectedVariation,
    handleVariationSelect,
  };
}
