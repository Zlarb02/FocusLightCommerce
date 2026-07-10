import { Layout } from "@/components/Layout";
import { AltoMark } from "@/components/alto/AltoBrand";

const PROCESS: Array<{ n: number; title: string; text: string }> = [
  {
    n: 1,
    title: "Echange",
    text: "Échange sur vos besoins, contraintes et vision esthétique",
  },
  {
    n: 2,
    title: "Conception",
    text: "Création de croquis et modélisation 3D de votre projet",
  },
  {
    n: 3,
    title: "Validation",
    text: "Ajustements et validation du design final avec devis",
  },
  {
    n: 4,
    title: "Fabrication",
    text: "Fabrication artisanale avec suivi régulier d'avancement",
  },
];

const REALISATIONS: Array<{ src: string; alt: string }> = [
  { src: "/images/alto/fab-orange-base.jpg", alt: "Détail d'une lampe sur-mesure orange" },
  { src: "/images/alto/atelier.jpg", alt: "Lampe sur-mesure dans un atelier de création" },
  { src: "/images/alto/surmesure-lampe.jpg", alt: "Lampe de table sur-mesure, chêne et PLA orange" },
];

/**
 * Sur-mesure — offre de création personnalisée (maquette) :
 * intro, process en 4 étapes, appel à devis, réalisations.
 */
export default function CreationsSurMesure() {
  return (
    <Layout headerTone="surface" footerTone="blue">
      {/* Titre + intro */}
      <section className="mx-auto max-w-[1400px] px-6 pt-12 md:px-10 md:pt-20">
        <h1
          className="text-5xl font-bold text-primary md:text-7xl"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          Sur-mesure
        </h1>
        <div className="mt-10 max-w-3xl space-y-5 text-lg leading-relaxed text-primary md:text-xl">
          <p className="font-bold">Une création pensée pour vous</p>
          <p>
            Parce que chaque intérieur est unique, je conçois des objets sur
            mesure adaptés à vos envies et à votre environnement.
          </p>
          <p>
            Après une phase d'échange et de conception, je développe un design
            exclusif que nous affinons ensemble jusqu'à validation. Votre
            design est ensuite fabriqué dans l'atelier lillois avec le même
            niveau d'exigence et d'attention porté à chacune de nos créations.
          </p>
        </div>
      </section>

      {/* Process en 4 étapes */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <ol className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {PROCESS.map((step) => (
            <li key={step.n} className="text-center">
              <div className="relative mx-auto h-20 w-20 text-alto-blue md:h-24 md:w-24">
                <AltoMark className="h-full w-full" title={`Étape ${step.n}`} />
                <span
                  className="absolute inset-0 flex items-center justify-center text-3xl font-bold md:text-4xl"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {step.n}
                </span>
              </div>
              <h2
                className="mt-5 text-xl font-bold text-primary md:text-2xl"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {step.title}
              </h2>
              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-relaxed md:text-base">
                {step.text}
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
            Un projet sur-mesure&nbsp;?
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            Contactez-moi pour discuter de votre projet et recevoir un devis
            personnalisé. Chaque création est unique et adaptée à vos besoins
            spécifiques.
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
              Demander un devis
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
          <p className="mt-10 text-sm opacity-80">
            Délai de réalisation : 3 à 6 semaines selon la complexité du projet
          </p>
        </div>
      </section>

      {/* Réalisations */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <p className="mb-8 text-lg font-medium">
          Prestations sur mesure réalisées&nbsp;:
        </p>
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
