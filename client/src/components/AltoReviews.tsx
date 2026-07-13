import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Avis Google — reprise fidèle de la maquette (Web 1920–2, bloc au-dessus du
 * footer) : bandeau « Google Reviews 5.0 » + bouton bleu, carrousel de cartes
 * blanches sur fond gris, bouton « Rédiger un avis » en pill orange outline.
 *
 * Les avis sont ceux de la fiche Google d'Alto Lille, recopiés en dur (le
 * widget Elfsight de la maquette ne s'initialisait plus depuis la refonte).
 * Les dates sont absolues pour que l'ancienneté affichée reste juste.
 */

const GOOGLE_REVIEW_URL = "https://g.co/kgs/wKEbWM2";

type Review = {
  author: string;
  /** Date de publication (ISO), sert à calculer « il y a N mois ». */
  date: string;
  rating: number;
  text: string;
};

const REVIEWS: Review[] = [
  {
    author: "Gautier Tirmarche",
    date: "2025-10-01",
    rating: 5,
    text: "Rajoute vraiment une ambiance chill à la pièce et la lampe est de bonne qualité",
  },
  {
    author: "salomé collet",
    date: "2025-08-01",
    rating: 5,
    text: "Lampe de très belle qualité et qui donne une très belle atmosphère à la pièce éclairée.",
  },
  {
    author: "Clemence Presti",
    date: "2025-07-01",
    rating: 5,
    text: "J'ai acheté une lampe pour l'anniversaire de mon petit-cousin, et nous avons tous été agréablement surpris par la qualité du produit ! Et c'est écolo ! Je recommande les yeux fermés 🫣",
  },
  {
    author: "MONIQUE BASSO",
    date: "2025-06-01",
    rating: 5,
    text: "J'ai déjà offert 2 fois cette lampe. Elle a été très appréciée pour son design, la facilité de montage et la livraison rapide. Je vais sûrement craquer pour mon usage personnel !",
  },
  {
    author: "Christine Mimine",
    date: "2025-05-01",
    rating: 5,
    text: "Lampe achetée en orange : top !!!! Fonctionnelle, esthétique. Une vrai touche design dans mon salon 😉",
  },
  {
    author: "Ben Dieu",
    date: "2025-04-01",
    rating: 5,
    text: "Lampe de super qualité et très belle !",
  },
];

const AVERAGE = 5.0;

/** Initiale sur pastille colorée, à défaut de photo de profil Google. */
const AVATAR_COLORS = [
  "#4285F4",
  "#DB4437",
  "#0F9D58",
  "#F4B400",
  "#AB47BC",
  "#00ACC1",
];

function timeAgo(iso: string, locale: string): string {
  const months = Math.max(
    1,
    Math.round(
      (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 30.4)
    )
  );
  const years = Math.floor(months / 12);
  const fr = locale.startsWith("fr");
  if (years >= 1) {
    if (fr) return years === 1 ? "il y a 1 an" : `il y a ${years} ans`;
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
  return fr ? `il y a ${months} mois` : `${months} months ago`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={
            s <= Math.round(rating)
              ? "h-4 w-4 fill-[#FBBC04] text-[#FBBC04]"
              : "h-4 w-4 text-gray-300"
          }
        />
      ))}
    </div>
  );
}

function GoogleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/**
 * Le widget d'avis reste CLAIR dans les deux thèmes : la maquette le pose tel
 * quel sur le panneau #F7F7F7, y compris sur le fond brun du thème sombre
 * (web-4, iphone-6). Seul le titre « Avis » suit le fond de page — d'où
 * `showTitle`, que la fiche produit désactive pour le sortir du panneau.
 */
export function AltoReviews({ showTitle = true }: { showTitle?: boolean }) {
  const { t, language } = useLanguage();

  return (
    <section className="animate fade-in">
      {showTitle && (
        <h2
          className="mb-6 text-[clamp(28px,2.1vw,40px)] font-bold leading-none text-alto-blue dark:text-alto-cream"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("product.reviews")}
        </h2>
      )}

      <div className="rounded-lg bg-[#F6F6F6] p-4 md:p-6">
        {/* Bandeau : note globale + lien Google */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GoogleLogo className="h-5 w-5" />
              <span className="text-lg font-semibold text-gray-800">
                Reviews
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {AVERAGE.toFixed(1)}
              </span>
              <Stars rating={AVERAGE} />
              <span className="text-xs text-gray-500">
                ({REVIEWS.length})
              </span>
            </div>
          </div>

          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#1A73E8] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1765CC]"
          >
            {t("product.reviews.google")}
          </a>
        </div>

        {/* Cartes : défilement horizontal (la maquette montre une rangée coupée) */}
        <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2">
          {REVIEWS.map((r, i) => (
            <article
              key={r.author}
              className="w-[280px] shrink-0 snap-start rounded-lg bg-white p-4 md:w-[calc((100%-3rem)/4)]"
            >
              <div className="mb-2 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  aria-hidden
                >
                  {r.author.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {r.author}
                  </p>
                  <p className="text-xs text-gray-500">
                    {timeAgo(r.date, language)}
                  </p>
                </div>
              </div>
              <Stars rating={r.rating} />
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {r.text}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Pill orange outline « Rédiger un avis » */}
      <a
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-alto-orange px-8 py-3 text-[clamp(16px,1.2vw,22px)] font-bold text-alto-orange transition-colors hover:bg-alto-orange hover:text-white"
        style={{ fontFamily: "var(--font-titles)" }}
      >
        {t("product.reviews.write")}
      </a>
    </section>
  );
}

export default AltoReviews;
