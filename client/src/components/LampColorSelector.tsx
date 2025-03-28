import { cn, getColorInfo } from "@/lib/utils";
import { Product } from "@shared/schema";
import { useState } from "react";

interface LampColorSelectorProps {
  colors: Product[];
  initialColor?: string;
  onColorSelect: (product: Product) => void;
  selectedProductId?: number;
  className?: string;
}

export function LampColorSelector({
  colors,
  initialColor = "Blanc",
  onColorSelect,
  selectedProductId,
  className,
}: LampColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const handleColorSelect = (product: Product) => {
    setSelectedColor(product.color);
    onColorSelect(product);
  };

  return (
    <div className={cn("flex space-x-3", className)}>
      {colors.map((product) => {
        const colorInfo = getColorInfo(product.color);
        const isSelected = selectedProductId 
          ? selectedProductId === product.id 
          : selectedColor === product.color;
        
        return (
          <button
            key={product.id}
            className={cn(
              "w-8 h-8 rounded-full border-2 border-white shadow-md transition-transform",
              colorInfo.bgClass,
              isSelected && "transform scale-115 shadow-lg"
            )}
            onClick={() => handleColorSelect(product)}
            title={`Lampe FOCUS.01 en ${product.color}`}
            aria-label={`Sélectionner la couleur ${product.color}`}
            aria-pressed={isSelected}
          />
        );
      })}
    </div>
  );
}
