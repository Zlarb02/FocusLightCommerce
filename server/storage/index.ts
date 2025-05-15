// filepath: /Users/etiennepogoda/Downloads/FocusLightCommerce/server/storage/index.ts
import { IStorage } from "./interfaces.js";
import { PgStorage } from "./pgStorage.js";
// import { MemoryStorage } from "./memoryStorage.js"; // Commenté - disponible en réserve si nécessaire
import { testDatabaseConnection } from "./db.js";

/**
 * Initialise le système de stockage PostgreSQL
 * @returns Une instance d'IStorage initialisée
 */
async function initializeStorage(): Promise<IStorage> {
  console.log("🔄 Tentative de connexion à PostgreSQL...");
  try {
    const isConnected = await testDatabaseConnection();
    if (isConnected) {
      console.log(
        "✅ Connexion PostgreSQL réussie - Utilisation du stockage PostgreSQL"
      );

      // Assurez-vous que la base de données contient les tables nécessaires
      // Si des migrations sont nécessaires, elles seront exécutées au démarrage du conteneur
      // via le script docker-entrypoint.sh
      return new PgStorage();
    } else {
      console.warn("⚠️ Impossible de se connecter à PostgreSQL");
      throw new Error(
        "Échec de connexion PostgreSQL - Vérifiez les variables d'environnement DB_*"
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors de la connexion à PostgreSQL:", error);
    throw error; // Ne pas continuer si PostgreSQL échoue
  }
}

// Export un singleton non-initialisé
let storageInstance: IStorage | null = null;

/**
 * Récupère l'instance de stockage initialisée
 * L'initialisation se fait à la demande, au premier appel
 */
export const getStorage = async (): Promise<IStorage> => {
  if (!storageInstance) {
    storageInstance = await initializeStorage();
  }
  return storageInstance;
};

// Pour la compatibilité avec le code existant, on expose aussi une version synchrone
// qui utilise getStorage() en interne pour initialiser le stockage
export const storage: IStorage = new Proxy({} as IStorage, {
  get: function (target, prop) {
    if (!storageInstance) {
      console.warn(
        "⚠️ Tentative d'accès à storage avant initialisation, initialisation automatique avec PgStorage"
      );

      // Initialiser de manière asynchrone, mais envelopper dans une promesse qui sera résolue
      const method = async (...args: any[]) => {
        const instance = await getStorage();
        // @ts-ignore - Impossible de typer correctement cette partie à cause de la nature dynamique
        return instance[prop](...args);
      };

      return method;
    }
    return Reflect.get(storageInstance as object, prop);
  },
});
