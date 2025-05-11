import { Express } from "express";
import { Server } from "http";
import { createServer } from "http";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

// Routes
import productRoutes from "./productRoutes.js";
import authRoutes from "./authRoutes.js";
import orderRoutes from "./orderRoutes.js";
import checkoutRoutes from "./checkoutRoutes.js";
import mediaRoutes from "./mediaRoutes.js";

// Déclaration pour étendre les sessions Express
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      isAdmin: boolean;
    };
  }
}

/**
 * Configure et enregistre toutes les routes de l'application
 */
export async function registerRoutes(app: Express): Promise<Server> {
  const isProd = process.env.NODE_ENV === "production";

  // Configuration des cookies pour la production et le développement
  const cookieConfig = isProd
    ? {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      }
    : {
        httpOnly: true,
        secure: false,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      };

  let sessionStore;

  if (isProd) {
    // Configuration Redis pour la production
    const redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    redisClient.on("connect", () =>
      console.log("Connected to Redis successfully")
    );

    await redisClient.connect();

    sessionStore = new RedisStore({
      client: redisClient,
      prefix: "alto:sess:",
    });
  } else {
    // MemoryStore pour le développement uniquement
    sessionStore = new session.MemoryStore();
  }

  app.set("trust proxy", 1);

  app.use(
    session({
      name: "alto.sid",
      secret: process.env.SESSION_SECRET || "focus-lamp-secret",
      resave: false,
      saveUninitialized: false,
      rolling: true,
      proxy: true,
      store: sessionStore,
      cookie: cookieConfig,
    })
  );

  // Enregistrement des routes
  app.use("/api/products", productRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/checkout", checkoutRoutes);
  app.use("/api/medias", mediaRoutes);

  return createServer(app);
}
