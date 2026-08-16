import type { CSSProperties } from "react";
import { Layout } from "@/components/Layout";
import { AltoMark } from "@/components/alto/AltoBrand";
import { useLanguage } from "@/contexts/LanguageContext";
import { heroTitleFitVw } from "@/lib/heroTitle";

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
      <section className="relative overflow-hidden">
        {/* Le hero tient dans le PREMIER ÉCRAN en desktop (demande d'Anatole,
            29/07 : l'écriture doit être lue à l'arrivée). La photo est verticale
            (1920×2880) : la montrer entière faisait près de trois écrans de
            haut, on revient donc au bandeau de la maquette (966 px sur 1920,
            soit 33 % de la photo, centrés) — haut et bas rognés à parts égales,
            ce que `object-cover` fait par défaut. En mobile PAREIL : la photo
            fait exactement un écran (demande d'Anatole, 16/08 — « les photos
            peuvent être coupées comme ça »), et non plus le cadre 143×291 de la
            maquette, qui dépassait d'un bon tiers d'écran et repoussait le titre
            hors de vue à l'arrivée. */}
        <img
          src="/images/alto/surmesure-hero.jpg"
          alt="Lampes sur-mesure en cours de création dans l'atelier"
          className="h-[calc(100svh-57px)] w-full object-cover md:h-[calc(100svh-96px)]"
        />
        {/* Écriture en BAS À DROITE du premier écran : accroche puis titre géant
            (218px sur la maquette, soit 24vw sur mobile et 11.4vw en desktop).
            Le cadre de placement fait la hauteur du premier écran (header déduit :
            56 px + 1 px de bordure en mobile, 96 px en desktop) et jamais plus
            que la photo (`max-h-full`), pour que le texte reste sur l'image
            quand celle-ci est plus courte. */}
        <div className="absolute inset-x-0 top-0 flex h-[calc(100svh-57px)] max-h-full flex-col justify-end px-[3%] pb-[2%] text-right md:h-[calc(100svh-96px)] md:px-[1%] md:pb-[1%]">
          <p className="text-alto-cream drop-shadow text-[2.6vw] md:text-[clamp(11px,1.6vw,30px)]">
            {t("sm.hero.tagline")}
          </p>
          {/* La taille vient de la maquette (218px sur 1920), mais ne dépasse
              jamais `--fit`, la largeur du cadre — voir `heroTitleFitVw`. */}
          <h1
            className="font-bold uppercase leading-[0.9] text-alto-cream drop-shadow text-[min(24vw,var(--fit))] md:text-[min(clamp(44px,11.4vw,218px),var(--fit))]"
            style={
              {
                fontFamily: "var(--font-titles)",
                "--fit": `${heroTitleFitVw(t("sm.title")).toFixed(2)}vw`,
              } as CSSProperties
            }
          >
            {t("sm.title")}
          </h1>
        </div>
      </section>

      {/* Intro : titre Bold orange puis paragraphes orange (maquette). */}
      <section className="mx-auto max-w-[1920px] px-6 pt-12 md:px-[6.1vw] md:pt-20">
        <h2
          className="font-bold text-alto-orange text-[9vw] md:text-[clamp(22px,2.3vw,44px)]"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("sm.lead")}
        </h2>
        <div className="mt-6 max-w-[1643px] space-y-5 leading-relaxed text-alto-orange text-[5.5vw] md:text-[clamp(13px,1.4vw,27px)]">
          <p>{t("sm.p1")}</p>
          <p>{t("sm.p2")}</p>
        </div>
      </section>

      {/* Process : 4 pastilles (logo Alto bleu) numérotées, reliées par le trait bleu.
          Le trait est porté par chaque étape sauf la dernière et relie sa pastille
          à la suivante :
          - mobile (vertical) : il part du bas du carré du logo et monte jusqu'au
            haut du chiffre suivant, sans marge ;
          - desktop (horizontal) : même tracé de gauche à droite, mais avec une
            marge visible à chaque extrémité — il ne touche ni le carré ni le chiffre.
          Le chiffre est bleu sur mobile, crème sur desktop, et légèrement décentré
          vers le haut du logo dans les deux cas. */}
      <section className="mx-auto max-w-[1920px] px-6 py-16 md:px-[10.9vw] md:py-24">
        <ol
          className="sm-steps grid gap-y-10 md:grid-cols-4 md:gap-x-0 md:gap-y-0"
          style={
            {
              /* Mesures de la maquette, rapportées aux bords du carré (--sm-mark
                 est défini dans index.css, en responsive) : le trait démarre 11 %
                 après le bord sortant du logo et se termine 25 % après le bord
                 entrant du logo suivant — il pénètre donc dans le disque évidé et
                 vient buter contre le chiffre. */
              "--sm-out": "calc(0.11 * var(--sm-mark))",
              "--sm-in": "calc(0.25 * var(--sm-mark))",
            } as React.CSSProperties
          }
        >
          {STEPS.map((n) => (
            <li
              key={n}
              className="relative flex items-start gap-5 md:block md:text-center"
            >
              {/* Desktop : le trait relie cette pastille à la suivante en passant
                  par les disques évidés — il s'arrête juste avant chaque chiffre.
                  Les colonnes étant jointives, le pas centre-à-centre vaut
                  exactement la largeur du <li>, soit 100 %. */}
              {n < STEPS.length && (
                <>
                  {/* Mobile : trait vertical, calé sur l'axe du monogramme. Il part
                      du bas du carré (+ marge sortante) et descend jusqu'au carré
                      de l'étape suivante — donc par-dessus tout le bloc de texte,
                      quelle que soit sa hauteur (le <li> suivant commence après le
                      gap-y-10) — puis pénètre dans son disque jusqu'au chiffre. */}
                  <span
                    aria-hidden="true"
                    className="absolute w-[3px] bg-alto-blue md:hidden"
                    style={{
                      left: "calc(var(--sm-mark) / 2)",
                      transform: "translateX(-50%)",
                      /* le trait démarre au ras du carré, sans marge */
                      top: "var(--sm-mark)",
                      bottom: "calc(-2.5rem - var(--sm-in))",
                    }}
                  />
                  {/* Desktop : trait horizontal — du bord droit du carré (+ marge
                      sortante) jusque dans le disque du logo suivant (+ marge
                      entrante). Colonnes jointives : le pas vaut 100 %. */}
                  <span
                    aria-hidden="true"
                    className="absolute hidden h-[3px] bg-alto-blue md:block"
                    style={{
                      top: "calc(var(--sm-mark) / 2)",
                      left: "calc(50% + var(--sm-mark) / 2 + var(--sm-out))",
                      width:
                        "calc(100% - var(--sm-mark) - var(--sm-out) + var(--sm-in))",
                    }}
                  />
                </>
              )}

              <div className="relative h-16 w-16 shrink-0 md:mx-auto md:h-[8.75vw] md:max-h-[168px] md:w-[8.75vw] md:max-w-[168px]">
                {/* Monogramme du designer, déclinaison bleue (disque évidé). */}
                <AltoMark color="blue" className="h-full w-full" title="" />
                {/* Chiffre bleu, posé dans le disque évidé du logo (donc sur le
                    fond crème de la section) et légèrement remonté par rapport au
                    centre du carré. */}
                {/* Le « 4 » a sa masse à gauche et une hampe fine à droite : centré
                    géométriquement, il paraît fuir à droite. On le recale
                    optiquement, comme la maquette. Les autres chiffres restent
                    centrés. */}
                <span
                  className={`absolute inset-0 flex items-start justify-center pt-[16%] font-bold leading-none text-alto-blue dark:text-alto-cream text-[7.2vw] md:pt-[13%] md:text-[clamp(28px,4.32vw,83px)] ${
                    n === 4 ? "pr-[8%]" : ""
                  }`}
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {n}
                </span>

              </div>
              {/* Corps de texte : la maquette mobile (484px) emploie les mêmes
                  tailles que la desktop (1920px) — 45px pour le titre d'étape,
                  22px pour la description. Les vw diffèrent donc selon la base :
                  45/484 = 9.3vw sur mobile, 45/1920 = 2.34vw à partir de md. */}
              <div className="md:mt-6">
                <h3
                  className="font-bold text-alto-orange text-[9.3vw] md:text-[clamp(24px,2.34vw,45px)]"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t(`sm.step${n}.title`)}
                </h3>
                {/* Texte brun posé sur la surface crème : il suit son support et
                    passe en crème quand celle-ci s'inverse en thème sombre. */}
                <p className="mt-2 leading-relaxed text-alto-brown dark:text-alto-cream/90 text-[4.5vw] md:mx-auto md:max-w-[316px] md:text-[clamp(13px,1.15vw,22px)]">
                  {t(`sm.step${n}.text`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Bloc devis — fond brun pleine largeur, CTA pill orange plein + tel en
          pill contour orange. */}
      {/* Bloc devis : brun en thème clair, ORANGE en sombre (maquette). */}
      <section className="bg-alto-brown text-alto-cream dark:bg-alto-orange">
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
              className="inline-flex items-center gap-3 rounded-full bg-alto-orange px-8 py-4 font-bold text-white transition-transform hover:scale-105 dark:bg-alto-brown md:px-12 md:py-6 text-[clamp(15px,2vw,38px)]"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              <img src="/images/alto/icon-mail.png" alt="" className="h-6 w-6 object-contain md:h-9 md:w-9" />
              {t("sm.cta.button")}
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="tel:+33782086690"
              className="inline-flex items-center gap-3 rounded-full border-[3px] border-alto-orange px-8 py-4 font-bold text-white transition-transform hover:scale-105 dark:border-alto-brown dark:bg-alto-brown md:px-10 md:py-6 text-[clamp(15px,1.9vw,37px)]"
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
