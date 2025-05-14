import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { LampColorSelector } from "@/components/LampColorSelector";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Leaf, Lightbulb, ShoppingBag, Trees } from "lucide-react";
import { formatPrice, getColorInfo } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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

      toast({
        title: "Produit ajouté au panier",
        description: `${selectedProduct.name} (${selectedVariation.variationValue}) a été ajouté au panier`,
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
        {/* Hero Section - Épuré et minimaliste */}
        <section className="py-12 md:py-20 lg:py-24 animate fade-in-up">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1 z-10">
              <h1
                className="font-heading text-4xl md:text-6xl mb-6 tracking-tight"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                FOCUS.01
              </h1>
              <p className="mb-8 text-gray-600 max-w-md text-lg leading-relaxed">
                Lampe d'appoint éco-responsable aux lignes épurées, conçue par
                Anatole Collet
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center text-sm">
                  <Leaf className="text-green-500 mr-2 h-4 w-4" />
                  <span>PLA éco-responsable</span>
                </div>
                <div className="flex items-center text-sm">
                  <Trees className="text-amber-700 mr-2 h-4 w-4" />
                  <span>Chêne écogéré</span>
                </div>
                <div className="flex items-center text-sm">
                  <Lightbulb className="text-yellow-400 mr-2 h-4 w-4" />
                  <span>LED 60W E14 incluse</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!selectedProduct}
                  className="bg-[var(--color-button)] hover:bg-[var(--color-button-hover)] rounded-none transition-all hover:translate-y-[-2px] shadow-none hover:shadow-md"
                  style={{ fontFamily: "var(--font-buttons)" }}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Acheter -{" "}
                  {selectedProduct ? formatPrice(selectedProduct.price) : ""}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("product-details")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-none border-[var(--color-text)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white transition-all hover:translate-y-[-2px]"
                  style={{ fontFamily: "var(--font-buttons)" }}
                >
                  Voir les détails
                </Button>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <span className="inline-block border-l-2 border-gray-300 pl-3">
                  Livraison offerte en France métropolitaine
                </span>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex justify-center items-center">
              {selectedProduct && selectedVariation && (
                <div className="relative w-full max-w-md h-[400px] flex items-center justify-center">
                  <img
                    src={selectedVariation.imageUrl}
                    alt={`Lampe FOCUS.01 coloris ${selectedVariation.variationValue}`}
                    className="w-full max-w-[70%] mx-auto object-contain transition-all duration-700 animate scale-in z-1"
                  />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full">
                    <LampColorSelector
                      variations={heroVariations}
                      productName={selectedProduct.name}
                      onVariationSelect={handleVariationSelect}
                      selectedVariationId={selectedVariation?.id}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Product Availability Notice - Style minimaliste avec bordure fine */}
        <section className="py-8 animate fade-in-up delay-2">
          <div className="bg-white border border-gray-200 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="bg-primary/5 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[var(--color-text)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Collection en cours de développement
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Actuellement, la lampe FOCUS.01 est notre seul produit
                  disponible à la vente. Pour toute demande concernant d'autres
                  créations ou services d'Alto, n'hésitez pas à nous contacter
                  via{" "}
                  <a
                    href="mailto:altolille@gmail.com"
                    className="text-primary underline decoration-dotted underline-offset-4 hover:decoration-solid"
                  >
                    altolille@gmail.com
                  </a>{" "}
                  ou au +33 782 086 690. Nous serons ravis d'échanger avec vous
                  sur vos projets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Section - Style plus minimaliste */}
        <section id="product-details" className="py-20 animate fade-in">
          <div className="container mx-auto max-w-5xl">
            <h2
              className="font-heading text-3xl md:text-4xl mb-16 text-center"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Conception & Détails
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="p-6 bg-white border border-gray-100 animate fade-in-right delay-1">
                <div className="w-12 h-12 bg-primary/5 flex items-center justify-center mb-4">
                  <Leaf className="text-[var(--color-text)] h-6 w-6" />
                </div>
                <h3
                  className="font-heading text-xl mb-3"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Matériaux Durables
                </h3>
                <p className="text-gray-600">
                  Structure en PLA 100% biodégradable associée à du chêne
                  provenant de forêts gérées durablement.
                </p>
              </div>

              <div className="p-6 bg-white border border-gray-100 animate fade-in-up delay-2">
                <div className="w-12 h-12 bg-primary/5 flex items-center justify-center mb-4">
                  <Lightbulb className="text-[var(--color-text)] h-6 w-6" />
                </div>
                <h3
                  className="font-heading text-xl mb-3"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Éclairage Optimal
                </h3>
                <p className="text-gray-600">
                  Livrée avec une ampoule LED 60W E14 pour un éclairage
                  chaleureux et économe en énergie.
                </p>
              </div>

              <div className="p-6 bg-white border border-gray-100 animate fade-in-left delay-3">
                <div className="w-12 h-12 bg-primary/5 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[var(--color-text)] h-6 w-6"
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
                  className="font-heading text-xl mb-3"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Fabrication Artisanale
                </h3>
                <p className="text-gray-600">
                  Chaque lampe est conçue et assemblée à la main par Anatole
                  Collet dans son atelier français.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/2 animate fade-in-right delay-4">
                {selectedProduct && selectedVariation && (
                  <img
                    src={selectedVariation.imageUrl}
                    alt={`FOCUS.01 en détail`}
                    className="w-full max-h-[500px] object-contain"
                  />
                )}
              </div>
              <div className="md:w-1/2 animate fade-in-left delay-4">
                <h3
                  className="font-heading text-2xl mb-6"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Caractéristiques Techniques
                </h3>
                <ul className="space-y-6 mb-8">
                  <li className="flex items-start">
                    <span className="bg-primary/5 text-[var(--color-text)] p-1 mr-4 mt-1">
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
                      <span className="font-medium block mb-1">Dimensions</span>
                      <p className="text-gray-600">
                        Hauteur: 30cm, Largeur: 12cm, Profondeur: 15cm
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/5 text-[var(--color-text)] p-1 mr-4 mt-1">
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
                      <span className="font-medium block mb-1">Matériaux</span>
                      <p className="text-gray-600">
                        Corps en PLA éco-responsable, base et tige en chêne
                        massif écogéré
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/5 text-[var(--color-text)] p-1 mr-4 mt-1">
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
                      <span className="font-medium block mb-1">Éclairage</span>
                      <p className="text-gray-600">
                        Ampoule LED 60W E14 incluse, câble avec interrupteur de
                        1m50
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/5 text-[var(--color-text)] p-1 mr-4 mt-1">
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
                      <span className="font-medium block mb-1">
                        Orientation
                      </span>
                      <p className="text-gray-600">
                        Tête orientable pour un éclairage directionnel et
                        ajustable
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <svg
                      className="text-green-600 mr-2 h-5 w-5"
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
                    <span>Garantie 2 ans</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="text-orange-600 mr-2 h-5 w-5"
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
                    <span>Emballage éco-responsable</span>
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
            Les Coloris
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Choisissez parmi nos quatre coloris distinctifs, chacun apportant
            une ambiance unique à votre espace.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.length > 0 &&
              colorSectionVariations.map((variation, index) => {
                // Trouver le produit parent pour cette variation
                const parentProduct = products.find((p) =>
                  p.variations?.some((v) => v.id === variation.id)
                );

                if (!parentProduct) return null;

                return (
                  <div
                    key={variation.id}
                    className={`animate fade-in-up delay-${index + 1}`}
                  >
                    <ProductCard
                      product={parentProduct}
                      variation={variation}
                    />
                  </div>
                );
              })}
          </div>
        </section>

        {/* Testimonials Section - Style design minimaliste */}
        <section className="py-20 container mx-auto animate fade-in">
          <h2
            className="font-heading text-3xl md:text-4xl text-center mb-16"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            Ce qu'en disent nos clients
          </h2>

          {/* Widget Trustpilot */}
          <div className="flex justify-center mb-20">
            <div
              className="trustpilot-widget"
              data-locale="fr-FR"
              data-template-id="5419b6a8b0d04a076446a9ad"
              data-businessunit-id="YOUR_BUSINESS_UNIT_ID"
              data-style-height="240px"
              data-style-width="100%"
              data-theme="light"
              data-min-review-count="0"
            >
              <a
                href="https://fr.trustpilot.com/review/altolille.com"
                target="_blank"
                rel="noopener"
              >
                Trustpilot
              </a>
            </div>
            {/* Script pour charger le widget Trustpilot */}
            <script
              type="text/jsx"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,r,n){w.TrustpilotObject=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};
                  a=d.createElement(s);a.async=1;a.src=r;a.type='text/java'+s;
                  b=d.getElementsByTagName(s)[0];b.parentNode.insertBefore(a,b)})
                  (window,document,'script','https://widget.trustpilot.com/bootstrap/v5.js','tp');
                  tp('register', 'YOUR_BUSINESS_UNIT_ID');
                `,
              }}
            />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 animate fade-in-up delay-4">
            <div className="text-center">
              <div className="w-14 h-14 border border-gray-200 flex items-center justify-center mx-auto mb-3">
                <Leaf className="text-green-600 h-5 w-5" />
              </div>
              <p className="font-medium text-sm">Éco-responsable</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 border border-gray-200 flex items-center justify-center mx-auto mb-3">
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
              <p className="font-medium text-sm">Livraison Offerte</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 border border-gray-200 flex items-center justify-center mx-auto mb-3">
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
              <p className="font-medium text-sm">Paiement Sécurisé</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 border border-gray-200 flex items-center justify-center mx-auto mb-3">
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
              <p className="font-medium text-sm">Retour 30 Jours</p>
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
                    Contactez-nous
                  </h3>
                  <p className="text-gray-600">
                    Besoin d'aide ?{" "}
                    <a
                      href="mailto:altolille@gmail.com"
                      className="text-primary hover:underline"
                    >
                      altolille@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-600">+33 782 086 690</p>
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
                    Projets sur mesure
                  </h3>
                  <p className="text-gray-600">
                    Vous cherchez une création unique ou personnalisée?
                  </p>
                  <p className="mt-2">
                    <a
                      href="mailto:altolille@gmail.com"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      Nous contacter
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
    </Layout>
  );
}
