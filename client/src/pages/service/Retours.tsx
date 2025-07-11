import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Retours() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("retours.title")}
        </h1>

        <div className="max-w-none text-gray-900 dark:text-gray-100">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.withdrawal.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("retours.withdrawal.description")}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mt-4">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                ⏰ {t("retours.withdrawal.deadline.title")}
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                <li>{t("retours.withdrawal.deadline.period")}</li>
                <li>{t("retours.withdrawal.deadline.postmark")}</li>
                <li>{t("retours.withdrawal.deadline.noPenalty")}</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.conditions.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("retours.conditions.description")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("retours.conditions.originalPackaging")}</li>
              <li>{t("retours.conditions.perfectCondition")}</li>
              <li>{t("retours.conditions.allAccessories")}</li>
              <li>{t("retours.conditions.labelsIntact")}</li>
              <li>✅ Facture d'achat jointe</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4 dark:bg-red-900/30 dark:border-red-600">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                ❌ {t("retours.conditions.exclusions.title")}
              </h4>
              <p className="text-red-700 dark:text-red-300 text-sm">
                {t("retours.conditions.exclusions.description")}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.process.title")}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {t("retours.process.step1.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("retours.process.step1.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {t("retours.process.step2.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("retours.process.step2.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {t("retours.process.step3.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("retours.process.step3.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {t("retours.process.step4.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("retours.process.step4.description")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.fees.title")}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  ✅ {t("retours.fees.free.title")}
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 list-disc pl-4">
                  <li>{t("retours.fees.free.defective")}</li>
                  <li>{t("retours.fees.free.ourError")}</li>
                  <li>{t("retours.fees.free.nonCompliant")}</li>
                  <li>{t("retours.fees.free.over100")}</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
                <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                  💰 {t("retours.fees.charged.title")}
                </h3>
                <ul className="text-sm text-orange-700 dark:text-orange-300 list-disc pl-4">
                  <li>{t("retours.fees.charged.changeOfMind")}</li>
                  <li>{t("retours.fees.charged.under100")}</li>
                  <li>{t("retours.fees.charged.cost")}</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.exchanges.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("retours.exchanges.description")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("retours.exchanges.contactFirst")}</li>
              <li>{t("retours.exchanges.checkAvailability")}</li>
              <li>{t("retours.exchanges.freeSameValue")}</li>
              <li>{t("retours.exchanges.payDifference")}</li>
              <li>{t("retours.exchanges.refundDifference")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.processing.title")}
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                📋 {t("retours.processing.timeline.title")}
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>{t("retours.processing.timeline.reception")}</li>
                <li>{t("retours.processing.timeline.qualityCheck")}</li>
                <li>{t("retours.processing.timeline.refund")}</li>
                <li>{t("retours.processing.timeline.total")}</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.refund.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("retours.refund.description")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("retours.refund.bankCard")}</li>
              <li>{t("retours.refund.bankTransfer")}</li>
              <li>{t("retours.refund.paypal")}</li>
            </ul>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("retours.refund.includes")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.defective.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("retours.defective.intro")}
            </p>
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
              <ul className="list-disc pl-6 text-sm text-gray-700 dark:text-gray-300">
                <li>{t("retours.defective.contactImmediately")}</li>
                <li>{t("retours.defective.dontUse")}</li>
                <li>{t("retours.defective.weCoverCosts")}</li>
                <li>{t("retours.defective.priorityReplacement")}</li>
                <li>{t("retours.defective.compensation")}</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.address.title")}
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {t("retours.address.company")}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t("retours.address.street")}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t("retours.address.city")}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t("retours.address.country")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t("retours.address.warning")}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("retours.contact.title")}
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                {t("retours.contact.email")}
                <br />
                {t("retours.contact.phone")}
                <br />
                {t("retours.contact.hours")}
              </p>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                {t("retours.contact.emailSubject")}
              </p>
            </div>
          </section>

          <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-600 p-4 mt-8">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t("retours.commitment")}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
