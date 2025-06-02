import ProjectPageUnified from "@/components/ProjectPageUnified";

export default function ChaussuresCustom() {
  return (
    <ProjectPageUnified
      title="Chaussures Custom"
      subtitle="Créer des chaussures uniques à partir d'une chaussure basique"
      imagePath="/images/chaussures-custom.jpg"
      date="Depuis 2020"
      currentProject="ChaussuresCustom"
      description={
        <>
          <p>
            Le projet "Chaussures Custom" est un projet extra-scolaire qui
            consiste à créer des chaussures uniques à partir d'une chaussure
            basique à la demande des clients. J'effectue un travail de peinture
            et de rajout ou suppression d'empiècements.
          </p>
          <p>
            Chaque paire devient ainsi une pièce unique, véritables œuvres d'art
            ambulantes qui permettent à chacun d'exprimer sa personnalité à
            travers ses pas. Plus qu'un simple accessoire, ces chaussures
            deviennent un moyen d'expression personnelle et un support
            artistique innovant.
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-3 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <img
                  src={`/images/custom-shoe-${i}.jpg`}
                  alt={`Chaussure customisée ${i}`}
                  className="w-full h-auto object-cover aspect-square rounded"
                />
                <div className="mt-3 p-2">
                  <h4
                    className="font-medium text-center text-gray-900 dark:text-gray-100"
                    style={{ fontFamily: "var(--font-titles)" }}
                  >
                    Modèle{" "}
                    {i === 1
                      ? "Urban Flow"
                      : i === 2
                      ? "Nature Spirit"
                      : "Abstract Vision"}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3
              className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Technique de customisation
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ma technique consiste en un travail minutieux de peinture et de
              modification des empiècements. Chaque chaussure de base est
              transformée selon les désirs du client, créant une pièce
              totalement personnalisée qui reflète sa personnalité.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    1
                  </span>
                </div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Consultation
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Échange sur les préférences et le style souhaité
                </p>
              </div>
              <div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    2
                  </span>
                </div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Design
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Création du motif personnalisé et choix des empiècements
                </p>
              </div>
              <div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    3
                  </span>
                </div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Transformation
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Peinture et modification des empiècements
                </p>
              </div>
              <div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    4
                  </span>
                </div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Finition
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Traitement protecteur pour une durabilité optimale
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black dark:bg-gray-900 text-white dark:text-gray-100 p-8 rounded-lg text-center border border-gray-800 dark:border-gray-600">
            <h3
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Envie d'une paire unique ?
            </h3>
            <p className="mb-6">
              Les commandes personnalisées sont ouvertes depuis 2020. Chaque
              projet est une collaboration unique entre l'artiste et le client
              pour créer LA paire qui vous ressemble.
            </p>
            <div className="inline-block border border-white dark:border-gray-300 px-5 py-3 rounded">
              Contact : custom@focuslight.fr
            </div>
          </div>
        </div>
      }
    />
  );
}
