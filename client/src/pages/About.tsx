import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const VALUES: Array<{ src: string; labelKey: string }> = [
  { src: "/images/alto/value-pla.png", labelKey: "studio.value.pla" },
  { src: "/images/alto/value-chene.png", labelKey: "studio.value.chene" },
  { src: "/images/alto/value-emballage.png", labelKey: "studio.value.emballage" },
  { src: "/images/alto/value-conception.png", labelKey: "studio.value.conception" },
  { src: "/images/alto/value-artisanale.png", labelKey: "studio.value.artisanale" },
  { src: "/images/alto/value-production.png", labelKey: "studio.value.production" },
];

export const INSTAGRAM_URL = "https://www.instagram.com/alto_lille/";

const FEED: Array<{ src: string; alt: string }> = [
  { src: "/images/alto/fab-macro-rouge.jpg", alt: "Abat-jour Focus rouge imprimé en 3D" },
  { src: "/images/alto/prod-auferte.jpg", alt: "Vide-poche Auferte.01" },
  { src: "/images/alto/surmesure-lampe.jpg", alt: "Lampe sur-mesure orange" },
];

/**
 * Studio — présentation d'Anatole Collet, manifeste et valeurs (maquette).
 */
export default function About() {
  const { t } = useLanguage();

  return (
    <Layout headerTone="surface" footerTone="blue">
      {/* Hero portrait + tagline */}
      <section className="relative">
        <img
          src="/images/alto/studio-portrait.jpg"
          alt="Anatole Collet dans son atelier, entouré de ses luminaires"
          className="h-[60vh] max-h-[780px] w-full object-cover object-[25%_center] md:h-[75vh]"
        />
        <p className="absolute bottom-8 right-6 text-right text-2xl font-medium text-alto-cream drop-shadow md:bottom-14 md:right-14 md:text-4xl">
          {t("home.tagline").split(", ").map((part, i, arr) => (
            <span key={part}>
              {part}
              {i < arr.length - 1 ? "," : ""}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      </section>

      {/* Anatole Collet — manifeste (orange en thème sombre, fidèle à la maquette) */}
      <section className="bg-alto-brown text-alto-cream dark:bg-alto-orange">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <h1
            className="text-center text-4xl font-bold md:text-6xl"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("studio.name")}
          </h1>
          <p className="mt-3 text-center text-lg opacity-90">
            {t("studio.role")}
          </p>
          <div className="mt-12 space-y-6 text-lg leading-relaxed md:text-xl">
            <p>{t("studio.manifesto1")}</p>
            <p>{t("studio.manifesto2")}</p>
          </div>
        </div>
      </section>

      {/* Valeurs + Je ne produis pas des objets */}
      <section className="mx-auto grid max-w-[1400px] gap-14 px-6 py-16 md:grid-cols-2 md:gap-20 md:px-10 md:py-24">
        <div className="grid grid-cols-2 content-center gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-2">
          {VALUES.map((value) => (
            <figure key={value.labelKey} className="text-center">
              <img
                src={value.src}
                alt=""
                className="mx-auto h-24 w-24 object-contain md:h-28 md:w-28"
                loading="lazy"
              />
              <figcaption className="mt-3 text-sm font-semibold text-primary md:text-base">
                {t(value.labelKey)}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="max-w-xl">
          <h2
            className="whitespace-pre-line text-3xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("studio.noObjects.title")}
          </h2>
          <div className="mt-8 space-y-5 leading-relaxed text-foreground/90">
            <p>{t("studio.noObjects.p1")}</p>
            <p className="font-semibold">{t("studio.noObjects.strong")}</p>
            <p>{t("studio.noObjects.p2")}</p>
            <p className="whitespace-pre-line">{t("studio.noObjects.p3")}</p>
          </div>
          <hr className="mt-10 border-border" />
        </div>
      </section>

      {/* Instagram */}
      <section className="mx-auto max-w-[1400px] px-6 pb-20 md:px-10 md:pb-28">
        <h2
          className="text-3xl font-bold text-primary md:text-5xl"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("studio.instagram")}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEED.map((post) => (
            <a
              key={post.src}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden bg-white"
            >
              <img
                src={post.src}
                alt={post.alt}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
