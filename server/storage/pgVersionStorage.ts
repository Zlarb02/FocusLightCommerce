// Implémentation PostgreSQL spécifique pour la gestion des versions du site
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import {
  type ShopMode,
  type ThemeDecoration,
  type SiteVersion,
} from "../../shared/schema.js";

/**
 * Fonction utilitaire pour convertir une valeur en Date
 */
function safeDate(value: unknown): Date {
  if (value === null || value === undefined) return new Date();
  if (value instanceof Date) return value;
  try {
    return new Date(String(value));
  } catch (e) {
    return new Date();
  }
}

/**
 * Fonction utilitaire pour convertir une valeur en Date ou null
 */
function safeDateOrNull(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  try {
    return new Date(String(value));
  } catch (e) {
    return null;
  }
}

/**
 * Gestion des versions du site dans PostgreSQL
 */
export class PgVersionStorage {
  /**
   * Récupère toutes les versions du site, triées par date de création décroissante
   */
  async getAllVersions(): Promise<SiteVersion[]> {
    const result = await db.execute(
      sql`SELECT * FROM site_versions ORDER BY created_at DESC`
    );

    return result.rows.map((row) => ({
      id: Number(row.id),
      shopMode: String(row.shop_mode) as ShopMode,
      themeDecoration: String(row.theme_decoration) as ThemeDecoration,
      isActive: Boolean(row.is_active),
      createdAt: safeDate(row.created_at),
      updatedAt: safeDateOrNull(row.updated_at),
    }));
  }

  /**
   * Récupère une version du site par son ID
   */
  async getVersionById(id: number): Promise<SiteVersion | undefined> {
    const result = await db.execute(
      sql`SELECT * FROM site_versions WHERE id = ${id}`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      shopMode: String(row.shop_mode) as ShopMode,
      themeDecoration: String(row.theme_decoration) as ThemeDecoration,
      isActive: Boolean(row.is_active),
      createdAt: safeDate(row.created_at),
      updatedAt: safeDateOrNull(row.updated_at),
    };
  }

  /**
   * Récupère la version active du site
   */
  async getActiveVersion(): Promise<SiteVersion | undefined> {
    const result = await db.execute(
      sql`SELECT * FROM site_versions WHERE is_active = TRUE`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      shopMode: String(row.shop_mode) as ShopMode,
      themeDecoration: String(row.theme_decoration) as ThemeDecoration,
      isActive: Boolean(row.is_active),
      createdAt: safeDate(row.created_at),
      updatedAt: safeDateOrNull(row.updated_at),
    };
  }

  /**
   * Définit une version comme active (et désactive toutes les autres)
   */
  async setActiveVersion(id: number): Promise<SiteVersion | undefined> {
    // D'abord désactiver toutes les versions
    await db.execute(sql`UPDATE site_versions SET is_active = FALSE`);

    // Puis activer celle demandée
    const result = await db.execute(
      sql`UPDATE site_versions 
          SET is_active = TRUE, updated_at = NOW()
          WHERE id = ${id}
          RETURNING id, shop_mode, theme_decoration, is_active, created_at, updated_at`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      shopMode: String(row.shop_mode) as ShopMode,
      themeDecoration: String(row.theme_decoration) as ThemeDecoration,
      isActive: Boolean(row.is_active),
      createdAt: safeDate(row.created_at),
      updatedAt: safeDateOrNull(row.updated_at),
    };
  }

  /**
   * Crée une nouvelle version du site
   */
  async createVersion(
    versionData: Omit<SiteVersion, "id" | "createdAt" | "updatedAt">
  ): Promise<SiteVersion> {
    if (versionData.isActive) {
      // Si la nouvelle version doit être active, désactiver d'abord les autres
      await db.execute(sql`UPDATE site_versions SET is_active = FALSE`);
    }

    const result = await db.execute(
      sql`INSERT INTO site_versions (shop_mode, theme_decoration, is_active)
          VALUES (${versionData.shopMode}, ${versionData.themeDecoration}, ${versionData.isActive})
          RETURNING id, shop_mode, theme_decoration, is_active, created_at, updated_at`
    );

    const row = result.rows[0];
    return {
      id: Number(row.id),
      shopMode: String(row.shop_mode) as ShopMode,
      themeDecoration: String(row.theme_decoration) as ThemeDecoration,
      isActive: Boolean(row.is_active),
      createdAt: safeDate(row.created_at),
      updatedAt: safeDateOrNull(row.updated_at),
    };
  }

