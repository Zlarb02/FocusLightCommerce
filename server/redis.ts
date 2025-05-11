const redis = require("redis");

export async function createRedisClient(): Promise<any> {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    return null;
  }

  const client = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
      reconnectStrategy: (retries: number) => {
        if (retries > 10) {
          console.error(
            "Impossible de se connecter à Redis après 10 tentatives"
          );
          return new Error("Échec de la connexion à Redis");
        }
        return Math.min(retries * 100, 3000);
      },
    },
  });

  client.on("error", (err: Error) => console.error("Erreur Redis:", err));
  client.on("connect", () => console.log("Connecté à Redis avec succès"));
  client.on("reconnecting", () => console.log("Reconnexion à Redis..."));

  try {
    await client.connect();
    return client;
  } catch (err) {
    console.error("Erreur de connexion à Redis:", err);
    throw err;
  }
}
