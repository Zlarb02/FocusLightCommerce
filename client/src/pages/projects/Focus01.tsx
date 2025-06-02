import ProjectPageUnified from "@/components/ProjectPageUnified";

export default function Focus01() {
  return (
    <ProjectPageUnified
      title="Focus.01"
      subtitle="Lampe de bureau"
      imagePath="/images/focus-01.jpg"
      date="2024/2025"
      currentProject="Focus01"
      description={
        <>
          <p>
            J'ai conçu ce projet pour lancer ma marque : Alto. C'est mon premier
            produit réalisé en totale autonomie grâce à l'impression 3D. Je me
            charge également du packaging et de la communication, créant ainsi
            une approche globale du design de produit.
          </p>
          <p>
            La Focus.01 représente le premier produit de mon entreprise Alto
            Lille. Je distribue mes créations dans des dépôts-ventes spécialisés
            en décoration d'intérieur ainsi que sur notre site internet en cours
            de développement.
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
                Concept et recherches
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                J'ai souhaité créer une lampe au design épuré avec une
                utilisation intuitive. Toutes les pièces s'emboîtent
                parfaitement grâce à un système d'assemblage sans outils.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Les couleurs contrastées permettent de maintenir l'intérêt
                visuel même lorsque la lampe est éteinte, faisant d'elle un
                véritable objet de décoration.
              </p>
            </div>
            <div>
              <h3
                className="text-xl font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Caractéristiques
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                La Focus.01 est livrée en kit pour optimiser l'emballage et
                réduire l'impact environnemental. Une notice illustrée
                accompagne le produit pour un montage rapide et accessible.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                L'assemblage ne nécessite ni colle ni vis, rendant le montage
                possible même pour un enfant, dans un esprit de simplicité et de
                durabilité.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Public cible et positionnement
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              La Focus.01 est proposée à 60€ frais de port inclus, positionnée
              comme une solution d'éclairage design accessible et
              éco-responsable.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Elle s'adresse à toute personne souhaitant offrir un cadeau
              original ou renouveler sa décoration d'intérieur sans
              investissement majeur. La lampe apporte une touche de modernité
              abordable à n'importe quel espace de vie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3
                className="text-lg font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Spécifications techniques
              </h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                <li>• Matières : PLA, chêne massif, LED</li>
                <li>• Douille E14, câble textile</li>
                <li>• Interrupteur intégré</li>
                <li>• Designer : Anatole Collet / 2024</li>
                <li>• 4 coloris disponibles</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3
                className="text-lg font-semibold mb-3 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Développement futur
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Pour mon second produit, j'ai développé une liseuse qui
                s'inscrit dans la continuité esthétique de la Focus.01. J'ai
                conservé le même abat-jour pour créer une cohérence visuelle et
                optimiser la production. D'autres créations sont actuellement en
                cours de développement pour enrichir la gamme Alto.
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2 dark:text-gray-100"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Alto lille - Focus.01
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Premier produit de la marque Alto | Disponible à 60€ frais de port
              inclus
            </p>
          </div>
        </div>
      }
    />
  );
}
