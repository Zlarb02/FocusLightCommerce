import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ProductWithVariations } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function Shop() {
  const { data: products = [], isLoading } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  // Filtrer les produits selon la recherche
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [products, searchTerm]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Catalogue
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Découvrez nos créations artisanales
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="relative max-w-md mx-auto mb-12">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={18}
            />
            <Input
              type="text"
              placeholder={t("shop.general.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg"
            />
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          )}

          {/* Affichage des produits */}
          {!isLoading && (
            <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
              {filteredProducts.length === 0 ? (
                <div className="w-full text-center text-gray-500 dark:text-gray-400 py-12">
                  {searchTerm
                    ? t("shop.general.noResults")
                    : "Aucun produit disponible"}
                </div>
              ) : (
                filteredProducts.map((product) => {
                  // Prendre la première variation pour l'image de prévisualisation
                  const previewVariation = product.variations?.[0];
                  const previewImage = previewVariation?.images?.[0]?.url;
                  const variationCount = product.variations?.length || 0;

                  return (
                    <Link key={product.id} href={`/shop/${product.id}`}>
                      <article className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transform hover:-translate-y-1 w-[280px] sm:w-[300px]">
                        {/* Image container */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt={product.name}
                              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                              <span className="text-4xl">📦</span>
                            </div>
                          )}

                          {/* Badge nombre de variations */}
                          {variationCount > 1 && (
                            <div className="absolute top-3 left-3 bg-black/80 dark:bg-white/90 text-white dark:text-gray-900 text-xs font-medium px-2 py-1 rounded-full">
                              {variationCount} coloris
                            </div>
                          )}

                          {/* Overlay au hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3
                            className="font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors"
                            style={{ fontFamily: "var(--font-titles)" }}
                          >
                            {product.name}
                          </h3>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              {formatPrice(product.price)}
                            </span>

                            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                              Voir le produit
                              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
