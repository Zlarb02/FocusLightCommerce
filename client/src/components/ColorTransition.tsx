import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface ColorTransitionProps {
  children: React.ReactNode;
  colorKey: string; // Identifiant unique pour la couleur actuelle
  className?: string;
}

export function ColorTransition({
  children,
  colorKey,
  className,
}: ColorTransitionProps) {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={colorKey}
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
              duration: 0.6,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: 0,
            scale: 1.1,
            rotateY: 15,
            transition: {
              duration: 0.3,
            },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
