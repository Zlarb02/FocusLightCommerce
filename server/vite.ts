import { type Express } from "express";
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

/**
 * Initialise la stratégie CORS :
 * – `/uploads/*` : fichiers publics, lecture seule, aucun cookie ni origine requise.
 * – reste de l’API : allow‑list stricte ; absence d’Origin acceptée (edge/CDN).
 */
export function setupCors(app: Express) {
  const isProd = process.env.NODE_ENV === "production";

  /** Origines autorisées pour les requêtes XHR/fetch. */
  const allowedOrigins = [
    "https://alto-lille.fr",
    "https://www.alto-lille.fr",
    "https://api-focus.pogodev.com",
    ...(isProd ? [] : ["http://localhost:5173"]),
  ];

  /* ------------------------------------------------------------------ */
  /*  FICHIERS PUBLICS                                                    */
  /* ------------------------------------------------------------------ */
  // Lecture seule, pas de cookies, CORS wildcard (même sans header Origin)
  app.use(
    "/uploads",
    cors({
      origin: (_origin, cb) => cb(null, true), // accepte même sans Origin
      methods: ["GET"],
      credentials: false, // fichier public → pas de cookie transmis
      maxAge: 86400,
    })
  );

  /* ------------------------------------------------------------------ */
  /*  API & AUTRES ENDPOINTS                                             */
  /* ------------------------------------------------------------------ */
  app.use(
    cors({
      origin: (origin, callback) => {
        log(`Requête reçue de l'origine: ${origin || "∅"}`);

        // 1. Absence d'Origin (edge proxy, cURL, server‑to‑server)
        if (!origin) {
          log("CORS: Aucune origine → autorisé (edge/server-to-server)");
          return callback(null, true);
        }

        // 2. Origine présente et dans la whitelist
        if (allowedOrigins.includes(origin)) {
          log(`CORS: Autorisé pour ${origin}`);
          return callback(null, true);
        }

        // 3. Rejet par défaut
        log(`❌ CORS refusé pour ${origin}`);
        return callback(new Error(`CORS non autorisé pour ${origin}`));
      },
      credentials: true, // cookies de session si besoin
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "Set-Cookie",
      ],
      exposedHeaders: ["Set-Cookie", "Authorization"],
      maxAge: 86400, // 24 h pour les pré‑vol
      preflightContinue: false,
      optionsSuccessStatus: 204,
    })
  );

  log(`CORS initialisé (${isProd ? "production" : "développement"})`);
}

export function serveStatic(app: Express) {
  log(
    "Le frontend est hébergé sur Vercel, aucun contenu statique servi depuis le backend"
  );

  app.use("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.status(404).json({
      message:
        "Cette API ne sert pas de contenu statique. Utilisez le frontend sur Vercel.",
    });
  });
}
