import { Layout } from "@/components/Layout";
import { AltoMark } from "@/components/alto/AltoBrand";
import { useLanguage } from "@/contexts/LanguageContext";

const REALISATIONS: Array<{ src: string; alt: string }> = [
  { src: "/images/alto/fab-orange-base.jpg", alt: "Détail du socle orange d'une lampe sur-mesure" },
  { src: "/images/alto/atelier.jpg", alt: "Lampe sur-mesure dans un atelier de création" },
  { src: "/images/alto/surmesure-lampe.jpg", alt: "Lampe de table sur-mesure, chêne et PLA orange" },
];

/**
 * Sur-mesure — offre de création personnalisée (maquette) :
 * intro, process en 4 étapes, appel à devis, réalisations.
 */
export default function CreationsSurMesure() {
  const { t } = useLanguage();

  return (
    <Layout headerTone="surface" footerTone="blue">
      {/* Titre + intro */}
      <section className="mx-auto max-w-[1400px] px-6 pt-12 md:px-10 md:pt-20">
        <h1
          className="text-5xl font-bold text-primary md:text-7xl"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("sm.title")}
        </h1>
        <div className="mt-10 max-w-3xl space-y-5 text-lg leading-relaxed text-primary md:text-xl">
          <p className="font-bold">{t("sm.lead")}</p>
          <p>{t("sm.p1")}</p>
          <p>{t("sm.p2")}</p>
        </div>
      </section>

      {/* Process en 4 étapes */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <ol className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="text-center">
              <div className="relative mx-auto h-20 w-20 text-alto-blue md:h-24 md:w-24">
                <AltoMark className="h-full w-full" title={`Étape ${n}`} />
                <span
                  className="absolute inset-0 flex items-center justify-center text-3xl font-bold md:text-4xl"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {n}
                </span>
              </div>
              <h2
                className="mt-5 text-xl font-bold text-primary md:text-2xl"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t(`sm.step${n}.title`)}
              </h2>
              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-relaxed md:text-base">
                {t(`sm.step${n}.text`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Appel à devis */}
      <section className="bg-alto-brown text-alto-cream dark:bg-alto-brown-deep">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <h2
            className="text-4xl font-bold md:text-6xl"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("sm.cta.title")}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            {t("sm.cta.text")}
          </p>
          <div className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center">
            <a
              href="mailto:altolille@gmail.com?subject=Projet%20sur-mesure"
              className="inline-flex items-center gap-3 rounded-full bg-alto-orange px-10 py-4 text-lg font-bold text-alto-cream transition-transform hover:scale-105"
            >
              <img
                src="/images/alto/icon-mail.png"
                alt=""
                className="h-6 w-6 object-contain"
              />
              {t("sm.cta.button")}
            </a>
            <a
              href="tel:+33782086690"
              className="inline-flex items-center gap-3 text-lg font-bold hover:underline"
            >
              <img
                src="/images/alto/icon-phone.png"
                alt=""
                className="h-6 w-6 object-contain"
              />
              +33 7 82 08 66 90
            </a>
          </div>
          <p className="mt-10 text-sm opacity-80">{t("sm.cta.delay")}</p>
        </div>
      </section>

      {/* Réalisations */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <p className="mb-8 text-lg font-medium">{t("sm.realisations")}</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {REALISATIONS.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
