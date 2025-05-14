import { IStorage } from "./interfaces.js";
import { MemStorage } from "./memStorage.js";
import { PgStorage } from "./pgStorage.js";
import {
  type Product,
  type InsertProduct,
  type ProductVariation,
  type InsertProductVariation,
  type ProductWithVariations,
  type Customer,
  type InsertCustomer,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type User,
  type InsertUser,
  type Media,
  type ThemeDecoration,
  type ShopMode,
} from "../../shared/schema.js";
import { SiteVersionData } from "./versionStorage.js";

// Variable pour stocker l'implémentation choisie
let storageImpl: IStorage;

// Fonction d'initialisation du stockage
export async function initializeStorage(): Promise<IStorage> {
  if (
    process.env.NODE_ENV === "development" &&
    !process.env.DB_CONNECTION_STRING
  ) {
    console.log(
      "Utilisation du stockage en mémoire (dev sans DB_CONNECTION_STRING)"
    );
    storageImpl = new MemStorage();
    await storageImpl.initDatabase();
  } else {
    // En production ou si DB_CONNECTION_STRING est définie, toujours utiliser PostgreSQL
    console.log("Utilisation du stockage PostgreSQL");
    try {
      const pgStorage = new PgStorage();
      // Initialiser la base de données
      await pgStorage.initDatabase();
      storageImpl = pgStorage;
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation du stockage PostgreSQL:",
        error
      );

      if (process.env.NODE_ENV === "production") {
        console.error(
          "ERREUR CRITIQUE: Impossible d'utiliser PostgreSQL en production."
        );
        throw error; // En production, on ne veut pas de fallback en mémoire
      } else {
        console.log(
          "Retour au stockage en mémoire comme fallback (dev seulement)"
        );
        storageImpl = new MemStorage();
        await storageImpl.initDatabase();
      }
    }
  }

  return storageImpl;
}

// Exporter une instance "proxy" qui redirige vers l'implémentation choisie
export const storage = new Proxy({} as IStorage, {
  get: (target, prop) => {
    // S'assurer que l'implémentation est initialisée
    if (!storageImpl) {
      throw new Error(
        "Storage not initialized. Call initializeStorage() first."
      );
    }
    // Rediriger toutes les propriétés vers l'implémentation choisie
    return storageImpl[prop as keyof IStorage];
  },
});
