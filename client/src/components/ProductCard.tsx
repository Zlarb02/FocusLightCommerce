import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice, getColorInfo } from "@/lib/utils";
import { Product } from "@shared/schema";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Check, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product);

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} (${product.color}) a été ajouté au panier`,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const colorInfo = getColorInfo(product.color);

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition">
      <div className="aspect-square mb-4 overflow-hidden rounded-xl">
        <img
          src={getColorInfo(product.color).imagePath}
          alt={`Lampe FOCUS.01 - ${product.color}`}
          className="w-full h-full object-contain max-h-[500px]"
        />
      </div>
      <CardContent className="pb-2">
        <h3 className="font-heading font-semibold text-xl mb-2">
          {product.color}
        </h3>
        <p className="text-muted-foreground mb-4">
          Élégance intemporelle qui s'intègre à tous les intérieurs
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="font-heading font-bold text-xl">
          {formatPrice(product.price)}
        </span>
        <Button
          onClick={handleAddToCart}
          className="gap-2"
          disabled={isAdding || product.stock <= 0}
        >
          {isAdding ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  );
}
