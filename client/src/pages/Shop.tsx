import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "motion/react";
import { Layout } from "@/components/Layout";
import { AltoReviews } from "@/components/AltoReviews";
import { ProductWithVariations } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { isProductOutOfStock } from "@/lib/utils";

/**
 * Catalogue — maquette XD `cffd37ec` (Web 1920–5) : sous le header, une grille
 * de 3 colonnes seulement. Valeurs natives 1920 : vignettes 479×508 à x=200,
 * 725, 1250 (gap 46) ; nom Geist Bold 50px et prix Bold 40px en brun #4A2020.
 * Ni titre de page, ni recherche dans l'artboard.
 */

/** Prix catalogue au format maquette « 25.00 € ». */
function catalogPrice(price: number): string {
  return `${price.toFixed(2)} €`;
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

  const { t } = useLanguage();

  return (
    <Layout headerTone="brown-desktop" footerTone="blue">
      {/* Marges maquette : 200/1920 = 10.42% ; grille limitée à 1920 comme l'artboard */}
      <div className="mx-auto max-w-[1920px] px-[6vw] pb-16 pt-[6vw] md:px-[10.42vw] md:pb-24 md:pt-[5.6vw]">
        {isLoading && (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="py-24 text-center text-muted-foreground">
            {t("shop.noProducts")}
          </div>
        )}

        {/* Grille : 2 colonnes mobile / 3 desktop (maquette), gap 46/1920 = 2.4% */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-[4vw] gap-y-[7vw] md:grid-cols-3 md:gap-x-[2.4vw] md:gap-y-[3.9vw]">
            {products.map((product, index) => {
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
                        {/* Cadre maquette 479×508 */}
                        <ProductTile
                          url={previewImage}
                          alt={product.name}
                          className="aspect-[479/508]"
                        />
                        {outOfStock && (
                          <span className="absolute right-3 top-3 rounded-full bg-alto-brown/85 px-3 py-1 text-xs font-medium text-alto-cream">
                            {t("shop.outOfStock")}
                          </span>
                        )}
                      </div>

                      {/* Nom : Geist Bold 50px brun (maquette) */}
                      <h3
                        className="mt-[1.4vw] text-[clamp(18px,2.6vw,50px)] font-bold leading-tight text-alto-brown dark:text-alto-cream"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {product.name}
                      </h3>
                      {/* Prix : Geist Bold 40px brun, format « 25.00 € » */}
                      <p
                        className="mt-[0.6vw] text-[clamp(15px,2.08vw,40px)] font-bold leading-tight text-alto-brown dark:text-alto-cream"
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

      {/* Avis Google, juste avant le footer (même bloc que la fiche produit).
          Hors du conteneur de la grille : ses 10,42vw de marges étranglaient la
          rangée d'avis, qui court presque bord à bord dans la maquette. */}
      {!isLoading && products.length > 0 && (
        <div className="mx-auto max-w-[1920px] px-[6vw] pb-16 pt-[8vw] md:px-[2.65vw] md:pb-24 md:pt-[5vw]">
          <AltoReviews />
        </div>
      )}
    </Layout>
  );
}
