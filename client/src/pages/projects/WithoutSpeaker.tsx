import ProjectPageUnified from "@/components/ProjectPageUnified";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WithoutSpeaker() {
  const { t } = useLanguage();

  return (
    <ProjectPageUnified
      title={t("projects.lowtechvynil")}
      subtitle={t("projects.withoutSpeaker.subtitle")}
      imagePath="/images/lowtech-vynil.jpg"
      date="2024"
      currentProject="WithoutSpeaker"
      description={
        <>
          <p>{t("projects.withoutSpeaker.description1")}</p>
          <p>{t("projects.withoutSpeaker.description2")}</p>
        </>
      }
      additionalContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.withoutSpeaker.concept.title")}
              </h3>
              <p className="text-gray-700 mb-4">
                {t("projects.withoutSpeaker.concept.text1")}
              </p>
              <p className="text-gray-700">
                {t("projects.withoutSpeaker.concept.text2")}
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.withoutSpeaker.technology.title")}
              </h3>
              <p className="text-gray-700 mb-4">
                {t("projects.withoutSpeaker.technology.text1")}
              </p>
              <p className="text-gray-700">
                {t("projects.withoutSpeaker.technology.text2")}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.withoutSpeaker.experience.title")}
            </h3>
            <p className="text-gray-700 mb-4">
              {t("projects.withoutSpeaker.experience.text1")}
            </p>
            <p className="text-gray-700">
              {t("projects.withoutSpeaker.experience.text2")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.withoutSpeaker.specs.title")}
              </h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>{t("projects.withoutSpeaker.specs.turntable")}</li>
                <li>{t("projects.withoutSpeaker.specs.drive")}</li>
                <li>{t("projects.withoutSpeaker.specs.support")}</li>
                <li>{t("projects.withoutSpeaker.specs.design")}</li>
                <li>{t("projects.withoutSpeaker.specs.materials")}</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("projects.withoutSpeaker.reflection.title")}
              </h3>
              <p className="text-gray-700 text-sm">
                {t("projects.withoutSpeaker.reflection.text")}
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("projects.withoutSpeaker.installation.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("projects.withoutSpeaker.installation.subtitle")}
            </p>
          </div>
        </div>
      }
    />
  );
}
