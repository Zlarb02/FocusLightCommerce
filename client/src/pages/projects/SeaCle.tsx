import ProjectPageUnified from "@/components/ProjectPageUnified";

export default function SeaCle() {
  return (
    <ProjectPageUnified
      title="Sea-clé"
      subtitle="Ramasseur de déchets plastiques"
      imagePath="/images/sea-cle.jpg"
      date="2024"
      currentProject="SeaCle"
      description={
        <>
          <p>
            Sea-clé est un projet de diplôme conçu pour révolutionner le
            ramassage des déchets plastiques sur les plages de sable. Cet outil
            innovant permet aux associations environnementales de collecter
            efficacement les détritus sans effort physique excessif.
          </p>
          <p>
            Fabriqué par PLASTICEM à partir des déchets plastiques récupérés sur
            les plages, Sea-clé incarne parfaitement l'économie circulaire :
            transformer le problème en solution. L'outil est conçu pour être
            utilisé autant par les enfants que par les adultes des associations.
          </p>
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
                Contexte d'usage
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                La charrette accompagne les bénévoles sur toute l'étendue de la
                plage. Les déchets sont collectés et stockés dans des sacs, puis
                rassemblés dans la charrette pour optimiser le transport.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Cet outil remplace les équipements traditionnels de ramassage,
                permettant aux bénévoles d'éviter les flexions répétées et de
                préserver leur dos lors des longues sessions de nettoyage.
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Innovation technique
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Après de nombreux tests réalisés avec un prototype à l'échelle
                1/5e, j'ai mis au point un système de filtrage simple mais
                remarquablement efficace, couvrant une surface étendue.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                L'ensemble du processus, du tri sélectif des déchets à
                l'injection plastique finale, est maîtrisé par PLASTICEM,
                garantissant ainsi une fabrication locale et éco-responsable.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Économie circulaire
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Sea-clé illustre parfaitement le concept d'économie circulaire :
              les déchets plastiques collectés sur les plages deviennent la
              matière première pour fabriquer l'outil qui permettra d'en
              collecter davantage. Un cycle vertueux au service de
              l'environnement.
            </p>
          </div>

          <div className="text-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Spécifications techniques
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Dimensions : 90 x 30 x 90 x 150 x 1,5 cm
              <br />
              Matériau : Plastique recyclé des plages
              <br />
              Fabricant : PLASTICEM
            </p>
          </div>
        </div>
      }
    />
  );
}
