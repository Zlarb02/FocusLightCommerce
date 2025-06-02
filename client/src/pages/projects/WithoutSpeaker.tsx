import ProjectPageUnified from "@/components/ProjectPageUnified";

export default function WithoutSpeaker() {
  return (
    <ProjectPageUnified
      title="Without Speaker"
      subtitle="Création innovante"
      imagePath="/images/lowtech-vynil.jpg"
      date="2024"
      currentProject="WithoutSpeaker"
      description={
        <>
          <p>
            Without Speaker est une exploration audacieuse de l'expérience
            musicale dépouillée de sa dimension sonore. Cette installation
            interroge notre rapport à la musique à travers une approche
            sensorielle alternative, où le vinyle devient protagoniste d'une
            performance silencieuse.
          </p>
          <p>
            Ce projet low-tech questionne les codes de l'écoute musicale
            contemporaine en proposant une expérience contemplative où l'objet
            vinyle, libéré de sa fonction première, révèle sa beauté plastique
            et son potentiel poétique.
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
                Concept et démarche
              </h3>
              <p className="text-gray-700 mb-4">
                L'absence volontaire de haut-parleur crée un espace de
                méditation autour de l'objet musical. Le spectateur est invité à
                imaginer la mélodie, à projeter ses souvenirs sonores sur le
                mouvement hypnotique du disque.
              </p>
              <p className="text-gray-700">
                Cette approche minimaliste révèle l'essence contemplative de
                l'écoute, transformant l'acte d'écouter en acte de regarder et
                de ressentir.
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Technologie détournée
              </h3>
              <p className="text-gray-700 mb-4">
                En détournant la technologie de la platine vinyle, Without
                Speaker questionne notre dépendance aux dispositifs de
                restitution sonore et recentre l'attention sur l'objet physique
                du disque.
              </p>
              <p className="text-gray-700">
                Cette démarche low-tech privilégie la simplicité mécanique et
                l'essentiel, révélant la beauté du geste répétitif et de la
                rotation perpétuelle.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Expérience immersive
            </h3>
            <p className="text-gray-700 mb-4">
              Sans son, l'expérience devient purement visuelle et tactile. Le
              spectateur peut toucher, manipuler, et créer sa propre bande
              sonore mentale. Chaque vinyle devient une partition visuelle
              unique.
            </p>
            <p className="text-gray-700">
              Cette installation invite à redécouvrir le plaisir de l'écoute
              intérieure, où l'imagination supplée l'absence physique du son
              pour créer une expérience musicale personnelle et intime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Spécifications techniques
              </h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Platine vinyle modifiée</li>
                <li>• Système d'entraînement mécanique</li>
                <li>• Support pour vinyles 33 et 45 tours</li>
                <li>• Design épuré sans amplification</li>
                <li>• Matériaux : bois, métal, vinyle</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Réflexion artistique
              </h3>
              <p className="text-gray-700 text-sm">
                Without Speaker s'inscrit dans une démarche de questionnement
                des habitudes de consommation culturelle. En supprimant
                l'élément sonore, l'installation révèle d'autres dimensions de
                l'objet musical et ouvre de nouveaux territoires d'exploration
                sensorielle.
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Without Speaker - Installation
            </h3>
            <p className="text-gray-600 text-sm">
              Création expérimentale | 2024 | Série limitée
            </p>
          </div>
        </div>
      }
    />
  );
}
