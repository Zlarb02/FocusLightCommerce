import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedCartIconProps {
  itemCount: number;
  className?: string;
  size?: number;
  showBadge?: boolean;
  onCartUpdate?: () => void;
}

export function AnimatedCartIcon({
  itemCount,
  className,
  size = 24,
  showBadge = true,
  onCartUpdate,
}: AnimatedCartIconProps) {
  const [prevCount, setPrevCount] = useState(itemCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (itemCount !== prevCount && itemCount > prevCount) {
      setIsAnimating(true);
      onCartUpdate?.();

      // Reset animation après un délai
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);

      return () => clearTimeout(timer);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount, onCartUpdate]);

  const bounceVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 0.9, 1.1, 1],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const bagVariants = {
    initial: { rotateZ: 0 },
    animate: {
      rotateZ: [0, -10, 10, -5, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  const badgeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
      },
    },
    update: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className={cn("relative", className)}
      variants={bounceVariants}
      initial="initial"
      animate={isAnimating ? "animate" : "initial"}
    >
      {/* Icône du panier */}
      <motion.div
        variants={bagVariants}
        animate={isAnimating ? "animate" : "initial"}
      >
        <ShoppingBag size={size} className="text-current" />
      </motion.div>

      {/* Badge de compteur */}
      <AnimatePresence>
        {showBadge && itemCount > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
            variants={badgeVariants}
            initial="initial"
            animate={isAnimating ? "update" : "animate"}
            exit={{ scale: 0, opacity: 0 }}
            key={itemCount} // Key pour forcer la re-animation lors du changement
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Effet de pulsation pour les nouveaux items */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0 border-2 border-primary rounded-full"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Particules d'effet lors de l'ajout */}
      <AnimatePresence>
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                initial={{
                  x: size / 2,
                  y: size / 2,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: size / 2 + Math.cos((i * Math.PI) / 2) * 20,
                  y: size / 2 + Math.sin((i * Math.PI) / 2) * 20,
                  opacity: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
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
