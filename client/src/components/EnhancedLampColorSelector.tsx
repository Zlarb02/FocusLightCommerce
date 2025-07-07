import { useState } from "react";
import { ProductVariation } from "@shared/schema";
import { cn, getColorInfo } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnhancedLampColorSelectorProps {
  variations: ProductVariation[];
  productName: string;
  onVariationSelect: (variation: ProductVariation) => void;
  selectedVariationId?: number;
  className?: string;
}

export function EnhancedLampColorSelector({
  variations,
  productName,
  onVariationSelect,
  selectedVariationId,
  className,
}: EnhancedLampColorSelectorProps) {
  const isMobile = useIsMobile();

  const colorVariations = variations.filter(
    (variation) => variation.variationType === "color"
  );

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20">
        <div
          className={cn(
            "flex gap-3",
            isMobile ? "flex-wrap justify-center" : "flex-row"
          )}
        >
          {colorVariations.map((variation) => {
            const colorInfo = getColorInfo(variation.variationValue);
            const isSelected = selectedVariationId === variation.id;
            const hasMultipleImages =
              variation.images && variation.images.length > 1;

            return (
              <div key={variation.id} className="relative group">
                <button
                  className={cn(
                    "relative w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all duration-300",
                    "border-2 shadow-md hover:shadow-lg",
                    "hover:scale-110 active:scale-95",
                    colorInfo.bgClass,
                    isSelected
                      ? "border-gray-800 dark:border-white scale-110 shadow-xl ring-2 ring-blue-500/50"
                      : "border-white/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500"
                  )}
                  onClick={() => onVariationSelect(variation)}
                  title={`${productName} en ${variation.variationValue}`}
                  aria-label={`Sélectionner la couleur ${variation.variationValue}`}
                  aria-pressed={isSelected}
                >
                  {/* Image preview pour cette couleur */}
                  {variation.images && variation.images[0] && (
                    <div className="absolute inset-1 rounded-lg overflow-hidden">
                      <img
                        src={variation.images[0].url}
                        alt={`${productName} ${variation.variationValue}`}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}

                  {/* Indicator pour multiple images */}
                  {hasMultipleImages && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {variation.images!.length}
                    </div>
                  )}

                  {/* Checkmark pour la sélection */}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>

                {/* Label de couleur */}
                <div
                  className={cn(
                    "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium",
                    "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    "pointer-events-none whitespace-nowrap",
                    "text-gray-800 dark:text-gray-200"
                  )}
                >
                  {variation.variationValue}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions subtiles */}
        <div className="text-center mt-3">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Cliquez pour changer de couleur
          </p>
        </div>
      </div>
    </div>
  );
}
