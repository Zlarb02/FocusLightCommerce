import ProjectPageUnified from "@/components/ProjectPageUnified";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SeaCle() {
  const { t } = useLanguage();

  return (
    <ProjectPageUnified
      title="Sea-clé"
      subtitle={t("projects.seacle.subtitle")}
      imagePath="/images/sea-cle.jpg"
      date="2024"
      currentProject="SeaCle"
      description={
        <>
          <p>{t("projects.seacle.description1")}</p>
          <p>{t("projects.seacle.description2")}</p>
        </>
      }
      additionalContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.seacle.ergonomics.title")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t("projects.seacle.ergonomics.text")}
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.seacle.innovation.title")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t("projects.seacle.innovation.text1")}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t("projects.seacle.innovation.text2")}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.seacle.economy.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t("projects.seacle.economy.text")}
            </p>
          </div>

          <div className="text-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.seacle.specs.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("projects.seacle.specs.dimensions")}
              <br />
              {t("projects.seacle.specs.material")}
              <br />
              {t("projects.seacle.specs.manufacturer")}
            </p>
          </div>
        </div>
      }
    />
  );
}
