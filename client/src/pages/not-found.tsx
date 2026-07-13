import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * 404 — elle vivait hors du Layout : ni header, ni footer, et une carte blanche
 * à bord gris qui n'appartenait à aucune page du site. Elle reprend le cadre
 * commun et la typographie de la maquette.
 */
export default function NotFound() {
  const { t } = useLanguage();

  return (
    <Layout headerTone="surface" footerTone="blue">
      <div className="mx-auto flex min-h-[60vh] max-w-[1920px] flex-col items-center justify-center px-[6vw] py-24 text-center md:px-[8.4vw]">
        <p
          className="font-bold leading-none text-alto-orange text-[clamp(72px,12vw,220px)]"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          404
        </p>

        <h1
          className="mt-4 font-bold text-alto-brown dark:text-alto-cream text-[clamp(28px,2.6vw,50px)]"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("error.404.title")}
        </h1>

        <p className="mt-4 max-w-[640px] text-alto-brown/70 dark:text-alto-cream/70 text-[clamp(16px,1.15vw,22px)]">
          {t("error.404.message")}
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-full border-2 border-alto-orange px-8 py-3 font-bold text-alto-orange transition-colors hover:bg-alto-orange hover:text-alto-cream text-[clamp(16px,1.2vw,22px)]"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("nav.home")}
        </Link>
      </div>
    </Layout>
  );
}
