import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { phrase, type SiteBlock, type SitePage } from "@/lib/sitePages";
import fallbackPages from "./sitePages.fallback.json";

interface SitePageViewProps {
  slug: string;
  /** Titre de repli tant que la page n'est pas chargée (clé de traduction). */
  fallbackTitleKey?: string;
}

/**
 * Rendu public d'une page annexe. Les six pages (Livraison, Retours, FAQ,
 * Mentions légales, Politique de confidentialité, CGV) passent toutes par ici :
 * la mise en forme est décidée une fois, le contenu vient de la gestion.
 */
export function SitePageView({ slug, fallbackTitleKey }: SitePageViewProps) {
  const { t, language } = useLanguage();

  const { data } = useQuery<SitePage>({
    queryKey: [`/api/pages/${slug}`],
  });

  // Copie embarquée au build, comme pour les traductions : une page légale doit
  // s'afficher même si l'API ne répond pas. Dès que l'API répond, c'est elle qui
  // fait foi — la copie peut donc dater d'avant les dernières modifications
  // faites en gestion, et c'est voulu.
  const bundled = (fallbackPages as Record<string, SitePage>)[slug];
  const page = data ?? bundled;

  const title = page
    ? phrase(page.title, language)
    : fallbackTitleKey
      ? t(fallbackTitleKey)
      : "";

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1
          className="mb-8 text-3xl font-bold text-alto-brown dark:text-alto-cream md:text-4xl"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {title}
        </h1>

        {!page && (
          <p className="text-alto-brown/80 dark:text-alto-cream/80">
            {t("common.error")}
          </p>
        )}

        {page && (
          <div className="space-y-6">
            {page.blocks.map((block) => (
              <Block key={block.id} block={block} language={language} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

/**
 * Les retours à la ligne saisis dans la gestion sont rendus tels quels : c'est
 * la seule mise en forme dont Anatole a besoin dans un paragraphe (adresses,
 * coordonnées), et ça évite d'ouvrir la porte au HTML libre.
 */
function Multiline({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i, all) => (
        <span key={i}>
          {line}
          {i < all.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

const BODY = "text-alto-brown/80 dark:text-alto-cream/80 leading-relaxed";

function Block({ block, language }: { block: SiteBlock; language: string }) {
  switch (block.type) {
    case "heading": {
      const text = phrase(block.text, language);
      if (block.level === 3) {
        return (
          <h3 className="pt-2 text-lg font-medium text-alto-brown dark:text-alto-cream">
            {text}
          </h3>
        );
      }
      return (
        <h2
          className="border-b border-alto-brown/15 pb-2 pt-6 text-2xl font-semibold text-alto-brown dark:border-alto-cream/15 dark:text-alto-cream"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {text}
        </h2>
      );
    }

    case "paragraph":
      return (
        <p className={BODY}>
          <Multiline text={phrase(block.text, language)} />
        </p>
      );

    case "list":
      return (
        <ul className={`list-disc space-y-1 pl-6 ${BODY}`}>
          {block.items.map((item, i) => (
            <li key={i}>{phrase(item, language)}</li>
          ))}
        </ul>
      );

    case "faq":
      return (
        <div className="space-y-4">
          {block.items.map((item, i) => (
            <div
              key={i}
              className="rounded-lg bg-alto-brown/5 p-6 dark:bg-alto-cream/5"
            >
              <h3 className="mb-3 text-lg font-medium text-alto-brown dark:text-alto-cream">
                {phrase(item.question, language)}
              </h3>
              <p className={BODY}>
                <Multiline text={phrase(item.answer, language)} />
              </p>
            </div>
          ))}
        </div>
      );

    case "callout":
      return (
        <div className="rounded-lg border-l-4 border-alto-orange bg-alto-orange/5 p-4">
          <p className={BODY}>
            <Multiline text={phrase(block.text, language)} />
          </p>
        </div>
      );

    case "image":
      return block.src ? (
        <figure>
          <img
            src={block.src}
            alt={phrase(block.alt, language)}
            className="w-full rounded-lg object-cover"
          />
        </figure>
      ) : null;

    default:
      return null;
  }
}
