import { Layout } from "@/components/Layout";

const VALUES: Array<{ src: string; label: string }> = [
  { src: "/images/alto/value-pla.png", label: "PLA éco-responsable" },
  { src: "/images/alto/value-chene.png", label: "Chêne écogéré" },
  { src: "/images/alto/value-emballage.png", label: "Emballage écologique" },
  { src: "/images/alto/value-conception.png", label: "Conception raisonnée" },
  { src: "/images/alto/value-artisanale.png", label: "Fabrication artisanale" },
  { src: "/images/alto/value-production.png", label: "Production française" },
];

const INSTAGRAM_URL = "https://www.instagram.com/altolille";

const FEED: Array<{ src: string; alt: string }> = [
  { src: "/images/alto/fab-macro-rouge.jpg", alt: "Lampe Focus rouge en situation" },
  { src: "/images/alto/prod-auferte.jpg", alt: "Vide-poche Auferte.01" },
  { src: "/images/alto/surmesure-lampe.jpg", alt: "Lampe sur-mesure orange" },
];

/**
 * Studio — présentation d'Anatole Collet, manifeste et valeurs (maquette).
 */
export default function About() {
  return (
    <Layout headerTone="surface" footerTone="blue">
      {/* Hero portrait + tagline */}
      <section className="relative">
        <img
          src="/images/alto/studio-portrait.jpg"
          alt="Anatole Collet dans son atelier, entouré de ses luminaires"
          className="h-[60vh] w-full object-cover object-left md:h-[75vh]"
        />
        <p className="absolute bottom-8 right-6 text-right text-2xl font-medium text-alto-cream drop-shadow md:bottom-14 md:right-14 md:text-4xl">
          Produire moins,
          <br />
          fabriquer mieux
        </p>
      </section>

      {/* Anatole Collet — manifeste (orange en thème sombre, fidèle à la maquette) */}
      <section className="bg-alto-brown text-alto-cream dark:bg-alto-orange">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <h1
            className="text-center text-4xl font-bold md:text-6xl"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            Anatole Collet
          </h1>
          <p className="mt-3 text-center text-lg opacity-90">
            Designer produit et fondateur d'Alto Lille.
          </p>
          <div className="mt-12 space-y-6 text-lg leading-relaxed md:text-xl">
            <p>
              Je conçois des luminaires qui allient design contemporain,
              fabrication locale et matériaux responsables. Chaque création est
              imaginée et réalisée dans mon atelier lillois, avec la volonté de
              donner naissance à des objets durables, élégants et honnêtes.
            </p>
            <p>
              Des pièces pensées pour traverser le temps et trouver
              naturellement leur place dans votre intérieur.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs + Je ne produis pas des objets */}
      <section className="mx-auto grid max-w-[1400px] gap-14 px-6 py-16 md:grid-cols-2 md:gap-20 md:px-10 md:py-24">
        <div className="grid grid-cols-2 content-center gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-2">
          {VALUES.map((value) => (
            <figure key={value.label} className="text-center">
              <img
                src={value.src}
                alt=""
                className="mx-auto h-24 w-24 object-contain md:h-28 md:w-28"
                loading="lazy"
              />
              <figcaption className="mt-3 text-sm font-semibold text-primary md:text-base">
                {value.label}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="max-w-xl">
          <h2
            className="text-3xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            Je ne produis pas
            <br />
            des objets.
          </h2>
          <div className="mt-8 space-y-5 leading-relaxed text-foreground/90">
            <p>
              Née à Lille, terre d'industrie et de savoir-faire, la marque
              transforme les matières délaissées en objets design durables
              grâce à l'impression 3D. Chaque pièce est conçue localement,
              fabriquée à la demande et pensée pour durer. Ici, la technologie
              ne produit pas +, elle produit mieux. Je redesign une nouvelle
              génération d'objets du quotidien : responsables, désirables et
              ancrés dans leur territoire.
            </p>
            <p className="font-semibold">
              Je crois que le design doit réparer le monde, pas l'épuiser.
            </p>
            <p>
              Chaque objet commence par une question simple : a-t-on vraiment
              besoin de produire du neuf, ou peut-on faire mieux avec ce qui
              existe déjà ?
            </p>
            <p>
              Les matériaux sont issus du réemploi.
              <br />
              La fabrication est locale.
              <br />
              La production est à la demande, sans surplus inutile.
              <br />
              La surproduction est remplacée par la justesse.
            </p>
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
          Retrouvez moi sur Instagram
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
                className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
