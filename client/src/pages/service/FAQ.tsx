import ProjectLayoutUnified from "@/components/ProjectLayoutUnified";

export default function FAQ() {
  return (
    <ProjectLayoutUnified title="FAQ - Questions fréquentes" currentProject="">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1
            className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            Questions fréquentes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus courantes sur nos
            produits, la livraison et le service client.
          </p>
        </div>

        {/* Questions et réponses */}
        <div className="space-y-8">
          {/* Produits */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-gray-200"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Nos produits
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Quels sont les matériaux utilisés pour vos lampes ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Nos lampes sont fabriquées avec des matériaux durables et
                  écologiques : bois massif français (chêne, hêtre), LED basse
                  consommation, composants électroniques recyclables et
                  finitions naturelles sans solvants nocifs.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Quelle est la consommation électrique de vos lampes ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Nos lampes LED consomment entre 5W et 15W maximum selon le
                  modèle, soit jusqu'à 80% de moins qu'une ampoule
                  traditionnelle. Elles sont également compatibles avec les
                  variateurs d'intensité.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Proposez-vous des personnalisations ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Oui, nous proposons des personnalisations sur certains modèles
                  : choix du bois, dimensions sur mesure, gravure personnalisée.
                  Contactez-nous à altolille@gmail.com pour discuter de votre
                  projet.
                </p>
              </div>
            </div>
          </section>

          {/* Commande et livraison */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-gray-200"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Commande et livraison
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Quels sont les délais de livraison ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  • France métropolitaine : 3-5 jours ouvrés
                  <br />
                  • Corse et DOM-TOM : 7-10 jours ouvrés
                  <br />
                  • Europe : 5-8 jours ouvrés
                  <br />• Produits sur mesure : 2-3 semaines selon la complexité
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Comment suivre ma commande ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Dès l'expédition, vous recevrez un email avec le numéro de
                  suivi. Vous pourrez suivre votre colis en temps réel sur le
                  site du transporteur. Un SMS vous préviendra également la
                  veille de la livraison.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Puis-je modifier ou annuler ma commande ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Les commandes peuvent être modifiées ou annulées dans les 2h
                  suivant la validation, en nous contactant directement. Passé
                  ce délai, la commande entre en préparation et ne peut plus
                  être modifiée.
                </p>
              </div>
            </div>
          </section>

          {/* Retours et garantie */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-gray-200"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Retours et garantie
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Comment procéder à un retour ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Vous disposez de 14 jours pour nous retourner un produit.
                  Contactez-nous pour obtenir une étiquette de retour gratuite.
                  Le produit doit être dans son emballage d'origine et en
                  parfait état.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Que couvre la garantie ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Garantie de 2 ans sur tous nos produits couvrant les défauts
                  de fabrication, les composants électroniques et les finitions.
                  Les dommages dus à une utilisation non conforme ne sont pas
                  couverts.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Comment faire jouer la garantie ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Contactez notre service client avec votre numéro de commande
                  et une description du problème. Nous vous proposons une
                  réparation, un échange ou un remboursement selon la nature du
                  défaut.
                </p>
              </div>
            </div>
          </section>

          {/* Paiement et sécurité */}
          <section>
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-6 pb-2 border-b border-gray-200"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Paiement et sécurité
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Quels moyens de paiement acceptez-vous ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Nous acceptons les cartes bancaires (Visa, Mastercard,
                  American Express) via Stripe. Tous les paiements sont
                  sécurisés et nous ne stockons aucune donnée bancaire.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-3">
                  Mes données bancaires sont-elles sécurisées ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Oui, toutes les transactions sont sécurisées par SSL via
                  Stripe. Nous ne stockons aucune donnée bancaire sur nos
                  serveurs. Stripe est certifié PCI-DSS niveau 1.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-[var(--color-bg-light)] p-8 rounded-lg">
            <h2
              className="text-2xl font-semibold text-[var(--color-text)] mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Vous ne trouvez pas votre réponse ?
            </h2>
            <p className="text-gray-600 mb-6">
              Notre équipe est là pour vous aider. N'hésitez pas à nous
              contacter, nous vous répondrons dans les plus brefs délais.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-[var(--color-text)] mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-[var(--color-text)]">Email</p>
                  <a
                    href="mailto:altolille@gmail.com"
                    className="text-gray-600 hover:text-[var(--color-text)] transition"
                  >
                    altolille@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-[var(--color-text)] mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-[var(--color-text)]">
                    Téléphone
                  </p>
                  <p className="text-gray-600">+33 782 086 690</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProjectLayoutUnified>
  );
}
