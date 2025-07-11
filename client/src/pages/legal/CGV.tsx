import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CGV() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("cgv.title")}
        </h1>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article1.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article1.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article2.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article2.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article2.text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article3.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article3.text")}
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article4.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article4.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article4.text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article5.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article5.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article6.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article6.text1")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>{t("cgv.article6.list.card1")}</li>
              <li>{t("cgv.article6.list.card2")}</li>
              <li>{t("cgv.article6.list.card3")}</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article6.text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article7.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article7.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article7.text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article8.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article8.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article9.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article9.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article9.text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article10.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article10.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article10.text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article11.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article11.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article12.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article12.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article13.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article13.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article14.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article14.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cgv.article15.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("cgv.article15.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>{t("cgv.article15.contact.company")}</strong>
              <br />
              {t("cgv.article15.contact.address")}
              <br />
              {t("cgv.article15.contact.postal")}
              <br />
              {t("cgv.article15.contact.country")}
              <br />
              <strong>{t("cgv.article15.contact.email")}</strong>{" "}
              altolille@gmail.com
              <br />
              <strong>{t("cgv.article15.contact.phone")}</strong> +33 782 086
              690
            </p>
          </section>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">
            {t("cgv.lastUpdate")}
          </p>
        </div>
      </div>
    </Layout>
  );
}
