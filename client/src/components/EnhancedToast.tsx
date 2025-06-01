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

export function EnhancedToast({
  id,
  title,
  description,
  type = "info",
  duration = 4000,
  onClose,
  productImage,
  productName,
  quantity = 1,
}: EnhancedToastProps) {
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
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cart":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "cart":
        return "bg-blue-50 border-blue-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "relative overflow-hidden rounded-lg border p-4 shadow-lg max-w-sm",
        getBgColor()
      )}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Barre de progression */}
      <motion.div
        className="absolute top-0 left-0 h-1 bg-primary/30"
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
                className="text-sm font-semibold text-gray-900"
              >
                {title}
              </motion.h4>
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-600 mt-1"
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
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
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
              className="mt-3 flex items-center gap-3 p-2 bg-white/50 rounded-md"
            >
              <img
                src={productImage}
                alt={productName}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {productName}
                </p>
                <p className="text-xs text-gray-500">Quantité: {quantity}</p>
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
