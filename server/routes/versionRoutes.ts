import express from "express";
import { storage } from "../storage/index.js";
import { SiteVersionData } from "../storage/versionStorage.js";
import { ThemeDecoration, ShopMode } from "../../shared/schema.js";
import { isAdmin } from "../middleware/middlewares.js";

const router = express.Router();

// Récupérer toutes les versions
router.get("/all", isAdmin, async (req, res) => {
  try {
    const versions = await storage.getAllVersions();
    res.json(versions);
  } catch (error) {
    console.error("Erreur lors de la récupération des versions:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer la version active et ses informations
router.get("/", async (req, res) => {
  try {
    const activeVersion = await storage.getActiveVersion();
    res.json(
      activeVersion || {
        shopMode: "focus",
        themeDecoration: "none",
        isActive: true,
      }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la version active:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer uniquement le mode boutique
router.get("/shop-mode", async (req, res) => {
  try {
    const activeVersion = await storage.getActiveVersion();
    res.json({ shopMode: activeVersion?.shopMode || "focus" });
  } catch (error) {
    console.error("Erreur lors de la récupération du mode boutique:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer uniquement la décoration thématique
router.get("/theme-decoration", async (req, res) => {
  try {
    const activeVersion = await storage.getActiveVersion();
    res.json({ themeDecoration: activeVersion?.themeDecoration || "none" });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la décoration thématique:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour les paramètres (requiert authentification admin)
router.put("/", isAdmin, async (req, res) => {
  try {
    if (!req.body.id) {
      // Création d'une nouvelle version
      const newVersion = await storage.createVersion(
        req.body as Omit<SiteVersionData, "id" | "createdAt" | "updatedAt">
      );
      res.json(newVersion);
    } else {
      // Mise à jour d'une version existante
      const updatedVersion = await storage.updateVersion(
        req.body as Partial<SiteVersionData> & { id: number }
      );
      res.json(updatedVersion);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour uniquement le mode boutique (requiert authentification admin)
router.put("/shop-mode", isAdmin, async (req, res) => {
  try {
    const { mode } = req.body;

    if (mode !== "general" && mode !== "focus") {
      res.status(400).json({ message: "Mode invalide" });
      return;
    }

    await storage.setShopMode(mode);
    res.json({ shopMode: mode });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mode boutique:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour uniquement la décoration thématique (requiert authentification admin)
router.put("/theme-decoration", isAdmin, async (req, res) => {
  try {
    const { decoration } = req.body;
    const validDecorations: ThemeDecoration[] = [
      "none",
      "summer-sale",
      "halloween",
      "christmas",
      "april-fools",
    ];

    if (!validDecorations.includes(decoration as ThemeDecoration)) {
      res.status(400).json({ message: "Décoration invalide" });
      return;
    }

    await storage.setThemeDecoration(decoration as ThemeDecoration);
    res.json({ themeDecoration: decoration });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la décoration thématique:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
