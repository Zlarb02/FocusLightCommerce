import ProjectPageUnified from "@/components/ProjectPageUnified";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Focus01() {
  const { t } = useLanguage();

  return (
    <ProjectPageUnified
      title="Focus.01"
      subtitle={t("projects.focus01.subtitle")}
      imagePath="/images/focus-01.jpg"
      date="2024/2025"
      currentProject="Focus01"
      description={
        <>
          <p>{t("projects.focus01.description1")}</p>
          <p>{t("projects.focus01.description2")}</p>
        </>
      }
      additionalContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Concept et recherches
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                J'ai souhaité créer une lampe au design épuré avec une
                utilisation intuitive. Toutes les pièces s'emboîtent
                parfaitement grâce à un système d'assemblage sans outils.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Les couleurs contrastées permettent de maintenir l'intérêt
                visuel même lorsque la lampe est éteinte, faisant d'elle un
                véritable objet de décoration.
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.focus01.characteristics.title")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t("projects.focus01.characteristics.text1")}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t("projects.focus01.characteristics.text2")}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.focus01.positioning.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("projects.focus01.positioning.text1")}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t("projects.focus01.positioning.text2")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3
                className="text-lg font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.focus01.specs.title")}
              </h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                <li>{t("projects.focus01.specs.materials")}</li>
                <li>{t("projects.focus01.specs.socket")}</li>
                <li>{t("projects.focus01.specs.switch")}</li>
                <li>{t("projects.focus01.specs.designer")}</li>
                <li>{t("projects.focus01.specs.colors")}</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3
                className="text-lg font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.focus01.future.title")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {t("projects.focus01.future.text")}
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Alto lille - Focus.01
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Premier produit de la marque Alto | Disponible à 60€ frais de port
              inclus
            </p>
          </div>
        </div>
      }
    />
  );
}
