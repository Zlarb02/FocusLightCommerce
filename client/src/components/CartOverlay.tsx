import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/components/CartItem";
import { useCart } from "@/hooks/useCart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingBag, X } from "lucide-react";
import { useLocation } from "wouter";

interface CartOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function CartOverlay({ open, onClose }: CartOverlayProps) {
  const { items, getTotalItems, getTotalPrice } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    onClose();
    setLocation("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="font-heading font-bold text-xl">
              Votre Panier
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-grow overflow-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Votre panier est vide
              </h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez des produits pour commencer vos achats
              </p>
              <Button onClick={onClose}>Continuer vos achats</Button>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.product.id} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Sous-total</span>
              <span className="font-medium">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Livraison</span>
              <span className="text-green-600">Gratuite</span>
            </div>
            <div className="flex justify-between mb-6 text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full py-6">
              Procéder au paiement
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
