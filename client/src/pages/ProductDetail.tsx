import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { X, Maximize2, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { EnhancedHeroProductDisplay } from "@/components/EnhancedHeroProductDisplay";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { AltoReviews } from "@/components/AltoReviews";
import { Button } from "@/components/ui/button";
import { AnimatedAddToCartButton } from "@/components/AnimatedAddToCartButton";
import { ToastContainer } from "@/components/EnhancedToast";
import {
  ProductAddedIndicator,
  useProductAddedIndicators,
} from "@/components/ProductAddedIndicator";
import { useEnhancedToast } from "@/hooks/useEnhancedToast";
import {
  formatPrice,
  getColorInfo,
  getSliderImages,
  isProductOutOfStock,
  isVariationOutOfStock,
} from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <Layout headerTone="surface" footerTone="blue">
      {/* Marges maquette : 162/1920 = 8.4% de part et d'autre */}
      <div className="mx-auto max-w-[1920px] px-[6vw] md:px-[8.4vw]">
        {/* Bouton retour (hors maquette, conservé pour la navigation) */}
        <div className="pt-4 md:pt-6">
          <Link href="/shop">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("product.back")}
            </Button>
          </Link>
        </div>

        {/* Hero — maquette -2 (clair) / -4 (sombre) : photo 646×806 à gauche,
            colonne texte à droite, alignées en haut. */}
        <section className="animate fade-in-up pb-8 pt-2 md:pb-16">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[646fr_785fr] md:gap-[6vw]">
            {/* Photo produit (colonne gauche desktop) */}
            <div className="relative order-1 flex items-start justify-center md:justify-start">
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

              {/* CTA maquette : deux pills 801×78 r39 empilés — « Ajouter au panier »
                  en contour orange (texte Bold 32px orange), « Voir plus de détails »
                  en brun plein (texte Regular 32px crème) avec chevron. */}
              <div className="mb-6 flex flex-col gap-4">
                {selectedOutOfStock ? (
                  <div className="w-full max-w-[801px] rounded-[39px] bg-muted px-8 py-3 text-center text-base font-semibold text-muted-foreground">
                    {t("shop.outOfStock")}
                  </div>
                ) : (
                  <AnimatedAddToCartButton
                    onClick={handleAddToCart}
                    disabled={!selectedVariation}
                    hideIcon
                    className="mobile-tap-highlight flex h-[64px] w-full max-w-[801px] items-center justify-center rounded-[39px] border border-alto-orange-soft bg-transparent !text-[clamp(20px,2.2vw,32px)] font-bold text-alto-orange-soft hover:bg-alto-orange-soft/10 hover:text-alto-orange-soft md:h-[78px]"
                  >
                    {`${t("button.addToCart")} : ${formatPrice(
                      selectedVariation?.price || product.price
                    )}`}
                  </AnimatedAddToCartButton>
                )}
                <button
                  onClick={() =>
                    document
                      .getElementById("product-details")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mobile-tap-highlight flex h-[64px] md:h-[78px] w-full max-w-[801px] items-center justify-center gap-3 rounded-[39px] bg-alto-brown text-alto-cream transition-transform hover:-translate-y-[2px] dark:bg-alto-cream dark:text-alto-brown text-[clamp(20px,2.2vw,32px)]"
                  style={{ fontFamily: "var(--font-buttons)" }}
                >
                  {t("product.viewDetails")}
                  <ChevronDown className="h-6 w-6" strokeWidth={2.5} />
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

        {/* Avis Google (maquette : bloc juste avant le footer) - configurable via CMS */}
        {isSectionEnabled("testimonials") && (
          <div className="container mx-auto py-20">
            <AltoReviews />
          </div>
        )}

      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
}
