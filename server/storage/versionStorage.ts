import { ThemeDecoration, ShopMode } from "../../shared/schema.js";

/**
 * Interface pour les versions du site en mémoire.
 * Cette interface est distincte de SiteVersion dans schema.ts car:
 * 1. Elle garantit que updatedAt est toujours une Date (jamais null)
 * 2. Elle utilise des objets Date natifs au lieu de chaînes de caractères
 *
 * Note: Dans pgVersionStorage.ts, on utilise directement le type SiteVersion défini dans schema.ts
 * car cette implémentation est conçue pour fonctionner avec les objets Date/null de PostgreSQL.
 */
export interface SiteVersionData {
  id: number;
  shopMode: ShopMode;
  themeDecoration: ThemeDecoration;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class VersionStorage {
  private versions: Map<number, SiteVersionData>;
  private versionId: number;
  private activeVersionId: number | null;

  constructor(
    versionId: number = 1,
    versions: Map<number, SiteVersionData> = new Map()
  ) {
    this.versions = versions;
    this.versionId = versionId;
    this.activeVersionId = null;

    // Initialiser avec une version par défaut si aucune n'existe
    if (this.versions.size === 0) {
      this.initializeDefaultVersion();
    } else {
      // Trouver la version active existante
      this.findActiveVersion();
    }
  }

  /**
   * Initialise une version par défaut
   */
  private initializeDefaultVersion() {
    const now = new Date();
    const defaultVersion: SiteVersionData = {
      id: this.versionId++,
      shopMode: "focus",
      themeDecoration: "none",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.versions.set(defaultVersion.id, defaultVersion);
    this.activeVersionId = defaultVersion.id;
  }

  /**
   * Trouve la version active parmi les versions existantes
   */
  private findActiveVersion() {
    for (const [id, version] of this.versions.entries()) {
      if (version.isActive) {
        this.activeVersionId = id;
        break;
      }
    }

    // Si aucune version active n'est trouvée, activer la plus récente
    if (this.activeVersionId === null && this.versions.size > 0) {
      const sortedVersions = Array.from(this.versions.values()).sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );

      if (sortedVersions.length > 0) {
        const mostRecent = sortedVersions[0];
        mostRecent.isActive = true;
        this.versions.set(mostRecent.id, mostRecent);
        this.activeVersionId = mostRecent.id;
      }
    }
  }

  /**
   * Récupère toutes les versions
   */
  async getAllVersions(): Promise<SiteVersionData[]> {
    return Array.from(this.versions.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  /**
   * Récupère une version par son ID
   */
  async getVersionById(id: number): Promise<SiteVersionData | undefined> {
    return this.versions.get(id);
  }

  /**
   * Récupère la version active
   */
  async getActiveVersion(): Promise<SiteVersionData | undefined> {
    if (this.activeVersionId === null) return undefined;
    return this.versions.get(this.activeVersionId);
  }

  /**
   * Récupère le mode boutique actuel
   */
  async getShopMode(): Promise<ShopMode> {
    const activeVersion = await this.getActiveVersion();
    return activeVersion?.shopMode || "focus";
  }

  /**
   * Récupère la décoration thématique actuelle
   */
  async getThemeDecoration(): Promise<ThemeDecoration> {
    const activeVersion = await this.getActiveVersion();
    return activeVersion?.themeDecoration || "none";
  }

  /**
   * Crée une nouvelle version
   */
  async createVersion(
    versionData: Omit<SiteVersionData, "id" | "createdAt" | "updatedAt">
  ): Promise<SiteVersionData> {
    const now = new Date();
    const newVersion: SiteVersionData = {
      id: this.versionId++,
      ...versionData,
      createdAt: now,
      updatedAt: now,
    };

    // Si cette version est active, désactiver les autres
    if (newVersion.isActive) {
      this.deactivateAllVersions();
      this.activeVersionId = newVersion.id;
    }

    this.versions.set(newVersion.id, newVersion);
    return newVersion;
  }

  /**
   * Met à jour une version existante
   */
  async updateVersion(
    id: number,
    versionData: Partial<Omit<SiteVersionData, "id" | "createdAt">>
  ): Promise<SiteVersionData | undefined> {
    const existingVersion = this.versions.get(id);
    if (!existingVersion) return undefined;

    // Si on active cette version, désactiver les autres
    if (versionData.isActive && !existingVersion.isActive) {
      this.deactivateAllVersions();
      this.activeVersionId = id;
    }

    const updatedVersion: SiteVersionData = {
      ...existingVersion,
      ...versionData,
      updatedAt: new Date(),
    };

    this.versions.set(id, updatedVersion);

    // Si cette version était active mais ne l'est plus, trouver une nouvelle version active
    if (
      existingVersion.isActive &&
      !updatedVersion.isActive &&
      this.activeVersionId === id
    ) {
      this.activeVersionId = null;
      this.findActiveVersion();
    }

    return updatedVersion;
  }

  /**
   * Définit le mode boutique pour la version active
   */
  async setShopMode(mode: ShopMode): Promise<void> {
    if (this.activeVersionId === null) {
      // Si aucune version active, en créer une nouvelle
      await this.createVersion({
        shopMode: mode,
        themeDecoration: "none",
        isActive: true,
      });
    } else {
      // Mettre à jour la version active
      const activeVersion = this.versions.get(this.activeVersionId);
      if (activeVersion) {
        this.versions.set(this.activeVersionId, {
          ...activeVersion,
          shopMode: mode,
          updatedAt: new Date(),
        });
      }
    }
  }

  /**
   * Définit la décoration thématique pour la version active
   */
  async setThemeDecoration(decoration: ThemeDecoration): Promise<void> {
    if (this.activeVersionId === null) {
      // Si aucune version active, en créer une nouvelle
      await this.createVersion({
        shopMode: "focus",
        themeDecoration: decoration,
        isActive: true,
      });
    } else {
      // Mettre à jour la version active
      const activeVersion = this.versions.get(this.activeVersionId);
      if (activeVersion) {
        this.versions.set(this.activeVersionId, {
          ...activeVersion,
          themeDecoration: decoration,
          updatedAt: new Date(),
        });
      }
    }
  }

  /**
   * Active une version spécifique
   */
  async activateVersion(id: number): Promise<boolean> {
    const version = this.versions.get(id);
    if (!version) return false;

    this.deactivateAllVersions();

    this.versions.set(id, {
      ...version,
      isActive: true,
      updatedAt: new Date(),
    });

    this.activeVersionId = id;
    return true;
  }

  /**
   * Définit la version active (alias de activateVersion)
   */
  async setActiveVersion(id: number): Promise<boolean> {
    return this.activateVersion(id);
  }

  /**
   * Désactive toutes les versions
   */
  private deactivateAllVersions() {
    for (const [id, version] of this.versions.entries()) {
      if (version.isActive) {
        this.versions.set(id, {
          ...version,
          isActive: false,
          updatedAt: new Date(),
        });
      }
    }
    this.activeVersionId = null;
  }

  /**
   * Supprime une version
   */
  async deleteVersion(id: number): Promise<boolean> {
    const version = this.versions.get(id);
    if (!version) return false;

    // Empêcher la suppression de la version active
    if (version.isActive) {
      throw new Error("Impossible de supprimer la version active");
    }

    this.versions.delete(id);
    return true;
  }

  /**
   * Récupère le thème actuel (alias de getThemeDecoration)
   */
  async getCurrentTheme(): Promise<string> {
    return this.getThemeDecoration();
  }

  /**
   * Récupère les décorations actuelles
   */
  async getCurrentDecorations(): Promise<Record<string, any>> {
    const activeVersion = await this.getActiveVersion();
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
   * Récupère le mode boutique actuel (alias de getShopMode)
   */
  async getCurrentShopMode(): Promise<string> {
    return this.getShopMode();
  }

  /**
   * Met à jour le thème (alias de setThemeDecoration)
   */
  async updateTheme(theme: string): Promise<void> {
    await this.setThemeDecoration(theme as ThemeDecoration);
  }

  /**
   * Met à jour les décorations
   */
  async updateDecorations(decorations: Record<string, any>): Promise<void> {
    // Extraire la décoration de l'objet decorations si disponible
    if (decorations.decoration) {
      await this.setThemeDecoration(decorations.decoration as ThemeDecoration);
    }
  }

  /**
   * Met à jour le mode boutique (alias de setShopMode)
   */
  async updateShopMode(mode: string): Promise<void> {
    await this.setShopMode(mode as ShopMode);
  }
}

// Exporter une instance unique
export const versionStorage = new VersionStorage();
