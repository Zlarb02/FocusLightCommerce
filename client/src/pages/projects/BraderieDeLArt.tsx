import ProjectPageUnified from "@/components/ProjectPageUnified";

export default function BraderieDeLArt() {
  return (
    <ProjectPageUnified
      title="Braderie de l'Art"
      subtitle="Week-end de création collective"
      imagePath="/images/braderie-de-l-art.png"
      date="Novembre 2023"
      currentProject="BraderieDeLArt"
      description={
        <>
          <p>
            La Braderie de l'Art de Roubaix est un événement unique qui
            transforme l'art en expérience collective. Durant ce week-end de
            création, les artistes doivent créer à partir de la matériauthèque
            mise à disposition, donnant naissance à des œuvres inattendues et
            spontanées.
          </p>
          <p>
            Pour cette édition 2023, j'ai conçu un meuble pour chaîne hi-fi
            construit autour du mouvement dynamique qu'offre un pied de chaise
            détourné. Cette création illustre parfaitement l'esprit de
            l'événement : transformer l'ordinaire en extraordinaire par un
            regard créatif renouvelé.
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Le défi créatif
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              L'essence de la Braderie de l'Art réside dans sa contrainte
              temporelle et matérielle. En quelques heures seulement, les
              participants doivent concevoir et réaliser une œuvre à partir des
              matériaux disponibles sur place. Cette approche force l'innovation
              et pousse à repenser l'usage habituel des objets.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Mon meuble hi-fi transforme un simple pied de chaise en élément
              fonctionnel et esthétique, créant un mouvement visuel qui dialogue
              harmonieusement avec la musique qu'il supporte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Processus de création
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Exploration de la matériauthèque</li>
                <li>• Identification du potentiel du pied de chaise</li>
                <li>• Conception autour du mouvement</li>
                <li>• Assemblage et finalisation</li>
              </ul>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Philosophie du projet
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Ce projet illustre ma démarche de réinterprétation des objets du
                quotidien. Le mouvement devient ici métaphore de la musique,
                créant un dialogue entre forme et fonction.
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Braderie de l'Art - Roubaix
            </h3>
            <p className="text-gray-600 text-sm">
              Événement extra-scolaire | Novembre 2023
            </p>
          </div>
        </div>
      }
    />
  );
}
