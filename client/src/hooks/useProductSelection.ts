import { useState, useEffect } from "react";
import { Product } from "@shared/schema";

/**
 * Hook personnalisé pour gérer la sélection de produits
 * Extrait la logique métier du composant pour faciliter les tests et la réutilisation
 */
export function useProductSelection(products: Product[]) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sélectionner un produit par défaut quand les produits sont chargés
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      // Priorité au produit blanc, sinon prendre le premier
      const defaultProduct =
        products.find((p) => p.color === "Blanc") || products[0];
      setSelectedProduct(defaultProduct);
    }
  }, [products, selectedProduct]);

  // Fonction pour changer de produit sélectionné
  const handleColorSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  return {
    selectedProduct,
    setSelectedProduct,
    handleColorSelect,
  };
}
