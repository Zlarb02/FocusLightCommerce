import { useState, useEffect, useRef } from "react";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { ColorTransition } from "./ColorTransition";
import { ProductAddedIndicator } from "./ProductAddedIndicator";
import { getColorInfo, getSliderImages } from "@/lib/utils";

interface EnhancedHeroProductDisplayProps {
  product: ProductWithVariations;
  selectedVariation: ProductVariation;
  onVariationSelect: (variation: ProductVariation) => void;
  variations: ProductVariation[];
  isProductAdded: (id: string) => boolean;
  className?: string;
}

export function EnhancedHeroProductDisplay({
  product,
  selectedVariation,
  onVariationSelect,
  variations,
  isProductAdded,
  className = "",
}: EnhancedHeroProductDisplayProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  // Maquette : image fixe. Le défilement auto reste disponible mais éteint par défaut.
  const [isAutoSlideEnabled, setIsAutoSlideEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Utiliser les images du slider (excluant la première image)
  const sliderImages = getSliderImages(selectedVariation.images || []);

  // Si il y a des images de slider, les utiliser, sinon utiliser la première image de la variation
  const images =
    sliderImages.length > 0
      ? sliderImages
      : selectedVariation.images && selectedVariation.images.length > 0
      ? [selectedVariation.images[0]]
      : [];
  const hasMultipleImages = images.length > 1;

  // Auto-slide functionality
  useEffect(() => {
    if (hasMultipleImages && isAutoSlideEnabled && !isImageHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 3000); // Change image every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasMultipleImages, isAutoSlideEnabled, isImageHovered, images.length]);

  // Reset auto-slide when variation changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedVariation.id]);

  // Preload images for better user experience
  useEffect(() => {
    if (images.length > 1) {
      images.forEach((image, index) => {
        if (index !== currentImageIndex) {
          const img = new Image();
          img.src = image.url;
        }
      });
    }
  }, [images, currentImageIndex]);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleImageNavigation = (direction: "prev" | "next") => {
    // Pause auto-slide when user manually navigates
    setIsAutoSlideEnabled(false);

    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoSlideEnabled(false); // Pause auto-slide when user clicks on dots
  };

  const handleVariationChange = (variation: ProductVariation) => {
    setCurrentImageIndex(0); // Reset to first image when changing color
    onVariationSelect(variation);
  };

  const handleMouseEnter = () => {
    setIsImageHovered(true);
  };

  const handleMouseLeave = () => {
    setIsImageHovered(false);
  };

  return (
    <div
      className={`hero-product-display mobile-optimized relative flex w-full max-w-[646px] flex-col ${className}`}
    >
      {/* Zone des contrôles en haut - Position absolue fixe */}
      <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 md:px-8 z-40">
        {/* Compteur d'images à gauche */}
        {hasMultipleImages && (
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center min-w-[50px]">
            <span className="leading-none">
              {currentImageIndex + 1}/{images.length}
            </span>
          </div>
        )}

        {/* Spacer pour pousser la coche à droite */}
        <div className="flex-1"></div>

        {/* Indicateur panier à droite */}
        <ProductAddedIndicator
          productId={selectedVariation.id.toString()}
          show={isProductAdded(selectedVariation.id.toString())}
          allowRemove={true}
        />
      </div>

      {/* Zone des points de navigation - Position absolue fixe */}
      {hasMultipleImages && images.length <= 5 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50 z-40">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? "bg-primary dark:bg-blue-400 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Voir image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Zone centrale - Image avec navigation. Cadre au ratio maquette (646×806). */}
      <div className="relative mb-4 flex aspect-[646/806] w-full items-center justify-center overflow-hidden">
        <ColorTransition
          colorKey={selectedVariation.variationValue}
          className="w-full h-full flex items-center justify-center"
        >
          <div
            className="relative w-full h-full flex items-center justify-center group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Container de l'image : la photo remplit le cadre, sans déformation */}
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={images[currentImageIndex]?.url || ""}
                alt={`${product.name} coloris ${selectedVariation.variationValue}`}
                className="mobile-optimized z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            </div>

            {/* Flèches de navigation */}
            {hasMultipleImages && isImageHovered && (
              <>
                <button
                  onClick={() => handleImageNavigation("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all z-30 group/btn"
                  aria-label="Image précédente"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-700 dark:text-gray-300 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleImageNavigation("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all z-30 group/btn"
                  aria-label="Image suivante"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-700 dark:text-gray-300 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </ColorTransition>
      </div>

    </div>
  );
}
