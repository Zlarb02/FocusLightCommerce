import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice, getColorInfo } from "@/lib/utils";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Check, Plus } from "lucide-react";
import { CartQuantityControl } from "@/components/CartQuantityControl";
import { ProductAddedIndicator } from "@/components/ProductAddedIndicator";

interface ProductCardProps {
  product: ProductWithVariations;
  variation: ProductVariation;
}

export function ProductCard({ product, variation }: ProductCardProps) {
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  // Vérifier si cette variation est dans le panier
  const isInCart = items.some((item) => item.product.id === variation.id);

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
    <Card className="h-full overflow-hidden hover:shadow-md transition relative">
      <div className="relative p-4 h-52 flex items-center justify-center bg-gray-50">
        <img
          src={variation.imageUrl}
          alt={`${product.name} - ${variation.variationValue}`}
          className="max-h-full object-contain transition-transform hover:scale-105"
        />

        {/* Indicateur produit ajouté - ne s'affiche que si la variation est dans le panier */}
        <ProductAddedIndicator productId={variation.id.toString()} />
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
        <CartQuantityControl
          product={product}
          variation={variation}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
