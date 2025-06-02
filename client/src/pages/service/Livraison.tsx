import ProjectLayoutUnified from "@/components/ProjectLayoutUnified";

export default function Livraison() {
  return (
    <ProjectLayoutUnified title="Livraison" currentProject="Livraison">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          Livraison
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Zones de livraison</h2>
            <p>Nous livrons actuellement dans les zones suivantes :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>France métropolitaine</strong> - Livraison standard
              </li>
              <li>
                <strong>Corse</strong> - Délais étendus
              </li>
              <li>
                <strong>DOM-TOM</strong> - Sur demande
              </li>
              <li>
                <strong>Union Européenne</strong> - Livraison internationale
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Modes de livraison</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-3">
                🚚 Livraison standard (France métropolitaine)
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Délai :</strong> 3 à 5 jours ouvrés
                </li>
                <li>
                  <strong>Prix :</strong> 9,90€
                </li>
                <li>
                  <strong>Gratuite</strong> à partir de 100€ d'achat
                </li>
                <li>
                  <strong>Transporteur :</strong> Mondial Relay
                </li>
                <li>
                  <strong>Numéro de suivi</strong> fourni pour chaque colis
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-3">
                ⚡ Livraison express (France métropolitaine)
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Délai :</strong> 24 à 48h
                </li>
                <li>
                  <strong>Prix :</strong> 19,90€
                </li>
                <li>
                  <strong>Transporteur :</strong> Mondial Relay Express
                </li>
                <li>
                  <strong>Suivi en temps réel</strong> avec numéro de colis
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-3">
                🌍 Livraison internationale (UE)
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Délai :</strong> 5 à 10 jours ouvrés
                </li>
                <li>
                  <strong>Prix :</strong> À partir de 19,90€
                </li>
                <li>
                  <strong>Transporteur :</strong> Mondial Relay International
                </li>
                <li>
                  <strong>Numéro de suivi</strong> fourni
                </li>
                <li>
                  <strong>Droits de douane :</strong> À la charge du
                  destinataire
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Préparation et expédition
            </h2>
            <p>
              <strong>Délai de préparation :</strong> 1 à 2 jours ouvrés
            </p>
            <p>
              Nos produits étant fabriqués à la main dans notre atelier lillois,
              certains articles peuvent nécessiter un délai de fabrication
              supplémentaire. Ce délai vous sera communiqué lors de la
              validation de votre commande.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Commandes passées avant 14h : expédiées le jour même (si en
                stock)
              </li>
              <li>
                Commandes du vendredi après 14h : expédiées le lundi suivant
              </li>
              <li>Pas d'expédition les weekends et jours fériés</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Suivi de commande</h2>
            <p>Dès l'expédition de votre commande, vous recevrez :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Un email de confirmation d'expédition</li>
              <li>Un numéro de suivi pour tracker votre colis</li>
              <li>Des notifications SMS (optionnel)</li>
            </ul>
            <p>
              Vous pouvez suivre votre commande en temps réel sur le site du
              transporteur ou directement depuis votre espace client avec le
              numéro de suivi Mondial Relay fourni.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Réception de votre commande
            </h2>
            <h3 className="text-xl font-medium mb-3">
              📦 Livraison à domicile
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Remise en main propre ou dans votre boîte aux lettres (selon la
                taille)
              </li>
              <li>Possibilité de livraison en point relais si absent</li>
              <li>Vérifiez l'état du colis avant signature</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">
              🏪 Livraison en point relais
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Retrait sous 14 jours</li>
              <li>Pensez à vous munir d'une pièce d'identité</li>
              <li>Avis de passage SMS</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Emballage éco-responsable
            </h2>
            <p>Chez Alto Lille, nous nous engageons pour l'environnement :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>📦 Emballages en carton recyclé et recyclable</li>
              <li>🌱 Matériaux de protection biodégradables</li>
              <li>♻️ Réduction des emballages au strict nécessaire</li>
              <li>🏷️ Étiquettes sans plastique</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Problèmes de livraison
            </h2>
            <p>En cas de problème avec votre livraison :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Colis endommagé :</strong> Refusez la livraison et
                contactez-nous immédiatement
              </li>
              <li>
                <strong>Colis perdu :</strong> Nous lançons une enquête avec le
                transporteur
              </li>
              <li>
                <strong>Adresse incorrecte :</strong> Frais de réexpédition à
                votre charge
              </li>
              <li>
                <strong>Absence lors de la livraison :</strong> Retrait en point
                relais ou nouvelle livraison
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact livraison</h2>
            <p>Pour toute question concernant votre livraison :</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>
                📧 <strong>Email :</strong> altolille@gmail.com
                <br />
                📞 <strong>Téléphone :</strong> +33 782 086 690
                <br />
                🕒 <strong>Horaires :</strong> Lundi au vendredi, 9h-18h
              </p>
            </div>
          </section>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
            <p className="text-sm">
              <strong>💡 Bon à savoir :</strong> Nos délais de livraison sont
              donnés à titre indicatif. En période de forte affluence (fêtes,
              promotions), ces délais peuvent être légèrement allongés. Nous
              vous tiendrons informé de tout retard éventuel.
            </p>
          </div>
        </div>
      </div>
    </ProjectLayoutUnified>
  );
}
