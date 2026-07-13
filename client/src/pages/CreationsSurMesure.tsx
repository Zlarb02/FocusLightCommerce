import { Layout } from "@/components/Layout";
import { AltoMark } from "@/components/alto/AltoBrand";
import { useLanguage } from "@/contexts/LanguageContext";

const STEPS = [1, 2, 3, 4] as const;

const REALISATIONS: Array<{ src: string; alt: string }> = [
  { src: "/images/alto/fab-orange-base.jpg", alt: "Détail du socle orange d'une lampe sur-mesure" },
  { src: "/images/alto/atelier.jpg", alt: "Lampe sur-mesure dans un atelier de création" },
  { src: "/images/alto/surmesure-lampe.jpg", alt: "Lampe de table sur-mesure, chêne et PLA orange" },
];

/**
 * Sur-mesure — artboard web-12 : hero photo atelier avec le titre géant en
 * surimpression, intro orange, process en 4 étapes reliées par une ligne bleue
 * passant par les pastilles du logo Alto, bloc devis brun, réalisations.
 *
 * La ligne bleue est horizontale sur desktop et verticale sur mobile
 * (iphone-10) : dans les deux cas c'est un trait #1B5EC4 posé derrière les
 * pastilles, borné au centre de la première et de la dernière.
 */
export default function CreationsSurMesure() {
  const { t } = useLanguage();

  return (
    <Layout headerTone="surface" footerTone="blue">
      {/* Hero : photo atelier, titre géant crème (218px sur 1920) débordant sur
          l'image, accroche fine juste au-dessus. */}
      <section className="relative">
        <img
          src="/images/alto/surmesure-hero.jpg"
          alt="Lampes sur-mesure en cours de création dans l'atelier"
          className="aspect-[16/9] w-full object-cover md:aspect-[1920/1064]"
        />
        <div className="absolute inset-x-0 bottom-0 px-[1%] pb-[1%]">
          <p className="text-alto-cream drop-shadow text-[clamp(11px,1.6vw,30px)]">
            {t("sm.hero.tagline")}
          </p>
          <h1
            className="font-bold uppercase leading-[0.9] text-alto-cream drop-shadow text-[clamp(44px,11.4vw,218px)]"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("sm.title")}
          </h1>
        </div>
      </section>

      {/* Intro : titre Bold orange puis paragraphes orange (maquette). */}
      <section className="mx-auto max-w-[1920px] px-6 pt-12 md:px-[6.1vw] md:pt-20">
        <h2
          className="font-bold text-alto-orange text-[clamp(22px,2.3vw,44px)]"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("sm.lead")}
        </h2>
        <div className="mt-6 max-w-[1643px] space-y-5 leading-relaxed text-alto-orange text-[clamp(13px,1.4vw,27px)]">
          <p>{t("sm.p1")}</p>
          <p>{t("sm.p2")}</p>
        </div>
      </section>

      {/* Process : 4 pastilles Alto bleues numérotées, reliées par la ligne bleue. */}
      <section className="mx-auto max-w-[1920px] px-6 py-16 md:px-[10.9vw] md:py-24">
        <ol className="relative grid gap-y-10 md:grid-cols-4 md:gap-x-[12%] md:gap-y-0">
          {/* Ligne bleue — mobile : verticale, bornée au centre des pastilles
              extrêmes (la pastille fait 4rem, donc 2rem de marge haut/bas). */}
          <span
            aria-hidden="true"
            className="absolute left-8 top-8 bottom-8 w-[3px] bg-alto-blue md:hidden"
          />
          {/* Ligne bleue — desktop : horizontale, à hauteur du centre des
              pastilles (168px sur 1920 → 8.75vw), bornée d'un demi-pas. */}
          <span
            aria-hidden="true"
            className="absolute hidden h-[3px] bg-alto-blue md:block"
            style={{
              top: "calc(min(8.75vw, 168px) / 2)",
              left: "calc((100% - 3 * 12%) / 8)",
              right: "calc((100% - 3 * 12%) / 8)",
            }}
          />

          {STEPS.map((n) => (
            <li
              key={n}
              className="relative flex items-start gap-5 md:block md:text-center"
            >
              <div className="relative z-10 h-16 w-16 shrink-0 text-alto-blue md:mx-auto md:h-[8.75vw] md:max-h-[168px] md:w-[8.75vw] md:max-w-[168px]">
                <AltoMark className="h-full w-full" title={`Étape ${n}`} />
                <span
                  className="absolute inset-0 flex items-center justify-center font-bold text-alto-blue text-[clamp(24px,4.3vw,83px)]"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {n}
                </span>
              </div>
              <div className="md:mt-6">
                <h3
                  className="font-bold text-alto-orange text-[clamp(18px,2.3vw,45px)]"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t(`sm.step${n}.title`)}
                </h3>
                <p className="mt-2 leading-relaxed text-alto-brown dark:text-alto-cream/90 text-[clamp(11px,1.15vw,22px)] md:mx-auto md:max-w-[316px]">
                  {t(`sm.step${n}.text`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Bloc devis — fond brun pleine largeur, CTA pill orange plein + tel en
          pill contour orange. */}
      <section className="bg-alto-brown text-alto-cream dark:bg-alto-brown-deep">
        <div className="mx-auto max-w-[1920px] px-6 py-14 md:px-[6.1vw] md:py-20">
          <h2
            className="font-bold text-[clamp(26px,3.9vw,75px)]"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("sm.cta.title")}
          </h2>
          <p className="mt-5 max-w-[1003px] leading-relaxed text-[clamp(14px,1.8vw,35px)]">
            {t("sm.cta.text")}
          </p>

          <div className="mt-10 flex flex-col items-start gap-5 md:mt-20 md:flex-row md:items-center md:justify-center md:gap-8">
            <a
              href="mailto:altolille@gmail.com?subject=Projet%20sur-mesure"
              className="inline-flex items-center gap-3 rounded-full bg-alto-orange px-8 py-4 font-bold text-white transition-transform hover:scale-105 md:px-12 md:py-6 text-[clamp(15px,2vw,38px)]"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              <img src="/images/alto/icon-mail.png" alt="" className="h-6 w-6 object-contain md:h-9 md:w-9" />
              {t("sm.cta.button")}
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="tel:+33782086690"
              className="inline-flex items-center gap-3 rounded-full border-[3px] border-alto-orange px-8 py-4 font-bold text-white transition-transform hover:scale-105 md:px-10 md:py-6 text-[clamp(15px,1.9vw,37px)]"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              <img src="/images/alto/icon-phone.png" alt="" className="h-6 w-6 object-contain md:h-8 md:w-8" />
              +33 7.82.08.66.90
            </a>
          </div>

          <p className="mt-10 text-right text-[clamp(11px,1.3vw,25px)] md:mt-14">
            {t("sm.cta.delay")}
          </p>
        </div>
      </section>

      {/* Réalisations */}
      <section className="mx-auto max-w-[1920px] px-6 py-14 md:px-[9vw] md:py-20">
        <p className="mb-8 text-alto-brown dark:text-alto-cream text-[clamp(13px,1.4vw,27px)]">
          {t("sm.realisations")}
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-[4.5%]">
          {REALISATIONS.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className="aspect-[493/740] w-full object-cover"
              loading="lazy"
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
