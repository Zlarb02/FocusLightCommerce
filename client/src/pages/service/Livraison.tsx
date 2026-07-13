import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Livraison() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-3xl font-bold mb-8 text-alto-brown dark:text-alto-cream"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("livraison.title")}
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-alto-brown dark:text-alto-cream">
              {t("livraison.zones.title")}
            </h2>
            <p className="text-alto-brown/80 dark:text-alto-cream/80">
              {t("livraison.zones.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-alto-brown/80 dark:text-alto-cream/80">
              <li>{t("livraison.zones.france")}</li>
              <li>{t("livraison.zones.corsica")}</li>
              <li>{t("livraison.zones.drom")}</li>
              <li>{t("livraison.zones.eu")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-alto-brown dark:text-alto-cream">
              {t("livraison.modes.title")}
            </h2>

            <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-3 text-alto-brown dark:text-alto-cream">
                🚚 {t("livraison.standard.title")}
              </h3>
              <ul className="list-disc pl-6 text-alto-brown/80 dark:text-alto-cream/80">
                <li>{t("livraison.standard.delay")}</li>
                <li>{t("livraison.standard.price")}</li>
                <li>{t("livraison.standard.free")}</li>
                <li>{t("livraison.standard.carrier")}</li>
                <li>{t("livraison.standard.tracking")}</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-3 text-alto-brown dark:text-alto-cream">
                ⚡ {t("livraison.express.title")}
              </h3>
              <ul className="list-disc pl-6 text-alto-brown/80 dark:text-alto-cream/80">
                <li>{t("livraison.express.delay")}</li>
                <li>{t("livraison.express.price")}</li>
                <li>{t("livraison.express.carrier")}</li>
                <li>{t("livraison.express.conditions")}</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-3 text-alto-brown dark:text-alto-cream">
                🌍 {t("livraison.international.title")}
              </h3>
              <ul className="list-disc pl-6 text-alto-brown/80 dark:text-alto-cream/80">
                <li>{t("livraison.international.delay")}</li>
                <li>{t("livraison.international.price")}</li>
                <li>{t("livraison.international.carrier")}</li>
                <li>{t("livraison.international.tracking")}</li>
                <li>{t("livraison.international.customs")}</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-alto-brown dark:text-alto-cream">
              {t("livraison.preparation.title")}
            </h2>
            <p className="text-alto-brown/80 dark:text-alto-cream/80">
              {t("livraison.preparation.delay")}
            </p>
            <p className="text-alto-brown/80 dark:text-alto-cream/80">
              {t("livraison.preparation.handmade")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-alto-brown/80 dark:text-alto-cream/80">
              <li>{t("livraison.preparation.sameDay")}</li>
              <li>{t("livraison.preparation.friday")}</li>
              <li>{t("livraison.preparation.noWeekend")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-alto-brown dark:text-alto-cream">
              {t("livraison.tracking.title")}
            </h2>
            <p className="text-alto-brown/80 dark:text-alto-cream/80">
              {t("livraison.tracking.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-alto-brown/80 dark:text-alto-cream/80">
              <li>{t("livraison.tracking.email")}</li>
              <li>{t("livraison.tracking.number")}</li>
              <li>{t("livraison.tracking.sms")}</li>
            </ul>
            <p className="text-alto-brown/80 dark:text-alto-cream/80">
              {t("livraison.tracking.follow")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-alto-brown dark:text-alto-cream">
              {t("livraison.reception.title")}
            </h2>
            <h3 className="text-xl font-medium mb-3 text-alto-brown dark:text-alto-cream">
              📦 {t("livraison.reception.home.title")}
            </h3>
            <ul className="list-disc pl-6 mb-4 text-alto-brown/80 dark:text-alto-cream/80">
              <li>{t("livraison.reception.home.delivery")}</li>
              <li>{t("livraison.reception.home.relayOption")}</li>
              <li>{t("livraison.reception.home.checkPackage")}</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-alto-brown dark:text-alto-cream">
              🏪 {t("livraison.reception.relay.title")}
            </h3>
            <ul className="list-disc pl-6 mb-4 text-alto-brown/80 dark:text-alto-cream/80">
              <li>{t("livraison.reception.relay.deadline")}</li>
              <li>{t("livraison.reception.relay.id")}</li>
              <li>{t("livraison.reception.relay.notification")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-alto-brown dark:text-alto-cream">
              {t("livraison.packaging.title")}
            </h2>
            <p className="text-alto-brown/80 dark:text-alto-cream/80">
              {t("livraison.packaging.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-alto-brown/80 dark:text-alto-cream/80">
              <li>{t("livraison.packaging.cardboard")}</li>
              <li>{t("livraison.packaging.biodegradable")}</li>
              <li>{t("livraison.packaging.minimal")}</li>
              <li>{t("livraison.packaging.noPlastic")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-alto-brown dark:text-alto-cream">
              {t("livraison.problems.title")}
            </h2>
            <p className="text-alto-brown/80 dark:text-alto-cream/80">
              {t("livraison.problems.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-alto-brown/80 dark:text-alto-cream/80">
              <li>{t("livraison.problems.damaged")}</li>
              <li>{t("livraison.problems.lost")}</li>
              <li>{t("livraison.problems.wrongAddress")}</li>
              <li>{t("livraison.problems.absent")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-alto-brown dark:text-alto-cream">
              {t("livraison.contact.title")}
            </h2>
            <p className="text-alto-brown/80 dark:text-alto-cream/80">
              {t("livraison.contact.intro")}
            </p>
            <div className="bg-alto-brown/5 dark:bg-alto-cream/5 p-4 rounded-lg">
              <p className="text-alto-brown/80 dark:text-alto-cream/80">
                {t("livraison.contact.email")}
                <br />
                {t("livraison.contact.phone")}
                <br />
                {t("livraison.contact.hours")}
              </p>
            </div>
          </section>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mt-8">
            <p className="text-sm text-alto-brown/80 dark:text-alto-cream/80">
              {t("livraison.notice")}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
