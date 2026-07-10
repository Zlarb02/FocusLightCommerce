import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  ShoppingCart,
  Package,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface EnhancedToastProps {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info" | "cart";
  duration?: number;
  onClose: (id: string) => void;
  productImage?: string;
  productName?: string;
  quantity?: number;
}

const toastVariants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.1,
    },
  },
};

const progressVariants = {
  initial: { width: "100%" },
  animate: (duration: number) => ({
    width: "0%",
    transition: {
      duration: duration / 1000,
      ease: "linear",
    },
  }),
};

export const EnhancedToast = React.forwardRef<
  HTMLDivElement,
  EnhancedToastProps
>(
  (
    {
      id,
      title,
      description,
      type = "info",
      duration = 4000,
      onClose,
      productImage,
      productName,
      quantity = 1,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 200);
    };

    const getIcon = () => {
      switch (type) {
        case "success":
          return <CheckCircle className="h-5 w-5 text-alto-orange" />;
        case "cart":
          return <ShoppingCart className="h-5 w-5 text-alto-blue dark:text-alto-cream" />;
        case "error":
          return <AlertCircle className="h-5 w-5 text-[#B3261E] dark:text-[#F2B8B5]" />;
        default:
          return <Package className="h-5 w-5 text-alto-blue dark:text-alto-cream" />;
      }
    };

    const getBgColor = () => {
      switch (type) {
        case "success":
          return "border-l-alto-orange";
        case "cart":
          return "border-l-alto-blue dark:border-l-alto-cream/70";
        case "error":
          return "border-l-[#B3261E]";
        default:
          return "border-l-alto-brown dark:border-l-alto-cream/70";
      }
    };

    if (!isVisible) return null;

    return (
      <motion.div
        ref={ref}
        variants={toastVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "relative max-w-sm overflow-hidden rounded-sm border border-l-4 border-border bg-popover p-4 text-popover-foreground shadow-[0_12px_32px_-12px_rgba(22,22,21,0.35)]",
          getBgColor()
        )}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* Barre de progression */}
        <motion.div
          className="absolute top-0 left-0 h-1 bg-alto-orange/40"
          variants={progressVariants}
          initial="initial"
          animate="animate"
          custom={duration}
        />

        <div className="flex items-start gap-3">
          {/* Icône animée */}
          <motion.div variants={iconVariants} className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </motion.div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <motion.h4
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-heading text-sm font-bold text-foreground"
                >
                  {title}
                </motion.h4>
                {description && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    {description}
                  </motion.p>
                )}
              </div>

              {/* Bouton fermer */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="ml-2 flex-shrink-0 text-foreground/40 transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Section produit pour les toasts de panier */}
            {type === "cart" && productImage && productName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-3 flex items-center gap-3 rounded-sm bg-muted/60 p-2"
              >
                <img
                  src={productImage}
                  alt={productName}
                  className="h-10 w-10 rounded-sm object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">
                    {productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Quantité: {quantity}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Effet de brillance */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    );
  }
);

EnhancedToast.displayName = "EnhancedToast";

// Container pour gérer l'affichage des toasts
export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: EnhancedToastProps[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <EnhancedToast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
