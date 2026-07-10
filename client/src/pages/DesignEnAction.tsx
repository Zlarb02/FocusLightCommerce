import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

interface StepMediaDef {
  type: "video" | "image";
  src: string;
  poster?: string;
  alt: string;
}

const STEP_MEDIA: StepMediaDef[] = [
  {
    type: "image",
    src: "/images/alto/fab-bois.jpg",
    alt: "Tasseaux de chêne massif récupérés en parqueterie",
  },
  {
    type: "video",
    src: "/videos/fabrication-decoupe.mp4",
    poster: "/images/alto/poster-decoupe.jpg",
    alt: "Découpe des tasseaux de chêne à la scie",
  },
  {
    type: "video",
    src: "/videos/fabrication-conception.mp4",
    poster: "/images/alto/poster-conception.jpg",
    alt: "Croquis et recherche de design",
  },
  {
    type: "image",
    src: "/images/alto/fab-imprimante.jpg",
    alt: "Impression 3D d'une pièce en PLA dans l'atelier",
  },
  {
    type: "video",
    src: "/videos/fabrication-assemblage.mp4",
    poster: "/images/alto/poster-assemblage.jpg",
    alt: "Assemblage d'une lampe Alto Lille",
  },
];

function StepMedia({ media }: { media: StepMediaDef }) {
  if (media.type === "video") {
    // Ratio natif conservé : les vidéos (dont une verticale) ne sont jamais coupées
    return (
      <video
        className="mx-auto max-h-[72vh] w-auto max-w-full"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={media.alt}
      />
    );
  }
  return (
    <img
      src={media.src}
      alt={media.alt}
      className="aspect-[4/3] w-full object-cover"
      loading="lazy"
    />
  );
}

/**
 * Fabrication — le processus complet en 5 étapes (maquette),
 * du réemploi du chêne à la mise en colis.
 */
export default function DesignEnAction() {
  const { t } = useLanguage();

  return (
    <Layout headerTone="surface" footerTone="brown">
      {/* Hero : duo d'images + citation */}
      <section className="mx-auto max-w-[1600px] px-4 pt-6 md:px-10">
        <h1 className="sr-only">{t("nav.fabrication")}</h1>
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          <img
            src="/images/alto/fab-macro-rouge.jpg"
            alt="Abat-jour Focus rouge imprimé en 3D"
            className="aspect-square w-full object-cover md:aspect-[4/3]"
          />
          <img
            src="/images/alto/fab-bois.jpg"
            alt="Chutes de chêne massif prêtes à être revalorisées"
            className="aspect-square w-full object-cover object-bottom md:aspect-[4/3]"
          />
        </div>
        <blockquote className="max-w-2xl py-12 md:py-16">
          <p className="text-xl font-medium leading-relaxed md:text-2xl">
            «&nbsp;{t("fab.quote")}&nbsp;»
          </p>
          <footer className="mt-4 text-lg font-bold text-primary">
            {t("fab.quoteBy")}
          </footer>
        </blockquote>
      </section>

      {/* Les 5 étapes */}
      <section className="mx-auto max-w-[1600px] space-y-20 px-4 pb-24 md:space-y-28 md:px-10">
        {STEP_MEDIA.map((media, i) => {
          const n = i + 1;
          const mediaLeft = i % 2 === 1;
          return (
            <article
              key={n}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div className={mediaLeft ? "md:order-2" : ""}>
                <div className="flex items-start gap-5">
                  <span
                    aria-hidden
                    className="select-none text-6xl font-bold text-primary md:text-8xl"
                    style={{
                      fontFamily: "var(--font-titles)",
                      WebkitTextStroke: "2px currentColor",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {String(n).padStart(2, "0")}
                  </span>
                  <h2
                    className="pt-2 text-3xl font-bold text-primary md:pt-4 md:text-4xl"
                    style={{ fontFamily: "var(--font-titles)" }}
                  >
                    {t(`fab.step${n}.title`)}
                  </h2>
                </div>
                <p className="mt-6 font-semibold">{t(`fab.step${n}.lead`)}</p>
                <div className="mt-4 space-y-4 leading-relaxed text-foreground/90">
                  {t(`fab.step${n}.body`)
                    .split("\n\n")
                    .map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                </div>
              </div>
              <div
                className={`self-center overflow-hidden ${
                  mediaLeft ? "md:order-1" : ""
                }`}
              >
                <StepMedia media={media} />
              </div>
            </article>
          );
        })}
      </section>

      {/* Bandeau Sur-mesure */}
      <section className="bg-alto-brown text-alto-cream dark:bg-alto-brown-deep">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-16 md:flex-row md:items-end md:justify-between md:px-10 md:py-24">
          <div>
            <p className="mb-4 text-lg opacity-90">
              {t("fab.surmesure.intro")}
            </p>
            <h2
              className="text-5xl font-bold md:text-8xl"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("fab.surmesure.title")}
            </h2>
          </div>
          <Link
            href="/creations-sur-mesure"
            className="inline-block self-start rounded-full bg-alto-orange px-10 py-4 text-lg font-bold text-alto-cream transition-transform hover:scale-105 md:self-auto"
          >
            {t("fab.surmesure.cta")}
          </Link>
        </div>
      </section>

      {/* Galerie atelier */}
      <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-6 py-16 sm:grid-cols-3 md:px-10 md:py-24">
        <img
          src="/images/alto/atelier.jpg"
          alt="L'atelier Alto Lille"
          className="aspect-[3/4] w-full object-cover"
          loading="lazy"
        />
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {/* Le poster flouté comble les côtés : la vidéo verticale reste
              entière, sans bandes blanches */}
          <img
            src="/images/alto/poster-assemblage.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
            loading="lazy"
          />
          <video
            className="absolute inset-0 h-full w-full object-contain"
            src="/videos/fabrication-assemblage.mp4"
            poster="/images/alto/poster-assemblage.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Vidéo d'assemblage d'une lampe"
          />
          <span className="absolute bottom-3 left-3 whitespace-pre-line bg-alto-cream/90 px-3 py-1.5 text-lg font-bold leading-tight text-alto-brown">
            {t("fab.videoAssemblage")}
          </span>
        </div>
        <img
          src="/images/alto/fab-orange-base.jpg"
          alt="Détail du socle orange d'une lampe sur-mesure"
          className="aspect-[3/4] w-full object-cover"
          loading="lazy"
        />
      </section>

      {/* Bandeau Recherche */}
      <section className="bg-alto-blue text-alto-cream">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24">
          <p className="mb-4 text-lg opacity-90">{t("fab.recherche.intro")}</p>
          <h2
            className="text-5xl font-bold md:text-8xl"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("fab.recherche.title")}
          </h2>
        </div>
      </section>

      {/* Matière recyclée */}
      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <img
            src="/images/alto/fab-broyeur.jpg"
            alt="Broyeur de plastique recyclé"
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          <img
            src="/images/alto/fab-bouteilles.jpg"
            alt="Bouteilles plastique collectées pour recyclage"
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          <img
            src="/images/alto/fab-flocons.jpg"
            alt="Flocons de plastique recyclé issus de bouteilles d'eau"
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="mt-6 font-medium text-alto-blue dark:text-alto-cream">
          {t("fab.recherche.caption")}
        </p>
      </section>
    </Layout>
  );
}
