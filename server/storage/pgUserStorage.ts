// Implémentation PostgreSQL spécifique pour la gestion des utilisateurs
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { type User, type InsertUser } from "../../shared/schema.js";

/**
 * Gestion des utilisateurs dans PostgreSQL
 */
export class PgUserStorage {
  /**
   * Initialise un utilisateur admin par défaut si nécessaire
   */
  async initializeDefaultAdmin(): Promise<void> {
    // Initialize with default admin user only if ADMIN_PASSWORD is set
    const adminPassword = process.env.ADMIN_PASSWORD;

    try {
      // Vérifier si l'utilisateur admin existe déjà
      const result = await db.execute(
        sql`SELECT * FROM users WHERE username = 'admin'`
      );

      if (result.rowCount === 0 || result.rowCount === undefined) {
        if (!adminPassword) {
          console.error(
            "⚠️ ADMIN_PASSWORD non défini : aucun utilisateur admin créé. " +
              "Définissez ADMIN_PASSWORD puis redémarrez pour créer le compte admin."
          );
          return;
        }
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await db.execute(
          sql`INSERT INTO users (username, password, is_admin) 
              VALUES ('admin', ${hashedPassword}, TRUE)`
        );

        console.log("✅ Utilisateur admin créé avec succès");
      } else {
        console.log("👤 L'utilisateur admin existe déjà");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation de l'admin:", error);
    }
  }

  /**
   * Récupère un utilisateur par son nom d'utilisateur
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.execute(
      sql`SELECT * FROM users WHERE username = ${username}`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      username: String(row.username),
      password: String(row.password),
      isAdmin: Boolean(row.is_admin),
    };
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const result = await db.execute(
      sql`INSERT INTO users (username, password, is_admin)
          VALUES (${user.username}, ${hashedPassword}, ${true})
          RETURNING id, username, password, is_admin`
    );

    const row = result.rows[0];
    return {
      id: Number(row.id),
      username: String(row.username),
      password: String(row.password),
      isAdmin: Boolean(row.is_admin),
    };
  }

  /**
   * Met à jour le mot de passe d'un utilisateur (hashé avec bcrypt)
   */
  async updatePassword(userId: number, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await db.execute(
      sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${userId}`
    );

    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Vérifie les identifiants d'un utilisateur
   */
  async verifyUser(
    username: string,
    password: string
  ): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    }
    return undefined;
  }
}
