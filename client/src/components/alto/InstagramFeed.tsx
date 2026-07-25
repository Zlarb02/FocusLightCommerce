import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

/**
 * Section « Retrouvez-moi sur Instagram » (maquette : titre Bold orange,
 * vignettes 2/3 cliquables vers le compte, chevron à droite).
 * Le contenu vient de /gestion → Instagram. La bande défile nativement
 * (doigt, trackpad, clavier) : en desktop 3 vignettes tiennent de front comme
 * dans la maquette, et les chevrons n'apparaissent que s'il reste à défiler —
 * en mobile une vignette et un bout de la suivante, qu'on fait glisser.
 */
export function InstagramFeed() {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { data } = useQuery<InstagramFeed>({
    queryKey: ["/api/instagram/feed"],
  });

  const posts = useMemo(() => {
    const list = (data?.posts ?? []).filter((p) => p.url);
    return list.length ? [...list].sort((a, b) => a.order - b.order) : FALLBACK_POSTS;
  }, [data]);

  const profileUrl = data?.profileUrl || INSTAGRAM_URL;

  /** Les chevrons ne servent que s'il reste réellement de la piste à parcourir. */
  const syncArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Marge de quelques pixels : les largeurs en % tombent rarement rondes,
    // et 3 vignettes pile ne doivent pas faire clignoter un chevron.
    const remaining = track.scrollWidth - track.clientWidth - track.scrollLeft;
    setCanScrollPrev(track.scrollLeft > 4);
    setCanScrollNext(remaining > 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncArrows();
    track.addEventListener("scroll", syncArrows, { passive: true });
    window.addEventListener("resize", syncArrows);
    return () => {
      track.removeEventListener("scroll", syncArrows);
      window.removeEventListener("resize", syncArrows);
    };
  }, [syncArrows, posts.length]);

  const go = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    // Un cran = une vignette (gouttière comprise), déduite de la position
    // réelle des deux premières ; à défaut, la largeur visible.
    const [first, second] = Array.from(track.children) as HTMLElement[];
    const step = second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
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
        <div
          ref={trackRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain md:gap-[3.3%]"
        >
          {posts.map((post) => (
            <a
              key={`${post.url}-${post.order}`}
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block shrink-0 snap-start basis-[78%] overflow-hidden bg-white sm:basis-[calc((100%-2*3.3%)/3)]"
            >
              <img
                src={post.url}
                alt={post.alt}
                className="aspect-[463/695] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                draggable={false}
              />
            </a>
          ))}
        </div>

        {canScrollPrev && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Photos précédentes"
            className="absolute -left-2 top-1/2 hidden -translate-y-1/2 text-alto-orange transition hover:opacity-70 sm:block md:-left-10"
          >
            <ChevronLeft className="h-10 w-10 md:h-16 md:w-16" strokeWidth={4} />
          </button>
        )}
        {canScrollNext && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Photos suivantes"
            className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-alto-orange transition hover:opacity-70 sm:block md:-right-10"
          >
            <ChevronRight className="h-10 w-10 md:h-16 md:w-16" strokeWidth={4} />
          </button>
        )}
      </div>
    </section>
  );
}
