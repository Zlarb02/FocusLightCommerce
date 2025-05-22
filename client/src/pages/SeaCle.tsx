import PolaroidPage from "./PolaroidPage";

export default function SeaCle() {
  return (
    <PolaroidPage
      title="Sea Clé"
      subtitle="Quand la mer rencontre l'artisanat"
      imagePath="/images/sea-cle.jpg"
      date="Été 2024"
      description={
        <>
          <p>
            "Sea Clé" est un projet qui marie les éléments naturels de la mer
            avec l'artisanat traditionnel. Cette œuvre est née d'une promenade
            le long des côtes du Nord-Pas-de-Calais, où l'inspiration s'est
            manifestée dans le mouvement des vagues et la texture du sable.
          </p>
          <p>
            Les couleurs douces et apaisantes évoquent l'horizon marin, tandis
            que la forme organique rappelle les galets polis par l'eau. Chaque
            pièce est unique, façonnée à la main dans un matériau
            éco-responsable qui reflète mon engagement pour un art respectueux
            de l'environnement.
          </p>
        </>
      }
      additionalContent={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Inspiration
            </h3>
            <p className="text-gray-700">
              L'œuvre s'inspire du mouvement perpétuel de la mer, cherchant à
              capturer dans une forme statique la dynamique des vagues. Le bleu
              profond représente les profondeurs marines, tandis que les touches
              plus claires évoquent l'écume des vagues.
            </p>
          </div>
          <div>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Technique
            </h3>
            <p className="text-gray-700">
              Réalisée à partir de matériaux recyclés et naturels, la "Sea Clé"
              utilise un processus de création qui minimise l'impact
              environnemental. Le jeu de textures est obtenu par plusieurs
              couches appliquées successivement, créant un effet de profondeur.
            </p>
          </div>
        </div>
      }
    />
  );
}
