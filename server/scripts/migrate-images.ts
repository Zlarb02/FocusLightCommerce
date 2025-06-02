#!/usr/bin/env node
/**
 * Script de migration pour mettre à jour les URLs d'images des variations de produits
 * Ce script peut être exécuté pour migrer les anciennes URLs vers les nouvelles URLs avec fond transparent
 *
 * Usage:
 * - En développement: npm run migrate:images
 * - En production: NODE_ENV=production npm run migrate:images
 */

import { db } from "../storage/db.js";
import { sql } from "drizzle-orm";
import { IMAGE_URL_MAPPING } from "../utils/imageMapper.js";

async function migrateImageUrls() {
  console.log("🖼️  Début de la migration des URLs d'images...");

  try {
    // Test de connexion à la base de données
    await db.execute(sql`SELECT 1`);
    console.log("✅ Connexion à la base de données réussie");

    // Récupérer toutes les variations avec leurs URLs actuelles
    const variations = await db.execute(
      sql`SELECT id, variation_value, image_url FROM product_variations`
    );

    console.log(`📊 ${variations.rowCount} variations trouvées`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const variation of variations.rows) {
      const currentUrl = String(variation.image_url);
      const newUrl = IMAGE_URL_MAPPING[currentUrl];

      if (newUrl && newUrl !== currentUrl) {
        try {
          // Mettre à jour l'URL dans la base de données
          await db.execute(
            sql`UPDATE product_variations 
                SET image_url = ${newUrl} 
                WHERE id = ${variation.id}`
          );

          console.log(`✅ Mis à jour: ${variation.variation_value}`);
          console.log(`   Ancien: ${currentUrl}`);
          console.log(`   Nouveau: ${newUrl}`);
          updatedCount++;
        } catch (updateError) {
          console.error(
            `❌ Erreur lors de la mise à jour de ${variation.variation_value}:`,
            updateError
          );
          // Continuer la migration même en cas d'erreur sur une variation
        }
      } else {
        console.log(
          `⏭️  Ignoré: ${variation.variation_value} (URL déjà à jour ou non mappée)`
        );
        skippedCount++;
      }
    }

    console.log("\n📈 Résumé de la migration:");
    console.log(`   ✅ ${updatedCount} variations mises à jour`);
    console.log(`   ⏭️  ${skippedCount} variations ignorées`);

    if (updatedCount === 0 && skippedCount > 0) {
      console.log(
        "ℹ️  Toutes les URLs sont déjà à jour - aucune migration nécessaire"
      );
    }

    console.log("🎉 Migration terminée avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    // En production, on ne veut pas arrêter le démarrage du serveur si la migration échoue
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "⚠️  Migration échouée en production, mais le serveur va continuer"
      );
      console.warn(
        "⚠️  Les URLs d'images seront toujours transformées à la volée"
      );
    } else {
      process.exit(1);
    }
  }
}

// Exécuter la migration si ce script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateImageUrls()
    .then(() => {
      console.log("🏁 Script de migration terminé");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Échec de la migration:", error);
      process.exit(1);
    });
}

export { migrateImageUrls };
