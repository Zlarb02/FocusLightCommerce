import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CartQuantityControlProps {
  product: ProductWithVariations;
  variation: ProductVariation;
  className?: string;
}

export function CartQuantityControl({
  product,
  variation,
  className,
}: CartQuantityControlProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart();

  // Trouver l'article dans le panier pour cette variation spécifique
  const cartItem = items.find((item) => item.product.id === variation.id);
  const quantity = cartItem?.quantity || 0;
  const isInCart = quantity > 0;

  const handleAddToCart = () => {
    const productWithVariation = {
      ...variation,
      productName: product.name,
      productDescription: product.description,
      basePrice: product.price,
    };
    addItem(productWithVariation);
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(variation.id, quantity + 1);
    } else {
      handleAddToCart();
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem) {
      if (quantity > 1) {
        updateQuantity(variation.id, quantity - 1);
      } else {
        removeItem(variation.id);
      }
    }
  };

  const displayPrice = variation.price || product.price;

  if (!isInCart) {
    // Bouton d'ajout au panier normal
    return (
      <motion.div initial={false} animate={{ scale: 1 }} className={className}>
        <Button
          onClick={handleAddToCart}
          className="gap-2 w-full"
          disabled={variation.stock <= 0}
        >
          <ShoppingCart className="h-4 w-4" />
          Ajouter au panier - {formatPrice(displayPrice)}
        </Button>
      </motion.div>
    );
  }

  // Contrôles de quantité
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className} space-y-3`}
    >
      {/* Indicateur de quantité et prix total */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
        <div className="text-sm text-green-700 dark:text-green-300 font-medium">
          Dans le panier: {quantity} × {formatPrice(displayPrice)}
        </div>
        <div className="text-lg font-bold text-green-800 dark:text-green-200">
          Total: {formatPrice(displayPrice * quantity)}
        </div>
      </div>

      {/* Contrôles + et - */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handleDecreaseQuantity}
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0 rounded-full border-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <motion.span
          key={quantity}
          initial={{ scale: 1.2, color: "#16a34a" }}
          animate={{ scale: 1, color: "#000000" }}
          className="text-xl font-bold min-w-[2rem] text-center text-foreground dark:text-foreground"
        >
          {quantity}
        </motion.span>

        <Button
          onClick={handleIncreaseQuantity}
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0 rounded-full border-2 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700"
          disabled={variation.stock <= quantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Stock disponible: {variation.stock}
      </div>
    </motion.div>
  );
}
