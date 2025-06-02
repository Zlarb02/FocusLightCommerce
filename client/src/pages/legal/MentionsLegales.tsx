import ProjectLayoutUnified from "@/components/ProjectLayoutUnified";

export default function MentionsLegales() {
  return (
    <ProjectLayoutUnified
      title="Mentions légales"
      currentProject="MentionsLegales"
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          Mentions légales
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Éditeur du site</h2>
            <p>
              <strong>Alto Lille</strong>
              <br />
              95 rue Pierre Ledent
              <br />
              62170 Montreuil-sur-Mer
              <br />
              France
            </p>
            <p>
              <strong>Email :</strong> altolille@gmail.com
              <br />
              <strong>Téléphone :</strong> +33 782 086 690
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Directeur de publication
            </h2>
            <p>Alto Lille</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Hébergement</h2>
            <h3 className="text-lg font-medium mb-2">Site web</h3>
            <p>
              Interface utilisateur hébergée par Vercel Inc.
              <br />
              340 S Lemon Ave #4133
              <br />
              Walnut, CA 91789
              <br />
              États-Unis
            </p>

            <h3 className="text-lg font-medium mb-2 mt-4">Données et API</h3>
            <p>
              Serveur backend et base de données hébergés par OVH SAS
              <br />
              2 rue Kellermann
              <br />
              59100 Roubaix
              <br />
              France
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Développement</h2>
            <p>
              Site développé par Etienne Pogoda
              <br />
              <a
                href="https://pogodev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                pogodev.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Propriété intellectuelle
            </h2>
            <p>
              L'ensemble de ce site relève de la législation française et
              internationale sur le droit d'auteur et la propriété
              intellectuelle. Tous les droits de reproduction sont réservés, y
              compris pour les documents téléchargeables et les représentations
              iconographiques et photographiques.
            </p>
            <p>
              La reproduction de tout ou partie de ce site sur un support
              électronique quel qu'il soit est formellement interdite sauf
              autorisation expresse du directeur de la publication.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Responsabilité</h2>
            <p>
              Les informations contenues sur ce site sont aussi précises que
              possible et le site remis à jour à différentes périodes de
              l'année, mais peut toutefois contenir des inexactitudes ou des
              omissions.
            </p>
            <p>
              Si vous constatez une lacune, erreur ou ce qui parait être un
              dysfonctionnement, merci de bien vouloir le signaler par email, à
              l'adresse altolille@gmail.com, en décrivant le problème de la
              façon la plus précise possible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Liens hypertextes</h2>
            <p>
              Les liens hypertextes mis en place dans le cadre du présent site
              internet en direction d'autres ressources présentes sur le réseau
              Internet ne sauraient engager la responsabilité d'Alto Lille.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Droit applicable</h2>
            <p>
              Tant le présent site que les modalités et conditions de son
              utilisation sont régis par le droit français, quel que soit le
              lieu d'utilisation. En cas de contestation éventuelle, et après
              l'échec de toute tentative de recherche d'une solution amiable,
              les tribunaux français seront seuls compétents pour connaître de
              ce litige.
            </p>
          </section>
        </div>
      </div>
    </ProjectLayoutUnified>
  );
}
