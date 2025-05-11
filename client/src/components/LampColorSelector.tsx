import { cn, getColorInfo } from "@/lib/utils";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { useState } from "react";

interface LampColorSelectorProps {
  variations: ProductVariation[];
  productName: string;
  initialVariationValue?: string;
  onVariationSelect: (variation: ProductVariation) => void;
  selectedVariationId?: number;
  className?: string;
}

export function LampColorSelector({
  variations,
  productName,
  initialVariationValue = "Blanc",
  onVariationSelect,
  selectedVariationId,
  className,
}: LampColorSelectorProps) {
  const [selectedValue, setSelectedValue] = useState(initialVariationValue);

  const handleVariationSelect = (variation: ProductVariation) => {
    setSelectedValue(variation.variationValue);
    onVariationSelect(variation);
  };

  return (
    <div className={cn("flex space-x-3", className)}>
      {variations
        .filter((variation) => variation.variationType === "color")
        .map((variation) => {
          const colorInfo = getColorInfo(variation.variationValue);
          const isSelected = selectedVariationId
            ? selectedVariationId === variation.id
            : selectedValue === variation.variationValue;

          return (
            <button
              key={variation.id}
              className={cn(
                "w-8 h-8 rounded-full border-2 border-white shadow-md transition-transform",
                colorInfo.bgClass,
                isSelected && "transform scale-115 shadow-lg"
              )}
              onClick={() => handleVariationSelect(variation)}
              title={`${productName} en ${variation.variationValue}`}
              aria-label={`Sélectionner la couleur ${variation.variationValue}`}
              aria-pressed={isSelected}
            />
          );
        })}
    </div>
  );
}
