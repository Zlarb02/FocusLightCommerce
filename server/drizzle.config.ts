import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

// Récupérer le répertoire courant
const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

const connectionString =
  process.env.DB_CONNECTION_STRING || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DB_CONNECTION_STRING ou DATABASE_URL manquant, vérifiez que la base de données est configurée"
  );
}

export default defineConfig({
  out: path.join(currentDirname, "../migrations"),
  schema: path.join(currentDirname, "../shared/schema.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
