import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "motion/react";
import { Layout } from "@/components/Layout";
import { ProductWithVariations } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ArrowRight } from "lucide-react";
import { formatPrice, isProductOutOfStock } from "@/lib/utils";

/**
 * Catalogue — refonte dans l'identité Alto (maquette RARE.design) :
 * grand titre éditorial, produit à la une, grille numérotée sur tuiles
 * blanches au fond flouté (les photos ne sont jamais recadrées).
 */

/** Photo produit sur tuile : copie floutée en fond, image entière devant. */
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
    <div className={`relative overflow-hidden bg-white ${className}`}>
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

  // Produit à la une : le premier disponible à la vente, sinon le premier
  const featured = useMemo(() => {
    if (searchTerm !== "" || filteredProducts.length === 0) return null;
    return filteredProducts.find((p) => !isProductOutOfStock(p)) ?? filteredProducts[0];
  }, [filteredProducts, searchTerm]);

  const gridProducts = featured
    ? filteredProducts.filter((p) => p.id !== featured.id)
    : filteredProducts;

  const featuredImage = featured?.variations?.[0]?.images?.[0]?.url;

  return (
    <Layout headerTone="brown" footerTone="brown">
      <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
        {/* En-tête éditorial */}
        <header className="mb-10 md:mb-16">
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-alto-orange md:text-sm"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("shop.kicker")}
          </p>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1
              className="text-5xl font-bold leading-[0.95] text-alto-blue md:text-7xl dark:text-alto-cream"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("shop.title")}
            </h1>
            <div className="flex items-center gap-6">
              <p className="hidden max-w-[220px] text-sm leading-snug text-muted-foreground md:block">
                {t("shop.tagline")}
              </p>
              {/* Recherche */}
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
            </div>
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

        {/* Produit à la une */}
        {!isLoading && featured && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0.22, 1] }}
          >
            <Link href={`/shop/${featured.id}`}>
              <article className="group mb-14 grid cursor-pointer overflow-hidden md:mb-20 md:grid-cols-[1.5fr_1fr]">
                <ProductTile
                  url={featuredImage}
                  alt={featured.name}
                  className="aspect-[4/3] md:aspect-auto md:min-h-[460px]"
                />
                <div className="flex flex-col justify-between gap-8 bg-alto-brown p-8 text-alto-cream md:p-12 dark:bg-alto-brown-deep">
                  <div>
                    <p
                      className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-alto-orange"
                      style={{ fontFamily: "var(--font-titles)" }}
                    >
                      {t("shop.featured")}
                    </p>
                    <h2
                      className="mb-5 text-4xl font-bold leading-none md:text-5xl"
                      style={{ fontFamily: "var(--font-titles)" }}
                    >
                      {featured.name}
                    </h2>
                    <p className="line-clamp-4 max-w-md leading-relaxed text-alto-cream/80">
                      {featured.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    {isProductOutOfStock(featured) ? (
                      <span className="text-sm font-medium text-alto-cream/60">
                        {t("shop.outOfStock")}
                      </span>
                    ) : (
                      <span
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {formatPrice(featured.price)}
                      </span>
                    )}
                    <span
                      className="inline-flex items-center gap-2 rounded-full bg-alto-orange px-6 py-2.5 text-sm font-bold text-alto-cream transition-transform group-hover:translate-x-1"
                      style={{ fontFamily: "var(--font-titles)" }}
                    >
                      {t("shop.discover")}
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        )}

        {/* Grille éditoriale numérotée */}
        {!isLoading && gridProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 xl:grid-cols-4">
            {gridProducts.map((product, index) => {
              const previewImage = product.variations?.[0]?.images?.[0]?.url;
              const variationCount = product.variations?.length || 0;
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
                          className="aspect-[7/8]"
                        />
                        {/* Index éditorial */}
                        <span
                          className="absolute left-3 top-3 text-xs font-bold tracking-widest text-alto-brown/60 dark:text-alto-brown"
                          style={{ fontFamily: "var(--font-titles)" }}
                        >
                          {String(index + (featured ? 2 : 1)).padStart(2, "0")}
                        </span>
                        {outOfStock && (
                          <span className="absolute right-3 top-3 rounded-full bg-alto-brown/85 px-3 py-1 text-xs font-medium text-alto-cream">
                            {t("shop.outOfStock")}
                          </span>
                        )}
                        {/* CTA au survol, comme le slider de la landing */}
                        <span
                          className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-alto-orange px-4 py-1.5 text-xs font-bold text-alto-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{ fontFamily: "var(--font-titles)" }}
                        >
                          {t("shop.discover")}
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline justify-between gap-3">
                        <h3
                          className="text-lg font-bold leading-tight text-primary md:text-xl"
                          style={{ fontFamily: "var(--font-titles)" }}
                        >
                          {product.name}
                        </h3>
                        {!outOfStock && (
                          <p
                            className="shrink-0 text-lg font-bold text-primary"
                            style={{ fontFamily: "var(--font-titles)" }}
                          >
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {outOfStock
                          ? t("shop.outOfStock")
                          : variationCount > 1
                            ? `${variationCount} ${t("shop.colorCount")}`
                            : t("shop.singleColor")}
                      </p>
                    </article>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bandeau manifeste */}
        {!isLoading && (
          <div className="mt-20 border-t border-border pt-10 text-center md:mt-28">
            <p
              className="mx-auto max-w-xl text-2xl font-bold leading-snug text-alto-blue md:text-3xl dark:text-alto-cream"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("shop.manifesto")}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{t("shop.manifesto.sub")}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
