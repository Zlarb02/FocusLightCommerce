import ProjectLayoutUnified from "@/components/ProjectLayoutUnified";

export default function Retours() {
  return (
    <ProjectLayoutUnified title="Retours" currentProject="Retours">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          Retours et échanges
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Droit de rétractation
            </h2>
            <p>
              Conformément à la réglementation en vigueur, vous disposez de{" "}
              <strong>14 jours</strong>à compter de la réception de votre
              commande pour exercer votre droit de rétractation.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mt-4">
              <h3 className="text-lg font-medium mb-3">
                ⏰ Délai de rétractation
              </h3>
              <ul className="list-disc pl-6">
                <li>14 jours calendaires à partir de la réception</li>
                <li>Le cachet de la poste fait foi pour le retour</li>
                <li>
                  Aucune pénalité ni frais supplémentaire (hors frais de retour)
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Conditions de retour
            </h2>
            <p>
              Pour être accepté, votre retour doit respecter les conditions
              suivantes :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>✅ Produit dans son emballage d'origine</li>
              <li>✅ Produit en parfait état, non utilisé</li>
              <li>✅ Tous les accessoires et documents inclus</li>
              <li>✅ Étiquettes et protections non retirées</li>
              <li>✅ Facture d'achat jointe</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
              <h4 className="font-medium text-red-800 mb-2">❌ Exclusions</h4>
              <p className="text-red-700 text-sm">
                Les produits personnalisés ou fabriqués sur mesure ne peuvent
                pas être retournés, sauf en cas de défaut de fabrication.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Comment effectuer un retour
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium">
                    Contactez notre service client
                  </h3>
                  <p className="text-gray-600">
                    Envoyez un email à altolille@gmail.com avec votre numéro de
                    commande et le motif du retour.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium">
                    Recevez votre étiquette de retour
                  </h3>
                  <p className="text-gray-600">
                    Nous vous enverrons une étiquette de retour prépayée et les
                    instructions détaillées.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Préparez votre colis</h3>
                  <p className="text-gray-600">
                    Emballez soigneusement le produit dans son emballage
                    d'origine avec tous les accessoires.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-medium">Expédiez votre retour</h3>
                  <p className="text-gray-600">
                    Déposez le colis dans un point de retrait du transporteur
                    indiqué.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Frais de retour</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">
                  ✅ Retours gratuits
                </h3>
                <ul className="text-sm text-green-700 list-disc pl-4">
                  <li>Produit défectueux</li>
                  <li>Erreur de notre part</li>
                  <li>Produit non conforme</li>
                  <li>Commande supérieure à 100€</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-800 mb-2">
                  💰 Frais à votre charge
                </h3>
                <ul className="text-sm text-orange-700 list-disc pl-4">
                  <li>Changement d'avis</li>
                  <li>Commande inférieure à 100€</li>
                  <li>Frais : 9,90€ déduits du remboursement</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Échanges</h2>
            <p>
              Vous souhaitez échanger votre produit contre une autre couleur ou
              un autre modèle ?
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Contactez-nous avant de renvoyer le produit</li>
              <li>Vérifiez la disponibilité du produit souhaité</li>
              <li>
                Les frais d'échange sont gratuits si la valeur est identique
              </li>
              <li>Supplément à régler si le nouveau produit est plus cher</li>
              <li>
                Remboursement de la différence si le nouveau produit est moins
                cher
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Traitement des retours
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">
                📋 Délais de traitement
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Réception :</strong> 2-3 jours ouvrés après expédition
                </li>
                <li>
                  <strong>Contrôle qualité :</strong> 1-2 jours ouvrés
                </li>
                <li>
                  <strong>Remboursement :</strong> 3-5 jours ouvrés après
                  validation
                </li>
                <li>
                  <strong>Délai total :</strong> 7-10 jours ouvrés maximum
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Mode de remboursement
            </h2>
            <p>
              Le remboursement s'effectue selon le mode de paiement utilisé lors
              de la commande :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Carte bancaire :</strong> Remboursement automatique sur
                la carte utilisée
              </li>
              <li>
                <strong>Virement bancaire :</strong> Sous 3-5 jours ouvrés
              </li>
              <li>
                <strong>PayPal :</strong> Remboursement sur le compte PayPal
              </li>
            </ul>
            <p className="text-sm text-gray-600">
              Le remboursement inclut le prix du produit et les frais de
              livraison initiaux (si le retour est de notre fait).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Produits défectueux</h2>
            <p>Si vous recevez un produit défectueux ou endommagé :</p>
            <div className="bg-red-50 p-4 rounded-lg">
              <ul className="list-disc pl-6 text-sm">
                <li>Contactez-nous immédiatement avec photos à l'appui</li>
                <li>N'utilisez pas le produit si vous suspectez un défaut</li>
                <li>Nous prenons en charge tous les frais de retour</li>
                <li>Remplacement prioritaire ou remboursement intégral</li>
                <li>Dédommagement possible selon la situation</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Adresse de retour</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-medium">Service Retours - Alto Lille</p>
              <p>95 rue Pierre Ledent</p>
              <p>62170 Montreuil-sur-Mer</p>
              <p>France</p>
              <p className="text-sm text-gray-600 mt-2">
                ⚠️ N'expédiez jamais un retour sans avoir contacté notre service
                client au préalable.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact retours</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p>
                📧 <strong>Email :</strong> altolille@gmail.com
                <br />
                📞 <strong>Téléphone :</strong> +33 782 086 690
                <br />
                🕒 <strong>Horaires :</strong> Lundi au vendredi, 9h-18h
              </p>
              <p className="text-sm mt-2">
                <strong>Objet email :</strong> "Demande de retour - Commande
                n°[votre numéro]"
              </p>
            </div>
          </section>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
            <p className="text-sm">
              <strong>💚 Notre engagement :</strong> Votre satisfaction est
              notre priorité. Nous mettons tout en œuvre pour traiter vos
              retours dans les meilleurs délais et vous offrir une expérience
              client exceptionnelle.
            </p>
          </div>
        </div>
      </div>
    </ProjectLayoutUnified>
  );
}
