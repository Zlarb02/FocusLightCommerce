import React, { useEffect, useState } from "react";
import { Star, User, Quote } from "lucide-react";

interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GoogleReviewsProps {
  placeId?: string;
  businessName?: string;
  className?: string;
}

// Données d'exemple pour les avis (à remplacer par de vraies données via l'API Google Places)
const sampleReviews: GoogleReview[] = [
  {
    author_name: "Marie Dubois",
    rating: 5,
    relative_time_description: "il y a 2 semaines",
    text: "Excellent travail, des lampes magnifiques et de très haute qualité. L'équipe est très professionnelle et à l'écoute. Je recommande vivement !",
    time: Date.now() - 14 * 24 * 60 * 60 * 1000,
    profile_photo_url: "/images/avatar-placeholder.png", // Utiliser une image locale
  },
  {
    author_name: "Jean Martin",
    rating: 5,
    relative_time_description: "il y a 1 mois",
    text: "Produits d'exception, finition impeccable. La lampe FOCUS.01 illumine parfaitement mon salon. Service client au top !",
    time: Date.now() - 30 * 24 * 60 * 60 * 1000,
    profile_photo_url: "/images/avatar-placeholder.png",
  },
  {
    author_name: "Sophie Leroy",
    rating: 4,
    relative_time_description: "il y a 3 semaines",
    text: "Très belles lampes artisanales. Design moderne et élégant. Livraison rapide et emballage soigné.",
    time: Date.now() - 21 * 24 * 60 * 60 * 1000,
    profile_photo_url: "/images/avatar-placeholder.png",
  },
  {
    author_name: "Pierre Durand",
    rating: 5,
    relative_time_description: "il y a 2 mois",
    text: "Qualité exceptionnelle, produit conforme à la description. L'éclairage LED est parfait pour créer une ambiance chaleureuse.",
    time: Date.now() - 60 * 24 * 60 * 60 * 1000,
    profile_photo_url:
      "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo-ba2",
  },
  {
    author_name: "Claire Moreau",
    rating: 5,
    relative_time_description: "il y a 1 mois",
    text: "Superbe lampe, fabrication française de qualité. L'équipe est très sympathique et répond rapidement aux questions.",
    time: Date.now() - 35 * 24 * 60 * 60 * 1000,
    profile_photo_url:
      "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo-ba1",
  },
];

const GoogleReviews: React.FC<GoogleReviewsProps> = ({
  placeId,
  businessName = "Alto Lille",
  className = "",
}) => {
  const [reviews, setReviews] = useState<GoogleReview[]>(sampleReviews);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    // Calculer la moyenne des avis
    if (reviews.length > 0) {
      const avg =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;
      setAverageRating(Math.round(avg * 10) / 10);
      setTotalReviews(reviews.length);
    }
  }, [reviews]);

  const renderStars = (rating: number, size = "sm") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"} ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header avec logo Google et stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285f4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34a853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#fbbc05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#ea4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Avis Google
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {averageRating}
            </span>
            {renderStars(averageRating, "md")}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({totalReviews} avis)
            </span>
          </div>
        </div>

        <a
          href="https://g.co/kgs/wKEbWM2"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          Voir tous les avis
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      {/* Grille des avis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reviews.slice(0, 6).map((review, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header de l'avis */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                {review.profile_photo_url ? (
                  <img
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {review.author_name}
                  </h4>
                  {renderStars(review.rating)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {review.relative_time_description}
                </p>
              </div>
            </div>

            {/* Contenu de l'avis */}
            <div className="relative">
              <Quote className="absolute top-0 left-0 w-4 h-4 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-600 dark:text-gray-300 ml-5 leading-relaxed">
                {truncateText(review.text, 150)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton pour voir plus d'avis */}
      <div className="text-center">
        <a
          href="https://g.co/kgs/wKEbWM2"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          Voir plus d'avis sur Google
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default GoogleReviews;
