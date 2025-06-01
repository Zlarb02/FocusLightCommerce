import ProjectPageUnified from "@/components/ProjectPageUnified";

export default function Waterfall() {
  return (
    <ProjectPageUnified
      title="Waterfall"
      subtitle="Applique murale"
      imagePath="/images/waterfall.jpg"
      date="2023"
      currentProject="Waterfall"
      description={
        <>
          <p>
            Projet de lampe conçu pour exposer à la Design Week de Reykjavik.
            J'ai mixé la cascade pour évoquer le paysage islandais ainsi que des
            assemblages simples pour la transporter facilement.
          </p>
          <p>
            Cette applique murale capture l'essence de la nature islandaise à
            travers un jeu de textures et de matériaux qui évoquent la fluidité
            de l'eau et la rugosité des paysages nordiques.
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-12">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Matériaux et expérimentations
            </h3>
            <p className="text-gray-700 mb-4">
              J'ai utilisé de la laine que j'ai teinte plusieurs fois pour
              obtenir un dégradé de bleu. J'ai ensuite monté un métier à tisser
              sur l'armature pour tisser la laine. Pour la base j'ai utilisé du
              feutre bleu et blanc.
            </p>
            <p className="text-gray-700">
              Cette technique artisanale permet de créer des effets de
              profondeur et de mouvement qui évoquent naturellement les cascades
              islandaises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Conception modulaire
              </h3>
              <p className="text-gray-700">
                L'applique a été conçue avec des assemblages simples pour
                faciliter le transport international vers l'Islande. Cette
                contrainte pratique a donné naissance à un design modulaire
                élégant et fonctionnel.
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Déclinaison
              </h3>
              <p className="text-gray-700">
                J'ai dérivé la technique de feutrer la laine cardée pour
                réaliser un lampadaire à la demande d'une cliente pour pouvoir
                lire le soir. J'ai donc fait un pied en béton pour que le tout
                soit stable grâce au poids.
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Spécifications techniques
            </h3>
            <p className="text-gray-600 text-sm">
              Dimensions : 50 x 25 x 15 x 45 x 8 x 35 x 20 x 2.2 x 3.5 cm
              <br />
              Designer : Collet Anatole
              <br />
              Date : 21/12/2023
              <br />
              Exposition : Design Week Reykjavik
            </p>
          </div>
        </div>
      }
    />
  );
}
