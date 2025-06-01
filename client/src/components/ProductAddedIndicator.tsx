import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductAddedIndicatorProps {
  productId: string;
  show: boolean;
  duration?: number;
  className?: string;
}

export function ProductAddedIndicator({
  productId,
  show,
  duration = 3000,
  className,
}: ProductAddedIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
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
            "absolute top-2 right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10",
            className
          )}
        >
          <Check className="w-4 h-4" />
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
