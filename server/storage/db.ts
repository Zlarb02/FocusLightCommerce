import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Récupérer le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement du fichier .env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Configuration de connexion à PostgreSQL
// Utiliser 127.0.0.1 au lieu de localhost pour éviter les problèmes de résolution DNS
const connectionString =
  process.env.DB_CONNECTION_STRING ||
  `postgresql://${process.env.DB_USER || "postgres"}:${
    process.env.DB_PASSWORD || "postgres"
  }@127.0.0.1:${process.env.DB_PORT || "5432"}/${
    process.env.DB_NAME || "focuslight"
  }`;

console.log(
  "Tentative de connexion à PostgreSQL avec:",
  connectionString.replace(/:[^:]*@/, ":***@")
);

// Créer le pool de connexions PostgreSQL
export const pool = new Pool({
  connectionString,
});

// Établir la connexion Drizzle
export const db = drizzle(pool);

// Fonction pour tester la connexion à la base de données
export async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log(
      `Connexion à la base de données établie: ${result.rows[0].now}`
    );
    return true;
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    return false;
  }
}
