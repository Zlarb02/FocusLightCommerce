// Implémentation PostgreSQL spécifique pour la gestion des médias
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import { type Media } from "../../shared/schema.js";

/**
 * Gestion des médias dans PostgreSQL
 */
export class PgMediaStorage {
  /**
   * Récupère tous les médias, triés par date de création décroissante
   */
  async getAllMedias(): Promise<Media[]> {
    const result = await db.execute(
      sql`SELECT * FROM media ORDER BY created_at DESC`
    );

    return result.rows.map((row) => ({
      id: Number(row.id),
      filename: String(row.filename),
      path: String(row.path),
      type: String(row.type) as "image" | "video" | "other",
      size: Number(row.size),
      createdAt:
        row.created_at &&
        (typeof row.created_at === "string" ||
          typeof row.created_at === "number" ||
          row.created_at instanceof Date)
          ? new Date(row.created_at).toISOString()
          : "",
    }));
  }

  /**
   * Récupère un média par son ID
   */
  async getMediaById(id: number): Promise<Media | null> {
    const result = await db.execute(sql`SELECT * FROM media WHERE id = ${id}`);

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      filename: String(row.filename),
      path: String(row.path),
      type: String(row.type) as "image" | "video" | "other",
      size: Number(row.size),
      createdAt:
        row.created_at &&
        (typeof row.created_at === "string" ||
          typeof row.created_at === "number" ||
          row.created_at instanceof Date)
          ? new Date(row.created_at).toISOString()
          : "",
    };
  }

  /**
   * Crée un nouveau média
   */
  async createMedia(media: Omit<Media, "id" | "createdAt">): Promise<Media> {
    const result = await db.execute(
      sql`INSERT INTO media (filename, path, type, size)
          VALUES (${media.filename}, ${media.path}, ${media.type}, ${media.size})
          RETURNING id, filename, path, type, size, created_at`
    );

    const row = result.rows[0];
    return {
      id: Number(row.id),
      filename: String(row.filename),
      path: String(row.path),
      type: String(row.type) as "image" | "video" | "other",
      size: Number(row.size),
      createdAt:
        row.created_at &&
        (typeof row.created_at === "string" ||
          typeof row.created_at === "number" ||
          row.created_at instanceof Date)
          ? new Date(row.created_at).toISOString()
          : "",
    };
  }

  /**
   * Supprime un média
   */
  async deleteMedia(id: number): Promise<boolean> {
    const result = await db.execute(sql`DELETE FROM media WHERE id = ${id}`);

    return (result.rowCount ?? 0) > 0;
  }
}
