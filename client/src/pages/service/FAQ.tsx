import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FAQ() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1
            className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("faq.title")}
          </h1>
          <p className="text-lg text-alto-brown/70 dark:text-alto-cream/80 max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* Questions et réponses */}
        <div className="space-y-8">
          {/* Produits */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-alto-brown/15 dark:border-alto-cream/15"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("faq.products.title")}
            </h2>

            <div className="space-y-6">
              <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.products.materials.title")}
                </h3>
                <p className="text-alto-brown/70 dark:text-alto-cream/80 leading-relaxed">
                  {t("faq.products.materials.answer")}
                </p>
              </div>

              <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.products.consumption.title")}
                </h3>
                <p className="text-alto-brown/70 dark:text-alto-cream/80 leading-relaxed">
                  {t("faq.products.consumption.answer")}
                </p>
              </div>

              <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.products.durability.title")}
                </h3>
                <p className="text-alto-brown/70 dark:text-alto-cream/80 leading-relaxed">
                  {t("faq.products.durability.answer")}
                </p>
              </div>
            </div>
          </section>

          {/* Commande et livraison */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-alto-brown/15 dark:border-alto-cream/15"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("faq.delivery.title")}
            </h2>

            <div className="space-y-6">
              <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.delivery.time.title")}
                </h3>
                <p className="text-alto-brown/70 dark:text-alto-cream/80 leading-relaxed">
                  {t("faq.delivery.time.answer")}
                </p>
              </div>

              <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.delivery.cost.title")}
                </h3>
                <p className="text-alto-brown/70 dark:text-alto-cream/80 leading-relaxed">
                  {t("faq.delivery.cost.answer")}
                </p>
              </div>

              <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.delivery.tracking.title")}
                </h3>
                <p className="text-alto-brown/70 dark:text-alto-cream/80 leading-relaxed">
                  {t("faq.delivery.tracking.answer")}
                </p>
              </div>
            </div>
          </section>

          {/* Section SAV et garantie supprimée à la demande du client */}

          {/* Technique */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-alto-brown/15 dark:border-alto-cream/15"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("faq.technical.title")}
            </h2>

            <div className="space-y-6">
              <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.technical.installation.title")}
                </h3>
                <p className="text-alto-brown/70 dark:text-alto-cream/80 leading-relaxed">
                  {t("faq.technical.installation.answer")}
                </p>
              </div>

              <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.technical.maintenance.title")}
                </h3>
                <p className="text-alto-brown/70 dark:text-alto-cream/80 leading-relaxed">
                  {t("faq.technical.maintenance.answer")}
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mt-12 pt-8 border-t border-alto-brown/15 dark:border-alto-cream/15">
            <div className="text-center">
              <h2
                className="text-2xl font-semibold text-[var(--color-text)] mb-4"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("faq.contact.title")}
              </h2>
              <p className="text-alto-brown/70 dark:text-alto-cream/80 mb-6">
                {t("faq.contact.subtitle")}
              </p>
              <a
                href="mailto:altolille@gmail.com"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {t("faq.contact.email")}
              </a>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
