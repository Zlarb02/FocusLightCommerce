import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/components/CartItem";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingBag, X } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import "./CartOverlay-dark-contrast.css";

interface CartOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function CartOverlay({ open, onClose }: CartOverlayProps) {
  const { items, getTotalItems, getTotalPrice } = useCart();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const handleCheckout = () => {
    onClose();
    setLocation("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="alto-cart flex flex-col h-full w-full sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="font-heading font-bold text-xl">
              {t("cart.title")}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-grow overflow-auto py-4">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full text-center cart-empty-container"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  damping: 15,
                  stiffness: 300,
                }}
              >
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-medium mb-2"
              >
                {t("cart.empty")}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-4"
              >
                {t("cart.emptyDescription")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {/* Pill contour orange, comme « Rédiger un avis » : le gris
                    ardoise d'avant n'appartenait pas à la marque. */}
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full border-2 border-alto-orange px-8 py-3 font-bold text-alto-orange transition-colors hover:bg-alto-orange hover:text-alto-cream"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("cart.continueShopping")}
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                    }}
                    layout
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="border-t pt-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between mb-2"
              >
                <span>{t("cart.subtotal")}</span>
                <span className="font-medium">
                  {formatPrice(getTotalPrice())}
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 flex justify-between text-alto-brown/80 dark:text-alto-cream/80"
              >
                <span>{t("cart.shipping")}</span>
                <span className="font-medium text-alto-blue dark:text-alto-cream">
                  {t("cart.freeShipping")}
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 flex justify-between text-lg font-bold text-alto-brown dark:text-alto-cream"
              >
                <span>{t("cart.total")}</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-full bg-alto-orange py-4 text-lg font-bold text-alto-cream transition-colors hover:bg-alto-orange-soft"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("cart.proceedToCheckout")}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
