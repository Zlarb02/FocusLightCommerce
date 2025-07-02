import ProjectLayoutUnified from "@/components/ProjectLayoutUnified";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FAQ() {
  const { t } = useLanguage();

  return (
    <ProjectLayoutUnified title={t("faq.title")} currentProject="">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1
            className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("faq.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* Questions et réponses */}
        <div className="space-y-8">
          {/* Produits */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-gray-200"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("faq.products.title")}
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.products.materials.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.products.materials.answer")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.products.consumption.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.products.consumption.answer")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.products.durability.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.products.durability.answer")}
                </p>
              </div>
            </div>
          </section>

          {/* Commande et livraison */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-gray-200"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("faq.delivery.title")}
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.delivery.time.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.delivery.time.answer")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.delivery.cost.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.delivery.cost.answer")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.delivery.tracking.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.delivery.tracking.answer")}
                </p>
              </div>
            </div>
          </section>

          {/* Retours et garantie */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-gray-200"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("faq.warranty.title")}
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.warranty.duration.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.warranty.duration.answer")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.warranty.claim.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.warranty.claim.answer")}
                </p>
              </div>
            </div>
          </section>

          {/* Paiement et sécurité */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-gray-200"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("faq.payment.title")}
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.payment.methods.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.payment.methods.answer")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  {t("faq.payment.security.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("faq.payment.security.answer")}
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-[var(--color-bg-light)] p-8 rounded-lg">
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("faq.contact.title")}
            </h2>
            <p className="text-gray-600 mb-6">{t("faq.contact.subtitle")}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-[var(--color-text)] mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-[var(--color-text)]">
                    {t("faq.contact.email")}
                  </p>
                  <a
                    href="mailto:altolille@gmail.com"
                    className="text-gray-600 hover:text-[var(--color-text)] transition"
                  >
                    altolille@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-[var(--color-text)] mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-[var(--color-text)]">
                    {t("faq.contact.phone")}
                  </p>
                  <p className="text-gray-600">+33 782 086 690</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProjectLayoutUnified>
  );
}
