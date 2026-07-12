import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "motion/react";
import { Layout } from "@/components/Layout";
import { ProductWithVariations } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
import { isProductOutOfStock } from "@/lib/utils";

/**
 * Catalogue — grille simple fidèle à la maquette (RARE.design, Web 1920–5) :
 * tuiles sur fond gris clair, nom et prix orange en Bold. Pas de produit à
 * la une ni de bandeau manifeste (retirés vs l'ancienne version éditoriale).
 */

/** Prix catalogue au format maquette « 25.00€ » (2 décimales, sans espace). */
function catalogPrice(price: number): string {
  return `${price.toFixed(2)}€`;
}

/** Photo produit sur tuile grise : copie floutée en fond, image entière devant. */
function ProductTile({
  url,
  alt,
  className = "",
}: {
  url?: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#F6F5F3] ${className}`}>
      {url ? (
        <>
          <img
            src={url}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
            loading="lazy"
          />
          <img
            src={url}
            alt={alt}
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-4xl text-muted-foreground">
          💡
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  const { data: products = [], isLoading } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <Layout headerTone="brown" footerTone="brown">
      <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
        {/* En-tête : titre bleu + recherche discrète */}
        <header className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-center md:justify-between">
          <h1
            className="text-[clamp(28px,2vw,40px)] font-bold leading-none text-alto-blue dark:text-alto-cream"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("shop.title")}
          </h1>
          {/* Recherche discrète à droite */}
          <div className="relative w-full max-w-xs md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              placeholder={t("shop.general.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-alto-orange"
            />
          </div>
        </header>

        {isLoading && (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="py-24 text-center text-muted-foreground">
            {searchTerm ? t("shop.general.noResults") : t("shop.noProducts")}
          </div>
        )}

        {/* Grille produits — 2 colonnes mobile / 4 desktop */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
            {filteredProducts.map((product, index) => {
              const previewImage = product.variations?.[0]?.images?.[0]?.url;
              const outOfStock = isProductOutOfStock(product);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.06, 0.4),
                    ease: [0.32, 0.72, 0.22, 1],
                  }}
                >
                  <Link href={`/shop/${product.id}`}>
                    <article className="group cursor-pointer">
                      <div className="relative">
                        <ProductTile
                          url={previewImage}
                          alt={product.name}
                          className="aspect-[4/3.5]"
                        />
                        {outOfStock && (
                          <span className="absolute right-3 top-3 rounded-full bg-alto-brown/85 px-3 py-1 text-xs font-medium text-alto-cream">
                            {t("shop.outOfStock")}
                          </span>
                        )}
                      </div>

                      {/* Nom orange Bold */}
                      <h3
                        className="mt-4 text-[clamp(22px,2.4vw,46px)] font-bold leading-tight text-alto-orange"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {product.name}
                      </h3>
                      {/* Prix orange Bold, format 25.00€ */}
                      <p
                        className="text-[clamp(22px,2.4vw,46px)] font-bold leading-tight text-alto-orange"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {outOfStock
                          ? t("shop.outOfStock")
                          : catalogPrice(product.price)}
                      </p>
                    </article>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
