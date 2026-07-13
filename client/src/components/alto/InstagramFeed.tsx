import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const INSTAGRAM_URL = "https://www.instagram.com/alto_lille/";

interface InstagramPost {
  url: string;
  alt: string;
  order: number;
}

interface InstagramFeed {
  profileUrl: string;
  posts: InstagramPost[];
}

/** Photos de secours si l'API ne répond pas (mêmes fichiers que data/instagramFeed.json). */
const FALLBACK_POSTS: InstagramPost[] = [
  { url: "/images/alto/instagram/insta-1.jpg", alt: "Lampe Alto Lille imprimée en 3D", order: 1 },
  { url: "/images/alto/instagram/insta-2.jpg", alt: "Atelier Alto Lille à Lille", order: 2 },
  { url: "/images/alto/instagram/insta-3.jpg", alt: "Création Alto Lille en situation", order: 3 },
];

/** La maquette montre 3 vignettes de front (463×695 sur 1920). */
const PER_VIEW = 3;

/**
 * Section « Retrouvez-moi sur Instagram » (maquette : titre Bold orange,
 * vignettes 2/3 cliquables vers le compte, chevron à droite).
 * Le contenu vient de /gestion → Instagram : au-delà de 3 photos la grille
 * devient un slider, conformément au chevron déjà présent dans la maquette.
 */
export function InstagramFeed() {
  const { t } = useLanguage();
  const [start, setStart] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery<InstagramFeed>({
    queryKey: ["/api/instagram/feed"],
  });

  const posts = useMemo(() => {
    const list = (data?.posts ?? []).filter((p) => p.url);
    return list.length ? [...list].sort((a, b) => a.order - b.order) : FALLBACK_POSTS;
  }, [data]);

  const profileUrl = data?.profileUrl || INSTAGRAM_URL;
  const isSlider = posts.length > PER_VIEW;
  const maxStart = Math.max(0, posts.length - PER_VIEW);

  const go = (direction: -1 | 1) => {
    setStart((s) => Math.min(maxStart, Math.max(0, s + direction)));
  };

  return (
    <section className="mx-auto w-full max-w-[1920px] px-6 py-16 md:px-[2.9vw] md:py-24">
      <h2
        className="font-bold leading-tight text-alto-orange text-[clamp(30px,4.1vw,78px)]"
        style={{ fontFamily: "var(--font-titles)" }}
      >
        {t("studio.instagram")}
      </h2>

      <div className="relative mt-8 md:mt-12">
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-4 transition-transform duration-500 ease-out md:gap-[3.3%]"
            style={
              isSlider
                ? {
                    // Chaque vignette occupe 1/3 de la piste visible : on décale
                    // d'autant de vignettes que d'index de départ.
                    transform: `translateX(calc(-${start} * (100% + 3.3%) / ${PER_VIEW}))`,
                  }
                : undefined
            }
          >
            {posts.map((post) => (
              <a
                key={`${post.url}-${post.order}`}
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block shrink-0 basis-[78%] overflow-hidden bg-white sm:basis-[calc((100%-2*3.3%)/3)]"
              >
                <img
                  src={post.url}
                  alt={post.alt}
                  className="aspect-[463/695] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>

        {isSlider && (
          <>
            {start > 0 && (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Photos précédentes"
                className="absolute -left-2 top-1/2 -translate-y-1/2 text-alto-orange transition hover:opacity-70 md:-left-10"
              >
                <ChevronLeft className="h-10 w-10 md:h-16 md:w-16" strokeWidth={4} />
              </button>
            )}
            {start < maxStart && (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Photos suivantes"
                className="absolute -right-2 top-1/2 -translate-y-1/2 text-alto-orange transition hover:opacity-70 md:-right-10"
              >
                <ChevronRight className="h-10 w-10 md:h-16 md:w-16" strokeWidth={4} />
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
