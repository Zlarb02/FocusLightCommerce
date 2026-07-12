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
      {/* Hero portrait + tagline. Sur desktop la photo est montrée en pleine
          hauteur ancrée à gauche (jamais coupée en haut/bas) ; l'écran plus
          large que la photo est comblé par studio-backdrop-tile.jpg : la
          tranche droite (gris pur) de la photo suivie de son miroir, répétée
          en x. La tuile démarre sur le pixel du bord droit de la photo donc
          le raccord est invisible, et Anatole ne peut jamais apparaître en
          double. Un écran plus étroit coupe la droite, pas la gauche où se
          trouve Anatole. */}
      <section
        className="relative overflow-hidden md:h-[75vh] md:max-h-[900px]"
        style={{
          background: "linear-gradient(180deg, #777a81 0%, #797b83 55%, #6b6c70 100%)",
        }}
      >
        <div className="md:flex md:h-full">
          <img
            src="/images/alto/studio-portrait.jpg"
            alt="Anatole Collet dans son atelier, entouré de ses luminaires"
            className="h-[60vh] max-h-[780px] w-full object-cover object-[25%_center] md:h-full md:max-h-none md:w-auto md:max-w-none md:shrink-0"
          />
          <div
            aria-hidden="true"
            className="hidden md:block md:h-full md:flex-1"
            style={{
              backgroundImage: "url(/images/alto/studio-backdrop-tile.jpg)",
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
            }}
          />
        </div>
        <p className="absolute bottom-8 right-6 text-right font-normal text-alto-cream drop-shadow md:bottom-14 md:right-14 text-[clamp(26px,4.2vw,81px)] leading-none">
          {t("home.tagline").split(", ").map((part, i, arr) => (
            <span key={part}>
              {part}
              {i < arr.length - 1 ? "," : ""}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      </section>

      {/* Anatole Collet — manifeste (maquette : nom Bold aligné à gauche,
          rôle Regular calé à droite, manifeste pleine largeur) */}
      <section className="bg-alto-brown text-alto-cream dark:bg-alto-brown-deep">
        <div className="mx-auto max-w-[1920px] px-6 py-16 md:px-[2.5vw] md:py-24">
          <h1
            className="font-bold leading-none text-[clamp(48px,5.3vw,102px)]"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("studio.name")}
          </h1>
          <p className="mt-4 text-[clamp(18px,1.8vw,35px)] opacity-90 md:pl-[60%]">
            {t("studio.role")}
          </p>
          <div className="mt-12 max-w-[1557px] space-y-6 leading-relaxed text-[clamp(18px,2vw,39px)]">
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
              <figcaption className="mt-3 text-[clamp(14px,1.1vw,21px)] font-normal text-alto-orange">
                {t(value.labelKey)}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="max-w-xl">
          <h2
            className="whitespace-pre-line font-bold leading-none text-alto-brown dark:text-alto-cream text-[clamp(32px,3.3vw,64px)]"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("studio.noObjects.title")}
          </h2>
          <div className="mt-8 space-y-5 leading-relaxed text-foreground/90 text-[clamp(15px,1.5vw,23px)]">
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
          className="font-bold text-alto-orange text-[clamp(32px,4.1vw,78px)]"
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
                className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
