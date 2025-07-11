import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";

export default function DesignEnAction() {
  const { t } = useLanguage();

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
                        {t("designInAction.seacle.circularEconomy.description")}
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
                    <img
                      src="https://www.alto-lille.fr/uploads/sea-cle.jpg"
                      alt="Sea-cle"
                      className="w-full h-full object-cover"
                    />
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
    </Layout>
  );
}
