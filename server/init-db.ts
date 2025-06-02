import { db } from "./storage/db.js";
import { products, productVariations, media } from "../shared/schema.js";
import { sql } from "drizzle-orm";
import { testDatabaseConnection } from "./storage/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Récupérer le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Données initiales pour les produits
const initialProducts = [
  {
    name: "FOCUS.01",
    description:
      "Lampe d'appoint imaginée et fabriquée par Anatole Collet. Réaliser en PLA écoresponsable et en chêne écogéré, livré avec une ampoule LED de 60W E14 et un câble avec interrupteur de 1m50.",
    price: 70.0,
  },
];

// Données initiales pour les variations de produits
const initialProductVariations = [
  // Variations pour FOCUS.01 - Nouvelles URLs avec transparence
  {
    productId: 1,
    variationType: "color",
    variationValue: "Blanc",
    stock: 10,
    imageUrl: "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
  },
  {
    productId: 1,
    variationType: "color",
    variationValue: "Bleu",
    stock: 10,
    imageUrl: "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
  },
  {
    productId: 1,
    variationType: "color",
    variationValue: "Rouge",
    stock: 10,
    imageUrl: "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
  },
  {
    productId: 1,
    variationType: "color",
    variationValue: "Orange",
    stock: 10,
    imageUrl: "https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png",
  },
];

/**
 * Initialise la base de données avec des données de départ
 */
async function initDatabase() {
  console.log("Initialisation de la base de données...");

  try {
    // Test de la connexion à la base de données
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      console.error(
        "Échec de la connexion à la base de données. Initialisation annulée."
      );
      return;
    }

    // 1. Vérifier si des produits existent déjà
    const existingProducts = await db.execute(
      sql`SELECT COUNT(*) FROM products`
    );
    const count = parseInt(existingProducts.rows[0].count as string, 10);

    if (count > 0) {
      console.log(
        `La base de données contient déjà ${count} produits. Initialisation ignorée.`
      );
      return;
    }

    // 2. Si aucun produit n'existe, insérer les données initiales
    console.log(
      "Aucun produit existant trouvé. Insertion des données initiales..."
    );

    // Insérer les produits
    for (const product of initialProducts) {
      await db.execute(sql`
        INSERT INTO products (name, description, price)
        VALUES (${product.name}, ${product.description}, ${product.price})
      `);
    }
    console.log(`${initialProducts.length} produits insérés avec succès.`);

    // Insérer les variations de produits
    for (const variation of initialProductVariations) {
      await db.execute(sql`
        INSERT INTO product_variations (product_id, variation_type, variation_value, stock, image_url)
        VALUES (${variation.productId}, ${variation.variationType}, ${variation.variationValue}, ${variation.stock}, ${variation.imageUrl})
      `);
    }
    console.log(
      `${initialProductVariations.length} variations de produits insérées avec succès.`
    );

    console.log("Initialisation de la base de données terminée avec succès.");
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error
    );
  }
}

// Export de la fonction pour pouvoir l'appeler depuis d'autres fichiers
export default initDatabase;

// Exécution directe si ce fichier est exécuté directement (et non importé)
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase().then(() => process.exit(0));
}
