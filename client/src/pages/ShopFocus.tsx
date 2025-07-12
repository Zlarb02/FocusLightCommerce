import { useEffect, useState } from "react";
import { X, Maximize2, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { LampColorSelector } from "@/components/LampColorSelector";
import { EnhancedHeroProductDisplay } from "@/components/EnhancedHeroProductDisplay";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { ECommerceProductCard } from "@/components/ECommerceProductCard";
import { Button } from "@/components/ui/button";
import { AnimatedAddToCartButton } from "@/components/AnimatedAddToCartButton";
import { ToastContainer } from "@/components/EnhancedToast";
import { ColorTransition } from "@/components/ColorTransition";
import "./ShopFocus-dark-contrast.css";
import {
  ProductAddedIndicator,
  useProductAddedIndicators,
} from "@/components/ProductAddedIndicator";
import { useEnhancedToast } from "@/hooks/useEnhancedToast";
import { Leaf, Lightbulb, ShoppingBag, Trees } from "lucide-react";
import { formatPrice, getColorInfo, getSliderImages } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { LampOnOffSwitch } from "@/components/LampOnOffSwitch";

// Ordre pour le sélecteur de la section hero: bleu, rouge, orange, blanc
const heroOrderMap: Record<string, number> = {
  Bleu: 0,
  Rouge: 1,
  Orange: 2,
  Blanc: 3,
};

// Ordre pour la section "Les Coloris": orange, bleu, blanc, rouge
const colorSectionOrderMap: Record<string, number> = {
  Orange: 0,
  Bleu: 1,
  Blanc: 2,
  Rouge: 3,
};

// Fonction pour trier les variations selon l'ordre souhaité pour le sélecteur de couleur
const sortVariationsForHero = (
  variations: ProductVariation[]
): ProductVariation[] => {
  return [...variations].sort((a, b) => {
    const orderA = heroOrderMap[a.variationValue] ?? 999;
    const orderB = heroOrderMap[b.variationValue] ?? 999;
    return orderA - orderB;
  });
};

// Fonction pour trier les variations selon l'ordre souhaité pour la section "Les Coloris"
const sortVariationsForColorSection = (
  variations: ProductVariation[]
): ProductVariation[] => {
  return [...variations].sort((a, b) => {
    const orderA = colorSectionOrderMap[a.variationValue] ?? 999;
    const orderB = colorSectionOrderMap[b.variationValue] ?? 999;
    return orderA - orderB;
  });
};

export default function ShopFocus() {
  // Pour la modal d'agrandissement d'image (avec navigation)
  const [modalImage, setModalImage] = useState<{
    images: string[];
    index: number;
    fromHero?: boolean;
  } | null>(null);
  // Pour suivre l'image courante de chaque variation (clé: variation.id)
  const [currentImageIndexes, setCurrentImageIndexes] = useState<
    Record<number, number>
  >({});
  const { data: allProducts = [] } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
  });

  // Filtrer uniquement les produits qui contiennent "focus" dans leur nom (insensible à la casse)
  const products = allProducts.filter((product) =>
    product.name.toLowerCase().includes("focus")
  );

  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithVariations | null>(null);
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { addToast, toasts, removeToast } = useEnhancedToast();
  const { showIndicator, isProductAdded } = useProductAddedIndicators();
  const { t } = useLanguage();

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      // Sélectionner le premier produit par défaut (lampe)
      const defaultProduct = products[0];
      setSelectedProduct(defaultProduct);

      // Sélectionner la variation bleue par défaut ou la première disponible
      if (defaultProduct.variations && defaultProduct.variations.length > 0) {
        const blueVariation = defaultProduct.variations.find(
          (v) => v.variationValue === "Bleu"
        );
        setSelectedVariation(blueVariation || defaultProduct.variations[0]);
      }
    }
  }, [products, selectedProduct]);

  const handleVariationSelect = (variation: ProductVariation) => {
    setSelectedVariation(variation);
  };

  const handleAddToCart = () => {
    if (selectedProduct && selectedVariation) {
      // Créer une représentation complète du produit avec sa variation
      const productWithVariation = {
        ...selectedVariation,
        productName: selectedProduct.name,
        productDescription: selectedProduct.description,
        basePrice: selectedProduct.price,
      };

      addItem(productWithVariation);

      // Afficher l'indicateur sur le produit
      showIndicator(selectedVariation.id.toString());

      // Toast amélioré avec image du produit
      addToast({
        title: t("focus.addedToCart"),
        description: `${selectedProduct.name} coloris ${selectedVariation.variationValue}`,
        type: "cart",
        duration: 5000,
        productImage:
          selectedVariation.images && selectedVariation.images.length > 0
            ? selectedVariation.images[0].url
            : "",
        productName: `${selectedProduct.name} - ${selectedVariation.variationValue}`,
        quantity: 1,
      });
    }
  };

  // Obtenez toutes les variations de tous les produits
  const allVariations = products.flatMap((p) => p.variations || []);

  // Variations triées pour le sélecteur de couleur dans la section hero
  const heroVariations = selectedProduct?.variations
    ? sortVariationsForHero(selectedProduct.variations)
    : [];

  // Variations triées pour la section "Les Coloris"
  const colorSectionVariations =
    allVariations.length > 0
      ? sortVariationsForColorSection(allVariations)
      : [];

  return (
    <Layout>
      {/* Desktop margin wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sélecteur de couleur compact - Visible uniquement sur mobile au-dessus du hero */}
        <section
          className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30"
          style={{ paddingTop: "12px", paddingBottom: "12px" }}
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                {t("shop.focus.colorsAvailable")} :
              </h3>
              <div className="flex items-center gap-3 justify-center overflow-x-auto pb-2 px-3 pt-1">
                {heroVariations.length > 0
                  ? heroVariations.map((variation) => {
                      const colorInfo = getColorInfo(variation.variationValue);
                      const isSelected = selectedVariation?.id === variation.id;
                      const primaryImage =
                        variation.images && variation.images.length > 0
                          ? variation.images[0]
                          : undefined;

                      return (
                        <button
                          key={variation.id}
                          onClick={() => handleVariationSelect(variation)}
                          className={`group relative w-12 h-12 transition-all duration-300 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 ${
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
                          aria-label={`Couleur ${variation.variationValue}`}
                          title={variation.variationValue}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                          {primaryImage ? (
                            <img
                              src={primaryImage.url}
                              alt={`${selectedProduct?.name} - ${variation.variationValue}`}
                              className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
                              style={{
                                objectPosition: "75% 65%",
                                transform: "translate(8px, 2px) scale(1.04)",
                                filter: isSelected
                                  ? "drop-shadow(0 4px 16px rgba(0,0,0,0.10)) brightness(1.08)"
                                  : "brightness(0.98)",
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                              {variation.variationValue?.substring(0, 1)}
                            </div>
                          )}
                          {isSelected && (
                            <div
                              className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md border border-white dark:border-gray-900"
                              style={{
                                background: "#18181b",
                                boxShadow:
                                  "0 2px 8px 0 rgba(0,0,0,0.10), 0 0.5px 1.5px 0 rgba(0,0,0,0.08)",
                              }}
                            ></div>
                          )}
                        </button>
                      );
                    })
                  : null}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section - Épuré et minimaliste avec optimisations mobile */}
        <section className="py-2 md:py-8 lg:py-10 animate fade-in-up">
          {/* Marge fixe réduite pour éviter le header seulement sur desktop */}
          <div className="hidden md:block md:mt-8 lg:mt-10"></div>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 md:order-1 z-10 px-4 md:px-0">
              <h1
                className="font-heading text-3xl md:text-6xl mb-4 md:mb-6 tracking-tight text-center md:text-left"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("focus.title")}
              </h1>
              <p className="mb-6 md:mb-8 text-gray-600 max-w-md text-base md:text-lg leading-relaxed text-center md:text-left mx-auto md:mx-0 dark:text-white dark:font-medium">
                {t("focus.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4 md:gap-6 mb-6 md:mb-8 justify-center md:justify-start">
                <div className="flex items-center text-xs md:text-sm">
                  <Leaf className="text-green-500 mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span>{t("focus.features.eco")}</span>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                  <Trees className="text-amber-700 mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span>{t("focus.features.wood")}</span>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                  <Lightbulb className="text-yellow-400 mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span>{t("focus.features.led")}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8 px-4 md:px-0">
                <AnimatedAddToCartButton
                  onClick={handleAddToCart}
                  disabled={!selectedProduct}
                  price={
                    selectedProduct ? formatPrice(selectedProduct.price) : ""
                  }
                  className="w-full md:w-auto mobile-tap-highlight bg-black text-white dark:bg-[#3a5fcf] dark:text-white dark:hover:bg-[#5477e6] dark:focus:bg-[#5477e6] transition-all"
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("product-details")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full md:w-auto rounded-none border-black text-black hover:bg-black hover:text-white dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 transition-all hover:translate-y-[-2px] mobile-tap-highlight"
                  style={{ fontFamily: "var(--font-buttons)" }}
                >
                  {t("product.viewDetails")}
                </Button>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-500 text-xs md:text-sm">
                <span className="inline-block border-l-2 border-gray-300 pl-3">
                  {t("focus.freeShipping")}
                </span>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex justify-center items-center px-4 md:px-0">
              {selectedProduct && selectedVariation && (
                <div className="relative">
                  <EnhancedHeroProductDisplay
                    product={selectedProduct}
                    selectedVariation={selectedVariation}
                    onVariationSelect={handleVariationSelect}
                    variations={heroVariations}
                    isProductAdded={isProductAdded}
                  />
                  {/* Bouton d'agrandissement pour le slider hero */}
                  {(() => {
                    const sliderImages =
                      selectedVariation.images &&
                      selectedVariation.images.length > 0
                        ? getSliderImages(selectedVariation.images)
                        : [];
                    const images =
                      sliderImages.length > 0
                        ? sliderImages
                        : selectedVariation.images || [];
                    return images.length > 0 ? (
                      <button
                        type="button"
                        className="absolute top-2 right-2 z-20 bg-white/80 dark:bg-gray-900/80 rounded-full p-1 shadow hover:bg-white dark:hover:bg-gray-800 transition"
                        title="Agrandir l'image"
                        onClick={() =>
                          setModalImage({
                            images: images.map((img) => img.url),
                            index: 0,
                            fromHero: true,
                          })
                        }
                      >
                        <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                      </button>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SÉLECTEUR DE COULEUR - Design moderne et minimaliste - Masqué sur mobile */}
        <section className="hidden md:block py-3 md:py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-y border-gray-200/50 dark:border-gray-700/50 animate fade-in">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-light text-gray-900 dark:text-gray-100 mb-1">
                  {t("shop.focus.colorsAvailable")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {heroVariations.length} variation
                  {heroVariations.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-center">
                {heroVariations.length > 0 ? (
                  heroVariations.map((variation) => {
                    const colorInfo = getColorInfo(variation.variationValue);
                    const isSelected = selectedVariation?.id === variation.id;
                    const primaryImage =
                      variation.images && variation.images.length > 0
                        ? variation.images[0]
                        : undefined;

                    // Palette premium harmonisée (bleu, rouge, orange, blanc)
                    let bgColor =
                      colorInfo?.bgClass || "bg-gray-50 dark:bg-gray-800";
                    if (variation.variationValue === "Bleu") {
                      bgColor = "bg-[#b7c7e6] dark:bg-[#3a4a6b]";
                    } else if (variation.variationValue === "Rouge") {
                      bgColor = "bg-[#e6b7b7] dark:bg-[#6b3a3a]";
                    } else if (variation.variationValue === "Orange") {
                      bgColor = "bg-[#e6ceb7] dark:bg-[#6b4a3a]";
                    }

                    return (
                      <button
                        key={variation.id}
                        onClick={() => handleVariationSelect(variation)}
                        className={`group relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 transition-all duration-300 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 ${
                          isSelected
                            ? "scale-105 shadow-lg border-2 border-gray-300 dark:border-gray-500"
                            : "hover:scale-105 shadow-md hover:shadow-lg"
                        } ${bgColor}`}
                        aria-label={`Couleur ${variation.variationValue}`}
                        title={variation.variationValue}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={`${selectedProduct?.name} - ${variation.variationValue}`}
                            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                            style={{
                              objectPosition: "75% 65%",
                              transform: "translate(12px, 4px) scale(1.04)",
                              filter: isSelected
                                ? "drop-shadow(0 4px 16px rgba(0,0,0,0.10)) brightness(1.08)"
                                : "brightness(0.98)",
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                            {variation.variationValue?.substring(0, 2)}
                          </div>
                        )}
                        {isSelected && (
                          <div
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-md border border-white dark:border-gray-900"
                            style={{
                              background: "#18181b",
                              boxShadow:
                                "0 2px 8px 0 rgba(0,0,0,0.10), 0 0.5px 1.5px 0 rgba(0,0,0,0.08)",
                            }}
                          ></div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Aucune variation disponible
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Image d'illustration supplémentaire - Thème adaptatif */}
        <section className="py-16 animate fade-in">
          <div className="max-w-4xl mx-auto">
            {/* Image pour le thème clair */}
            <img
              src="https://www.alto-lille.fr/uploads/a6fb36f6-9a3a-48c4-ac59-5fe29be8dbd5.jpeg"
              alt="FOCUS.01 - Ambiance et utilisation"
              className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-lg shadow-lg block dark:hidden"
            />
            {/* Image pour le thème sombre */}
            <img
              src="https://www.alto-lille.fr/uploads/6ca98d66-62d6-4d50-9fa9-253eeae6c89e.jpeg"
              alt="FOCUS.01 - Vision d'ensemble"
              className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-lg shadow-lg hidden dark:block"
            />
          </div>
        </section>

        {/* Switch on/off pour "Voir les lampes allumées/éteintes" */}
        <div className="w-full flex justify-center mt-4">
          <LampOnOffSwitch />
        </div>

        {/* Product Details Section - Style plus minimaliste */}
        <section id="product-details" className="py-20 animate fade-in">
          <div className="container mx-auto max-w-5xl">
            <h2
              className="font-heading text-3xl md:text-4xl mb-16 text-center dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("focus.conceptDetails")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate fade-in-right delay-1">
                <div className="w-12 h-12 bg-primary/5 dark:bg-blue-400/10 flex items-center justify-center mb-4">
                  <Leaf className="text-[var(--color-text)] dark:text-blue-400 h-6 w-6" />
                </div>
                <h3
                  className="font-heading text-xl mb-3 dark:text-gray-100"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("focus.sustainableMaterials")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("focus.sustainableMaterials.text")}
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate fade-in-up delay-2">
                <div className="w-12 h-12 bg-primary/5 dark:bg-blue-400/10 flex items-center justify-center mb-4">
                  <Lightbulb className="text-[var(--color-text)] dark:text-blue-400 h-6 w-6" />
                </div>
                <h3
                  className="font-heading text-xl mb-3 dark:text-gray-100"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("focus.lighting.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("focus.lighting.text")}
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate fade-in-left delay-3">
                <div className="w-12 h-12 bg-primary/5 dark:bg-blue-400/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[var(--color-text)] dark:text-blue-400 h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    <path d="M9 17l-2-2" />
                  </svg>
                </div>
                <h3
                  className="font-heading text-xl mb-3 dark:text-gray-100"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("focus.artisanalCrafting")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("focus.artisanalCrafting.text")}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/2 animate fade-in-right delay-4 flex flex-col items-center">
                {/* Image pour le thème clair */}
                <img
                  src="https://www.alto-lille.fr/uploads/f0d658a0-e71f-462d-9210-31b276408bdd.jpeg"
                  alt="FOCUS.01 - Caractéristiques et détails"
                  className="w-full max-h-[500px] object-contain block dark:hidden mt-8"
                />
                {/* Image pour le thème sombre */}
                <img
                  src="https://www.alto-lille.fr/uploads/29ce9490-1000-4d95-8d92-cd5191e15b80.jpeg"
                  alt="FOCUS.01 - Caractéristiques et détails (sombre)"
                  className="w-full max-h-[500px] object-contain hidden dark:block mt-8"
                />
              </div>
              <div className="md:w-1/2 animate fade-in-left delay-4">
                <h3
                  className="font-heading text-2xl mb-6 dark:text-gray-100"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("product.specifications")}
                </h3>
                <ul className="space-y-6 mb-8">
                  <li className="flex items-start">
                    <span className="bg-primary/5 dark:bg-blue-400/10 text-[var(--color-text)] dark:text-blue-400 p-1 mr-4 mt-1">
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium block mb-1 dark:text-gray-100">
                        {t("product.dimensions")}
                      </span>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t("focus.dimensions.text")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/5 dark:bg-blue-400/10 text-[var(--color-text)] dark:text-blue-400 p-1 mr-4 mt-1">
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium block mb-1 dark:text-gray-100">
                        {t("product.materials")}
                      </span>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t("focus.materials.text")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/5 dark:bg-blue-400/10 text-[var(--color-text)] dark:text-blue-400 p-1 mr-4 mt-1">
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium block mb-1 dark:text-gray-100">
                        {t("focus.lighting.label")}
                      </span>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t("focus.lighting.details")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/5 dark:bg-blue-400/10 text-[var(--color-text)] dark:text-blue-400 p-1 mr-4 mt-1">
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium block mb-1 dark:text-gray-100">
                        {t("product.orientation")}
                      </span>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t("focus.orientation.text")}
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <svg
                      className="text-green-600 dark:text-green-400 mr-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="dark:text-gray-300">
                      {t("focus.warranty2years")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="text-orange-600 dark:text-orange-400 mr-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <span className="dark:text-gray-300">
                      {t("focus.features.packaging")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Options Section - Design épuré */}
        <section className="py-20 container mx-auto animate fade-in">
          <h2
            className="font-heading text-3xl md:text-4xl text-center mb-6"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("shop.focus.colors")}
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16 dark:text-white dark:font-medium">
            {t("focus.colorSelection")}
          </p>

          <div className="grid grid-cols-1 min-[481px]:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.length > 0 &&
              colorSectionVariations.map((variation, index) => {
                // Trouver le produit parent pour cette variation
                const parentProduct = products.find((p) =>
                  p.variations?.some((v) => v.id === variation.id)
                );

                if (!parentProduct) return null;

                // Reproduire la logique d'image affichée dans ECommerceProductCard
                // (sliderImages.length > 0 ? sliderImages : variation.images)
                const sliderImages =
                  variation.images && variation.images.length > 0
                    ? getSliderImages(variation.images)
                    : [];
                const images =
                  sliderImages.length > 0
                    ? sliderImages
                    : variation.images || [];
                const currentImageIndex =
                  currentImageIndexes[variation.id] ?? 0;
                const handleImageIndexChange = (newIndex: number) => {
                  setCurrentImageIndexes((prev) => ({
                    ...prev,
                    [variation.id]: newIndex,
                  }));
                };
                return (
                  <div
                    key={variation.id}
                    className={`animate fade-in-up delay-${index + 1}`}
                  >
                    <div className="relative group">
                      <ECommerceProductCard
                        product={parentProduct}
                        variation={variation}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={handleImageIndexChange}
                      />
                      {images.length > 0 && (
                        <button
                          type="button"
                          className="absolute top-2 right-2 z-20 bg-white/80 dark:bg-gray-900/80 rounded-full p-1 shadow hover:bg-white dark:hover:bg-gray-800 transition"
                          title="Agrandir l'image"
                          onClick={() =>
                            setModalImage({
                              images: images.map((img) => img.url),
                              index: currentImageIndex,
                            })
                          }
                        >
                          <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          {/* Modal d'agrandissement d'image (placée globalement, hors de la map) */}
          {modalImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate fade-in">
              <button
                className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
                onClick={() => setModalImage(null)}
                title="Fermer"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              </button>
              {/* Flèche gauche */}
              {modalImage.images.length > 1 && (
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImage(
                      (prev) =>
                        prev && {
                          images: prev.images,
                          index:
                            (prev.index - 1 + prev.images.length) %
                            prev.images.length,
                        }
                    );
                  }}
                  title="Image précédente"
                  aria-label="Image précédente"
                >
                  <svg
                    className="w-7 h-7 text-gray-900 dark:text-gray-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              {/* Image agrandie */}
              <img
                src={modalImage.images[modalImage.index]}
                alt="Aperçu du produit"
                className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white dark:border-gray-900 animate fade-in"
                onClick={() => setModalImage(null)}
                style={{ cursor: "zoom-out" }}
              />
              {/* Flèche droite */}
              {modalImage.images.length > 1 && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImage(
                      (prev) =>
                        prev && {
                          images: prev.images,
                          index: (prev.index + 1) % prev.images.length,
                        }
                    );
                  }}
                  title="Image suivante"
                  aria-label="Image suivante"
                >
                  <svg
                    className="w-7 h-7 text-gray-900 dark:text-gray-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
              {/* Compteur d'images */}
              {modalImage.images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-900/90 rounded-full px-4 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 shadow">
                  {modalImage.index + 1} / {modalImage.images.length}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Avantages Section - Design minimaliste */}
        <section className="py-16 animate fade-in">
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            <div className="text-center">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <Leaf className="text-green-600 h-5 w-5" />
              </div>
              <p className="font-medium text-sm">{t("focus.ecoResponsible")}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="text-blue-600 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <p className="font-medium text-sm">{t("focus.freeDelivery")}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="text-purple-600 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <p className="font-medium text-sm">{t("focus.securePayment")}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="text-orange-600 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 16l5-5-5-5" />
                  <path d="M13.8 2.2C18.1 3.3 21 7.2 21 11.4c0 3.6-2.1 6.9-5.4 8.3-.5.2-1.1.4-1.6.5" />
                  <path d="M12 22a10 10 0 0 1 0-20" />
                </svg>
              </div>
              <p className="font-medium text-sm">{t("focus.return30")}</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Avis Google Elfsight */}
        <section className="py-20 container mx-auto animate fade-in">
          <h2
            className="font-heading text-3xl md:text-4xl text-center mb-16"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("focus.testimonials")}
          </h2>

          {/* Elfsight Google Reviews Widget */}
          <div
            className="elfsight-app-4e4b87d4-745d-4e46-ab59-bc0b36f7d8ad relative overflow-visible"
            data-elfsight-app-lazy
            style={{ margin: "0 -40px", padding: 0 }}
          />
          {/* Masquage du titre et du badge via CSS-in-JS (sans !important) */}
          <style>{`
            .elfsight-app-4e4b87d4-745d-4e46-ab59-bc0b36f7d8ad [class*="es-widget-title"],
            .elfsight-app-4e4b87d4-745d-4e46-ab59-bc0b36f7d8ad [class*="es-powered-by"] {
              display: none;
            }
          `}</style>
        </section>

        {/* New Product Slider - Modern and Stylish */}
        <section className="py-6 md:py-8 animate fade-in-up delay-2">
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6 md:p-8 mx-4 md:mx-0 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-400/10 to-orange-400/10 rounded-full blur-xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Icon with animation */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-4 rounded-2xl shadow-lg animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3
                  className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("focus.newProduct.title")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-3">
                  {t("focus.newProduct.subtitle")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {t("focus.newProduct.description")}
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={() =>
                    (window.location.href = "/creations-sur-mesure")
                  }
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                  size="lg"
                >
                  {t("focus.newProduct.cta")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Banners - Design minimaliste et épuré */}
        <section className="py-12 animate fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div>
                  <svg
                    className="text-[var(--color-text)] h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m8 17 4 4 4-4"></path>
                  </svg>
                </div>
                <div>
                  <h3
                    className="font-medium text-lg mb-2"
                    style={{ fontFamily: "var(--font-titles)" }}
                  >
                    {t("focus.contactUs")}
                  </h3>
                  <p className="text-gray-600 dark:text-white dark:font-medium">
                    {t("focus.contactUs.text")}{" "}
                    <a
                      href="mailto:altolille@gmail.com"
                      className="text-primary hover:underline dark:text-blue-400"
                    >
                      altolille@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-600 dark:text-white dark:font-semibold">
                    +33 782 086 690
                  </p>
                </div>
              </div>
            </div>

            {/* Additional contact info for custom orders */}
            <div className="border border-gray-200 p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div>
                  <svg
                    className="text-[var(--color-text)] h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                  </svg>
                </div>
                <div>
                  <h3
                    className="font-medium text-lg mb-2"
                    style={{ fontFamily: "var(--font-titles)" }}
                  >
                    {t("focus.custom.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-white dark:font-medium">
                    {t("focus.custom.text")}
                  </p>
                  <p className="mt-2">
                    <a
                      href="mailto:altolille@gmail.com"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      {t("focus.custom.contact")}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />
      </div>

      {/* Container pour les toasts améliorés */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
}
