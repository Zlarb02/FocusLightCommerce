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

  // Configuration CORS pour toutes les requêtes
  app.use(
    cors({
      origin: function (origin, callback) {
        // Pour les requêtes GET sur /uploads, autoriser même sans origine
        if (origin === undefined && isProd) {
          // Récupérer le chemin de la requête depuis l'objet req
          const req = arguments[2]?.req;
          if (req && req.path && req.path.startsWith('/uploads') && req.method === 'GET') {
            log(`CORS: GET ${req.path} sans origine → autorisé exceptionnellement`);
            return callback(null, true);
          }
          
          log("CORS: Aucune origine (prod) → refusé");
          return callback(new Error("CORS requiert une origine en production"));
        }
        
        // Si pas d'origine en développement, on autorise
        if (origin === undefined && !isProd) {
          log("CORS: Aucune origine (dev) → autorisé");
          return callback(null, true);
        }

        // Vérifier si l'origine est autorisée
        if (origin && allowedOrigins.includes(origin)) {
          log(`CORS: Autorisé pour ${origin}`);
          return callback(null, true);
        }

        log(`❌ CORS refusé pour ${origin || 'null'}`);
        return callback(new Error(`CORS non autorisé pour ${origin || 'null'}`));
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
