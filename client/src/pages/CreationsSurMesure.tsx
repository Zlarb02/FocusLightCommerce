import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { DynamicImage } from "@/components/DynamicImage";
import { CustomCreationGallery } from "@/components/CustomCreationGallery";
import { useIllustrationUrl } from "@/hooks/use-illustration-url";
import {
  ArrowRight,
  Mail,
  Phone,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import { useState } from "react";

export default function CreationsSurMesure() {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [modalImage, setModalImage] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  const nextImage = (creationId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [creationId]: ((prev[creationId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (creationId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [creationId]: ((prev[creationId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const goToImage = (creationId: string, index: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [creationId]: index,
    }));
  };

  const openImageModal = (url: string) => {
    setModalImage({ images: [url], index: 0, title: "" });
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  const nextModalImage = () => {
    if (modalImage) {
      setModalImage({
        ...modalImage,
        index: (modalImage.index + 1) % modalImage.images.length,
      });
    }
  };

  const prevModalImage = () => {
    if (modalImage) {
      setModalImage({
        ...modalImage,
        index:
          (modalImage.index - 1 + modalImage.images.length) %
          modalImage.images.length,
      });
    }
  };

  const customCreations = [
    {
      id: "lampadaire-focus-sur-pied",
      title: t("customCreations.lampadaireFocus.title"),
      description: t("customCreations.lampadaireFocus.description"),
      images: [
        { key: "surMesure.gallery1", fallback: "https://www.alto-lille.fr/uploads/1ebb8f8c-1206-4581-b9ae-c3cb6641aa97.JPEG" },
        { key: "surMesure.gallery2", fallback: "https://www.alto-lille.fr/uploads/1a786d6d-4866-444b-b5c6-e165ab45eb54.JPEG" },
        { key: "surMesure.gallery3", fallback: "https://www.alto-lille.fr/uploads/5dcd2a73-249b-4ed7-bf83-064f1c679932.JPEG" },
        { key: "surMesure.gallery4", fallback: "https://www.alto-lille.fr/uploads/d7c3b584-0de1-413d-84ed-316a57e4367d.JPEG" },
        { key: "surMesure.gallery5", fallback: "https://www.alto-lille.fr/uploads/11f4d848-62d7-44e5-a738-536d6ab6490e.JPEG" },
        { key: "surMesure.gallery6", fallback: "https://www.alto-lille.fr/uploads/13909521-1363-4a81-9177-5a64ac0918ef.JPEG" },
        { key: "surMesure.gallery7", fallback: "https://www.alto-lille.fr/uploads/e2f45c03-cdbf-438d-bb23-6a73ec91cdc5.JPEG" },
        { key: "surMesure.gallery8", fallback: "https://www.alto-lille.fr/uploads/8b94efef-0919-47e8-987c-5afc676b965c.JPEG" },
        { key: "surMesure.gallery9", fallback: "https://www.alto-lille.fr/uploads/864143f6-2415-4924-adee-6da2a71bb8d3.JPEG" },
        { key: "surMesure.gallery10", fallback: "https://www.alto-lille.fr/uploads/e1718e09-554f-43be-b355-91c0e91c52e3.JPEG" },
        { key: "surMesure.gallery11", fallback: "https://www.alto-lille.fr/uploads/993c6b33-19f9-4467-af0a-845485d53b1d.JPEG" },
        { key: "surMesure.gallery12", fallback: "https://www.alto-lille.fr/uploads/7e9b6d82-7b1e-460c-b9c0-ee7132714d3d.JPEG" },
      ],
      features: [
        t("customCreations.lampadaireFocus.features.design"),
        t("customCreations.lampadaireFocus.features.materials"),
        t("customCreations.lampadaireFocus.features.led"),
        t("customCreations.lampadaireFocus.features.french"),
        t("customCreations.lampadaireFocus.features.assembly"),
      ],
      specs: t("customCreations.lampadaireFocus.specs"),
      price: t("customCreations.lampadaireFocus.price"),
      story: t("customCreations.lampadaireFocus.story"),
    },
    {
      id: "lampadaire-sur-mesure",
      title: t("customCreations.lampadaire.title"),
      description: t("customCreations.lampadaire.description"),
      image: {
        key: "surMesure.lampadaire",
        fallback: "https://www.alto-lille.fr/uploads/c5e2d6c0-e84d-4409-9349-0c3582bf0d6c.png"
      },
      features: [
        t("customCreations.lampadaire.features.design"),
        t("customCreations.lampadaire.features.led"),
        t("customCreations.lampadaire.features.adjustable"),
        t("customCreations.lampadaire.features.materials"),
        t("customCreations.lampadaire.features.french"),
      ],
      specs: t("customCreations.lampadaire.specs"),
      price: t("customCreations.lampadaire.price"),
      story: t("customCreations.lampadaire.story"),
    },
    {
      id: "lampe-murale-sur-mesure",
      title: t("customCreations.lampemurale.title"),
      description: t("customCreations.lampemurale.description"),
      image: {
        key: "surMesure.lampemurale",
        fallback: "https://www.alto-lille.fr/uploads/ca4d1b96-c00f-4992-b23d-5a7cdaafde05.png"
      },
      features: [
        t("customCreations.lampemurale.features.installation"),
        t("customCreations.lampemurale.features.directional"),
        t("customCreations.lampemurale.features.finishes"),
        t("customCreations.lampemurale.features.design"),
        t("customCreations.lampemurale.features.touch"),
      ],
      specs: t("customCreations.lampemurale.specs"),
      price: t("customCreations.lampemurale.price"),
      story: t("customCreations.lampemurale.story"),
    },
  ];

  const process = [
    {
      step: "1",
      title: t("customCreations.process.consultation.title"),
      description: t("customCreations.process.consultation.description"),
    },
    {
      step: "2",
      title: t("customCreations.process.conception.title"),
      description: t("customCreations.process.conception.description"),
    },
    {
      step: "3",
      title: t("customCreations.process.validation.title"),
      description: t("customCreations.process.validation.description"),
    },
    {
      step: "4",
      title: t("customCreations.process.realization.title"),
      description: t("customCreations.process.realization.description"),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {t("customCreations.hero.title")}{" "}
                <span className="text-amber-600 dark:text-amber-400">
                  {/* Le mot "Demande" est inclus dans la traduction */}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                {t("customCreations.hero.subtitle")}
              </p>
              <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  {t("customCreations.hero.guarantee")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Réalisations Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("customCreations.realizationsSection.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("customCreations.realizationsSection.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {customCreations.map((creation, index) => (
                <div
                  key={creation.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group relative ${
                    creation.id === "lampadaire-focus-sur-pied"
                      ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900"
                      : ""
                  }`}
                >
                  {/* Badge "Nouveau" pour le lampadaire Focus */}
                  {creation.id === "lampadaire-focus-sur-pied" && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {t("customCreations.lampadaireFocus.badge")}
                    </div>
                  )}
                  
                  {/* Image ou Galerie */}
                  <div className="relative h-64 overflow-hidden">
                    {creation.images ? (
                      <CustomCreationGallery
                        images={creation.images}
                        title={creation.title}
                        currentIndex={currentImageIndex[creation.id] || 0}
                        onIndexChange={(index) => {
                          setCurrentImageIndex(prev => ({
                            ...prev,
                            [creation.id]: index
                          }));
                        }}
                        onImageClick={(url) => openImageModal(url)}
                      />
                    ) : creation.image ? (
                      <DynamicImage
                        illustrationKey={creation.image.key}
                        fallbackSrc={creation.image.fallback}
                        alt={creation.title}
                        className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
                        onClick={() => openImageModal(creation.image.fallback)}
                      />
                    ) : null}
                  </div>

                  {/* Badge prix remplacé par un badge "Sur demande" (seulement si ce n'est pas le Focus sur pied qui a déjà un badge) */}
                  {creation.id !== "lampadaire-focus-sur-pied" && (
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t("customCreations.common.onDemand")}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {creation.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {creation.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {creation.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                        >
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Specs */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        {t("customCreations.common.specifications")}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {creation.specs}
                      </p>
                    </div>

                    {/* Story */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 mb-4">
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">
                        {t("customCreations.common.story")}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {creation.story}
                      </p>
                    </div>

                    {/* CTA Button pour demander un devis */}
                    <Button
                      onClick={() =>
                        (window.location.href = `mailto:altolille@gmail.com?subject=Demande de devis - ${creation.title}&body=Bonjour,%0D%0A%0D%0AJe suis intéressé(e) par votre création "${creation.title}" et souhaiterais recevoir un devis personnalisé.%0D%0A%0D%0AMerci de me recontacter pour discuter des détails.%0D%0A%0D%0ACordialement`)
                      }
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
                      size="lg"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {t("customCreations.common.requestQuote")}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("customCreations.process.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t("customCreations.process.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <div key={item.step} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-amber-200 dark:bg-amber-800 -ml-8" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {t("customCreations.cta.title")}
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              {t("customCreations.cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-100 group"
                onClick={() =>
                  (window.location.href =
                    "mailto:altolille@gmail.com?subject=Demande de devis - Création sur mesure")
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                {t("customCreations.cta.quote")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-amber-600 bg-transparent group"
                onClick={() => (window.location.href = "tel:+33782086690")}
              >
                <Phone className="mr-2 h-4 w-4" />
                {t("customCreations.cta.phone")}
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-amber-500/30">
              <p className="text-amber-100 text-sm">
                <strong>{t("customCreations.cta.delivery")}</strong>{" "}
                {t("customCreations.cta.deliveryTime")}
                <br />
                <strong>{t("customCreations.cta.warranty")}</strong>{" "}
                {t("customCreations.cta.warrantyTime")}
              </p>
            </div>
          </div>
        </section>

        {/* Modal d'agrandissement d'image */}
        {modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
              {/* Bouton fermer */}
              <button
                className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
                onClick={closeImageModal}
                title="Fermer"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              </button>

              {/* Flèche gauche */}
              {modalImage.images.length > 1 && (
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
                  onClick={prevModalImage}
                  title="Image précédente"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-7 h-7 text-gray-900 dark:text-gray-100" />
                </button>
              )}

              {/* Image agrandie */}
              <img
                src={modalImage.images[modalImage.index]}
                alt={`${modalImage.title} - Image ${modalImage.index + 1}`}
                className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white dark:border-gray-900"
                onClick={closeImageModal}
                style={{ cursor: "zoom-out" }}
              />

              {/* Flèche droite */}
              {modalImage.images.length > 1 && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
                  onClick={nextModalImage}
                  title="Image suivante"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-7 h-7 text-gray-900 dark:text-gray-100" />
                </button>
              )}

              {/* Compteur d'images */}
              {modalImage.images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-900/90 rounded-full px-4 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 shadow">
                  {modalImage.index + 1} / {modalImage.images.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
