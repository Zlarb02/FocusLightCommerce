import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductVariation } from "@shared/schema";
import { Plus, Minus } from "lucide-react";

interface ProductQuantityCounterProps {
  productId: number;
  variation: ProductVariation;
  productName: string;
  productDescription?: string;
  basePrice: number;
  className?: string;
}

export function ProductQuantityCounter({
  productId,
  variation,
  productName,
  productDescription = "",
  basePrice,
  className = "",
}: ProductQuantityCounterProps) {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(0);

  // Trouver la quantité actuelle du produit dans le panier
  useEffect(() => {
    const cartItem = items.find((item) => item.product.id === variation.id);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [items, variation.id]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Pas d'ajout au panier pour une variation en rupture de stock
    if ((variation.stock ?? 0) <= 0) return;

    const productWithVariation = {
      ...variation,
      productName,
      productDescription,
      basePrice,
    };

    addItem(productWithVariation);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantity > 1) {
      updateQuantity(variation.id, quantity - 1);
    } else if (quantity === 1) {
      removeItem(variation.id);
    }
  };

  const handleUpdateQuantity = (newQuantity: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (newQuantity <= 0) {
      removeItem(variation.id);
    } else {
      updateQuantity(variation.id, newQuantity);
    }
  };

  if (quantity === 0) {
    // Bouton "Ajouter au panier" simple
    return (
      <button
        onClick={handleAdd}
        className={`bg-primary hover:bg-primary/90 dark:bg-[#3a5fcf] dark:hover:bg-[#5477e6] text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md transform hover:scale-105 ${className}`}
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">{t("shop.focus.addToCart")}</span>
      </button>
    );
  }

  // Compteur avec boutons + et -
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={handleRemove}
        className="bg-gray-100 dark:bg-[#232a3a] hover:bg-gray-200 dark:hover:bg-[#2d3952] text-gray-700 dark:text-white w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
        aria-label="Diminuer la quantité"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-semibold min-w-[50px] text-center shadow-sm text-gray-900 dark:text-white">
        {quantity}
      </div>

      <button
        onClick={handleAdd}
        className="bg-primary hover:bg-primary/90 dark:bg-[#3a5fcf] dark:hover:bg-[#5477e6] text-white w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
        aria-label="Augmenter la quantité"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
