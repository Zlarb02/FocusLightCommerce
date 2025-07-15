import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice, cn, getColorInfo } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Package,
  Truck,
  Star,
  Heart,
  ImageIcon,
  Palette,
} from "lucide-react";
import { ProductVariation } from "@shared/schema";

interface EditableOrderSummaryProps {
  className?: string;
  showTitle?: boolean;
}

interface ProductVariations {
  [productId: number]: ProductVariation[];
}

export const EditableOrderSummary: React.FC<EditableOrderSummaryProps> = ({
  className = "",
  showTitle = true,
}) => {
  const { t } = useLanguage();
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
    addItem,
  } = useCart();

  const [productVariations, setProductVariations] = useState<ProductVariations>(
    {}
  );
  const [loadingVariations, setLoadingVariations] = useState<Set<number>>(
    new Set()
  );

  // Fonction pour récupérer les variantes d'un produit
  const fetchProductVariations = async (productId: number) => {
    if (productVariations[productId] || loadingVariations.has(productId)) {
      return;
    }

    setLoadingVariations((prev) => new Set(prev).add(productId));

    try {
      const apiUrl = (window as any).ENV?.API_URL;
      const response = await fetch(`${apiUrl}/api/products/${productId}`);
      if (response.ok) {
        const productData = await response.json();
        console.log(
          `📦 Variations pour le produit ${productId}:`,
          productData.variations
        );
        setProductVariations((prev) => ({
          ...prev,
          [productId]: productData.variations || [],
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des variantes:", error);
    } finally {
      setLoadingVariations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Récupérer les variantes pour tous les produits dans le panier
  useEffect(() => {
    const uniqueProductIds = [
      ...new Set(items.map((item) => item.product.productId)),
    ];
    console.log("🛒 Items dans le panier:", items);
    console.log("🔍 ProductIds uniques:", uniqueProductIds);
    uniqueProductIds.forEach((productId) => {
      fetchProductVariations(productId);
    });
  }, [items]);

  // Fonction pour gérer le changement de quantité
  const handleQuantityChange = (variationId: number, change: number) => {
    const item = items.find((item) => item.product.id === variationId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(variationId, newQuantity);
    }
  };

  // Fonction pour supprimer un article
  const handleRemoveItem = (variationId: number) => {
    removeItem(variationId);
  };

  // Fonction pour changer de variation avec fusion intelligente
  const handleVariationChange = (
    currentVariationId: number,
    newVariationId: number
  ) => {
    const currentItem = items.find(
      (item) => item.product.id === currentVariationId
    );
    if (!currentItem) return;

    const currentProductId = currentItem.product.productId;
    const availableVariations = productVariations[currentProductId] || [];
    const newVariation = availableVariations.find(
      (v) => v.id === newVariationId
    );

    if (!newVariation) return;

    // Vérifier si la nouvelle variation existe déjà dans le panier
    const existingItemWithNewVariation = items.find(
      (item) => item.product.id === newVariationId
    );

    if (existingItemWithNewVariation) {
      // Fusion : ajouter la quantité à l'item existant et supprimer l'ancien
      const newQuantity =
        existingItemWithNewVariation.quantity + currentItem.quantity;
      updateQuantity(newVariationId, newQuantity);
      removeItem(currentVariationId);
    } else {
      // Remplacement : créer un nouveau produit avec la nouvelle variation
      const newProductWithVariation = {
        ...newVariation,
        productName: currentItem.product.productName,
        productDescription: currentItem.product.productDescription,
        basePrice: currentItem.product.basePrice,
      };

      // Retirer l'ancien article et ajouter le nouveau avec la même quantité
      const quantity = currentItem.quantity;
      removeItem(currentVariationId);

      // Ajouter le nouveau produit avec la quantité appropriée
      for (let i = 0; i < quantity; i++) {
        addItem(newProductWithVariation);
      }
    }
  };

  if (items.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t("cart.empty")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} overflow-hidden`}>
      {showTitle && (
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {t("checkout.confirmation.orderDetails")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                {getTotalItems()}{" "}
                {getTotalItems() > 1
                  ? t("checkout.cart.items_plural")
                  : t("checkout.cart.items")}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Image produit */}
                  <div className="relative flex-shrink-0">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.productName}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {item.product.variationValue && (
                      <div className="absolute -top-2 -right-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-200 dark:border-blue-700">
                        {item.product.variationValue}
                      </div>
                    )}
                  </div>

                  {/* Informations produit */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.product.productName}
                    </h4>

                    {/* Affichage de la variation actuelle */}
                    {item.product.variationType &&
                      item.product.variationValue && (
                        <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                          {item.product.variationType === "color"
                            ? t("common.color")
                            : item.product.variationType}
                          :{" "}
                          {item.product.variationType === "color"
                            ? item.product.variationValue // Vous pouvez ajouter translateColor ici si nécessaire
                            : item.product.variationValue}
                        </p>
                      )}

                    {/* Sélecteur de couleur minimaliste - Style ShopFocus */}
                    {(() => {
                      const hasColorVariation =
                        item.product.variationType === "color";
                      const hasVariations =
                        productVariations[item.product.productId];
                      const colorVariations = hasVariations
                        ? productVariations[item.product.productId].filter(
                            (v) => v.variationType === "color"
                          )
                        : [];
                      const hasMultipleColors = colorVariations.length > 1;

                      console.log(
                        `🎨 Sélecteur couleur pour ${item.product.productName}:`,
                        {
                          hasColorVariation,
                          hasVariations: !!hasVariations,
                          colorVariations: colorVariations.length,
                          hasMultipleColors,
                          productId: item.product.productId,
                          variationId: item.product.id,
                          allVariations:
                            productVariations[item.product.productId],
                        }
                      );

                      return (
                        hasColorVariation &&
                        hasVariations &&
                        hasMultipleColors && (
                          <div className="flex items-center gap-2 mt-3">
                            {colorVariations.map((variation) => {
                              const colorInfo = getColorInfo(
                                variation.variationValue
                              );
                              const isSelected =
                                variation.id === item.product.id;
                              const primaryImage =
                                variation.images && variation.images.length > 0
                                  ? variation.images[0]
                                  : undefined;

                              return (
                                <button
                                  key={variation.id}
                                  onClick={() =>
                                    handleVariationChange(
                                      item.product.id,
                                      variation.id
                                    )
                                  }
                                  disabled={isSelected}
                                  className={`group relative w-10 h-10 transition-all duration-300 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 ${
                                    isSelected
                                      ? "scale-105 shadow-lg border-2 border-gray-300 dark:border-gray-500"
                                      : "hover:scale-105 shadow-md hover:shadow-lg"
                                  } ${
                                    // Palette plus douce et premium pour les couleurs
                                    variation.variationValue === "Bleu"
                                      ? "bg-[#b7c7e6] dark:bg-[#3a4a6b]"
                                      : variation.variationValue === "Rouge"
                                      ? "bg-[#e6b7b7] dark:bg-[#6b3a3a]"
                                      : variation.variationValue === "Orange"
                                      ? "bg-[#e6ceb7] dark:bg-[#6b4a3a]"
                                      : colorInfo?.bgClass ||
                                        "bg-gray-50 dark:bg-gray-800"
                                  }`}
                                  title={variation.variationValue}
                                  aria-label={`${t("cart.colorVariation")}: ${
                                    variation.variationValue
                                  }`}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                  {primaryImage ? (
                                    <img
                                      src={primaryImage.url}
                                      alt={`${item.product.productName} - ${variation.variationValue}`}
                                      className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                                      style={{
                                        objectPosition: "75% 65%",
                                        transform:
                                          "translate(2px, 1px) scale(1.04)",
                                        filter: isSelected
                                          ? "drop-shadow(0 2px 8px rgba(0,0,0,0.10)) brightness(1.08)"
                                          : "brightness(0.98)",
                                      }}
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                                      {variation.variationValue?.substring(
                                        0,
                                        1
                                      )}
                                    </div>
                                  )}
                                  {isSelected && (
                                    <div
                                      className="absolute left-0.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-md border border-white dark:border-gray-900"
                                      style={{
                                        background: "#18181b",
                                        boxShadow:
                                          "0 2px 8px 0 rgba(0,0,0,0.10), 0 0.5px 1.5px 0 rgba(0,0,0,0.08)",
                                      }}
                                    ></div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )
                      );
                    })()}

                    {item.product.productDescription && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                        {item.product.productDescription}
                      </p>
                    )}

                    {/* Prix unitaire */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatPrice(
                          item.product.price || item.product.basePrice
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Contrôles quantité et actions */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Prix total pour cet article */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatPrice(
                          (item.product.price || item.product.basePrice) *
                            item.quantity
                        )}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500">
                          {item.quantity} ×{" "}
                          {formatPrice(
                            item.product.price || item.product.basePrice
                          )}
                        </p>
                      )}
                    </div>

                    {/* Contrôles de quantité */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.product.id, -1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>

                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.product.id, 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Résumé des coûts */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("cart.subtotal")}
            </span>
            <span className="font-medium">{formatPrice(getTotalPrice())}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              {t("cart.shipping")}
            </span>
            <span className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
              <Star className="w-3 h-3" />
              {t("cart.freeShipping")}
            </span>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("cart.total")}
              </span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>

          {/* Badge livraison gratuite */}
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                <Heart className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {t("checkout.freeShipping")}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {t("checkout.delivery.free.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableOrderSummary;
