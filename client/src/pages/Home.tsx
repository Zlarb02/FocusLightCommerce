import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { LampColorSelector } from "@/components/LampColorSelector";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Leaf, Lightbulb, ShoppingBag, Trees } from "lucide-react";
import { formatPrice, getColorInfo } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      // Default to the white lamp on initial load
      const defaultProduct =
        products.find((p) => p.color === "Blanc") || products[0];
      setSelectedProduct(defaultProduct);
    }
  }, [products, selectedProduct]);

  const handleColorSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct);
      toast({
        title: "Produit ajouté au panier",
        description: `${selectedProduct.name} (${selectedProduct.color}) a été ajouté au panier`,
      });
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          <div className="md:w-1/2">
            <h1 className="kantumruy-pro text-4xl md:text-5xl leading-tight mb-4">
              FOCUS.01
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Lampe d'appoint éco-responsable aux lignes épurées, conçue par
              Anatole Collet
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center">
                <Leaf className="text-green-500 mr-2 h-5 w-5" />
                <span>PLA éco-responsable</span>
              </div>
              <div className="flex items-center">
                <Trees className="text-amber-700 mr-2 h-5 w-5" />
                <span>Chêne écogéré</span>
              </div>
              <div className="flex items-center">
                <Lightbulb className="text-yellow-400 mr-2 h-5 w-5" />
                <span>LED 60W E14 incluse</span>
              </div>
            </div>
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedProduct}
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
              >
                Voir les détails
              </Button>
            </div>
            <div className="flex items-center text-muted-foreground">
              <span>Livraison offerte en France métropolitaine</span>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            {selectedProduct && (
              <img
                src={getColorInfo(selectedProduct.color).imagePath}
                alt={`Lampe FOCUS.01 coloris ${selectedProduct.color}`}
                className="w-full max-w-md mx-auto max-h-[300px] object-contain transition-opacity duration-300"
              />
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <LampColorSelector
                colors={products}
                onColorSelect={handleColorSelect}
                selectedProductId={selectedProduct?.id}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section id="product-details" className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl text-center mb-12">
            Conception & Détails
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Leaf className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">
                Matériaux Durables
              </h3>
              <p className="text-muted-foreground">
                Structure en PLA 100% biodégradable associée à du chêne
                provenant de forêts gérées durablement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Lightbulb className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">
                Éclairage Optimal
              </h3>
              <p className="text-muted-foreground">
                Livrée avec une ampoule LED 60W E14 pour un éclairage chaleureux
                et économe en énergie.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 22v-4h12v4" />
                  <path d="M18 5V2" />
                  <path d="M18 10V8" />
                  <circle cx="18" cy="6" r="2" />
                  <circle cx="6" cy="2" r="1" />
                  <circle cx="6" cy="12" r="1" />
                  <path d="M6 8v2" />
                  <path d="M6 4v2" />
                  <path d="M12 18v-4" />
                  <path d="M6 12v6" />
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">
                Fabrication Artisanale
              </h3>
              <p className="text-muted-foreground">
                Chaque lampe est conçue et assemblée à la main par Anatole
                Collet dans son atelier français.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="md:w-1/2">
              {selectedProduct && (
                <img
                  src={getColorInfo(selectedProduct.color).imagePath}
                  alt={`FOCUS.01 en détail`}
                  className="w-full rounded-lg shadow-lg max-h-[500px] object-contain"
                />
              )}
            </div>
            <div className="md:w-1/2">
              <h3 className="font-heading font-semibold text-2xl mb-4">
                Caractéristiques Techniques
              </h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-primary rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <span className="font-medium">Dimensions</span>
                    <p className="text-muted-foreground">
                      Hauteur: 30cm, Largeur: 12cm, Profondeur: 15cm
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-primary rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <span className="font-medium">Matériaux</span>
                    <p className="text-muted-foreground">
                      Corps en PLA éco-responsable, base et tige en chêne massif
                      écogéré
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-primary rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <span className="font-medium">Éclairage</span>
                    <p className="text-muted-foreground">
                      Ampoule LED 60W E14 incluse, câble avec interrupteur de
                      1m50
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-primary rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <span className="font-medium">Orientation</span>
                    <p className="text-muted-foreground">
                      Tête orientable pour un éclairage directionnel et
                      ajustable
                    </p>
                  </div>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center">
                  <svg
                    className="text-green-600 mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
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
                    strokeWidth="2"
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

      {/* Color Options Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="font-heading font-bold text-3xl text-center mb-4">
          Les Coloris
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Choisissez parmi nos quatre coloris distinctifs, chacun apportant une
          ambiance unique à votre espace.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Admin Dashboard Preview */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl text-center mb-4">
            Suivez Votre Commande
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Consultez facilement le statut de votre commande et recevez des
            mises à jour en temps réel sur sa livraison.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="font-heading font-bold text-3xl text-center mb-12">
          Ce qu'en disent nos clients
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p className="italic mb-4">
              "Design épuré et matériaux de qualité. La lampe FOCUS.01 sublime
              parfaitement mon bureau et crée une ambiance de travail idéale."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-medium text-sm">MT</span>
              </div>
              <div>
                <p className="font-medium">Marie T.</p>
                <p className="text-sm text-muted-foreground">
                  Architecte d'intérieur
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p className="italic mb-4">
              "J'adore le concept éco-responsable allié à un design minimaliste.
              La version bleue apporte une touche de couleur subtile à mon
              salon."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-medium text-sm">PL</span>
              </div>
              <div>
                <p className="font-medium">Pierre L.</p>
                <p className="text-sm text-muted-foreground">Designer</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex text-yellow-400 mb-4">
              {[...Array(4)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="italic mb-4">
              "Livraison rapide et emballage soigné. La lampe est encore plus
              belle en vrai que sur les photos. Un achat que je ne regrette pas
              !"
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-medium text-sm">SC</span>
              </div>
              <div>
                <p className="font-medium">Sophie C.</p>
                <p className="text-sm text-muted-foreground">Décoratrice</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <Leaf className="text-green-600 h-6 w-6" />
            </div>
            <p className="font-medium">Éco-responsable</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <svg
                className="text-blue-600 h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <p className="font-medium">Livraison Offerte</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <svg
                className="text-purple-600 h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="font-medium">Paiement Sécurisé</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
              <svg
                className="text-orange-600 h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 16l5-5-5-5" />
                <path d="M13.8 2.2C18.1 3.3 21 7.2 21 11.4c0 3.6-2.1 6.9-5.4 8.3-.5.2-1.1.4-1.6.5" />
                <path d="M12 22a10 10 0 0 1 0-20" />
              </svg>
            </div>
            <p className="font-medium">Retour 30 Jours</p>
          </div>
        </div>
      </section>

      <Separator />
    </Layout>
  );
}
