import { Link } from "wouter";
import { Layout } from "@/components/Layout";

interface Step {
  n: string;
  title: string;
  lead: string;
  body: string[];
  media: { type: "video" | "image"; src: string; poster?: string; alt: string };
}

const STEPS: Step[] = [
  {
    n: "01",
    title: "Seconde vie",
    lead: "Donner une nouvelle histoire à la matière.",
    body: [
      "Chaque lampe naît de matériaux promis à la benne.",
      "Le chêne massif que nous utilisons provient de chutes issues d'une parqueterie du nord de la France. Ces tasseaux, autrefois écartés des circuits de production traditionnels, retrouvent aujourd'hui toute leur valeur à travers une nouvelle création.",
      "Plutôt que de produire davantage de matière, je choisis de révéler celle qui existe déjà. Cette démarche de réemploi permet de réduire le gaspillage tout en donnant naissance à des objets uniques, porteurs de sens et d'authenticité.",
    ],
    media: {
      type: "image",
      src: "/images/alto/fab-bois.jpg",
      alt: "Tasseaux de chêne massif récupérés en parqueterie",
    },
  },
  {
    n: "02",
    title: "Sublimer la matière première",
    lead: "Transformer l'existant en objet d'exception.",
    body: [
      "Les chutes de chêne massif récupérées localement sont triées, délignées, rabotées et préparées avec précision afin de révéler toute la noblesse du matériau. Ce travail minutieux permet de conserver la beauté naturelle du bois tout en garantissant une finition irréprochable.",
      "Associé à des composants durables, le chêne trouve un nouvel équilibre entre tradition artisanale et design contemporain.",
      "Parce qu'une matière revalorisée mérite le même niveau d'exigence qu'une matière neuve, chaque détail est pensé pour magnifier son caractère et sa singularité.",
    ],
    media: {
      type: "video",
      src: "/videos/fabrication-decoupe.mp4",
      poster: "/images/alto/poster-decoupe.jpg",
      alt: "Découpe des tasseaux de chêne à la scie",
    },
  },
  {
    n: "03",
    title: "Conception et création",
    lead: "Un design pensé pour durer",
    body: [
      "Mes objets sont conçus autour d'un principe simple : créer des designs intemporels, fonctionnels et responsables.",
      "Chaque modèle est dessiné pour mettre en valeur l'équilibre entre le bois massif et les éléments imprimés en 3D. Les lignes sont volontairement épurées afin de traverser les tendances et de s'intégrer naturellement dans tous les intérieurs.",
      "L'assemblage a également été repensé pour limiter les contraintes : sans colle et avec un minimum de fixation, les différentes pièces s'emboîtent de manière intuitive. Cette approche facilite la réparation, le remplacement des composants et prolonge la durée de vie du produit.",
      "Je conçois des objets qui ne sont pas seulement beaux aujourd'hui, mais qui ont vocation à vous accompagner pendant de nombreuses années.",
    ],
    media: {
      type: "video",
      src: "/videos/fabrication-conception.mp4",
      poster: "/images/alto/poster-conception.jpg",
      alt: "Croquis et recherche de design",
    },
  },
  {
    n: "04",
    title: "Impression 3D",
    lead: "Une fabrication locale, précise et raisonnée.",
    body: [
      "L'impression 3D joue un rôle essentiel dans mon processus de fabrication. Elle me permet de produire uniquement ce qui est nécessaire, au moment où cela est nécessaire, tout en limitant les déchets liés à la production.",
      "Chaque pièce est d'abord modélisée numériquement avec précision avant d'être fabriquée couche après couche dans mon atelier. Cette technologie offre une grande liberté de conception tout en optimisant l'utilisation de la matière.",
      "J'utilise du PLA, un bioplastique issu de ressources renouvelables en amidon de maïs. Ce matériau constitue une alternative plus responsable aux plastiques traditionnels tout en garantissant robustesse et qualité de finition.",
      "Cette méthode de fabrication locale me permet de réduire notre impact environnemental sans compromis sur le design ou la qualité.",
    ],
    media: {
      type: "image",
      src: "/images/alto/fab-imprimante.jpg",
      alt: "Impression 3D d'une pièce en PLA dans l'atelier",
    },
  },
  {
    n: "05",
    title: "Assemblage et mise en colis",
    lead: "Conçu pour être monté simplement",
    body: [
      "Mes objets sont pensés comme des créations à assembler facilement chez soi, sans compétence particulière et sans matériel complexe.",
      "Chaque élément est soigneusement préparé et conditionné afin d'optimiser le transport tout en réduisant le volume des colis. Cette approche permet de limiter l'empreinte carbone liée à la logistique et de protéger efficacement les composants pendant leur acheminement.",
      "L'assemblage est rapide, intuitif et agréable. En quelques gestes seulement, votre objet prend forme et trouve sa place dans votre intérieur.",
      "De la conception à l'expédition, chaque étape est guidée par la même ambition : proposer un objet durable, responsable et conçu avec soin.",
    ],
    media: {
      type: "video",
      src: "/videos/fabrication-assemblage.mp4",
      poster: "/images/alto/poster-assemblage.jpg",
      alt: "Assemblage d'une lampe Alto Lille",
    },
  },
];

