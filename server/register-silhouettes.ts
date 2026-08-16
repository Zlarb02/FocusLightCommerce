import { db } from "./storage/db.js";
import { sql } from "drizzle-orm";

/**
 * Silhouettes produits livrées avec le site.
 *
 * Elles vivent dans le dossier public du front, pas dans `uploads/` : elles
 * n'arrivent donc pas dans la médiathèque par le téléversement habituel. On les
 * y déclare au démarrage pour qu'Anatole les voie et les retrouve dans les
 * sélecteurs, au même titre que ses propres images.
 */
const SILHOUETTE_MEDIAS = [
  { filename: "applique-focus-brown.png", path: "/images/alto/silhouettes/applique-focus-brown.png", size: 63193 },
  { filename: "applique-focus-cream.png", path: "/images/alto/silhouettes/applique-focus-cream.png", size: 59735 },
  { filename: "auferte-brown.png", path: "/images/alto/silhouettes/auferte-brown.png", size: 14891 },
  { filename: "auferte-cream.png", path: "/images/alto/silhouettes/auferte-cream.png", size: 15303 },
  { filename: "aurora-brown.png", path: "/images/alto/silhouettes/aurora-brown.png", size: 9275 },
  { filename: "aurora-cream.png", path: "/images/alto/silhouettes/aurora-cream.png", size: 9208 },
  { filename: "aurora-lampadaire-brown.png", path: "/images/alto/silhouettes/aurora-lampadaire-brown.png", size: 32766 },
  { filename: "aurora-lampadaire-cream.png", path: "/images/alto/silhouettes/aurora-lampadaire-cream.png", size: 17303 },
  { filename: "aurora-lampe-brown.png", path: "/images/alto/silhouettes/aurora-lampe-brown.png", size: 17014 },
  { filename: "aurora-lampe-cream.png", path: "/images/alto/silhouettes/aurora-lampe-cream.png", size: 17585 },
  { filename: "caligo-brown.png", path: "/images/alto/silhouettes/caligo-brown.png", size: 44570 },
  { filename: "caligo-cream.png", path: "/images/alto/silhouettes/caligo-cream.png", size: 43542 },
  { filename: "deposit-brown.png", path: "/images/alto/silhouettes/deposit-brown.png", size: 123493 },
  { filename: "deposit-cream.png", path: "/images/alto/silhouettes/deposit-cream.png", size: 123666 },
  { filename: "lampadaire-focus-brown.png", path: "/images/alto/silhouettes/lampadaire-focus-brown.png", size: 12695 },
  { filename: "lampadaire-focus-cream.png", path: "/images/alto/silhouettes/lampadaire-focus-cream.png", size: 13714 },
  { filename: "silhouette-focus-cream.png", path: "/images/alto/silhouette-focus-cream.png", size: 7694 },
  { filename: "silhouette-focus-brown.png", path: "/images/alto/silhouette-focus-brown.png", size: 7694 },
];

/**
 * Ajoute les silhouettes manquantes à la médiathèque. Appelée à chaque
 * démarrage : le test porte sur le chemin, donc rien n'est dupliqué. Une
 * silhouette supprimée depuis la gestion réapparaîtra au redémarrage suivant —
 * ce sont des fichiers du site, pas des téléversements.
 */
export async function registerSilhouetteMedias(): Promise<void> {
  try {
    let added = 0;
    for (const media of SILHOUETTE_MEDIAS) {
      const existing = await db.execute(
        sql`SELECT id FROM media WHERE path = ${media.path} LIMIT 1`
      );
      if (existing.rows.length > 0) continue;

      await db.execute(sql`
        INSERT INTO media (filename, path, type, size)
        VALUES (${media.filename}, ${media.path}, 'image', ${media.size})
      `);
      added += 1;
    }
    console.log(
      added > 0
        ? `🖼️  ${added} silhouette(s) ajoutée(s) à la médiathèque.`
        : "🖼️  Silhouettes déjà présentes dans la médiathèque."
    );
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des silhouettes:", error);
  }
}
