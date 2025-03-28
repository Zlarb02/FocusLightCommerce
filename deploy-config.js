const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Chargement des variables d'environnement
dotenv.config();

// Obtenir l'URL de l'API depuis les variables d'environnement ou utiliser une valeur par défaut
const API_URL = process.env.API_URL || "";

// Créer un fichier de configuration pour le frontend
const envConfig = `
window.ENV = {
  API_URL: "${API_URL}",
  NODE_ENV: "${process.env.NODE_ENV || "production"}"
};
`;

// Écrire la configuration dans un fichier qui sera servi avec l'application
fs.writeFileSync(path.join(__dirname, "client/dist/env-config.js"), envConfig);

console.log("Configuration de déploiement créée avec succès");
