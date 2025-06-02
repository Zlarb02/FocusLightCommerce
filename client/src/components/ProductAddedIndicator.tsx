import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/hooks/useCart";

interface ProductAddedIndicatorProps {
  productId: string;
  show?: boolean; // Rendu optionnel car on va utiliser le panier
  duration?: number;
  className?: string;
}

export function ProductAddedIndicator({
  productId,
  show,
  duration = 3000,
  className,
}: ProductAddedIndicatorProps) {
  const [justAdded, setJustAdded] = useState(false);
  const isMobile = useIsMobile();
  const { items } = useCart();

  // Vérifier si ce produit spécifique est dans le panier
  const isInCart = items.some(
    (item) => item.product.id.toString() === productId
  );

  // Gérer l'animation temporaire d'ajout (optionnelle)
  useEffect(() => {
    if (show) {
      setJustAdded(true);
      const timer = setTimeout(() => {
        setJustAdded(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  // L'indicateur n'est visible que si le produit est réellement dans le panier
  const shouldShow = isInCart;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 180 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 300,
          }}
          className={cn(
            "absolute bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg z-20",
            isMobile
              ? "top-4 right-4 w-12 h-12" // Plus grand et mieux positionné sur mobile
              : "top-2 right-2 w-8 h-8", // Taille normale sur desktop
            className
          )}
        >
          <Check className={isMobile ? "w-6 h-6" : "w-4 h-4"} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook pour gérer l'état des indicateurs de produits ajoutés
export function useProductAddedIndicators() {
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  const showIndicator = (productId: string) => {
    setAddedProducts((prev) => new Set(prev).add(productId));

    setTimeout(() => {
      setAddedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 3000);
  };

  const isProductAdded = (productId: string) => addedProducts.has(productId);

  return {
    showIndicator,
    isProductAdded,
  };
}
