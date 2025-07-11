import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PolitiqueConfidentialite() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("privacy.title")}
        </h1>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.intro.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.intro.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.data.title")}
            </h2>
            <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-gray-100">
              {t("privacy.data.provided.title")}
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("privacy.data.provided.name")}</li>
              <li>{t("privacy.data.provided.email")}</li>
              <li>{t("privacy.data.provided.address")}</li>
              <li>{t("privacy.data.provided.phone")}</li>
              <li>{t("privacy.data.provided.payment")}</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-gray-100">
              {t("privacy.data.auto.title")}
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("privacy.data.auto.ip")}</li>
              <li>{t("privacy.data.auto.browser")}</li>
              <li>{t("privacy.data.auto.pages")}</li>
              <li>{t("privacy.data.auto.location")}</li>
            </ul>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-4">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                {t("privacy.data.principle.title")}
              </h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                {t("privacy.data.principle.text")}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.usage.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.usage.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("privacy.usage.orders")}</li>
              <li>{t("privacy.usage.contact")}</li>
              <li>{t("privacy.usage.support")}</li>
              <li>{t("privacy.usage.improve")}</li>
              <li>{t("privacy.usage.legal")}</li>
            </ul>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              <strong>Note :</strong> {t("privacy.usage.note")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.sharing.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.sharing.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("privacy.sharing.providers")}</li>
              <li>{t("privacy.sharing.legal")}</li>
            </ul>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Hébergement sécurisé :</strong>{" "}
              {t("privacy.sharing.hosting")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.cookies.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.cookies.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("privacy.cookies.preferences")}</li>
              <li>{t("privacy.cookies.analytics")}</li>
              <li>{t("privacy.cookies.personalize")}</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.cookies.disable")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.security.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.security.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.rights.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.rights.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("privacy.rights.access")}</li>
              <li>{t("privacy.rights.rectify")}</li>
              <li>{t("privacy.rights.delete")}</li>
              <li>{t("privacy.rights.limit")}</li>
              <li>{t("privacy.rights.oppose")}</li>
              <li>{t("privacy.rights.portable")}</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.rights.contact")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.retention.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.retention.text1")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t("privacy.retention.text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.modifications.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.modifications.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("privacy.contact.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("privacy.contact.intro")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>{t("privacy.contact.email")}</strong> altolille@gmail.com
              <br />
              <strong>{t("privacy.contact.address")}</strong> 95 rue Pierre
              Ledent, 62170 Montreuil-sur-Mer, France
              <br />
              <strong>{t("privacy.contact.phone")}</strong> +33 782 086 690
            </p>
          </section>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">
            {t("privacy.lastUpdate")}
          </p>
        </div>
      </div>
    </Layout>
  );
}
