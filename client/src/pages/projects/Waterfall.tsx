import ProjectPageUnified from "@/components/ProjectPageUnified";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Waterfall() {
  const { t } = useLanguage();

  return (
    <ProjectPageUnified
      title="Waterfall"
      subtitle={t("projects.waterfall.subtitle")}
      imagePath="/images/waterfall.jpg"
      date="2023"
      currentProject="Waterfall"
      description={
        <>
          <p>{t("projects.waterfall.description1")}</p>
          <p>{t("projects.waterfall.description2")}</p>
        </>
      }
      additionalContent={
        <div className="space-y-12">
          <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.waterfall.materials.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("projects.waterfall.materials.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("projects.waterfall.materials.text2")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.waterfall.design.title")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t("projects.waterfall.design.text")}
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.waterfall.variation.title")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t("projects.waterfall.variation.text")}
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.waterfall.details.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t("projects.waterfall.details.designer")}
              <br />
              {t("projects.waterfall.details.date")}
              <br />
              {t("projects.waterfall.details.exhibition")}
            </p>
          </div>
        </div>
      }
    />
  );
}
