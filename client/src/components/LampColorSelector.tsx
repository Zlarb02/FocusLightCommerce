import { cn, getColorInfo } from "@/lib/utils";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleVariationSelect = (variation: ProductVariation) => {
    setSelectedValue(variation.variationValue);
    onVariationSelect(variation);
  };

  // Gestion du swipe sur mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = variations.findIndex((v) =>
        selectedVariationId
          ? selectedVariationId === v.id
          : selectedValue === v.variationValue
      );

      let nextIndex;
      if (isLeftSwipe) {
        nextIndex = (currentIndex + 1) % variations.length;
      } else {
        nextIndex =
          currentIndex === 0 ? variations.length - 1 : currentIndex - 1;
      }

      const nextVariation = variations[nextIndex];
      if (nextVariation) {
        handleVariationSelect(nextVariation);
      }
    }
  };

  const colorVariations = variations.filter(
    (variation) => variation.variationType === "color"
  );

  return (
    <div className={cn("flex justify-center", className)}>
      {isMobile ? (
        // Version mobile avec swipe et scroll horizontal
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide py-2 px-4 touch-pan-x"
          style={{ scrollSnapType: "x mandatory" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {colorVariations.map((variation) => {
            const colorInfo = getColorInfo(variation.variationValue);
            const isSelected = selectedVariationId
              ? selectedVariationId === variation.id
              : selectedValue === variation.variationValue;

            return (
              <button
                key={variation.id}
                className={cn(
                  "w-12 h-12 rounded-full border-2 border-white shadow-lg transition-all duration-300 flex-shrink-0",
                  "active:scale-95 touch-manipulation",
                  colorInfo.bgClass,
                  isSelected &&
                    "transform scale-125 shadow-xl ring-2 ring-gray-400 ring-offset-2"
                )}
                style={{ scrollSnapAlign: "center" }}
                onClick={() => handleVariationSelect(variation)}
                title={`${productName} en ${variation.variationValue}`}
                aria-label={`Sélectionner la couleur ${variation.variationValue}`}
                aria-pressed={isSelected}
              />
            );
          })}
        </div>
      ) : (
        // Version desktop normale
        <div className="flex space-x-3">
          {colorVariations.map((variation) => {
            const colorInfo = getColorInfo(variation.variationValue);
            const isSelected = selectedVariationId
              ? selectedVariationId === variation.id
              : selectedValue === variation.variationValue;

            return (
              <button
                key={variation.id}
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110",
                  colorInfo.bgClass,
                  isSelected &&
                    "transform scale-115 shadow-lg ring-2 ring-gray-300 ring-offset-1"
                )}
                onClick={() => handleVariationSelect(variation)}
                title={`${productName} en ${variation.variationValue}`}
                aria-label={`Sélectionner la couleur ${variation.variationValue}`}
                aria-pressed={isSelected}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
