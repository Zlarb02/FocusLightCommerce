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
  const allowedOrigins = [
    "http://localhost:5173",
    "https://alto-lille.fr",
    "https://www.alto-lille.fr",
    "https://vps-a.pogodev.com",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          log("CORS: Aucune origine (CLI ou interne) → autorisé");
          return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
          log(`CORS: Autorisé pour ${origin}`);
          return callback(null, true);
        }

        log(`❌ CORS refusé pour ${origin}`);
        return callback(new Error(`CORS non autorisé pour ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  log("CORS initialisé");
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
