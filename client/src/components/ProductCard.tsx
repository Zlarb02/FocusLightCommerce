import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice, getColorInfo } from "@/lib/utils";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Check, Plus } from "lucide-react";

interface ProductCardProps {
  product: ProductWithVariations;
  variation: ProductVariation;
}

export function ProductCard({ product, variation }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);

    // Créer une représentation complète du produit avec sa variation
    const productWithVariation = {
      ...variation,
      productName: product.name,
      productDescription: product.description,
      basePrice: product.price,
    };

    addItem(productWithVariation);

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} (${variation.variationValue}) a été ajouté au panier`,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const colorInfo = getColorInfo(variation.variationValue);
  const displayPrice = variation.price || product.price;

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition">
      <div className="relative p-4 h-52 flex items-center justify-center bg-gray-50">
        <img
          src={variation.imageUrl}
          alt={`${product.name} - ${variation.variationValue}`}
          className="max-h-full object-contain transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="pt-6">
        <h3 className="font-heading font-bold text-lg mb-2">
          {product.name} - {variation.variationValue}
        </h3>
        <p className="text-muted-foreground mb-4">
          Élégance intemporelle qui s'intègre à tous les intérieurs
        </p>
        <div className="font-bold text-xl mb-4">
          {formatPrice(displayPrice)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <Button
          onClick={handleAddToCart}
          className="gap-2 w-full"
          disabled={isAdding || variation.stock <= 0}
        >
          {isAdding ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
}
