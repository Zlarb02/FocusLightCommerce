import ProjectPageUnified from "@/components/ProjectPageUnified";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LowtechVynil() {
  const { t } = useLanguage();

  return (
    <ProjectPageUnified
      title={t("projects.lowtechvynil")}
      subtitle={t("projects.lowtechvynil.subtitle")}
      imagePath="/images/lowtech-vynil.jpg"
      date="2022"
      currentProject="LowtechVynil"
      description={
        <>
          <p>{t("projects.lowtechvynil.description1")}</p>
          <p>{t("projects.lowtechvynil.description2")}</p>
        </>
      }
      additionalContent={
        <div className="space-y-10">
          <div className="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-100 p-8 rounded-xl">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.lowtechvynil.functioning.title")}
            </h3>
            <p className="mb-4">
              {t("projects.lowtechvynil.functioning.text1")}
            </p>
            <p>{t("projects.lowtechvynil.functioning.text2")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3
                className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.lowtechvynil.philosophy.title")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {t("projects.lowtechvynil.philosophy.text1")}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t("projects.lowtechvynil.philosophy.text2")}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                {t("projects.lowtechvynil.usage.title")}
              </h4>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>{t("projects.lowtechvynil.usage.step1")}</li>
                <li>{t("projects.lowtechvynil.usage.step2")}</li>
                <li>{t("projects.lowtechvynil.usage.step3")}</li>
              </ol>
            </div>
          </div>

          <div className="text-center bg-blue-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.lowtechvynil.project.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t("projects.lowtechvynil.project.subtitle")}
            </p>
          </div>
        </div>
      }
    />
  );
}
