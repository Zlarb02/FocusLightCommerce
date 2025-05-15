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
    name: "Lampe FocusLight Classic",
    description:
      "Notre lampe classique avec design minimaliste et éclairage LED efficace",
    price: 99.99,
  },
  {
    name: "Lampe FocusLight Pro",
    description:
      "Version avancée avec réglage d'intensité et températures de couleur variables",
    price: 149.99,
  },
  {
    name: "Lampe FocusLight Compact",
    description: "Version compacte parfaite pour les petits espaces et voyages",
    price: 79.99,
  },
];

// Données initiales pour les variations de produits
const initialProductVariations = [
  // Variations pour FocusLight Classic
  {
    productId: 1,
    variationType: "color",
    variationValue: "Blanc",
    stock: 25,
    imageUrl: "/uploads/blanche.png",
  },
  {
    productId: 1,
    variationType: "color",
    variationValue: "Rouge",
    stock: 15,
    imageUrl: "/uploads/rouge.png",
  },
  {
    productId: 1,
    variationType: "color",
    variationValue: "Bleu",
    stock: 20,
    imageUrl: "/uploads/bleue.png",
  },

  // Variations pour FocusLight Pro
  {
    productId: 2,
    variationType: "color",
    variationValue: "Blanc",
    stock: 20,
    imageUrl: "/uploads/blanche.png",
  },
  {
    productId: 2,
    variationType: "color",
    variationValue: "Noir",
    stock: 18,
    imageUrl: "/uploads/orange.png", // Remplacer par une image noire si disponible
  },

  // Variations pour FocusLight Compact
  {
    productId: 3,
    variationType: "color",
    variationValue: "Blanc",
    stock: 30,
    imageUrl: "/uploads/blanche.png",
  },
  {
    productId: 3,
    variationType: "color",
    variationValue: "Orange",
    stock: 12,
    imageUrl: "/uploads/orange.png",
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
