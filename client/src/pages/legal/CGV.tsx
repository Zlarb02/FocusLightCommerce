import ProjectLayoutUnified from "@/components/ProjectLayoutUnified";

export default function CGV() {
  return (
    <ProjectLayoutUnified
      title="Conditions Générales de Vente"
      currentProject="CGV"
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          Conditions Générales de Vente
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 1 - Objet</h2>
            <p>
              Les présentes conditions générales de vente s'appliquent, sans
              restriction ni réserve, à toutes les ventes de produits effectuées
              par Alto Lille aux acheteurs non professionnels (« consommateurs
              »), qui acceptent sans réserve ces conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 2 - Produits
            </h2>
            <p>
              Les produits proposés sont ceux qui figurent dans le catalogue
              publié dans le site Internet d'Alto Lille. Ces produits sont
              proposés dans la limite des stocks disponibles.
            </p>
            <p>
              Chaque produit est accompagné d'un descriptif établi par Alto
              Lille. Les photographies illustrant les produits n'entrent pas
              dans le champ contractuel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 3 - Prix</h2>
            <p>
              Les prix sont indiqués en euros, toutes taxes comprises (TTC),
              hors frais de livraison. Alto Lille se réserve le droit de
              modifier ses tarifs à tout moment, étant toutefois entendu que le
              prix figurant au catalogue le jour de la commande sera le seul
              applicable à l'acheteur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 4 - Commandes
            </h2>
            <p>
              Les commandes sont effectuées sur le site Internet d'Alto Lille.
              L'acheteur sélectionne les produits qu'il désire commander, puis
              valide sa commande après avoir vérifié le contenu de son panier.
            </p>
            <p>
              La confirmation de commande entraîne acceptation des présentes
              conditions de vente, la reconnaissance d'en avoir parfaite
              connaissance et la renonciation à se prévaloir de ses propres
              conditions d'achat.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 5 - Validation de commande
            </h2>
            <p>
              Toute commande passée sur le site Internet d'Alto Lille constitue
              la formation d'un contrat entre l'acheteur et Alto Lille. Alto
              Lille se réserve le droit d'annuler ou de refuser toute commande
              d'un acheteur avec lequel il existerait un litige.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 6 - Paiement
            </h2>
            <p>
              Le paiement s'effectue par carte bancaire via Stripe, notre
              prestataire de paiement sécurisé.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Cartes acceptées : Visa, Mastercard, American Express</li>
              <li>Paiement sécurisé SSL via Stripe</li>
              <li>Aucune donnée bancaire stockée sur nos serveurs</li>
            </ul>
            <p>
              Le paiement est dû en totalité à la commande. Le débit s'effectue
              immédiatement lors de la validation de la commande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 7 - Livraison
            </h2>
            <p>
              Les produits sont livrés via Mondial Relay à l'adresse indiquée
              par l'acheteur lors de sa commande. Un numéro de suivi est
              systématiquement fourni. Les délais de livraison sont communiqués
              à titre indicatif lors de la validation de la commande.
            </p>
            <p>
              Alto Lille s'engage à expédier les produits commandés dans un
              délai maximum de 2 jours ouvrés et à livrer dans un délai maximum
              de 10 jours ouvrés à compter de la validation de la commande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 8 - Transfert de propriété et des risques
            </h2>
            <p>
              Le transfert de propriété des produits au profit de l'acheteur ne
              sera réalisé qu'après complet paiement du prix. Le transfert des
              risques de perte et de détérioration s'effectue dès livraison et
              prise de possession physique des produits par l'acheteur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 9 - Droit de rétractation
            </h2>
            <p>
              Conformément à l'article L121-21 du Code de la consommation,
              l'acheteur dispose d'un délai de quatorze jours ouvrables à
              compter de la réception de sa commande pour exercer son droit de
              rétractation et ainsi retourner le produit au vendeur pour échange
              ou remboursement sans pénalité, à l'exception des frais de retour.
            </p>
            <p>
              Pour exercer ce droit, l'acheteur doit retourner le produit dans
              son emballage d'origine, en parfait état, accompagné de tous les
              accessoires livrés et de la facture d'achat.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 10 - Garantie
            </h2>
            <p>
              Tous les produits vendus par Alto Lille bénéficient de la garantie
              légale de conformité et de la garantie contre les vices cachés,
              dans les conditions et délais prévus par la loi.
            </p>
            <p>
              Alto Lille accorde en outre une garantie commerciale de 2 ans sur
              tous ses produits, couvrant les défauts de fabrication dans des
              conditions normales d'utilisation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 11 - Responsabilité
            </h2>
            <p>
              Alto Lille ne saurait être tenu responsable de l'inexécution du
              contrat conclu en cas de rupture de stock ou d'indisponibilité du
              produit, cas fortuit ou de force majeure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 12 - Propriété intellectuelle
            </h2>
            <p>
              Tous les éléments du site d'Alto Lille sont et restent la
              propriété intellectuelle et exclusive d'Alto Lille. Personne n'est
              autorisé à reproduire, exploiter, rediffuser, ou utiliser à
              quelque titre que ce soit, même partiellement, des éléments du
              site qu'ils soient logiciels, visuels ou sonores.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 13 - Données personnelles
            </h2>
            <p>
              Alto Lille s'engage à préserver la confidentialité des
              informations fournies par l'acheteur. Toute information le
              concernant est soumise aux dispositions de la loi n° 78-17 du 6
              janvier 1978. A ce titre, l'internaute dispose d'un droit d'accès,
              de modification et de suppression des informations le concernant.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 14 - Droit applicable
            </h2>
            <p>
              Toutes les ventes réalisées par Alto Lille sont soumises au droit
              français. En cas de litige, les tribunaux français seront seuls
              compétents.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Article 15 - Contact
            </h2>
            <p>
              Pour toute information ou réclamation, l'acheteur peut s'adresser
              à :
            </p>
            <p>
              <strong>Alto Lille</strong>
              <br />
              95 rue Pierre Ledent
              <br />
              62170 Montreuil-sur-Mer
              <br />
              France
              <br />
              <strong>Email :</strong> altolille@gmail.com
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
