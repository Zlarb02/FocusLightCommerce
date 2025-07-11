import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MentionsLegales() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("mentions.title")}
        </h1>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("mentions.editor.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>{t("mentions.editor.company")}</strong>
              <br />
              {t("mentions.editor.address")}
              <br />
              {t("mentions.editor.postal")}
              <br />
              {t("mentions.editor.country")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>{t("mentions.editor.email")}</strong> altolille@gmail.com
              <br />
              <strong>{t("mentions.editor.phone")}</strong> +33 782 086 690
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("mentions.director.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.director.name")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("mentions.hosting.title")}
            </h2>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
              {t("mentions.hosting.website.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.hosting.website.text")}
              <br />
              {t("mentions.hosting.website.address")}
              <br />
              {t("mentions.hosting.website.city")}
              <br />
              {t("mentions.hosting.website.country")}
            </p>

            <h3 className="text-lg font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100">
              {t("mentions.hosting.data.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.hosting.data.text")}
              <br />
              {t("mentions.hosting.data.address")}
              <br />
              {t("mentions.hosting.data.city")}
              <br />
              {t("mentions.hosting.data.country")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("mentions.development.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.development.text")}
              <br />
              <a
                href="https://pogodev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                pogodev.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("mentions.intellectual.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.intellectual.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.intellectual.text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("mentions.responsibility.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.responsibility.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.responsibility.text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("mentions.links.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.links.text")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("mentions.law.title")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t("mentions.law.text")}
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
