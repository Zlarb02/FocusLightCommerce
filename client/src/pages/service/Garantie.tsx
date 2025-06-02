import ProjectLayoutUnified from "@/components/ProjectLayoutUnified";

export default function Garantie() {
  return (
    <ProjectLayoutUnified title="Garantie" currentProject="Garantie">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          Garantie et SAV
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Notre engagement qualité
            </h2>
            <p>
              Chez Alto Lille, nous accordons une attention particulière à la
              qualité de nos produits. Chaque lampe est conçue et fabriquée avec
              soin dans notre atelier lillois, en utilisant des matériaux
              durables et des techniques artisanales éprouvées.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mt-4">
              <h3 className="text-lg font-medium mb-3">
                🏆 Garantie commerciale Alto Lille
              </h3>
              <p className="text-lg font-semibold text-blue-800">
                2 ans sur tous nos produits
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Cette garantie couvre les défauts de fabrication et de matériaux
                dans des conditions normales d'utilisation.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Garanties légales</h2>
            <p>
              En plus de notre garantie commerciale, vous bénéficiez de toutes
              les garanties légales :
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-medium mb-2">📋 Garantie de conformité</h3>
                <ul className="text-sm list-disc pl-4 space-y-1">
                  <li>Durée : 2 ans à partir de la livraison</li>
                  <li>Couvre les défauts présents à la livraison</li>
                  <li>Présomption de défaut pendant 6 mois</li>
                  <li>Réparation, remplacement ou remboursement</li>
                </ul>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-medium mb-2">
                  🔍 Garantie des vices cachés
                </h3>
                <ul className="text-sm list-disc pl-4 space-y-1">
                  <li>Durée : 2 ans à partir de la découverte</li>
                  <li>Couvre les défauts non apparents</li>
                  <li>Défauts rendant le produit impropre à l'usage</li>
                  <li>Annulation de vente ou réduction de prix</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Que couvre notre garantie
            </h2>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">
                  ✅ Couvert par la garantie
                </h3>
                <ul className="text-sm text-green-700 list-disc pl-4 space-y-1">
                  <li>Défauts de fabrication (impression 3D, assemblage)</li>
                  <li>
                    Problèmes électriques (câblage, interrupteur, douille)
                  </li>
                  <li>
                    Défauts matériaux (bois, PLA, composants électroniques)
                  </li>
                  <li>
                    LED défaillante (durée de vie normale : 25 000h minimum)
                  </li>
                  <li>Problèmes de finition ou d'esthétique</li>
                  <li>Non-conformité aux spécifications annoncées</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">
                  ❌ Non couvert par la garantie
                </h3>
                <ul className="text-sm text-red-700 list-disc pl-4 space-y-1">
                  <li>Dommages dus à une mauvaise utilisation</li>
                  <li>Chutes, chocs ou accidents</li>
                  <li>Exposition à l'humidité excessive</li>
                  <li>Modifications ou réparations non autorisées</li>
                  <li>
                    Usure normale (variation de teinte du bois, micro-rayures)
                  </li>
                  <li>Dommages dus à une surtension électrique</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Comment faire jouer la garantie
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Contactez notre SAV</h3>
                  <p className="text-gray-600 text-sm">
                    Envoyez un email à altolille@gmail.com avec votre numéro de
                    commande, la description du problème et des photos si
                    possible.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Diagnostic à distance</h3>
                  <p className="text-gray-600 text-sm">
                    Notre équipe analyse votre demande et vous propose une
                    solution : conseil d'utilisation, réparation ou
                    remplacement.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Retour ou intervention</h3>
                  <p className="text-gray-600 text-sm">
                    Selon le cas : retour gratuit du produit défectueux ou
                    intervention sur site (région Lille uniquement).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-medium">Réparation ou remplacement</h3>
                  <p className="text-gray-600 text-sm">
                    Réparation dans notre atelier ou envoi d'un produit de
                    remplacement neuf.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Délais de traitement SAV
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    24h
                  </div>
                  <div className="text-sm text-gray-600">
                    Réponse à votre demande
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    7 jours
                  </div>
                  <div className="text-sm text-gray-600">
                    Diagnostic et solution proposée
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    14 jours
                  </div>
                  <div className="text-sm text-gray-600">
                    Réparation ou remplacement
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Types d'intervention
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-medium mb-2">🔧 Réparation</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Remise en état du produit défectueux dans notre atelier
                  lillois.
                </p>
                <ul className="text-sm list-disc pl-4">
                  <li>Diagnostic précis du problème</li>
                  <li>Réparation avec pièces d'origine</li>
                  <li>Tests qualité avant retour</li>
                  <li>Garantie 6 mois sur la réparation</li>
                </ul>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-medium mb-2">🔄 Remplacement</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Échange contre un produit neuf identique si la réparation
                  n'est pas possible.
                </p>
                <ul className="text-sm list-disc pl-4">
                  <li>Produit neuf de remplacement</li>
                  <li>Garantie complète remise à zéro</li>
                  <li>Retour du produit défectueux inclus</li>
                  <li>Expédition prioritaire</li>
                </ul>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-medium mb-2">💰 Remboursement</h3>
                <p className="text-sm text-gray-600 mb-2">
                  En dernier recours, si aucune solution technique n'est
                  possible.
                </p>
                <ul className="text-sm list-disc pl-4">
                  <li>Remboursement intégral du produit</li>
                  <li>Frais de port de retour inclus</li>
                  <li>Délai de remboursement : 14 jours</li>
                  <li>Mode de paiement original</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Extension de garantie
            </h2>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">
                🌟 Garantie Premium (optionnelle)
              </h3>
              <p className="mb-4">
                Prolongez votre tranquillité d'esprit avec notre garantie
                premium :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Durée :</strong> +2 ans supplémentaires (4 ans au
                  total)
                </li>
                <li>
                  <strong>Couverture :</strong> Dommages accidentels inclus
                </li>
                <li>
                  <strong>Service :</strong> Intervention à domicile (région
                  Lille)
                </li>
                <li>
                  <strong>Prix :</strong> 15% du prix d'achat
                </li>
              </ul>
              <p className="text-sm text-yellow-700">
                Cette extension doit être souscrite dans les 30 jours suivant
                l'achat.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Entretien et conseils
            </h2>
            <p>Pour prolonger la durée de vie de votre lampe Alto Lille :</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-medium mb-2">🧹 Entretien courant</h3>
                <ul className="text-sm list-disc pl-4 space-y-1">
                  <li>Dépoussiérage avec un chiffon sec</li>
                  <li>Nettoyage doux du bois avec un produit adapté</li>
                  <li>Vérification périodique des connexions</li>
                  <li>Remplacement de l'ampoule si nécessaire</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">⚠️ Précautions d'usage</h3>
                <ul className="text-sm list-disc pl-4 space-y-1">
                  <li>Éviter l'exposition directe au soleil</li>
                  <li>Ne pas exposer à l'humidité</li>
                  <li>Utiliser uniquement des ampoules E14 max 60W</li>
                  <li>Débrancher avant nettoyage</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact SAV</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p>
                🔧 <strong>Service SAV :</strong> altolille@gmail.com
                <br />
                📞 <strong>Téléphone :</strong> +33 782 086 690
                <br />
                🕒 <strong>Horaires :</strong> Lundi au vendredi, 9h-18h
                <br />
                📍 <strong>Atelier :</strong> 95 rue Pierre Ledent, 62170
                Montreuil-sur-Mer
              </p>
              <p className="text-sm mt-2">
                <strong>Objet email :</strong> "SAV - Garantie - Commande
                n°[votre numéro]"
              </p>
            </div>
          </section>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
            <p className="text-sm">
              <strong>💚 Notre promesse :</strong> Votre satisfaction est notre
              priorité absolue. Si vous n'êtes pas entièrement satisfait de
              votre produit Alto Lille, nous ferons tout notre possible pour
              trouver une solution adaptée.
            </p>
          </div>
        </div>
      </div>
    </ProjectLayoutUnified>
  );
}
