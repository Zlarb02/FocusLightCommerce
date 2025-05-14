import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes/index.js";
import { log, setupCors } from "./vite.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { storage } from "./storage/index.js";
import mime from "mime";

const app = express();

/* ------------------------------------------------------------------ */
/*  SERVEUR DE FICHIERS PUBLICS (/uploads)                            */
/* ------------------------------------------------------------------ */
// Tous les fichiers uploadés sont stockés dans <racine>/uploads
// → même dossier pour l'upload (multer) et pour la lecture statique
const uploadsDir = path.join(process.cwd(), "uploads"); // ex : /app/uploads en prod

// Route statique : lecture seule, les headers CORS sont ajoutés par setupCors
app.use("/uploads", express.static(uploadsDir, { extensions: false }));

/* ------------------------------------------------------------------ */
/*  CORS GENERAL (API, etc.)                                          */
/* ------------------------------------------------------------------ */
setupCors(app);

/* ------------------------------------------------------------------ */
/*  EXPRESS CORE                                                      */
/* ------------------------------------------------------------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging de performance & réponse JSON condensée
app.use((req, res, next) => {
  const start = Date.now();
  const p = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore – conserver type any du spread
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    if (!p.startsWith("/api")) return; // on log uniquement l'API
    const duration = Date.now() - start;
    let logLine = `${req.method} ${p} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }
    if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
    log(logLine);
  });

  next();
});

/* ------------------------------------------------------------------ */
/*  DEMARRAGE                                                         */
/* ------------------------------------------------------------------ */
/**
 * Importe automatiquement les fichiers présents dans /uploads au démarrage
 */
async function importExistingUploads() {
  const uploadsPath = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsPath)) return;
  const files = fs.readdirSync(uploadsPath);
  const existingMedias = await storage.getAllMedias();
  const existingPaths = new Set(existingMedias.map((m) => m.path));

  for (const file of files) {
    if (file === ".DS_Store") continue;
    const filePath = path.join(uploadsPath, file);
    if (!fs.statSync(filePath).isFile()) continue;
    const relPath = `/uploads/${file}`;
    if (existingPaths.has(relPath)) continue;
    const mimetype = mime.getType(filePath) || "application/octet-stream";
    let type: "image" | "video" | "other" = "other";
    if (mimetype.startsWith("image/")) type = "image";
    else if (mimetype.startsWith("video/")) type = "video";
    const size = fs.statSync(filePath).size;
    await storage.createMedia({
      filename: file,
      path: relPath,
      type,
      size,
    });
  }
}

(async () => {
  await importExistingUploads();
  const server = await registerRoutes(app);

  // Gestion globale des erreurs
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Port configurable via env, 5000 par défaut
  const port = parseInt(process.env.PORT || "5000", 10);
  app.listen(port, "0.0.0.0", () => {
    log(`API servie sur le port ${port}`);
  });
})();
