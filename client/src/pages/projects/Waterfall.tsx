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
            Projet d'applique murale conçu spécialement pour l'exposition à la
            Design Week de Reykjavik. J'ai puisé l'inspiration dans les cascades
            islandaises pour créer cette pièce unique, en intégrant des
            assemblages modulaires facilitant le transport international.
          </p>
          <p>
            Cette applique murale capture l'essence de la nature islandaise à
            travers un jeu subtil de textures et de matériaux qui évoquent la
            fluidité de l'eau et la force brute des paysages nordiques.
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-12">
          <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Matériaux et expérimentations
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              J'ai utilisé de la laine que j'ai teintée à plusieurs reprises
              pour obtenir un dégradé de bleu nuancé. J'ai ensuite monté un
              métier à tisser directement sur l'armature pour tisser la laine en
              place. La base est réalisée en feutre bleu et blanc pour compléter
              l'ensemble.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Cette approche artisanale permet de créer des effets de profondeur
              et de mouvement qui évoquent naturellement le flux des cascades
              islandaises, donnant vie à la matière.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Conception modulaire
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                L'applique a été conçue avec des assemblages simples pour
                faciliter le transport international vers l'Islande. Cette
                contrainte pratique a donné naissance à un design modulaire
                élégant et fonctionnel.
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Déclinaison
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                J'ai adapté la technique du feutre en laine cardée pour réaliser
                un lampadaire sur commande d'une cliente souhaitant un éclairage
                de lecture. J'ai donc conçu un pied en béton pour assurer la
                stabilité de l'ensemble grâce à son poids.
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Détails du projet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
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