function StepMedia({ media }: { media: Step["media"] }) {
  if (media.type === "video") {
    return (
      <video
        className="h-full w-full object-cover"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-label={media.alt}
      />
    );
  }
  return (
    <img
      src={media.src}
      alt={media.alt}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}

/**
 * Fabrication — le processus complet en 5 étapes (maquette),
 * du réemploi du chêne à la mise en colis.
 */
export default function DesignEnAction() {
  return (
    <Layout headerTone="surface" footerTone="brown">
      {/* Hero : duo d'images + citation */}
      <section className="mx-auto max-w-[1600px] px-4 pt-6 md:px-10">
        <h1 className="sr-only">Fabrication</h1>
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          <img
            src="/images/alto/fab-macro-rouge.jpg"
            alt="Abat-jour Focus rouge imprimé en 3D"
            className="aspect-[4/3] w-full object-cover"
          />
          <img
            src="/images/alto/fab-bois.jpg"
            alt="Chutes de chêne massif prêtes à être revalorisées"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <blockquote className="max-w-2xl py-12 md:py-16">
          <p className="text-xl font-medium leading-relaxed md:text-2xl">
            «&nbsp;Je pense le cercle de vie complet des objets pour qu'il y
            ait le moins de déchets possible et le moins d'impact en termes de
            pollution.&nbsp;»
          </p>
          <footer className="mt-4 text-lg font-bold text-primary">
            Conçu et Fabriqué à Lille.
          </footer>
        </blockquote>
      </section>

      {/* Les 5 étapes */}
      <section className="mx-auto max-w-[1600px] space-y-20 px-4 pb-24 md:space-y-28 md:px-10">
        {STEPS.map((step, i) => {
          const mediaLeft = i % 2 === 1;
          return (
            <article
              key={step.n}
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
                    {step.n}
                  </span>
                  <h2
                    className="pt-2 text-3xl font-bold text-primary md:pt-4 md:text-4xl"
                    style={{ fontFamily: "var(--font-titles)" }}
                  >
                    {step.title}
                  </h2>
                </div>
                <p className="mt-6 font-semibold">{step.lead}</p>
                <div className="mt-4 space-y-4 leading-relaxed text-foreground/90">
                  {step.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div
                className={`aspect-[4/3] overflow-hidden bg-muted ${
                  mediaLeft ? "md:order-1" : ""
                }`}
              >
                <StepMedia media={step.media} />
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
              Parce que chaque demande est unique, je conçois des objets sur
              mesure adaptés à vos besoins.
            </p>
            <h2
              className="text-5xl font-bold md:text-8xl"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Sur-mesure
            </h2>
          </div>
          <Link
            href="/creations-sur-mesure"
            className="inline-block self-start rounded-full bg-alto-orange px-10 py-4 text-lg font-bold text-alto-cream transition-transform hover:scale-105 md:self-auto"
          >
            En savoir plus
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
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
          <video
            className="h-full w-full object-cover"
            src="/videos/fabrication-assemblage.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label="Vidéo d'assemblage d'une lampe"
          />
          <span className="absolute bottom-4 left-4 text-xl font-medium text-white drop-shadow">
            Vidéo
            <br />
            assemblage
          </span>
        </div>
        <img
          src="/images/alto/fab-orange-base.jpg"
          alt="Détail d'une lampe sur-mesure orange"
          className="aspect-[3/4] w-full object-cover"
          loading="lazy"
        />
      </section>

      {/* Bandeau Recherche */}
      <section className="bg-alto-blue text-alto-cream">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24">
          <p className="mb-4 text-lg opacity-90">
            ALTO ne cesse de faire de la recherche de matériaux pour, à terme,
            ne produire qu'avec des déchets.
          </p>
          <h2
            className="text-5xl font-bold md:text-8xl"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            Recherche
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
          Avec ALTO, je développe un nouveau matériau issu du recyclage de
          bouteilles d'eau.
        </p>
      </section>
    </Layout>
  );
}
