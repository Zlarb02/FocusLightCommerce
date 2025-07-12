import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { DynamicImage } from "@/components/DynamicImage";
import { SliderImage } from "@/components/SliderImage";
import { useIllustrationUrl } from "@/hooks/use-illustration-url";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function DesignEnAction() {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const slides = [
    {
      illustrationKey: "designInAction.seacle1",
      fallbackSrc: "https://www.alto-lille.fr/uploads/sea-cle.jpg",
      alt: t("projects.seacle.slider.image2.alt"),
      caption: t("projects.seacle.slider.image2.caption"),
      rotate: false,
    },
    {
      illustrationKey: "designInAction.seacle2",
      fallbackSrc:
        "https://www.alto-lille.fr/uploads/2f869fa9-1d39-42d4-8413-8913ca9a8046.png",
      alt: t("projects.seacle.slider.image3.alt"),
      caption: t("projects.seacle.slider.image3.caption"),
      rotate: false,
    },
  ];

  // Get current slide URL dynamically
  const currentSlideIllustration = useIllustrationUrl(
    slides[currentSlide]?.illustrationKey,
    slides[currentSlide]?.fallbackSrc
  );

  // Auto-slider effect with progress
  useEffect(() => {
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 100 / 35; // 35 steps for 3.5 seconds (100ms each)
      });
    }, 100);

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideInterval);
    };
  }, [slides.length, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Helper component for links
  const RivagesPropresLink = () => (
    <a
      href="https://www.rivagespropres.fr/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      Rivages Propres
    </a>
  );

  const PlastisemLink = () => (
    <a
      href="https://plastisem.fr/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      Plastisem
    </a>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {t("designInAction.title")}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                {t("designInAction.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Sea-cle Project */}
            <div className="mb-32">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {t("designInAction.seacle.category")}
                      </span>
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t("designInAction.seacle.title")}
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        {t("designInAction.seacle.subtitle")}
                      </p>
                    </div>

                    <div className="prose prose-lg dark:prose-invert mb-8">
                      <p>{t("designInAction.seacle.description")}</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mb-8">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                        {t("designInAction.seacle.circularEconomy.title")}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {language === "fr" ? (
                          <>
                            Sea-cle incarne parfaitement le concept d'économie
                            circulaire : les déchets plastiques collectés sur
                            les plages par les associations sont transformés en
                            bobines de plastique par <PlastisemLink />, qu'Alto
                            Lille utilise ensuite pour fabriquer l'outil Sea-cle
                            et d'autres créations comme les lampes Focus. Un
                            cycle vertueux au service de l'environnement.
                          </>
                        ) : (
                          <>
                            Sea-cle perfectly embodies the concept of circular
                            economy: plastic waste collected from beaches by
                            associations is transformed into plastic spools by{" "}
                            <PlastisemLink />, which Alto Lille then uses to
                            manufacture the Sea-cle tool and other creations
                            like Focus lamps. A virtuous cycle serving the
                            environment.
                          </>
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <strong>
                          {t("designInAction.seacle.specs.manufacturer")}
                        </strong>{" "}
                        {t("designInAction.seacle.specs.manufacturerValue")}
                      </div>
                      <div>
                        <strong>
                          {t("designInAction.seacle.specs.material")}
                        </strong>{" "}
                        {t("designInAction.seacle.specs.materialValue")}
                      </div>
                      <div>
                        <strong>
                          {t("designInAction.seacle.specs.dimensions")}
                        </strong>{" "}
                        {t("designInAction.seacle.specs.dimensionsValue")}
                      </div>
                      <div>
                        <strong>
                          {t("designInAction.seacle.specs.usage")}
                        </strong>{" "}
                        {t("designInAction.seacle.specs.usageValue")}
                      </div>
                    </div>
                  </div>

                  <div className="relative h-96 lg:h-auto">
                    {/* Slider principal */}
                    <div
                      className="relative w-full h-full overflow-hidden rounded-r-2xl lg:rounded-r-none group cursor-pointer"
                      onClick={() =>
                        setModalImage(
                          currentSlideIllustration.url ||
                            slides[currentSlide].fallbackSrc
                        )
                      }
                    >
                      <div className="relative w-full h-full">
                        <SliderImage
                          illustrationKey={slides[currentSlide].illustrationKey}
                          fallbackSrc={slides[currentSlide].fallbackSrc}
                          alt={slides[currentSlide].alt}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          style={
                            slides[currentSlide].rotate
                              ? {
                                  transform: "rotate(90deg)",
                                  transformOrigin: "center",
                                }
                              : {}
                          }
                        />

                        {/* Overlay pour indiquer que c'est cliquable */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white bg-opacity-0 group-hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 transform scale-0 group-hover:scale-100">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Caption overlay avec indicateur cliquable */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-white text-sm font-medium">
                              {slides[currentSlide].caption}
                            </p>
                            <div className="text-white text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                              <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                                {t("projects.seacle.slider.clickToEnlarge")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Navigation arrows - plus visibles */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevSlide();
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 z-10 border border-white/20 shadow-lg"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextSlide();
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 z-10 border border-white/20 shadow-lg"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Dots indicator - plus visibles et animés */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                          {slides.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentSlide(index);
                              }}
                              className={`w-3 h-3 rounded-full transition-all duration-300 border border-white/50 ${
                                currentSlide === index
                                  ? "bg-white scale-125 shadow-lg"
                                  : "bg-white/30 hover:bg-white/50 hover:scale-110"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Progress bar pour le slider automatique */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
                          <div
                            className="h-full bg-white transition-all duration-100 ease-linear"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section détaillée avec images */}
              <div className="mt-16 space-y-16">
                {/* Contexte et outils actuels */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    {t("projects.seacle.context.title")}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    {language === "fr" ? (
                      <>
                        Les associations comme <RivagesPropresLink /> utilisent
                        actuellement des outils basiques mais efficaces : gants,
                        tamis et sacs poubelles. Sea-cle vient compléter cet
                        équipement en offrant un meilleur confort de travail aux
                        bénévoles tout en réduisant l'utilisation de sacs
                        plastiques.
                      </>
                    ) : (
                      <>
                        Associations like <RivagesPropresLink /> currently use
                        basic but effective tools: gloves, sieves and garbage
                        bags. Sea-cle complements this equipment by offering
                        better working comfort to volunteers while reducing the
                        use of plastic bags.
                      </>
                    )}
                  </p>

                  {/* Photo des bénévoles enfants - intégrée harmonieusement */}
                  <div className="mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      <div className="lg:col-span-2">
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                          {t("projects.seacle.context.additionalText")}
                        </p>
                      </div>
                      <div className="lg:col-span-1">
                        <div className="relative group">
                          <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-lg bg-gray-100 dark:bg-gray-700">
                            <DynamicImage
                              illustrationKey="designInAction.project1"
                              fallbackSrc="https://www.alto-lille.fr/uploads/8c4bf80d-6019-445c-9877-bbb91d3fe951.jpg"
                              alt={t(
                                "projects.seacle.context.volunteersImage.alt"
                              )}
                              className="w-full h-full object-cover"
                              style={{
                                transform: "rotate(90deg)",
                                transformOrigin: "center",
                              }}
                            />
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {t(
                                "projects.seacle.context.volunteersImage.caption"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    {t("projects.seacle.tools.title")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <DynamicImage
                        illustrationKey="designInAction.gallery1"
                        fallbackSrc="https://www.alto-lille.fr/uploads/f5d04e1c-e453-4ee5-8b73-ac4435453b84.jpg"
                        alt="Gants de protection"
                        className="w-full h-48 object-cover rounded-lg shadow-md mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() =>
                          setModalImage(
                            "https://www.alto-lille.fr/uploads/f5d04e1c-e453-4ee5-8b73-ac4435453b84.jpg"
                          )
                        }
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("projects.seacle.tools.gloves")}
                      </p>
                    </div>
                    <div className="text-center">
                      <DynamicImage
                        illustrationKey="designInAction.gallery2"
                        fallbackSrc="https://www.alto-lille.fr/uploads/0e82ffea-51c2-4782-985a-e6733d240efc.jpg"
                        alt="Tamis pour filtrer le sable"
                        className="w-full h-48 object-cover rounded-lg shadow-md mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() =>
                          setModalImage(
                            "https://www.alto-lille.fr/uploads/0e82ffea-51c2-4782-985a-e6733d240efc.jpg"
                          )
                        }
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("projects.seacle.tools.sieve")}
                      </p>
                    </div>
                    <div className="text-center">
                      <img
                        src="https://www.alto-lille.fr/uploads/48ebe2f3-94a6-4d10-b2d0-b770bd6cfd52.jpg"
                        alt="Sac poubelle"
                        className="w-full h-48 object-cover rounded-lg shadow-md mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() =>
                          setModalImage(
                            "https://www.alto-lille.fr/uploads/48ebe2f3-94a6-4d10-b2d0-b770bd6cfd52.jpg"
                          )
                        }
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("projects.seacle.tools.bags")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Innovation technique */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {t("projects.seacle.innovation.title")}
                  </h3>
                  <div className="prose prose-lg dark:prose-invert mb-8">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {t("projects.seacle.innovation.text1")}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {language === "fr" ? (
                        <>
                          Le plus beau dans ce projet ? Sea-cle est fabriqué par{" "}
                          <PlastisemLink /> à partir des déchets plastiques
                          ramassés sur les plages. C'est ça, l'économie
                          circulaire en action : transformer le problème en
                          solution ! Cette entreprise locale, qui fournit aussi
                          le plastique pour nos imprimantes 3D, partage notre
                          vision d'un design responsable et durable.
                        </>
                      ) : (
                        <>
                          The beautiful thing about this project? Sea-cle is
                          made by <PlastisemLink /> from plastic waste collected
                          on beaches. That's the circular economy in action:
                          turning the problem into the solution! This local
                          company, which also supplies plastic for our 3D
                          printers, shares our vision of responsible and
                          sustainable design.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Sea-cle en action avec images */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-8 lg:p-12">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      {t("projects.seacle.prototype.title")}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      {t("projects.seacle.prototype.description")}
                    </p>
                  </div>

                  {/* Images plus visibles pour formats verticaux */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 pb-8">
                    <div className="space-y-4">
                      <div className="relative h-80 overflow-hidden rounded-lg shadow-lg">
                        <img
                          src="https://www.alto-lille.fr/uploads/019d94a4-0e28-4aa0-bbc1-bfccc13c65c8.jpg"
                          alt="Prototype Sea-cle en action sur la plage"
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() =>
                            setModalImage(
                              "https://www.alto-lille.fr/uploads/019d94a4-0e28-4aa0-bbc1-bfccc13c65c8.jpg"
                            )
                          }
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Prototype Sea-cle en action sur la plage
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Le prototype Sea-cle collectant les déchets sur la
                          plage
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div
                        className="relative h-80 overflow-hidden rounded-lg shadow-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() =>
                          setModalImage(
                            "https://www.alto-lille.fr/uploads/dd3d70e2-6aa6-44e2-a4b7-515b87281e7c.jpg"
                          )
                        }
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src="https://www.alto-lille.fr/uploads/dd3d70e2-6aa6-44e2-a4b7-515b87281e7c.jpg"
                            alt="Anatole vidant le contenu du Sea-cle"
                            className="max-w-full max-h-full object-contain"
                            style={{
                              transform: "rotate(90deg)",
                              transformOrigin: "center",
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Anatole vidant le contenu du Sea-cle
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Vidage du contenu collecté dans les bennes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bénéfices */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    {t("projects.seacle.benefits.title")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {t("projects.seacle.benefits.comfort")}
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {t("projects.seacle.benefits.efficiency")}
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {t("projects.seacle.benefits.ecological")}
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {t("projects.seacle.benefits.ergonomic")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Économie circulaire et processus Plastisem */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {t("projects.seacle.economy.title")}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    {language === "fr" ? (
                      <>
                        Sea-cle illustre parfaitement le concept d'économie
                        circulaire : les déchets plastiques collectés sur les
                        plages par les associations sont transformés en bobines
                        de plastique par <PlastisemLink />, qu'Alto Lille
                        utilise ensuite pour fabriquer l'outil Sea-cle et
                        d'autres créations comme les lampes Focus. Un cycle
                        vertueux au service de l'environnement.
                      </>
                    ) : (
                      <>
                        Sea-cle perfectly illustrates the concept of circular
                        economy: plastic waste collected on beaches by
                        associations is transformed into plastic spools by{" "}
                        <PlastisemLink />, which Alto Lille then uses to
                        manufacture the Sea-cle tool and other creations like
                        Focus lamps. A virtuous cycle in service of the
                        environment.
                      </>
                    )}
                  </p>

                  {/* Schéma du processus */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                      {t("projects.seacle.economy.process.title")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-2xl">🏖️</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          {t("projects.seacle.economy.process.step1.title")}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t(
                            "projects.seacle.economy.process.step1.description"
                          )}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-2xl">♻️</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          {t("projects.seacle.economy.process.step2.title")}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === "fr" ? (
                            <>
                              Tri, nettoyage et transformation en bobines par{" "}
                              <PlastisemLink />
                            </>
                          ) : (
                            <>
                              Sorting, cleaning and transformation into coils by{" "}
                              <PlastisemLink />
                            </>
                          )}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-2xl">🛠️</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          {t("projects.seacle.economy.process.step3.title")}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t(
                            "projects.seacle.economy.process.step3.description"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Without Speaker Project */}
            <div className="mb-32">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-96 lg:h-auto lg:order-1">
                    <img
                      src="https://www.alto-lille.fr/uploads/lowtech-vynil.jpg"
                      alt="Without Speaker"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-8 lg:p-12 flex flex-col justify-center lg:order-2">
                    <div className="mb-6">
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {t("designInAction.withoutSpeaker.category")}
                      </span>
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t("designInAction.withoutSpeaker.title")}
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        {t("designInAction.withoutSpeaker.subtitle")}
                      </p>
                    </div>

                    <div className="prose prose-lg dark:prose-invert mb-8">
                      <p>{t("designInAction.withoutSpeaker.description")}</p>
                    </div>

                    <div className="bg-gray-900 dark:bg-gray-700 text-white p-6 rounded-lg mb-8">
                      <h3 className="font-semibold text-lg mb-3">
                        {t("designInAction.withoutSpeaker.philosophy.title")}
                      </h3>
                      <p className="text-gray-200">
                        {t(
                          "designInAction.withoutSpeaker.philosophy.description"
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <strong>
                          {t("designInAction.withoutSpeaker.specs.type")}
                        </strong>{" "}
                        {t("designInAction.withoutSpeaker.specs.typeValue")}
                      </div>
                      <div>
                        <strong>
                          {t("designInAction.withoutSpeaker.specs.principle")}
                        </strong>{" "}
                        {t(
                          "designInAction.withoutSpeaker.specs.principleValue"
                        )}
                      </div>
                      <div>
                        <strong>
                          {t("designInAction.withoutSpeaker.specs.year")}
                        </strong>{" "}
                        {t("designInAction.withoutSpeaker.specs.yearValue")}
                      </div>
                      <div>
                        <strong>
                          {t("designInAction.withoutSpeaker.specs.operation")}
                        </strong>{" "}
                        {t(
                          "designInAction.withoutSpeaker.specs.operationValue"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="bg-gray-50 dark:bg-gray-800 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              {t("designInAction.philosophy.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              {t("designInAction.philosophy.description")}
            </p>

            <a
              href="mailto:altolille@gmail.com"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              {t("designInAction.philosophy.cta")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </section>
      </div>

      {/* Modal pour afficher les images en grand */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={modalImage}
              alt="Image agrandie"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
