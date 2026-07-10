import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { X, Maximize2, ArrowLeft, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { EnhancedHeroProductDisplay } from "@/components/EnhancedHeroProductDisplay";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { ECommerceProductCard } from "@/components/ECommerceProductCard";
import { Button } from "@/components/ui/button";
import { AnimatedAddToCartButton } from "@/components/AnimatedAddToCartButton";
import { ToastContainer } from "@/components/EnhancedToast";
import { DynamicImage } from "@/components/DynamicImage";
import {
  ProductAddedIndicator,
  useProductAddedIndicators,
} from "@/components/ProductAddedIndicator";
import { useEnhancedToast } from "@/hooks/useEnhancedToast";
import { Leaf, Lightbulb, Trees } from "lucide-react";
import { formatPrice, getColorInfo, getSliderImages } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0", 10);

  // Récupérer le produit par son ID
  const { data: product, isLoading, error } = useQuery<ProductWithVariations>({
    queryKey: [`/api/products/${productId}`],
    enabled: productId > 0,
  });

  // Récupérer le contenu personnalisé du produit (CMS)
  interface ProductContentSection {
    id: string;
    type: string;
    enabled: boolean;
    items?: Array<{ icon?: string; titleKey?: string }>;
    cards?: Array<{ icon?: string; titleKey?: string; textKey?: string }>;
    widgetId?: string;
  }

  interface ProductContent {
    sections: ProductContentSection[];
    images?: Record<string, string>;
  }

  const { data: productContent } = useQuery<ProductContent>({
    queryKey: [`/api/products/${productId}/content`],
    enabled: productId > 0,
  });

  // Autres produits du catalogue (maquette : bloc « Autres produits »)
  const { data: allProducts = [] } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
  });
  const otherProducts = allProducts
    .filter((p) => p.id !== productId)
    .slice(0, 4);

  // Vérifier si une section est activée
  const isSectionEnabled = (sectionId: string): boolean => {
    if (!productContent?.sections) {
      // Fallback pour FOCUS.01 si pas de config
      return productId === 1;
    }
    const section = productContent.sections.find((s) => s.id === sectionId);
    return section?.enabled ?? false;
  };

  // Pour la modal d'agrandissement d'image
  const [modalImage, setModalImage] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  // Pour suivre l'image courante de chaque variation
  const [currentImageIndexes, setCurrentImageIndexes] = useState<
    Record<number, number>
  >({});

  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);

  const { addItem } = useCart();
  const { addToast, toasts, removeToast } = useEnhancedToast();
  const { showIndicator, isProductAdded } = useProductAddedIndicators();
  const { t } = useLanguage();

  // Sélectionner la première variation par défaut quand le produit charge
  useEffect(() => {
    if (product && product.variations && product.variations.length > 0 && !selectedVariation) {
      setSelectedVariation(product.variations[0]);
    }
  }, [product, selectedVariation]);

  const handleVariationSelect = (variation: ProductVariation) => {
    setSelectedVariation(variation);
  };

  const handleAddToCart = () => {
    if (product && selectedVariation) {
      const productWithVariation = {
        ...selectedVariation,
        productName: product.name,
        productDescription: product.description,
        basePrice: product.price,
      };

      addItem(productWithVariation);
      showIndicator(selectedVariation.id.toString());

      addToast({
        title: t("focus.addedToCart"),
        description: `${product.name} - ${selectedVariation.variationValue}`,
        type: "cart",
        duration: 5000,
        productImage:
          selectedVariation.images && selectedVariation.images.length > 0
            ? selectedVariation.images[0].url
            : "",
        productName: `${product.name} - ${selectedVariation.variationValue}`,
        quantity: 1,
      });
    }
  };

  // Variations du produit (ordre d'arrivée API)
  const variations = product?.variations || [];

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement du produit...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Produit non trouvé
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Le produit que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link href="/shop">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la boutique
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerTone="surface" footerTone="brown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <div className="pt-4 md:pt-8">
          <Link href="/shop">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au catalogue
            </Button>
          </Link>
        </div>

        {/* Sélecteur de variation mobile */}
        {variations.length > 1 && (
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
                  {variations.map((variation) => {
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
                        } ${colorInfo?.bgClass || "bg-gray-50 dark:bg-gray-800"}`}
                        aria-label={`Option ${variation.variationValue}`}
                        title={variation.variationValue}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={`${product.name} - ${variation.variationValue}`}
                            className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
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
                            style={{ background: "#18181b" }}
                          ></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hero Section */}
        <section className="py-2 md:py-8 lg:py-10 animate fade-in-up">
          <div className="hidden md:block md:mt-8 lg:mt-10"></div>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 md:order-1 z-10 px-4 md:px-0">
              <h1
                className="font-heading text-4xl md:text-6xl font-bold uppercase text-primary mb-4 md:mb-6 tracking-tight text-center md:text-left"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {product.name}
              </h1>
              <p className="mb-6 md:mb-8 max-w-md text-base md:text-lg leading-relaxed text-center md:text-left mx-auto md:mx-0 text-foreground/90">
                {product.description}
              </p>
              {/* Features icons - configurables via CMS */}
              {isSectionEnabled("features") && (
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
              )}
              <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8 px-4 md:px-0">
                <AnimatedAddToCartButton
                  onClick={handleAddToCart}
                  disabled={!selectedVariation}
                  price={formatPrice(selectedVariation?.price || product.price)}
                  className="w-full md:w-auto mobile-tap-highlight rounded-full bg-alto-orange text-alto-cream hover:bg-alto-orange-soft focus:bg-alto-orange-soft transition-all"
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("product-details")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full md:w-auto rounded-full border-0 bg-alto-brown text-alto-cream hover:bg-alto-brown-deep hover:text-alto-cream dark:bg-alto-brown-deep dark:hover:bg-alto-brown transition-all hover:translate-y-[-2px] mobile-tap-highlight"
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
              {selectedVariation && (
                <div className="relative">
                  <EnhancedHeroProductDisplay
                    product={product}
                    selectedVariation={selectedVariation}
                    onVariationSelect={handleVariationSelect}
                    variations={variations}
                    isProductAdded={isProductAdded}
                  />
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

        {/* Sélecteur de variation desktop */}
        {variations.length > 1 && (
          <section className="hidden md:block py-3 md:py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-y border-gray-200/50 dark:border-gray-700/50 animate fade-in">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-light text-gray-900 dark:text-gray-100 mb-1">
                    {t("shop.focus.colorsAvailable")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {variations.length} variation{variations.length > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-center">
                  {variations.map((variation) => {
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
                        className={`group relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 transition-all duration-300 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 ${
                          isSelected
                            ? "scale-105 shadow-lg border-2 border-gray-300 dark:border-gray-500"
                            : "hover:scale-105 shadow-md hover:shadow-lg"
                        } ${colorInfo?.bgClass || "bg-gray-50 dark:bg-gray-800"}`}
                        aria-label={`Option ${variation.variationValue}`}
                        title={variation.variationValue}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={`${product.name} - ${variation.variationValue}`}
                            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
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
                            style={{ background: "#18181b" }}
                          ></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Product Details Section - configurable via CMS */}
        {isSectionEnabled("details") && (
          <section id="product-details" className="py-12 md:py-20 animate fade-in">
            <div className="alto-caracteristique px-6 py-12 md:px-14 md:py-16">
              <h2
                className="font-heading text-3xl md:text-5xl font-bold mb-12"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Caractéristique
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="p-6 animate fade-in-right delay-1">
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

                <div className="p-6 animate fade-in-up delay-2">
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

                <div className="p-6 animate fade-in-left delay-3">
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
                  <DynamicImage
                    illustrationKey="shopFocus.lifestyle1"
                    fallbackSrc="https://www.alto-lille.fr/uploads/f0d658a0-e71f-462d-9210-31b276408bdd.jpeg"
                    alt={`${product.name} - Caractéristiques`}
                    className="w-full max-h-[500px] object-contain block dark:hidden mt-8"
                  />
                  <DynamicImage
                    illustrationKey="shopFocus.lifestyle2"
                    fallbackSrc="https://www.alto-lille.fr/uploads/29ce9490-1000-4d95-8d92-cd5191e15b80.jpeg"
                    alt={`${product.name} - Caractéristiques (sombre)`}
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
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
                  </ul>
                  <Link
                    href="/design-en-action"
                    className="inline-block rounded-full bg-alto-orange px-10 py-3.5 text-lg font-bold text-alto-cream transition-transform hover:scale-105"
                  >
                    Fabrication
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Grille des variations */}
        {variations.length > 1 && (
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
              {variations.map((variation, index) => {
                const sliderImages =
                  variation.images && variation.images.length > 0
                    ? getSliderImages(variation.images)
                    : [];
                const images =
                  sliderImages.length > 0 ? sliderImages : variation.images || [];
                const currentImageIndex = currentImageIndexes[variation.id] ?? 0;
                const handleImageIndexChange = (newIndex: number) => {
                  setCurrentImageIndexes((prev) => ({
                    ...prev,
                    [variation.id]: newIndex,
                  }));
                };

                return (
                  <div key={variation.id} className={`animate fade-in-up delay-${index + 1}`}>
                    <div className="relative group">
                      <ECommerceProductCard
                        product={product}
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
          </section>
        )}

        {/* Autres produits (maquette) */}
        {otherProducts.length > 0 && (
          <section className="py-16 animate fade-in">
            <h2
              className="mb-10 text-3xl md:text-4xl font-bold text-alto-blue dark:text-alto-cream"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Autres produits
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-10">
              {otherProducts.map((other) => {
                const previewImage = other.variations?.[0]?.images?.[0]?.url;
                return (
                  <Link key={other.id} href={`/shop/${other.id}`}>
                    <article className="group cursor-pointer">
                      <div className="aspect-square overflow-hidden bg-white">
                        {previewImage && (
                          <img
                            src={previewImage}
                            alt={other.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <h3
                        className="mt-3 text-lg font-bold text-primary md:text-xl"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {other.name}
                      </h3>
                      <p className="font-bold text-primary">
                        {formatPrice(other.price)}
                      </p>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Modal d'agrandissement d'image */}
        {modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate fade-in">
            <button
              className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
              onClick={() => setModalImage(null)}
              title="Fermer"
            >
              <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
            </button>
            {modalImage.images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImage((prev) =>
                    prev && {
                      images: prev.images,
                      index: (prev.index - 1 + prev.images.length) % prev.images.length,
                    }
                  );
                }}
              >
                <ArrowLeft className="w-7 h-7 text-gray-900 dark:text-gray-100" />
              </button>
            )}
            <img
              src={modalImage.images[modalImage.index]}
              alt="Aperçu du produit"
              className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white dark:border-gray-900 animate fade-in"
              onClick={() => setModalImage(null)}
              style={{ cursor: "zoom-out" }}
            />
            {modalImage.images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImage((prev) =>
                    prev && {
                      images: prev.images,
                      index: (prev.index + 1) % prev.images.length,
                    }
                  );
                }}
              >
                <ArrowRight className="w-7 h-7 text-gray-900 dark:text-gray-100" />
              </button>
            )}
            {modalImage.images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-900/90 rounded-full px-4 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 shadow">
                {modalImage.index + 1} / {modalImage.images.length}
              </div>
            )}
          </div>
        )}

        {/* Testimonials Section - Avis Google Elfsight - configurable via CMS */}
        {isSectionEnabled("testimonials") && (
          <section className="py-20 container mx-auto animate fade-in">
            <h2
              className="mb-10 text-3xl md:text-4xl font-bold text-alto-blue dark:text-alto-cream"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Avis
            </h2>

            {/* Elfsight Google Reviews Widget */}
            <div
              className="elfsight-app-4e4b87d4-745d-4e46-ab59-bc0b36f7d8ad relative overflow-visible"
              data-elfsight-app-lazy
              style={{ margin: "0 -40px", padding: 0 }}
            />
            <style>{`
              .elfsight-app-4e4b87d4-745d-4e46-ab59-bc0b36f7d8ad [class*="es-widget-title"],
              .elfsight-app-4e4b87d4-745d-4e46-ab59-bc0b36f7d8ad [class*="es-powered-by"] {
                display: none;
              }
            `}</style>
          </section>
        )}

        {/* Avantages Section */}
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

        {/* Contact Section */}
        <section className="py-12 animate fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div>
                  <svg
                    className="text-[var(--color-text)] dark:text-blue-400 h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m8 17 4 4 4-4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2" style={{ fontFamily: "var(--font-titles)" }}>
                    {t("focus.contactUs")}
                  </h3>
                  <p className="text-gray-600 dark:text-white dark:font-medium">
                    {t("focus.contactUs.text")}{" "}
                    <a href="mailto:altolille@gmail.com" className="text-primary hover:underline dark:text-blue-400">
                      altolille@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-600 dark:text-white dark:font-semibold">+33 782 086 690</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div>
                  <svg
                    className="text-[var(--color-text)] dark:text-blue-400 h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2" style={{ fontFamily: "var(--font-titles)" }}>
                    {t("focus.custom.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-white dark:font-medium">
                    {t("focus.custom.text")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
}
