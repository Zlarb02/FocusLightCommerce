import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart, Sparkles, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Types pour les animations
interface CartButtonAnimationProps {
  children: React.ReactNode;
  isAdding: boolean;
  onAnimationComplete?: () => void;
  className?: string;
  variant?: "primary" | "success" | "pulse";
}

interface CartIconAnimationProps {
  isAnimating: boolean;
  itemCount: number;
  className?: string;
}

interface ProductAddedOverlayProps {
  isVisible: boolean;
  productName: string;
  onComplete: () => void;
  position?: { x: number; y: number };
}

interface FloatingElementsProps {
  isActive: boolean;
  elements?: Array<"star" | "heart" | "sparkle">;
}

// Animation du bouton d'ajout au panier
export function CartButtonAnimation({
  children,
  isAdding,
  onAnimationComplete,
  className,
  variant = "primary",
}: CartButtonAnimationProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  const buttonVariants = {
    idle: {
      scale: 1,
      backgroundColor:
        variant === "primary" ? "hsl(var(--primary))" : "hsl(var(--secondary))",
      transition: { duration: 0.2 },
    },
    loading: {
      scale: [1, 1.05, 1],
      backgroundColor: "hsl(var(--primary))",
      transition: {
        scale: { duration: 0.6, repeat: Infinity },
        backgroundColor: { duration: 0.3 },
      },
    },
    success: {
      scale: [1, 1.2, 1.1, 1],
      backgroundColor: "hsl(142 76% 36%)", // green-600
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    idle: { rotate: 0, scale: 1 },
    loading: {
      rotate: [0, 10, -10, 0],
      scale: 1,
      transition: { duration: 0.6, repeat: Infinity },
    },
    success: {
      rotate: [0, 360],
      scale: [1, 1.3, 1],
      transition: { duration: 0.8 },
    },
  };

  const state = isAdding ? "loading" : "idle";
  const showSuccess = variant === "success";

  useEffect(() => {
    if (showSuccess && onAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onAnimationComplete]);

  return (
    <motion.div
      ref={buttonRef}
      className={cn("relative overflow-hidden", className)}
      variants={buttonVariants}
      animate={showSuccess ? "success" : state}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}

      {/* Effet de ripple */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-md"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Indicateur de succès */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-green-600 rounded-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <motion.div variants={iconVariants} animate="success">
              <Check className="h-5 w-5 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Animation de l'icône du panier
export function CartIconAnimation({
  isAnimating,
  itemCount,
  className,
}: CartIconAnimationProps) {
  const [prevItemCount, setPrevItemCount] = useState(itemCount);

  useEffect(() => {
    if (itemCount > prevItemCount) {
      setPrevItemCount(itemCount);
    }
  }, [itemCount, prevItemCount]);

  const cartVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    bounce: {
      scale: [1, 1.3, 1.1, 1],
      rotate: [0, -10, 5, 0],
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className={cn("relative", className)}
      variants={cartVariants}
      animate={isAnimating ? "bounce" : "idle"}
    >
      <ShoppingCart className="h-6 w-6" />

      {/* Badge avec animation */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            key={itemCount}
          >
            <motion.span
              key={itemCount}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {itemCount}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Effet de pulse pour nouveaux articles */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0 border-2 border-primary rounded-full"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Overlay de confirmation d'ajout
export function ProductAddedOverlay({
  isVisible,
  productName,
  onComplete,
  position = { x: 0, y: 0 },
}: ProductAddedOverlayProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-50 pointer-events-none"
          style={{ left: position.x, top: position.y }}
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -20 }}
          exit={{ opacity: 0, scale: 0.5, y: -40 }}
          transition={{
            duration: 0.5,
            exit: { duration: 0.3 },
          }}
        >
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Check className="h-4 w-4" />
            </motion.div>
            <span className="text-sm font-medium">{productName} ajouté !</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Éléments flottants décoratifs
export function FloatingElements({
  isActive,
  elements = ["star", "heart", "sparkle"],
}: FloatingElementsProps) {
  const getIcon = (element: string, index: number) => {
    const iconProps = { className: "h-4 w-4 text-yellow-400" };
    switch (element) {
      case "star":
        return <Star key={index} {...iconProps} fill="currentColor" />;
      case "heart":
        return (
          <Heart
            key={index}
            {...iconProps}
            fill="currentColor"
            className="h-4 w-4 text-red-400"
          />
        );
      case "sparkle":
        return <Sparkles key={index} {...iconProps} />;
      default:
        return <Star key={index} {...iconProps} fill="currentColor" />;
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {elements.map((element, index) => (
            <motion.div
              key={`${element}-${index}`}
              className="absolute"
              initial={{
                opacity: 0,
                scale: 0,
                x: Math.random() * 100 + "%",
                y: "50%",
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: "-20px",
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              {getIcon(element, index)}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Effet de particules pour succès
export function SuccessParticles({
  isActive,
  count = 6,
}: {
  isActive: boolean;
  count?: number;
}) {
  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: count }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              initial={{
                opacity: 1,
                scale: 0,
                x: "50%",
                y: "50%",
              }}
              animate={{
                opacity: 0,
                scale: 1,
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${50 + (Math.random() - 0.5) * 200}%`,
              }}
              transition={{
                duration: 1,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook personnalisé pour gérer les animations du panier
export function useCartAnimations() {
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [lastAddedProduct, setLastAddedProduct] = useState<string>("");

  const triggerCartAnimation = () => {
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 800);
  };

  const triggerSuccessOverlay = (
    productName: string,
    element?: HTMLElement
  ) => {
    setLastAddedProduct(productName);

    if (element) {
      const rect = element.getBoundingClientRect();
      setOverlayPosition({
        x: rect.right + 10,
        y: rect.top + rect.height / 2,
      });
    }

    setShowSuccessOverlay(true);
  };

  const hideSuccessOverlay = () => {
    setShowSuccessOverlay(false);
  };

  return {
    isCartAnimating,
    showSuccessOverlay,
    overlayPosition,
    lastAddedProduct,
    triggerCartAnimation,
    triggerSuccessOverlay,
    hideSuccessOverlay,
  };
}
