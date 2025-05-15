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
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT NOT NULL
      )
    `);

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
        await db.execute(
          sql`INSERT INTO product_variations 
              (product_id, variation_type, variation_value, stock, image_url)
              VALUES 
              (${productId}, 'color', 'Blanc', 10, '/uploads/blanche.png'),
              (${productId}, 'color', 'Bleu', 10, '/uploads/bleue.png'),
              (${productId}, 'color', 'Rouge', 10, '/uploads/rouge.png'),
              (${productId}, 'color', 'Orange', 10, '/uploads/orange.png')`
        );

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
