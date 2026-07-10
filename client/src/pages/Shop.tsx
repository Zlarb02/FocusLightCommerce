import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ProductWithVariations } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

/**
 * Catalogue — grille de la maquette : photos sur tuiles blanches,
 * nom et prix en orange sous chaque produit.
 */
export default function Shop() {
  const { data: products = [], isLoading } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

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
    <Layout headerTone="brown" footerTone="brown">
      <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-10 md:py-14">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1
            className="text-4xl font-bold text-alto-blue md:text-5xl dark:text-alto-cream"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("shop.title")}
          </h1>

          {/* Recherche */}
          <div className="relative w-full max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              type="text"
              placeholder={t("shop.general.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border-border bg-card pl-10"
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-10 xl:grid-cols-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-muted-foreground">
                {searchTerm
                  ? t("shop.general.noResults")
                  : t("shop.noProducts")}
              </div>
            ) : (
              filteredProducts.map((product) => {
                const previewVariation = product.variations?.[0];
                const previewImage = previewVariation?.images?.[0]?.url;
                const variationCount = product.variations?.length || 0;

                return (
                  <Link key={product.id} href={`/shop/${product.id}`}>
                    <article className="group cursor-pointer">
                      <div className="relative aspect-[7/8] overflow-hidden bg-white">
                        {previewImage ? (
                          <>
                            {/* Fond flouté : la photo garde son ratio d'origine
                                (choisi en gestion) sans être coupée */}
                            <img
                              src={previewImage}
                              alt=""
                              aria-hidden
                              className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
                              loading="lazy"
                            />
                            <img
                              src={previewImage}
                              alt={product.name}
                              className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                          </>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <span className="text-4xl">💡</span>
                          </div>
                        )}
                        {variationCount > 1 && (
                          <span className="absolute left-3 top-3 rounded-full bg-alto-brown/85 px-2.5 py-1 text-xs font-medium text-alto-cream">
                            {variationCount} {t("shop.colorCount")}
                          </span>
                        )}
                      </div>

                      <h3
                        className="mt-4 text-xl font-bold text-primary md:text-2xl"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {product.name}
                      </h3>
                      <p className="mt-1 text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </p>
                    </article>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
