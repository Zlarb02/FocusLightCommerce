import ProjectPageUnified from "@/components/ProjectPageUnified";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ChaussuresCustom() {
  const { t } = useLanguage();

  return (
    <ProjectPageUnified
      title="Chaussures Custom"
      subtitle={t("projects.chaussures.subtitle")}
      imagePath="/images/chaussures-custom.jpg"
      date={t("dates.since2020")}
      currentProject="ChaussuresCustom"
      description={
        <>
          <p>{t("projects.chaussures.description1")}</p>
          <p>{t("projects.chaussures.description2")}</p>
        </>
      }
      additionalContent={
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-3 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <img
                  src={`/images/custom-shoe-${i}.jpg`}
                  alt={`Chaussure customisée ${i}`}
                  className="w-full h-auto object-cover aspect-square rounded"
                />
                <div className="mt-3 p-2">
                  <h4
                    className="font-medium text-center text-gray-900 dark:text-gray-100"
                    style={{ fontFamily: "var(--font-titles)" }}
                  >
                    Modèle{" "}
                    {i === 1
                      ? t("projects.chaussures.models.urbanFlow")
                      : i === 2
                      ? t("projects.chaussures.models.natureSpirit")
                      : t("projects.chaussures.models.abstractVision")}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3
              className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.chaussures.technique.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("projects.chaussures.technique.description")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    1
                  </span>
                </div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {t("projects.chaussures.process.consultation")}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("projects.chaussures.process.consultation.desc")}
                </p>
              </div>
              <div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    2
                  </span>
                </div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {t("projects.chaussures.process.design")}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("projects.chaussures.process.design.desc")}
                </p>
              </div>
              <div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    3
                  </span>
                </div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {t("projects.chaussures.process.transformation")}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("projects.chaussures.process.transformation.desc")}
                </p>
              </div>
              <div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    4
                  </span>
                </div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {t("projects.chaussures.process.finishing")}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("projects.chaussures.process.finishing.desc")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black dark:bg-gray-900 text-white dark:text-gray-100 p-8 rounded-lg text-center border border-gray-800 dark:border-gray-600">
            <h3
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.chaussures.cta.title")}
            </h3>
            <p className="mb-6">{t("projects.chaussures.cta.text")}</p>
            <div className="inline-block border border-white dark:border-gray-300 px-5 py-3 rounded">
              {t("projects.chaussures.cta.contact")}
            </div>
          </div>
        </div>
      }
    />
  );
}
