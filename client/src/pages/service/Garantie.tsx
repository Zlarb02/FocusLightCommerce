import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Garantie() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("garantie.title")}
        </h1>

        <div className="max-w-none text-gray-900 dark:text-gray-100">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("garantie.commitment.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("garantie.commitment.description")}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mt-4">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                🏆 {t("garantie.commercial.title")}
              </h3>
              <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                {t("garantie.commercial.duration")}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
                {t("garantie.commercial.coverage")}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("garantie.legal.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("garantie.legal.description")}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  📋 {t("garantie.legal.conformity.title")}
                </h3>
                <ul className="text-sm list-disc pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>{t("garantie.legal.conformity.duration")}</li>
                  <li>Couvre les défauts présents à la livraison</li>
                  <li>{t("garantie.legal.conformity.presumption")}</li>
                  <li>{t("garantie.legal.conformity.remedy")}</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  🔍 {t("garantie.legal.hiddenDefects.title")}
                </h3>
                <ul className="text-sm list-disc pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>{t("garantie.legal.hiddenDefects.duration")}</li>
                  <li>{t("garantie.legal.hiddenDefects.coverage")}</li>
                  <li>{t("garantie.legal.hiddenDefects.defects")}</li>
                  <li>{t("garantie.legal.hiddenDefects.remedy")}</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("garantie.coverage.title")}
            </h2>

            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  ✅ {t("garantie.coverage.covered.title")}
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 list-disc pl-4 space-y-1">
                  <li>{t("garantie.coverage.covered.manufacturing")}</li>
                  <li>{t("garantie.coverage.covered.electrical")}</li>
                  <li>{t("garantie.coverage.covered.materials")}</li>
                  <li>{t("garantie.coverage.covered.led")}</li>
                  <li>{t("garantie.coverage.covered.finish")}</li>
                  <li>{t("garantie.coverage.covered.nonCompliance")}</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  ❌ {t("garantie.coverage.notCovered.title")}
                </h3>
                <ul className="text-sm text-red-700 dark:text-red-300 list-disc pl-4 space-y-1">
                  <li>{t("garantie.coverage.notCovered.misuse")}</li>
                  <li>{t("garantie.coverage.notCovered.accidents")}</li>
                  <li>{t("garantie.coverage.notCovered.humidity")}</li>
                  <li>{t("garantie.coverage.notCovered.modifications")}</li>
                  <li>{t("garantie.coverage.notCovered.normalWear")}</li>
                  <li>{t("garantie.coverage.notCovered.overvoltage")}</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("garantie.process.title")}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {t("garantie.process.step1.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t("garantie.process.step1.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {t("garantie.process.step2.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t("garantie.process.step2.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {t("garantie.process.step3.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {t("garantie.process.step3.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {t("garantie.process.step4.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {t("garantie.process.step4.description")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("garantie.timeline.title")}
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {t("garantie.timeline.response.time")}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {t("garantie.timeline.response.description")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {t("garantie.timeline.diagnosis.time")}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {t("garantie.timeline.diagnosis.description")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {t("garantie.timeline.resolution.time")}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {t("garantie.timeline.resolution.description")}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("garantie.interventions.title")}
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  🔧 {t("garantie.interventions.repair.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t("garantie.interventions.repair.description")}
                </p>
                <ul className="text-sm list-disc pl-4 text-gray-700 dark:text-gray-300">
                  <li>{t("garantie.interventions.repair.diagnosis")}</li>
                  <li>{t("garantie.interventions.repair.originalParts")}</li>
                  <li>{t("garantie.interventions.repair.qualityTests")}</li>
                  <li>{t("garantie.interventions.repair.warranty")}</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  🔄 {t("garantie.interventions.replacement.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t("garantie.interventions.replacement.description")}
                </p>
                <ul className="text-sm list-disc pl-4 text-gray-700 dark:text-gray-300">
                  <li>{t("garantie.interventions.replacement.newProduct")}</li>
                  <li>
                    {t("garantie.interventions.replacement.fullWarranty")}
                  </li>
                  <li>
                    {t("garantie.interventions.replacement.returnIncluded")}
                  </li>
                  <li>
                    {t("garantie.interventions.replacement.priorityShipping")}
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  💰 {t("garantie.interventions.refund.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t("garantie.interventions.refund.description")}
                </p>
                <ul className="text-sm list-disc pl-4 text-gray-700 dark:text-gray-300">
                  <li>{t("garantie.interventions.refund.fullRefund")}</li>
                  <li>{t("garantie.interventions.refund.returnCosts")}</li>
                  <li>{t("garantie.interventions.refund.deadline")}</li>
                  <li>{t("garantie.interventions.refund.originalPayment")}</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("garantie.extension.title")}
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                🌟 {t("garantie.extension.premium.title")}
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                {t("garantie.extension.premium.description")}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t("garantie.extension.premium.duration")}</li>
                <li>{t("garantie.extension.premium.coverage")}</li>
                <li>{t("garantie.extension.premium.service")}</li>
                <li>{t("garantie.extension.premium.price")}</li>
              </ul>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                {t("garantie.extension.premium.condition")}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("garantie.maintenance.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("garantie.maintenance.intro")}
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  🧹 {t("garantie.maintenance.regular.title")}
                </h3>
                <ul className="text-sm list-disc pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>{t("garantie.maintenance.regular.dusting")}</li>
                  <li>{t("garantie.maintenance.regular.woodCleaning")}</li>
                  <li>{t("garantie.maintenance.regular.connectionCheck")}</li>
                  <li>{t("garantie.maintenance.regular.bulbReplacement")}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  ⚠️ {t("garantie.maintenance.precautions.title")}
                </h3>
                <ul className="text-sm list-disc pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>{t("garantie.maintenance.precautions.sunExposure")}</li>
                  <li>{t("garantie.maintenance.precautions.humidity")}</li>
                  <li>{t("garantie.maintenance.precautions.bulbSpecs")}</li>
                  <li>
                    {t("garantie.maintenance.precautions.unplugBeforeCleaning")}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("garantie.contact.title")}
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                {t("garantie.contact.service")}
                <br />
                {t("garantie.contact.phone")}
                <br />
                {t("garantie.contact.hours")}
                <br />
                {t("garantie.contact.workshop")}
              </p>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                {t("garantie.contact.emailSubject")}
              </p>
            </div>
          </section>

          <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-600 p-4 mt-8">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t("garantie.promise")}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
