import ProjectPageUnified from "@/components/ProjectPageUnified";
import {
  MapPin,
  Mail,
  Instagram,
  Palette,
  Lightbulb,
  Users,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function QuiSuisJe() {
  const { t } = useLanguage();

  return (
    <ProjectPageUnified
      title="Qui suis-je"
      subtitle={t("projects.quiSuisJe.subtitle")}
      imagePath="/images/qui-suis-je.jpg"
      currentProject="QuiSuisJe"
      description={
        <>
          <p className="text-lg leading-relaxed">
            {t("projects.quiSuisJe.description1")}
          </p>
          <p className="text-lg leading-relaxed">
            {t("projects.quiSuisJe.description2")}
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-16">
          {/* Section Vision & Philosophie */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-blue-600" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("quiSuisJe.vision.creativity")}
                </h3>
                <p className="text-gray-700">
                  {t("quiSuisJe.vision.creativity.desc")}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-green-600" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("quiSuisJe.vision.innovation")}
                </h3>
                <p className="text-gray-700">
                  {t("quiSuisJe.vision.innovation.desc")}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("quiSuisJe.vision.sharing")}
                </h3>
                <p className="text-gray-700">
                  {t("quiSuisJe.vision.sharing.desc")}
                </p>
              </div>
            </div>
          </div>

          {/* Section Mon Parcours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("quiSuisJe.journey.title")}
              </h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6 py-2">
                  <div className="text-sm text-gray-500 font-medium">
                    2024-2025
                  </div>
                  <div className="font-semibold text-lg">
                    Lancement d'Alto Lille
                  </div>
                  <p className="text-gray-700 mt-1">
                    Création de ma première collection avec Focus.01,
                    développement de l'identité de marque et mise en place des
                    circuits de distribution.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6 py-2">
                  <div className="text-sm text-gray-500 font-medium">
                    2020-2024
                  </div>
                  <div className="font-semibold text-lg">
                    Exploration & Expérimentation
                  </div>
                  <p className="text-gray-700 mt-1">
                    Développement de projets personnels : customisation de
                    chaussures, création d'objets low-tech, exploration de
                    différents médiums artistiques.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6 py-2">
                  <div className="text-sm text-gray-500 font-medium">
                    2018-2020
                  </div>
                  <div className="font-semibold text-lg">
                    Formation & Apprentissage
                  </div>
                  <p className="text-gray-700 mt-1">
                    Acquisition des compétences techniques et développement de
                    ma sensibilité artistique et de mon approche du design.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white p-8 rounded-2xl">
              <h3
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Ma Vision
              </h3>
              <blockquote className="text-lg italic leading-relaxed mb-6">
                "Je crois que les objets ont une âme et que le design peut
                transformer notre rapport au quotidien. Chaque création d'Alto
                Lille porte cette conviction."
              </blockquote>
              <p className="text-gray-300">
                Mon objectif est de développer Alto Lille comme une référence
                dans le design d'objets du quotidien, en privilégiant toujours
                la qualité, l'authenticité et l'innovation responsable.
              </p>
            </div>
          </div>

          {/* Section Contact & Informations */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Restons en Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">Lille, France</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">contact@alto-lille.fr</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Instagram className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">@alto_lille</span>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Collaborations
                </h3>
                <p className="text-gray-700 mb-4">
                  Ouvert aux collaborations créatives, projets sur mesure et
                  partenariats avec d'autres créateurs.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    💡 Vous avez un projet ? Parlons-en !
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Processus Créatif */}
          <div className="text-center">
            <h3
              className="text-2xl font-bold mb-8"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("quiSuisJe.process.title")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-b from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">
                  {t("quiSuisJe.process.inspiration")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("quiSuisJe.process.inspiration.desc")}
                </p>
              </div>

              <div className="bg-gradient-to-b from-green-50 to-green-100 p-6 rounded-xl">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">
                  {t("quiSuisJe.process.conception")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("quiSuisJe.process.conception.desc")}
                </p>
              </div>

              <div className="bg-gradient-to-b from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">
                  {t("quiSuisJe.process.prototype")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("quiSuisJe.process.prototype.desc")}
                </p>
              </div>

              <div className="bg-gradient-to-b from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <h4 className="font-semibold mb-2">
                  {t("quiSuisJe.process.production")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("quiSuisJe.process.production.desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
