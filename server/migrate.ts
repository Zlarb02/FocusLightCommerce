import { db, pool, testDatabaseConnection } from "./storage/db.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bcrypt from "bcrypt";

// Récupérer le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le dossier de migrations
const migrationsFolder = path.join(__dirname, "../migrations");

async function migrateImageData() {
  console.log("Vérification des données à migrer...");

  try {
    // Vérifier si la colonne image_url existe encore
    const hasImageUrlColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'product_variations' AND column_name = 'image_url'
    `);

    if (hasImageUrlColumn.rowCount && hasImageUrlColumn.rowCount > 0) {
      console.log("Migration des données image_url vers variation_images...");

      // Récupérer toutes les variations avec image_url
      const variationsWithImages = await db.execute(sql`
        SELECT id, image_url FROM product_variations WHERE image_url IS NOT NULL AND image_url != ''
      `);

      for (const variation of variationsWithImages.rows) {
        // Vérifier si l'image n'existe pas déjà dans variation_images
        const existingImage = await db.execute(sql`
          SELECT id FROM variation_images WHERE variation_id = ${variation.id}
        `);

        if (existingImage.rowCount === 0) {
          // Insérer l'image dans variation_images
          await db.execute(sql`
            INSERT INTO variation_images (variation_id, url, "order")
            VALUES (${variation.id}, ${variation.image_url}, 0)
          `);
          console.log(`✅ Image migrée pour la variation ${variation.id}`);
        }
      }

      // Supprimer la colonne image_url
      console.log("Suppression de la colonne image_url...");
      await db.execute(
        sql`ALTER TABLE product_variations DROP COLUMN IF EXISTS image_url`
      );
      console.log("✅ Colonne image_url supprimée");
    } else {
      console.log(
        "✅ La colonne image_url n'existe plus, migration déjà effectuée"
      );
    }
  } catch (error) {
    console.error("Erreur lors de la migration des images:", error);
    // Ne pas faire échouer toute la migration pour ça
  }
}

async function createTablesDirectly() {
  console.log("Création directe des tables dans la base de données...");

  try {
    // Création des tables une par une dans le bon ordre
    console.log("Création de la table des produits...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL
      )
    `);

    console.log("Création de la table des variations de produits...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS product_variations (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        variation_type TEXT NOT NULL,
        variation_value TEXT NOT NULL,
        price REAL,
        stock INTEGER NOT NULL DEFAULT 0
      )
    `);

    console.log("Création de la table des images de variations...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS variation_images (
        id SERIAL PRIMARY KEY,
        variation_id INTEGER NOT NULL REFERENCES product_variations(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0
      )
    `);

    // Migration des données existantes de image_url vers variation_images
    console.log("Migration des données existantes...");
    await migrateImageData();

    console.log("Création de la table des clients...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        address TEXT,
        city TEXT,
        postal_code TEXT,
        country TEXT
      )
    `);

    console.log("Création de la table des commandes...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("Création de la table des éléments de commande...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL
      )
    `);

    console.log("Création de la table des utilisateurs...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE
      )
    `);

    console.log("Création de la table des médias...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        path TEXT NOT NULL,
        type TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    console.log("Création de la table des versions du site...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_versions (
        id SERIAL PRIMARY KEY,
        shop_mode TEXT NOT NULL DEFAULT 'focus',
        theme_decoration TEXT NOT NULL DEFAULT 'none',
        is_active BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    console.log("Toutes les tables ont été créées avec succès!");
    return true;
  } catch (error) {
    console.error("Erreur lors de la création directe des tables:", error);
    throw error;
  }
}

async function runMigrations() {
  // Tester la connexion à la base de données
  const isConnected = await testDatabaseConnection();
  if (!isConnected) {
    console.error(
      "Impossible de se connecter à la base de données pour les migrations"
    );
    process.exit(1);
  }

  try {
    // Vérifier si le dossier de migrations existe
    const hasMigrationsFolder =
      fs.existsSync(migrationsFolder) &&
      fs.readdirSync(migrationsFolder).length > 0;

    if (hasMigrationsFolder) {
      console.log(`Migration à partir du dossier: ${migrationsFolder}`);

      // Exécuter les migrations via drizzle
      await migrate(db, { migrationsFolder });
      console.log("Migrations terminées avec succès");
    } else {
      console.log("Aucun dossier de migrations trouvé ou dossier vide");
      console.log("Création directe des tables...");

      // Créer les tables directement depuis le schéma
      await createTablesDirectly();
    }

    // Initialiser les données par défaut si nécessaire
    await initializeDefaultData();

    console.log("✅ Migration et initialisation terminées avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  } finally {
    // Fermer la connexion à la base de données
    await pool.end();
  }
}

/**
 * Initialise les données par défaut nécessaires
 * - Crée un utilisateur admin si ADMIN_PASSWORD est défini
 * - Crée les produits initiaux (les lampes FocusLight)
 */
async function initializeDefaultData() {
  console.log("Initialisation des données par défaut...");

  try {
    // Créer l'utilisateur admin
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminPassword) {
      const existingUsers = await db.execute(
        sql`SELECT * FROM users WHERE username = 'admin'`
      );

      if (existingUsers.rowCount === 0) {
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await db.execute(
          sql`INSERT INTO users (username, password, is_admin) 
              VALUES ('admin', ${hashedPassword}, TRUE)`
        );

        console.log("✅ Utilisateur admin créé avec succès");
      } else {
        console.log("👤 L'utilisateur admin existe déjà");
      }
    } else {
      console.log(
        "⚠️ ADMIN_PASSWORD non défini, pas de création d'utilisateur admin"
      );
    }

    // Vérifier si des produits existent déjà
    const existingProducts = await db.execute(sql`SELECT * FROM products`);

    if (existingProducts.rowCount === 0) {
      console.log("🛍️ Initialisation des produits...");

      // Créer le produit de base
      const lampProductResult = await db.execute(
        sql`INSERT INTO products (name, description, price)
            VALUES (
              'FOCUS.01', 
              'Lampe d''appoint imaginée et fabriquée par Anatole Collet. Réaliser en PLA écoresponsable et en chêne écogéré, livré avec une ampoule LED de 60W E14 et un câble avec interrupteur de 1m50.',
              70.0
            )
            RETURNING id`
      );

      if (lampProductResult.rowCount && lampProductResult.rowCount > 0) {
        const productId = lampProductResult.rows[0].id;

        // Ajouter les variations de couleur
        const variations = [
          {
            color: "Blanc",
            images: [
              "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
              "https://www.alto-lille.fr/uploads/79b8fa12-a1a6-4527-9ab0-365d6ad22179.jpeg",
            ],
          },
          {
            color: "Bleu",
            images: [
              "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
            ],
          },
          {
            color: "Rouge",
            images: [
              "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
              "https://www.alto-lille.fr/uploads/30233a9e-8c26-47ef-89c6-588683f68b7b.jpeg",
            ],
          },
          {
            color: "Orange",
            images: [
              "https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png",
              "https://www.alto-lille.fr/uploads/8ccbd06d-02a6-49d2-b9ca-f64ceff88f9e.jpeg",
            ],
          },
        ];

        for (const variation of variations) {
          // Créer la variation
          const variationResult = await db.execute(
            sql`INSERT INTO product_variations 
                (product_id, variation_type, variation_value, stock)
                VALUES (${productId}, 'color', ${variation.color}, 10)
                RETURNING id`
          );

          if (variationResult.rowCount && variationResult.rowCount > 0) {
            const variationId = variationResult.rows[0].id;

            // Ajouter toutes les images de la variation
            for (let i = 0; i < variation.images.length; i++) {
              await db.execute(sql`
                INSERT INTO variation_images (variation_id, url, "order")
                VALUES (${variationId}, ${variation.images[i]}, ${i})
              `);
            }
          }
        }

        console.log("✅ Produits initialisés avec succès");
      }
    } else {
      console.log("🛍️ Des produits existent déjà dans la base de données");
    }

    // Initialiser la version du site par défaut si nécessaire
    const existingVersions = await db.execute(sql`SELECT * FROM site_versions`);

    if (existingVersions.rowCount === 0) {
      console.log("🔄 Initialisation de la version du site par défaut...");

      await db.execute(
        sql`INSERT INTO site_versions (shop_mode, theme_decoration, is_active)
            VALUES ('focus', 'none', TRUE)`
      );

      console.log("✅ Version du site initialisée avec succès");
    } else {
      console.log("🔄 Des versions de site existent déjà");
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des données:", error);
    throw error;
  }
}

// Exécuter les migrations
runMigrations();

// EN PROD
// # Se connecter au conteneur
// docker exec -it alto-backend /bin/sh

// # Exécuter le script de migration manuellement
// cd /app
// node server/dist/server/migrate.js
