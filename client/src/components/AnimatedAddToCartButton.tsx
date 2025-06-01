import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedAddToCartButtonProps {
  onClick: () => void;
  disabled?: boolean;
  price?: string;
  size?: "sm" | "lg" | "default";
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedAddToCartButton({
  onClick,
  disabled = false,
  price,
  size = "lg",
  className,
  children,
}: AnimatedAddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = async () => {
    if (disabled || isAdding) return;

    setIsAdding(true);

    // Simulation de l'ajout au panier avec feedback
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      onClick();

      // Reset après 2 secondes
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 800);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Button
        size={size}
        onClick={handleClick}
        disabled={disabled || isAdding}
        className={cn(
          "bg-primary text-primary-foreground hover:bg-primary/90 rounded-none transition-all duration-300 relative overflow-hidden shadow-none hover:shadow-md transform hover:translate-y-[-2px]",
          isAdded && "bg-green-600 hover:bg-green-600",
          className
        )}
        style={{ fontFamily: "var(--font-buttons)" }}
      >
        {/* Effet de vague lors du clic */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Contenu du bouton avec animations */}
        <div className="flex items-center relative z-10">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Plus className="h-4 w-4" />
                </motion.div>
                Ajout en cours...
              </motion.div>
            ) : isAdded ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "backOut" }}
                className="flex items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3, ease: "backOut" }}
                >
                  <Check className="mr-2 h-4 w-4" />
                </motion.div>
                Ajouté !
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {children || `Acheter${price ? ` - ${price}` : ""}`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Effet de brillance au survol */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full"
          whileHover={{
            translateX: "200%",
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
        />
      </Button>

      {/* Particules de succès */}
      <AnimatePresence>
        {isAdded && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-green-400 rounded-full"
                initial={{
                  x: "50%",
                  y: "50%",
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  opacity: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
