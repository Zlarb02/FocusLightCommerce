import { useState } from "react";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { formatPrice, getSliderImages, translateColor } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductQuantityCounter } from "./ProductQuantityCounter";

interface ECommerceProductCardProps {
  product: ProductWithVariations;
  variation: ProductVariation;
  className?: string;
  currentImageIndex?: number;
  setCurrentImageIndex?: (index: number) => void;
}

export function ECommerceProductCard(props: ECommerceProductCardProps) {
  const {
    product,
    variation,
    className = "",
    currentImageIndex: controlledImageIndex,
    setCurrentImageIndex: setControlledImageIndex,
  } = props;
  // Si on reçoit un index contrôlé, on l'utilise, sinon on gère localement
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const currentImageIndex = controlledImageIndex ?? uncontrolledIndex;
  const setCurrentImageIndex = setControlledImageIndex ?? setUncontrolledIndex;
  const [isHovered, setIsHovered] = useState(false);
  // Suppression de la modal d'image ici, gérée dans ShopFocus
  const { t } = useLanguage();

  // Utiliser les images du slider (excluant la première image)
  const sliderImages = getSliderImages(variation.images || []);
  // Si il y a des images de slider, les utiliser, sinon utiliser l'image principale par défaut
  const images =
    sliderImages.length > 0 ? sliderImages : variation.images || [];
  const hasMultipleImages = images.length > 1;

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div
      className={`group relative bg-white dark:bg-[#181c2a] border border-gray-200 dark:border-[#22305a] hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-[#1e2538]">
        {images.length > 0 && (
          <img
            src={images[currentImageIndex]?.url || ""}
            alt={`${product.name} - ${variation.variationValue}`}
            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Image counter for multiple images - Design amélioré */}
        {hasMultipleImages && (
          <div className="absolute top-2 left-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-medium shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center min-w-[44px]">
            <span className="leading-none">
              {currentImageIndex + 1}/{images.length}
            </span>
          </div>
        )}
      </div>

      {/* Image Thumbnails - Style Amazon/AliExpress */}
      {hasMultipleImages && (
        <div className="p-3 border-t border-gray-100 dark:border-[#22305a]">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleImageSelect(index);
                }}
                className={`flex-shrink-0 w-12 h-12 rounded border-2 image-thumbnail ${
                  index === currentImageIndex
                    ? "border-primary dark:border-[#2d437a] shadow-md selected"
                    : "border-gray-200 dark:border-[#22305a] hover:border-gray-300 dark:hover:border-[#2d437a]"
                }`}
                aria-label={`Voir image ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt={`${product.name} - Vue ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2 dark:text-gray-100 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 capitalize">
          {t("product.color")}: {translateColor(variation.variationValue, t)}
        </p>

        {/* Price and Counter Section */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-primary dark:text-[#7eaaff]">
            {formatPrice(variation.price || product.price)}
          </span>
          {hasMultipleImages && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {images.length} {t("product.images")}
            </span>
          )}
        </div>

        {/* Product Quantity Counter */}
        <div className="flex justify-center">
          <ProductQuantityCounter
            productId={variation.id}
            variation={variation}
            productName={product.name}
            productDescription={product.description}
            basePrice={product.price}
            className="w-full max-w-[200px]"
          />
        </div>
      </div>
    </div>
  );
}
