import ProjectLayoutUnified from "@/components/ProjectLayoutUnified";

export default function PolitiqueConfidentialite() {
  return (
    <ProjectLayoutUnified
      title="Politique de confidentialité"
      currentProject="PolitiqueConfidentialite"
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          Politique de confidentialité
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              Alto Lille s'engage à protéger votre vie privée. Cette politique
              de confidentialité explique comment nous collectons, utilisons et
              protégeons vos informations personnelles lorsque vous utilisez
              notre site web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Données collectées</h2>
            <h3 className="text-xl font-medium mb-3">
              Données que vous nous fournissez
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Adresse postale de livraison</li>
              <li>
                Numéro de téléphone (optionnel, pour le suivi de livraison)
              </li>
              <li>
                Informations de paiement (traitées de manière sécurisée par
                Stripe, jamais stockées sur nos serveurs)
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3">
              Données collectées automatiquement
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Adresse IP</li>
              <li>Type de navigateur et version</li>
              <li>Pages visitées et temps passé sur le site</li>
              <li>Données de géolocalisation approximative (pays/région)</li>
            </ul>

            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <h4 className="font-medium text-green-800 mb-2">
                🔒 Principe de minimisation
              </h4>
              <p className="text-green-700 text-sm">
                Nous ne collectons que les données strictement nécessaires à la
                réalisation de votre commande. Aucun compte utilisateur n'est
                créé, ce qui limite considérablement les données personnelles
                traitées.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Utilisation des données
            </h2>
            <p>Nous utilisons vos données personnelles pour :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Traiter vos commandes et assurer la livraison</li>
              <li>
                Vous contacter concernant vos commandes (suivi, livraison)
              </li>
              <li>Fournir un service client et support technique</li>
              <li>Améliorer notre site web et nos services</li>
              <li>Respecter nos obligations légales</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Note :</strong> Nous ne créons pas de comptes clients. Vos
              données sont uniquement utilisées pour le traitement de votre
              commande et supprimées conformément à la réglementation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Partage des données</h2>
            <p>
              Nous ne vendons, n'échangeons ni ne louons vos informations
              personnelles à des tiers. Nous pouvons partager vos données avec :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Nos prestataires de services (Stripe pour le paiement, Mondial
                Relay pour la livraison, hébergement)
              </li>
              <li>Les autorités légales si requis par la loi</li>
            </ul>
            <p className="text-sm text-gray-600">
              <strong>Hébergement sécurisé :</strong> Les données sensibles sont
              stockées sur nos serveurs VPS OVH situés en France, garantissant
              la conformité RGPD et la protection de vos données.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de
              navigation. Les cookies sont de petits fichiers stockés sur votre
              appareil qui nous aident à :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Mémoriser vos préférences</li>
              <li>Analyser l'utilisation du site</li>
              <li>Personnaliser le contenu</li>
            </ul>
            <p>
              Vous pouvez désactiver les cookies dans les paramètres de votre
              navigateur, mais cela peut affecter le fonctionnement du site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Sécurité des données
            </h2>
            <p>
              Nous mettons en place des mesures de sécurité appropriées pour
              protéger vos données personnelles contre l'accès non autorisé, la
              modification, la divulgation ou la destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Vos droits</h2>
            <p>Conformément au RGPD, vous avez le droit de :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données inexactes</li>
              <li>Supprimer vos données (droit à l'oubli)</li>
              <li>Limiter le traitement de vos données</li>
              <li>Vous opposer au traitement</li>
              <li>Recevoir vos données dans un format portable</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : altolille@gmail.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Conservation des données
            </h2>
            <p>
              Nous conservons vos données personnelles uniquement pendant la
              durée nécessaire au traitement de votre commande et au suivi
              post-vente (garantie), soit maximum 2 ans après livraison, ou
              selon les exigences légales (comptabilité : 10 ans).
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Sans création de compte client, vos données ne sont pas conservées
              à des fins commerciales au-delà du traitement de votre commande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Les modifications seront publiées
              sur cette page avec la date de mise à jour.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité,
              contactez-nous :
            </p>
            <p>
              <strong>Email :</strong> altolille@gmail.com
              <br />
              <strong>Adresse :</strong> 95 rue Pierre Ledent, 62170
              Montreuil-sur-Mer, France
              <br />
              <strong>Téléphone :</strong> +33 782 086 690
            </p>
          </section>

          <p className="text-sm text-gray-600 mt-8">
            Dernière mise à jour : 1er juin 2025
          </p>
        </div>
      </div>
    </ProjectLayoutUnified>
  );
}
