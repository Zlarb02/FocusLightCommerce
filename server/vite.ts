import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import cors from "cors"; // Vous devrez peut-être installer ce package

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Configuration CORS pour le développement
export function setupCors(app: Express) {
  if (process.env.NODE_ENV !== "production") {
    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
    log("CORS configuré pour le développement");
  }
}

// Pour servir l'application en production
export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "client", "dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  log("Serveur configuré pour servir l'application en production");
}