  /**
   * Met à jour une version existante du site
   */
  async updateVersion(
    id: number,
    versionData: Partial<SiteVersion>
  ): Promise<SiteVersion | undefined> {
    // Si cette version doit être active, désactiver d'abord les autres
    if (versionData.isActive !== undefined && versionData.isActive) {
      await db.execute(sql`UPDATE site_versions SET is_active = FALSE`);
    }

    // Préparation des parties de la requête d'update
    const updates = [];

    if (versionData.shopMode !== undefined) {
      updates.push(sql`shop_mode = ${versionData.shopMode}`);
    }

    if (versionData.themeDecoration !== undefined) {
      updates.push(sql`theme_decoration = ${versionData.themeDecoration}`);
    }

    if (versionData.isActive !== undefined) {
      updates.push(sql`is_active = ${versionData.isActive}`);
    }

    // Toujours mettre à jour le champ updated_at
    updates.push(sql`updated_at = NOW()`);

    if (updates.length === 0) {
      return this.getVersionById(id);
    }

    // Construit la requête SQL complète avec drizzle-orm
    const updateSql = sql`UPDATE site_versions 
      SET ${sql.join(updates, sql`, `)}
      WHERE id = ${id}
      RETURNING id, shop_mode, theme_decoration, is_active, created_at, updated_at`;

    const result = await db.execute(updateSql);

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      shopMode: String(row.shop_mode) as ShopMode,
      themeDecoration: String(row.theme_decoration) as ThemeDecoration,
      isActive: Boolean(row.is_active),
      createdAt: safeDate(row.created_at),
      updatedAt: safeDateOrNull(row.updated_at),
    };
  }

  /**
   * Change le mode de la boutique pour la version active
   */
  async setShopMode(mode: ShopMode): Promise<SiteVersion | undefined> {
    // Récupérer la version active
    const activeVersion = await this.getActiveVersion();

    if (!activeVersion) {
      // Créer une nouvelle version si aucune n'est active
      return this.createVersion({
        shopMode: mode,
        themeDecoration: "none",
        isActive: true,
      });
    }

    // Mettre à jour la version active
    return this.updateVersion(activeVersion.id, {
      shopMode: mode,
    });
  }

  /**
   * Change la décoration du thème pour la version active
   */
  async setThemeDecoration(
    decoration: ThemeDecoration
  ): Promise<SiteVersion | undefined> {
    // Récupérer la version active
    const activeVersion = await this.getActiveVersion();

    if (!activeVersion) {
      // Créer une nouvelle version si aucune n'est active
      return this.createVersion({
        shopMode: "focus",
        themeDecoration: decoration,
        isActive: true,
      });
    }

    // Mettre à jour la version active
    return this.updateVersion(activeVersion.id, {
      themeDecoration: decoration,
    });
  }

  /**
   * Récupère le thème actuel
   */
  async getCurrentTheme(): Promise<string> {
    const activeVersion = await this.getActiveVersion();
    return activeVersion?.themeDecoration || "none";
  }

  /**
   * Récupère les décorations actuelles
   * Pour l'instant, retourne un objet vide car les décorations sont stockées
   * directement dans themeDecoration et ne sont pas des objets JSON
   */
  async getCurrentDecorations(): Promise<Record<string, any>> {
    const activeVersion = await this.getActiveVersion();
    // On pourrait éventuellement stocker plus de détails sur les décorations dans une autre table
    // Pour l'instant, retourner un objet simple basé sur le type de décoration
    const decoration = activeVersion?.themeDecoration || "none";

    // Selon le type de décoration, on pourrait retourner différentes configurations
    switch (decoration) {
      case "summer-sale":
        return {
          banner: true,
          colors: ["#FFD700", "#FF6347"],
          promotion: "20%",
        };
      case "halloween":
        return {
          banner: true,
          colors: ["#FF6347", "#000000"],
          specialEffects: true,
        };
      case "christmas":
        return {
          banner: true,
          colors: ["#006400", "#FF0000", "#FFFFFF"],
          snowEffect: true,
        };
      case "april-fools":
        return { banner: true, colors: ["#FF00FF", "#00FFFF"], funMode: true };
      default:
        return {};
    }
  }

  /**
   * Récupère le mode boutique actuel
   */
  async getCurrentShopMode(): Promise<string> {
    const activeVersion = await this.getActiveVersion();
    return activeVersion?.shopMode || "focus";
  }

  /**
   * Met à jour le thème (alias de setThemeDecoration)
   */
  async updateTheme(theme: string): Promise<void> {
    await this.setThemeDecoration(theme as ThemeDecoration);
  }

  /**
   * Met à jour les décorations
   * Cette méthode n'est pas complètement implémentée car les décorations ne sont
   * pas stockées sous forme d'objet JSON dans la base de données
   */
  async updateDecorations(decorations: Record<string, any>): Promise<void> {
    // Dans une implémentation future, on pourrait stocker les détails de décoration
    // Pour l'instant, cette méthode ne fait rien de spécial
    console.log("Mise à jour des décorations:", decorations);
    // On pourrait extraire un type de décoration de l'objet decorations si nécessaire
  }

  /**
   * Met à jour le mode boutique (alias de setShopMode)
   */
  async updateShopMode(mode: string): Promise<void> {
    await this.setShopMode(mode as ShopMode);
  }
}
