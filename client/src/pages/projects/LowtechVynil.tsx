import ProjectPageUnified from "@/components/ProjectPageUnified";

export default function LowtechVynil() {
  return (
    <ProjectPageUnified
      title="Without speaker"
      subtitle="Lecteur vinyle Low tech"
      imagePath="/images/lowtech-vynil.jpg"
      date="2022"
      currentProject="LowtechVynil"
      description={
        <>
          <p>
            Without speaker est un lecteur vinyle et une enceinte qui permettent
            d'utiliser le moins d'énergie possible. Le son est créé grâce à la
            vibration du diamant sur le vinyle, cette vibration s'accentue dans
            la caisse de résonance pour créer le son.
          </p>
          <p>
            Ce projet explore les principes de la low-tech appliqués à l'audio,
            privilégiant la simplicité mécanique à la complexité électronique.
            Une approche minimaliste qui révèle la beauté pure du son
            analogique.
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-10">
          <div className="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-100 p-8 rounded-xl">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Fonctionnement
            </h3>
            <p className="mb-4">
              Le principe est d'une simplicité remarquable : la lecture du
              vinyle génère des vibrations mécaniques qui sont amplifiées
              naturellement par la caisse de résonance, sans aucun composant
              électronique.
            </p>
            <p>
              Cette approche low-tech redonne ses lettres de noblesse à l'écoute
              contemplative, loin de la surstimulation sonore de notre époque.
              Un retour aux sources de l'expérience musicale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3
                className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Philosophie low-tech
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Without speaker s'inscrit dans une démarche de sobriété
                technologique. Face à la complexification constante de nos
                objets du quotidien, ce projet propose un retour à l'essentiel.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                La beauté réside dans la simplicité du mécanisme : aucune
                électronique, aucune amplification artificielle, juste la pure
                mécanique au service de la musique.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Scénario d'usage
              </h4>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>1. Mise en place du vinyle</li>
                <li>2. Activation via bouton on/off</li>
                <li>3. Écoute amplifiée naturellement</li>
              </ol>
            </div>
          </div>

          <div className="text-center bg-blue-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Without speaker - 2022
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Lecteur vinyle low-tech | Amplification naturelle
            </p>
          </div>
        </div>
      }
    />
  );
}
