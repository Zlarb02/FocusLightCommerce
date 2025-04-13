import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import cors from "cors";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Configuration CORS pour tous les environnements
export function setupCors(app: Express) {
  // Utilisez l'URL du frontend sur Vercel en production
  const corsOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );

  log(`CORS configuré pour: ${corsOrigin}`);
}

// Nous n'avons plus besoin de servir le frontend statique depuis le serveur
// Cette fonction peut être supprimée ou remplacée par un message d'information
export function serveStatic(app: Express) {
  log(
    "Le frontend est hébergé sur Vercel, aucun contenu statique servi depuis le backend"
  );

  // Répondre avec un message informatif pour toutes les routes non-API
  app.use("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.status(404).json({
      message:
        "Cette API n'est pas destinée à servir du contenu statique. Veuillez accéder au frontend sur l'URL Vercel.",
    });
  });
}
