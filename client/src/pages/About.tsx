import { Layout } from "@/components/Layout";
import { InstagramFeed, INSTAGRAM_URL } from "@/components/alto/InstagramFeed";
import { useLanguage } from "@/contexts/LanguageContext";

const VALUES: Array<{ src: string; labelKey: string }> = [
  { src: "/images/alto/value-pla.png", labelKey: "studio.value.pla" },
  { src: "/images/alto/value-chene.png", labelKey: "studio.value.chene" },
  { src: "/images/alto/value-emballage.png", labelKey: "studio.value.emballage" },
  { src: "/images/alto/value-conception.png", labelKey: "studio.value.conception" },
  { src: "/images/alto/value-artisanale.png", labelKey: "studio.value.artisanale" },
  { src: "/images/alto/value-production.png", labelKey: "studio.value.production" },
];

export { INSTAGRAM_URL };

/**
 * Studio — artboard web-3 : hero photo plein cadre (1920×1280) avec la tagline
 * calée en bas à droite, bandeau brun « Anatole Collet », manifeste, pictos
 * valeurs face au texte « Je ne produis pas des objets. », puis Instagram.
 */
export default function About() {
  const { t } = useLanguage();

  return (
    <Layout headerTone="surface" footerTone="blue">
      {/* Hero : photo pleine largeur au ratio 3/2 de la maquette, mais bornée à
          la hauteur de l'écran (moins le header) pour qu'à l'arrivée sur la
          page Anatole soit visible en entier — baskettes comprises — avec la
          tagline bien cadrée en bas à droite. Le cadrage retombe sur le bas de
          la photo, là où sont les pieds. */}
      <section className="relative">
        <img
          src="/images/alto/studio-portrait.jpg"
          alt="Anatole Collet dans son atelier, entouré de ses luminaires"
          className="aspect-[3/2] max-h-[calc(100svh-96px)] w-full object-cover object-[center_65%]"
        />
        <p className="absolute bottom-[6%] right-[3%] text-right font-normal leading-tight text-alto-cream drop-shadow text-[clamp(22px,4.2vw,81px)]">
          {t("home.tagline").split(", ").map((part, i, arr) => (
            <span key={part}>
              {part}
              {i < arr.length - 1 ? "," : ""}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      </section>

      {/* Anatole Collet — nom Bold 102px à gauche, rôle Regular calé à droite,
          manifeste Regular 39px sur fond brun. */}
      <section className="bg-alto-brown text-alto-cream">
        <div className="mx-auto max-w-[1920px] px-6 py-14 md:px-[2.5vw] md:py-20">
          <h1
            className="font-bold uppercase leading-none text-[clamp(36px,5.3vw,102px)]"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("studio.name")}
          </h1>
          <p className="mt-3 text-[clamp(15px,1.8vw,35px)] md:pl-[62%]">
            {t("studio.role")}
          </p>
          <div className="mt-10 max-w-[1557px] space-y-6 leading-relaxed text-[clamp(16px,2vw,39px)] md:mt-20">
            <p>{t("studio.manifesto1")}</p>
            <p>{t("studio.manifesto2")}</p>
          </div>
        </div>
      </section>

      {/* Pictos valeurs (2 colonnes, libellés orange 21px) face au manifeste
          « Je ne produis pas des objets. » (Bold 64px brun). */}
      <section className="mx-auto grid max-w-[1920px] gap-12 px-6 py-16 md:grid-cols-2 md:gap-[6%] md:px-[5.7vw] md:py-24">
        <div className="grid grid-cols-2 content-start justify-items-center gap-x-6 gap-y-10 md:gap-y-12">
          {VALUES.map((value) => (
            <figure key={value.labelKey} className="w-full max-w-[220px] text-center">
              <img
                src={value.src}
                alt=""
                className="mx-auto h-20 w-20 object-contain md:h-[8.5vw] md:max-h-[164px] md:w-auto"
                loading="lazy"
              />
              <figcaption className="mt-2 font-normal text-alto-orange text-[clamp(12px,1.1vw,21px)]">
                {t(value.labelKey)}
              </figcaption>
            </figure>
          ))}
        </div>

        <div>
          <h2
            className="whitespace-pre-line font-bold uppercase leading-tight text-alto-brown dark:text-alto-cream text-[clamp(26px,3.3vw,64px)]"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("studio.noObjects.title")}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-alto-brown dark:text-alto-cream/90 text-[clamp(13px,1.2vw,23px)] md:mt-10">
            <p>{t("studio.noObjects.p1")}</p>
            <p>{t("studio.noObjects.strong")}</p>
            <p>{t("studio.noObjects.p2")}</p>
            <p className="whitespace-pre-line">{t("studio.noObjects.p3")}</p>
          </div>
          {/* Filet orange sous la colonne de texte (maquette : y=3114). */}
          <hr className="mt-10 border-alto-orange md:mt-16" />
        </div>
      </section>

      <InstagramFeed />
    </Layout>
  );
}
