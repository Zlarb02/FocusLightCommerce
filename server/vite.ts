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

export function setupCors(app: Express) {
  const isProd = process.env.NODE_ENV === "production";
  const allowedOrigins = [
    "https://alto-lille.fr",
    "https://www.alto-lille.fr",
    "https://api-focus.pogodev.com",
    ...(isProd ? [] : ["http://localhost:5173"]),
  ];

  // Configuration CORS spéciale pour les requêtes GET sur /uploads
  app.use("/uploads", (req, res, next) => {
    // Si c'est une requête GET, autoriser même sans origine en production
    if (req.method === "GET") {
      return cors({
        origin: function (origin, callback) {
          log(`Requête GET /uploads reçue de l'origine: ${origin || "aucune"}`);
          // Autoriser même sans origine
          if (!origin) {
            log(
              "CORS: GET /uploads sans origine → autorisé exceptionnellement"
            );
            return callback(null, true);
          }

          // Vérifier si l'origine est autorisée
          if (allowedOrigins.includes(origin)) {
            log(`CORS: GET /uploads autorisé pour ${origin}`);
            return callback(null, true);
          }

          log(`❌ CORS GET /uploads refusé pour ${origin}`);
          return callback(new Error(`CORS non autorisé pour ${origin}`));
        },
        credentials: true,
        methods: ["GET"],
      })(req, res, next);
    }

    // Si ce n'est pas GET, passer au middleware CORS général
    next();
  });

  // Configuration CORS générale pour toutes les autres requêtes
  app.use(
    cors({
      origin: function (origin, callback) {
        log(`Requête reçue de l'origine: ${origin}`);

        // Autoriser les requêtes sans origine en développement uniquement
        if (!origin) {
          if (!isProd) {
            log("CORS: Aucune origine (dev) → autorisé");
            return callback(null, true);
          }
          log("CORS: Aucune origine (prod) → refusé");
          return callback(new Error("CORS requiert une origine en production"));
        }

        // Vérifier si l'origine est autorisée
        if (allowedOrigins.includes(origin)) {
          log(`CORS: Autorisé pour ${origin}`);
          return callback(null, true);
        }

        log(`❌ CORS refusé pour ${origin}`);
        return callback(new Error(`CORS non autorisé pour ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "Set-Cookie",
      ],
      exposedHeaders: ["Set-Cookie", "Authorization"],
      maxAge: 86400, // 24 heures
      preflightContinue: false,
      optionsSuccessStatus: 204,
    })
  );

  log(
    `CORS initialisé avec la configuration de production: ${
      isProd ? "oui" : "non"
    }`
  );
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
