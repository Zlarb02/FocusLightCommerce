import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Créer le répertoire dist s'il n'existe pas
  const distDir = path.join(__dirname, "client/dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Obtenir l'URL de l'API depuis les variables d'environnement
  // Cette URL doit pointer vers votre backend Docker déployé
  const API_URL = process.env.API_URL || "https://api.votredomaine.com";

  // Créer un fichier de configuration pour le frontend
  const envConfig = `
window.ENV = {
  API_URL: "${API_URL}",
  NODE_ENV: "${process.env.NODE_ENV || "production"}"
};
`;

  // Écrire la configuration dans un fichier qui sera servi avec l'application
  fs.writeFileSync(path.join(distDir, "env-config.js"), envConfig);
  console.log("Configuration de déploiement créée avec succès");
} catch (error) {
  console.error("Erreur lors de la création de la configuration:", error);
  process.exit(1);
}
