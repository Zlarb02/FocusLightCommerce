import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

interface StepMedia {
  type: "video" | "image";
  src: string;
  poster?: string;
  alt: string;
}

/** Média de chaque étape, dans l'ordre de la maquette (web-11 / iphone-9). */
const STEP_MEDIA: StepMedia[] = [
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
    type: "image",
    src: "/images/alto/fab-bois.jpg",
    alt: "Pièces de chêne prêtes à être assemblées et mises en colis",
  },
];

function StepVisual({ media }: { media: StepMedia }) {
  if (media.type === "video") {
    return (
      <video
        className="aspect-[4/3] w-full object-cover md:aspect-[3/2]"
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
      className="aspect-[4/3] w-full object-cover md:aspect-[3/2]"
      loading="lazy"
    />
  );
}

/**
 * Fabrication — web-11 / iphone-5 (thème clair) et web-14 / iphone-9 (sombre).
 *
 * La maquette existe en deux versions par page, qui ne diffèrent QUE par le
 * fond (crème en clair, brun en sombre) : la structure et les couleurs de
 * marque sont les mêmes. Le fond suit donc `bg-background`, et la bande
 * Sur-mesure reste brune avec un CTA orange dans les deux cas.
 *
 * Mise en page : hero avec le titre géant, citation orange, 5 étapes dont le
 * visuel file jusqu'au bord (alternance gauche/droite en desktop, empilement en
 * mobile), bande Sur-mesure, bande Recherche bleue, matière recyclée.
 */
export default function DesignEnAction() {
  const { t } = useLanguage();

  return (
    <Layout headerTone="surface" footerTone="blue">
      {/* Le fond suit le thème (crème en clair, brun en sombre) : les deux
          versions de la maquette ne diffèrent que par là — la structure, elle,
          est la même. */}
      <div className="bg-background text-foreground">
        {/* Hero : photo en gros plan, le titre géant (218px sur 1920) posé en bas
            À GAUCHE et débordant sur l'image, précédé de « Conçu et fabriqué à
            Lille » (30px). Le hero fait ~1010px de haut sur la maquette. */}
        <section className="relative overflow-hidden">
          {/* La photo source est verticale (1600×2400) et la lampe occupe son
              tiers supérieur : le cadre large de la maquette se cale donc en
              haut de l'image, pas au centre — sinon on ne voit que la laine. */}
          <img
            src="/images/alto/fab-macro-rouge.jpg"
            alt="Abat-jour Focus rouge imprimé en 3D, éclairé"
            className="aspect-[143/305] w-full object-cover object-[center_22%] md:aspect-[1920/1010]"
          />
          {/* Titre géant à gauche ; l'accroche se pose en bout de ligne, à
              droite, sur la dernière ligne du titre. */}
          {/* Mobile : accroche au-dessus du titre, alignée à droite. Desktop :
              en bout de la dernière ligne du titre. */}
          <div className="absolute inset-x-0 bottom-0 px-[3%] pb-[2%] md:flex md:items-end md:justify-between md:gap-4 md:px-[3.3%] md:pb-[1%]">
            <p className="order-2 text-right text-alto-cream drop-shadow text-[2.6vw] md:mb-[2%] md:shrink-0 md:text-[clamp(11px,1.56vw,30px)]">
              {t("fab.quoteBy")}
            </p>
            <h1
              className="order-1 font-bold uppercase leading-[0.9] text-alto-cream drop-shadow text-[13vw] md:text-[clamp(64px,11.35vw,218px)]"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("nav.fabrication")}
            </h1>
          </div>
        </section>

        {/* Citation orange (37px sur 1920), centrée sous un guillemet. */}
        <section className="mx-auto max-w-[1400px] px-6 py-10 text-center md:py-16">
          <p
            className="font-bold leading-none text-alto-orange text-[6vw] md:text-[clamp(20px,1.93vw,37px)]"
            style={{ fontFamily: "var(--font-titles)" }}
            aria-hidden="true"
          >
            &quot;
          </p>
          <p className="mt-2 leading-relaxed text-alto-orange text-[4.6vw] md:text-[clamp(16px,1.93vw,37px)]">
            {t("fab.quote")}
          </p>
        </section>

        {/* Les 5 étapes. Dans la maquette l'image de chaque étape file jusqu'au
            bord de la page (aucune marge extérieure) : la section n'a donc pas de
            padding horizontal, c'est la colonne de texte qui porte le sien. */}
        <section className="mx-auto max-w-[1920px] pb-12 md:pb-24">
          {STEP_MEDIA.map((media, i) => {
            const n = i + 1;
            // Desktop : l'image passe à gauche une ligne sur deux (maquette).
            const mediaFirst = i % 2 === 1;
            return (
              <article
                key={n}
                className="mb-12 md:mb-24 md:grid md:grid-cols-2 md:items-center md:gap-[6%]"
              >
                {/* Maquette : numéro géant (180px) à gauche, titre (60px) posé à
                    sa droite, et le corps de texte (23px) aligné sous le titre —
                    pas sous le numéro. Sur mobile tout s'empile. */}
                <div
                  className={`px-6 md:px-0 ${
                    mediaFirst
                      ? "md:order-2 md:pr-[5.7vw] md:pl-[6%]"
                      : "md:pl-[5.7vw] md:pr-[6%]"
                  }`}
                >
                  <div className="fab-step">
                    <div className="md:flex md:items-baseline md:gap-[3%]">
                      <p
                        className="shrink-0 font-bold leading-none text-alto-orange text-[16vw] md:text-[length:var(--fab-num)]"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {String(n).padStart(2, "0")}
                      </p>
                      <h2
                        className="mt-2 font-bold leading-tight text-alto-orange text-[9.3vw] md:mt-0 md:text-[clamp(24px,3.12vw,60px)]"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {t(`fab.step${n}.title`)}
                      </h2>
                    </div>
                    {/* Le corps s'aligne sous le titre, donc en retrait de la
                        largeur du numéro (2 chiffres) plus la gouttière. */}
                    <div className="md:pl-[var(--fab-indent)]">
                      <p className="mt-5 text-[3.6vw] md:mt-6 md:text-[clamp(12px,1.2vw,23px)]">
                        {t(`fab.step${n}.lead`)}
                      </p>
                      <div className="mt-3 space-y-3 leading-relaxed text-[3.4vw] md:space-y-4 md:text-[clamp(11px,1.2vw,23px)]">
                        {t(`fab.step${n}.body`)
                          .split("\n\n")
                          .map((paragraph) => (
                            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Mobile : l'image vient sous le texte, pleine largeur.
                    Desktop : elle occupe toute sa moitié, jusqu'au bord. */}
                <div className={`mt-8 md:mt-0 ${mediaFirst ? "md:order-1" : ""}`}>
                  <StepVisual media={media} />
                </div>
              </article>
            );
          })}
        </section>
      </div>

      {/* Bande Sur-mesure. En CLAIR : brune, titre crème, CTA orange (web-11,
          iphone-5). En SOMBRE la maquette diverge selon la taille, et on la
          suit à la lettre : mobile ORANGE avec CTA bleu (iphone-9), desktop
          CRÈME avec titre brun et CTA orange (web-14). */}
      <section className="bg-alto-brown text-alto-cream dark:bg-alto-orange dark:md:bg-alto-cream dark:md:text-alto-brown">
        <div className="mx-auto max-w-[1920px] px-6 py-12 md:flex md:items-end md:justify-between md:px-[5.7vw] md:py-20">
          <div>
            <p className="text-[3.4vw] md:text-[clamp(11px,1vw,20px)]">
              {t("fab.surmesure.intro")}
            </p>
            <h2
              className="mt-2 font-bold uppercase leading-[0.9] text-[15vw] md:mt-3 md:text-[clamp(48px,7.6vw,146px)]"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("fab.surmesure.title")}
            </h2>
          </div>
          <Link
            href="/creations-sur-mesure"
            className="mt-8 inline-block shrink-0 rounded-full bg-alto-orange px-8 py-3 font-bold text-alto-cream transition-transform hover:scale-105 dark:bg-alto-blue dark:md:bg-alto-orange md:mt-0 md:px-10 md:py-4 text-[4vw] md:text-[clamp(13px,1.05vw,20px)]"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("fab.surmesure.cta")}
          </Link>
        </div>
      </section>

      {/* Atelier + vidéo d'assemblage : triptyque en desktop, la seule photo
          d'atelier sur mobile (maquette). */}
      <section className="bg-background text-foreground">
        <div className="mx-auto grid max-w-[1920px] gap-6 px-6 py-12 sm:grid-cols-3 md:px-[5.7vw] md:py-16">
          <img
            src="/images/alto/atelier.jpg"
            alt="L'atelier Alto Lille"
            className="aspect-[3/4] w-full object-cover"
            loading="lazy"
          />
          <div className="relative hidden aspect-[3/4] w-full overflow-hidden bg-alto-cream sm:block">
            {/* Vidéo verticale : le poster flouté comble les côtés pour ne pas
                la déformer ni laisser de bandes. */}
            <img
              src="/images/alto/poster-assemblage.jpg"
              alt=""
              aria-hidden="true"
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
              aria-label={t("fab.videoAssemblage").replace("\n", " ")}
            />
          </div>
          <img
            src="/images/alto/fab-orange-base.jpg"
            alt="Détail du socle orange d'une lampe"
            className="hidden aspect-[3/4] w-full object-cover sm:block"
            loading="lazy"
          />
        </div>
      </section>

      {/* Bande Recherche — bleue, titre géant crème. */}
      <section className="bg-alto-blue text-alto-cream">
        <div className="mx-auto max-w-[1920px] px-6 py-12 md:px-[5.7vw] md:py-20">
          <p className="text-[3vw] md:text-[clamp(11px,1vw,20px)]">
            {t("fab.recherche.intro")}
          </p>
          <h2
            className="mt-2 font-bold uppercase leading-[0.9] text-[14vw] md:mt-3 md:text-[clamp(48px,7.6vw,146px)]"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("fab.recherche.title")}
          </h2>
        </div>
      </section>

      {/* Matière recyclée : trois photos en desktop, une seule sur mobile
          (maquette), sur fond brun côté mobile. */}
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-[1920px] px-6 py-12 md:px-[5.7vw] md:py-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <img
              src="/images/alto/fab-broyeur.jpg"
              alt="Broyeur de plastique recyclé"
              className="hidden aspect-[4/3] w-full object-cover sm:block"
              loading="lazy"
            />
            <img
              src="/images/alto/fab-bouteilles.jpg"
              alt="Bouteilles plastique collectées pour recyclage"
              className="hidden aspect-[4/3] w-full object-cover sm:block"
              loading="lazy"
            />
            <img
              src="/images/alto/fab-flocons.jpg"
              alt="Flocons de plastique recyclé issus de bouteilles d'eau"
              className="aspect-[3/4] w-full object-cover sm:aspect-[4/3]"
              loading="lazy"
            />
          </div>
          <p className="mt-6 leading-relaxed text-[4vw] md:text-[clamp(12px,1.05vw,20px)]">
            {t("fab.recherche.caption")}
          </p>
        </div>
      </section>
    </Layout>
  );
}
