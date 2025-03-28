const fs = require("fs");
const path = require("path");

try {
  // Créer le répertoire dist s'il n'existe pas
  const distDir = path.join(__dirname, "client/dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Obtenir l'URL de l'API depuis les variables d'environnement ou utiliser une valeur par défaut
  const API_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

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
