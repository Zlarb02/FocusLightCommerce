import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ProductWithSelectedVariation } from "@shared/schema";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  item: {
    product: ProductWithSelectedVariation;
    quantity: number;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { product, quantity } = item;
  const { updateQuantity, removeItem } = useCart();

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  // Calcul du prix (utiliser le prix de la variation s'il est disponible, sinon le prix de base)
  const itemPrice = product.price || product.basePrice;

  return (
    <div className="flex gap-4 border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
      <img
        src={product.imageUrl}
        alt={`FOCUS.01 ${product.variationValue}`}
        className="w-20 h-20 object-contain"
      />
      <div className="flex-grow">
        <div className="flex justify-between">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            {product.productName}
          </h4>
          <button
            onClick={handleRemove}
            className="text-red-500 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300"
            aria-label="Supprimer du panier"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          {product.variationType === "color"
            ? "Couleur"
            : product.variationType}
          : {product.variationValue}
        </p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-0 h-8"
              onClick={handleDecrease}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-2">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-0 h-8"
              onClick={handleIncrease}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="font-medium">
            {formatPrice(itemPrice * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
