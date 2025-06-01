import PolaroidPage from "./PolaroidPage";

export default function Focus01() {
  return (
    <PolaroidPage
      title="Focus.01"
      subtitle="Lampe de bureau"
      imagePath="/images/focus-01.jpg"
      date="2024/2025"
      description={
        <>
          <p>
            J'ai réalisé ce projet pour lancer ma marque : Alto. C'est mon 1er
            projet réalisé en totale indépendance grâce à une imprimante 3D. Je
            réalise aussi le packaging ainsi que la communication.
          </p>
          <p>
            Ceci est le premier produit de mon entreprise : Alto lille. Je
            distribue mes produits dans des dépôts ventes de décorations
            d'intérieur ainsi que sur un site internet. (En cours de
            développement)
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
                Recherches
              </h3>
              <p className="text-gray-700 mb-4">
                J'ai voulu créer une lampe au style épuré avec une utilisation
                simple. Toutes les pièces s'emboîtent et sont faciles à monter.
              </p>
              <p className="text-gray-700">
                Les couleurs très contrastées permettent de garder un objet qui
                concentre l'intérêt quand elle est off.
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Caractéristiques
              </h3>
              <p className="text-gray-700 mb-4">
                La Focus.01 est envoyée en kit pour un emballage réduit. Une
                notice est fournie pour un montage rapide et simple.
              </p>
              <p className="text-gray-700">
                Il n'y a ni colle ni vis pour la monter donc même un enfant peut
                la monter.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Cibles
            </h3>
            <p className="text-gray-700 mb-4">
              Focus.01 est une petite lampe. Je la propose à 60€ avec l'envoi.
            </p>
            <p className="text-gray-700">
              C'est destiné à toute personne voulant faire un cadeau ou à ceux
              qui veulent changer leurs décorations d'intérieur sans tout
              remanier. La lampe apporte une petite touche de renouveau
              abordable.
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
                <li>• Matières : PLA, chêne massif, LED</li>
                <li>• Douille E14, câble textile</li>
                <li>• Interrupteur intégré</li>
                <li>• Designer : Anatole Collet / 2024</li>
                <li>• 4 coloris disponibles</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Développement futur
              </h3>
              <p className="text-gray-700 text-sm">
                Pour mon 2ème produit j'ai développé une liseuse qui est
                cohérente avec le premier produit. J'ai donc gardé le même
                abat-jour, cela permet aussi de faciliter la production.
                D'autres produits sont en cours de développement.
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Alto lille - Focus.01
            </h3>
            <p className="text-gray-600 text-sm">
              Premier produit de la marque Alto | Disponible à 60€ avec envoi
            </p>
          </div>
        </div>
      }
    />
  );
}
