import ProjectPageUnified from "@/components/ProjectPageUnified";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BraderieDeLArt() {
  const { t } = useLanguage();

  return (
    <ProjectPageUnified
      title="Braderie de l'Art"
      subtitle={t("projects.braderie.subtitle")}
      imagePath="/images/braderie-de-l-art.png"
      date={t("dates.november2023")}
      currentProject="BraderieDeLArt"
      description={
        <>
          <p>{t("projects.braderie.description1")}</p>
          <p>{t("projects.braderie.description2")}</p>
        </>
      }
      additionalContent={
        <div className="space-y-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.braderie.context.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("projects.braderie.context.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("projects.braderie.context.text2")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.braderie.process.title")}
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>{t("projects.braderie.process.explore")}</li>
                <li>{t("projects.braderie.process.identify")}</li>
                <li>{t("projects.braderie.process.design")}</li>
                <li>{t("projects.braderie.process.assembly")}</li>
              </ul>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.braderie.philosophy.title")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t("projects.braderie.philosophy.text")}
                quotidien. Le mouvement devient ici métaphore de la musique,
                créant un dialogue entre forme et fonction.
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Braderie de l'Art - Roubaix
            </h3>
            <p className="text-gray-600 text-sm">
              Événement extra-scolaire | Novembre 2023
            </p>
          </div>
        </div>
      }
    />
  );
}
