import { db } from "./storage/db.js";
import { sql } from "drizzle-orm";

/**
 * Met à jour uniquement les URLs d'images des variations de produits
 * sans toucher aux autres données (produits, commandes, etc.)
 */
async function updateImageUrls() {
  console.log("🖼️  Mise à jour des URLs d'images des variations...");
  console.log("🔧 Environnement:", process.env.NODE_ENV || 'development');
  console.log("🗄️  Database URL:", process.env.DATABASE_URL ? 'Configurée' : 'NON CONFIGURÉE');

  try {
    // Test de connexion
    await db.execute(sql`SELECT 1`);
    console.log("✅ Connexion à la base de données réussie");
    // Mapping des nouvelles URLs avec les UUIDs
    const imageUpdates = [
      {
        variation: 'Blanc',
        newUrl: 'https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png'
      },
      {
        variation: 'Bleu', 
        newUrl: 'https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png'
      },
      {
        variation: 'Rouge',
        newUrl: 'https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png'
      },
      {
        variation: 'Orange',
        newUrl: 'https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png'
      }
    ];

    let updatedCount = 0;
    
    for (const update of imageUpdates) {
      const result = await db.execute(
        sql`UPDATE product_variations 
            SET image_url = ${update.newUrl} 
            WHERE variation_value = ${update.variation}`
      );
      
      const rowCount = result.rowCount || 0;
      if (rowCount > 0) {
        console.log(`✅ ${update.variation}: URL mise à jour (${rowCount} variation(s))`);
        updatedCount += rowCount;
      } else {
        console.log(`⚠️  ${update.variation}: Aucune variation trouvée`);
      }
    }

    console.log(`\n🎉 Mise à jour terminée: ${updatedCount} URLs d'images mises à jour`);
    
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des URLs:", error);
    throw error;
  }
}

// Exporter la fonction pour pouvoir l'utiliser ailleurs
export { updateImageUrls };

// Exécuter si appelé directement
if (process.argv[1] && process.argv[1].includes('update-image-urls')) {
  updateImageUrls()
    .then(() => {
      console.log("🏁 Mise à jour des URLs terminée avec succès");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur critique:", error);
      process.exit(1);
    });
}
