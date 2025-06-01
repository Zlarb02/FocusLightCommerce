import PolaroidPage from "./PolaroidPage";

export default function SeaCle() {
  return (
    <PolaroidPage
      title="Sea-clé"
      subtitle="Ramasseur de déchets plastiques"
      imagePath="/images/sea-cle.jpg"
      date="2024"
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
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Contexte d'usage
              </h3>
              <p className="text-gray-700 mb-4">
                La charrette suit les ramasseurs sur toute la plage. Les déchets
                sont ramassés et entassés dans des sacs poubelles puis récoltés
                dans une charrette.
              </p>
              <p className="text-gray-700">
                L'objet remplace les outils traditionnels de ramassage de
                l'association, permettant aux bénévoles de ne plus se baisser
                constamment et de s'économiser physiquement.
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Innovation technique
              </h3>
              <p className="text-gray-700 mb-4">
                Après de nombreux tests avec un prototype au 1/5ème, j'ai
                développé un filtre simple mais efficace couvrant une large
                surface.
              </p>
              <p className="text-gray-700">
                Tout le processus, du tri des déchets à l'injection plastique,
                est réalisé chez PLASTICEM, garantissant une fabrication locale
                et responsable.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Économie circulaire
            </h3>
            <p className="text-gray-700">
              Sea-clé illustre parfaitement le concept d'économie circulaire :
              les déchets plastiques collectés sur les plages deviennent la
              matière première pour fabriquer l'outil qui permettra d'en
              collecter davantage. Un cycle vertueux au service de
              l'environnement.
            </p>
          </div>

          <div className="text-center bg-gray-100 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Spécifications techniques
            </h3>
            <p className="text-gray-600 text-sm">
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
