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
import {
  ProductAddedIndicator,
  useProductAddedIndicators,
} from "@/components/ProductAddedIndicator";
import { useEnhancedToast } from "@/hooks/useEnhancedToast";
import { Leaf } from "lucide-react";
import {
  formatPrice,
  getColorInfo,
  getSliderImages,
  isProductOutOfStock,
  isVariationOutOfStock,
} from "@/lib/utils";
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

  // Traduction par produit : `product.<id>.<suffixe>` (éditable dans
  // gestion > Traductions) prime sur la clé générique `focus.<suffixe>`,
  // pour que chaque produit puisse avoir sa page complète sans code.
  const pt = (suffix: string): string => {
    const productKey = `product.${productId}.${suffix}`;
    const value = t(productKey);
    return value === productKey ? t(`focus.${suffix}`) : value;
  };

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
    if (product && selectedVariation && (selectedVariation.stock ?? 0) > 0) {
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

  // Rupture de stock : pas de prix affiché, pas d'ajout au panier
  const productOutOfStock = product ? isProductOutOfStock(product) : false;
  const selectedOutOfStock =
    productOutOfStock ||
    (selectedVariation ? isVariationOutOfStock(selectedVariation) : false);

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
              {t("product.back")}
            </Button>
          </Link>
        </div>

        {/* Hero Section — maquette -2 (clair) / -4 (sombre) */}
        <section className="py-2 md:py-8 lg:py-10 animate fade-in-up">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Photo produit (colonne gauche desktop) */}
            <div className="order-1 relative flex justify-center items-center px-4 md:px-0">
              {selectedVariation && (
                <div className="relative w-full max-w-[646px]">
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

            {/* Colonne texte (droite desktop) */}
            <div className="order-2 z-10 px-4 md:px-0">
              {/* Titre orange-soft Bold 70px */}
              <h1
                className="font-heading font-bold uppercase text-alto-orange-soft tracking-tight text-center md:text-left text-[clamp(44px,3.6vw,70px)]"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {product.name}
              </h1>

              {/* Sous-titre bleu (masqué si la clé n'est pas traduite) */}
              {(() => {
                const subtitle = pt("subtitle");
                const missing = subtitle === "focus.subtitle" || !subtitle;
                return missing ? null : (
                  <p
                    className="mt-2 mb-4 text-center md:text-left font-bold text-[clamp(18px,1.5vw,23px)]"
                    style={{ color: "#048EF3", fontFamily: "var(--font-titles)" }}
                  >
                    {subtitle}
                  </p>
                );
              })()}

              {/* Description brun/crème Regular 23px */}
              <p className="mb-8 max-w-[785px] leading-relaxed text-center md:text-left mx-auto md:mx-0 text-alto-brown dark:text-alto-cream text-[clamp(16px,1.5vw,23px)]">
                {product.description}
              </p>

              {/* Features verticales avec pictos dessinés */}
              {isSectionEnabled("features") && (
                <ul className="mb-8 flex flex-col gap-4 items-center md:items-start">
                  {[
                    { img: "/images/alto/value-pla.png", label: pt("features.eco") },
                    { img: "/images/alto/value-chene.png", label: pt("features.wood") },
                    { img: "/images/alto/value-conception.png", label: pt("features.led") },
                  ].map((f) => (
                    <li key={f.label} className="flex items-center gap-3">
                      <img src={f.img} alt="" aria-hidden className="h-8 w-8 object-contain" />
                      <span className="text-alto-brown dark:text-alto-cream text-[clamp(16px,1.5vw,23px)]">
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Couleurs disponibles + swatches matière */}
              {variations.length > 1 && (
                <div className="mb-6">
                  <p className="mb-3 text-center md:text-left text-alto-brown dark:text-alto-cream text-[clamp(15px,1.3vw,20px)]">
                    {t("shop.focus.colorsAvailable")} :
                  </p>
                  <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                    {variations.map((variation) => {
                      const colorInfo = getColorInfo(variation.variationValue);
                      const isSelected = selectedVariation?.id === variation.id;
                      return (
                        <button
                          key={variation.id}
                          onClick={() => handleVariationSelect(variation)}
                          className={`relative h-16 w-16 md:h-[86px] md:w-[86px] overflow-hidden transition-all duration-300 ${
                            isSelected
                              ? "scale-105 ring-2 ring-alto-orange ring-offset-2 ring-offset-background"
                              : "hover:scale-105"
                          }`}
                          style={{
                            backgroundImage: `url(${colorInfo.imagePath})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          aria-label={`Option ${variation.variationValue}`}
                          aria-pressed={isSelected}
                          title={variation.variationValue}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA : ajouter au panier (texte orange Bold + filet) + voir détails (pill) */}
              <div className="flex flex-col gap-5 mb-6">
                {selectedOutOfStock ? (
                  <div className="w-full md:w-auto md:self-start rounded-full bg-muted px-8 py-3 text-center text-base font-semibold text-muted-foreground">
                    {t("shop.outOfStock")}
                  </div>
                ) : (
                  <div className="border-b-2 border-alto-orange/40 pb-3">
                    <AnimatedAddToCartButton
                      onClick={handleAddToCart}
                      disabled={!selectedVariation}
                      price={formatPrice(selectedVariation?.price || product.price)}
                      className="mobile-tap-highlight w-full bg-transparent text-alto-orange-soft hover:bg-transparent hover:text-alto-orange justify-center md:justify-start !text-[clamp(22px,2.2vw,32px)] font-bold"
                    />
                  </div>
                )}
                <button
                  onClick={() =>
                    document
                      .getElementById("product-details")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mobile-tap-highlight flex h-[64px] md:h-[78px] w-full max-w-[801px] items-center justify-center rounded-[39px] bg-alto-brown text-alto-cream transition-transform hover:-translate-y-[2px] dark:bg-alto-cream dark:text-alto-brown text-[clamp(20px,2.2vw,32px)]"
                  style={{ fontFamily: "var(--font-buttons)" }}
                >
                  {t("product.viewDetails")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section Caractéristique — maquette -2/-4 (fonds inversés via CSS) */}
        {isSectionEnabled("details") && (
          <section id="product-details" className="py-12 md:py-20 animate fade-in">
            <div className="alto-caracteristique relative overflow-hidden px-6 py-12 md:px-16 md:py-20">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
                {/* Colonne texte */}
                <div>
                  <h2
                    className="font-heading font-bold mb-8 text-[clamp(40px,3.6vw,70px)] leading-none"
                    style={{ fontFamily: "var(--font-titles)" }}
                  >
                    {t("product.caracteristique")}
                  </h2>

                  <div className="mb-10 max-w-[760px] space-y-1 text-[clamp(16px,1.5vw,23px)] leading-relaxed">
                    <p>{pt("sustainableMaterials.text")}</p>
                    <p>{pt("lighting.text")}</p>
                    <p>{pt("dimensions.text")}</p>
                    <p>{pt("materials.text")}</p>
                    <p>{pt("artisanalCrafting.text")}</p>
                  </div>

                  {/* Bouton Fabrication — pill orange 409×114 */}
                  <Link
                    href="/design-en-action"
                    className="inline-flex h-[70px] w-full max-w-[409px] items-center justify-center rounded-[57px] bg-alto-orange font-bold text-alto-cream transition-transform hover:scale-[1.03] md:h-[114px] text-[clamp(28px,3.4vw,51px)]"
                    style={{ fontFamily: "var(--font-titles)" }}
                  >
                    {t("product.fabricationBtn")}
                  </Link>
                </div>

                {/* Silhouette lampe — crème sur fond brun (clair) / brune sur crème (sombre) */}
                <div className="flex justify-center md:justify-end">
                  <img
                    src="/images/alto/silhouette-focus-cream.png"
                    alt=""
                    aria-hidden
                    className="block dark:hidden h-[280px] md:h-[420px] w-auto object-contain"
                  />
                  <img
                    src="/images/alto/silhouette-focus-brown.png"
                    alt=""
                    aria-hidden
                    className="hidden dark:block h-[280px] md:h-[420px] w-auto object-contain"
                  />
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
              {pt("colorSelection")}
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
              {t("product.others")}
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-10">
              {otherProducts.map((other) => {
                const previewImage = other.variations?.[0]?.images?.[0]?.url;
                return (
                  <Link key={other.id} href={`/shop/${other.id}`}>
                    <article className="group cursor-pointer">
                      <div className="relative aspect-square overflow-hidden bg-white">
                        {previewImage && (
                          <>
                            <img
                              src={previewImage}
                              alt=""
                              aria-hidden
                              className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
                              loading="lazy"
                            />
                            <img
                              src={previewImage}
                              alt={other.name}
                              className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                          </>
                        )}
                      </div>
                      <h3
                        className="mt-3 text-lg font-bold text-primary md:text-xl"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {other.name}
                      </h3>
                      {isProductOutOfStock(other) ? (
                        <p className="font-medium text-muted-foreground">
                          {t("shop.outOfStock")}
                        </p>
                      ) : (
                        <p className="font-bold text-primary">
                          {formatPrice(other.price)}
                        </p>
                      )}
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
              {t("product.reviews")}
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
