import { Router, Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { handleError, requireAuth } from "../middleware/middlewares.js";

const router = Router();

// Schémas de validation
const updateIllustrationSchema = z.object({
  url: z.string().url().optional().or(z.string().min(1)),
  title: z.string().min(1),
  description: z.string().optional(),
  pages: z.array(z.string()).optional(),
  category: z.string().optional(),
});

const addIllustrationSchema = z.object({
  key: z.string().min(1),
  url: z.string().url().optional().or(z.string().min(1)),
  title: z.string().min(1),
  description: z.string().optional(),
  pages: z.array(z.string()).default([]),
  category: z.string().default("general"),
});

// Chemin vers le fichier d'illustrations
const ILLUSTRATIONS_PATH = process.env.NODE_ENV === 'production' 
  ? path.join(process.cwd(), "data", "illustrations.json")
  : path.join(process.cwd(), "../client/src/contexts/illustrations.json");

// Fonction utilitaire pour lire les illustrations
function readIllustrations() {
  try {
    const data = fs.readFileSync(ILLUSTRATIONS_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lors de la lecture des illustrations:", error);
    return {};
  }
}

// Fonction utilitaire pour écrire les illustrations
function writeIllustrations(illustrations: any) {
  try {
    // Vérifier que le répertoire existe
    const dir = path.dirname(ILLUSTRATIONS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      ILLUSTRATIONS_PATH,
      JSON.stringify(illustrations, null, 2),
      "utf8"
    );
    console.log(`Illustrations écrites avec succès : ${ILLUSTRATIONS_PATH}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'écriture des illustrations:", error);
    console.error("Chemin:", ILLUSTRATIONS_PATH);
    console.error("Permissions:", fs.constants.W_OK);
    return false;
  }
}

// Handlers
const getAllIllustrationsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 50, search = "", category = "" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const searchTerm = (search as string).toLowerCase();
    const categoryFilter = category as string;

    const illustrations = readIllustrations();

    // Convertir en tableau pour faciliter la pagination
    const illustrationsArray: Array<{
      key: string;
      url: string;
      title: string;
      description?: string;
      pages?: string[];
      category?: string;
    }> = [];

    Object.entries(illustrations).forEach(([key, data]: [string, any]) => {
      // Filtrer par recherche si un terme est fourni
      const matchesSearch =
        !searchTerm ||
        key.toLowerCase().includes(searchTerm) ||
        data.title?.toLowerCase().includes(searchTerm) ||
        data.description?.toLowerCase().includes(searchTerm) ||
        data.category?.toLowerCase().includes(searchTerm);

      // Filtrer par catégorie si spécifiée
      const matchesCategory =
        !categoryFilter || data.category === categoryFilter;

      if (matchesSearch && matchesCategory) {
        illustrationsArray.push({
          key,
          url: data.url || "",
          title: data.title || "",
          description: data.description,
          pages: data.pages || [],
          category: data.category || "general",
        });
      }
    });

    // Trier par clé
    illustrationsArray.sort((a, b) => a.key.localeCompare(b.key));

    // Calculer la pagination
    const total = illustrationsArray.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedIllustrations = illustrationsArray.slice(
      startIndex,
      endIndex
    );

    // Obtenir toutes les catégories disponibles pour le filtre
    const allCategories = [
      ...new Set(
        Object.values(illustrations)
          .map((data: any) => data.category)
          .filter(Boolean)
      ),
    ];

    res.json({
      illustrations: paginatedIllustrations,
      categories: allCategories,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

const updateIllustrationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key } = req.params;
    const data = updateIllustrationSchema.parse(req.body);

    const illustrations = readIllustrations();

    if (!illustrations[key]) {
      res.status(404).json({ error: "Illustration non trouvée" });
      return;
    }

    // Mettre à jour les données
    illustrations[key] = {
      ...illustrations[key],
      ...data,
    };

    const success = writeIllustrations(illustrations);

    if (success) {
      res.json({
        message: "Illustration mise à jour avec succès",
        illustration: illustrations[key],
      });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const addIllustrationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = addIllustrationSchema.parse(req.body);

    const illustrations = readIllustrations();

    // Vérifier si la clé existe déjà
    if (illustrations[data.key]) {
      res.status(400).json({ error: "Cette clé d'illustration existe déjà" });
      return;
    }

    illustrations[data.key] = {
      url: data.url,
      title: data.title,
      description: data.description,
      pages: data.pages,
      category: data.category,
    };

    const success = writeIllustrations(illustrations);

    if (success) {
      res.json({
        message: "Illustration ajoutée avec succès",
        illustration: illustrations[data.key],
      });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const deleteIllustrationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key } = req.params;

    const illustrations = readIllustrations();

    if (!illustrations[key]) {
      res.status(404).json({ error: "Illustration non trouvée" });
      return;
    }

    delete illustrations[key];

    const success = writeIllustrations(illustrations);

    if (success) {
      res.json({ message: "Illustration supprimée avec succès" });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const getIllustrationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key } = req.params;

    const illustrations = readIllustrations();

    if (!illustrations[key]) {
      res.status(404).json({ error: "Illustration non trouvée" });
      return;
    }

    res.json({
      key,
      ...illustrations[key],
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Handler pour mettre à jour le JSON complet des illustrations
const updateFullIllustrationsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newIllustrations = req.body;

    // Validation basique (pas de validation Zod stricte pour le JSON complet)
    if (!newIllustrations || typeof newIllustrations !== "object") {
      res.status(400).json({ error: "Format de données invalide" });
      return;
    }

    // Log de la taille pour debug
    const jsonSize = JSON.stringify(newIllustrations).length;
    console.log(`Mise à jour illustrations: ${jsonSize} bytes`);
    console.log("Clés reçues:", Object.keys(newIllustrations));

    // Headers pour gros payloads
    res.setHeader("Content-Type", "application/json");

    const success = writeIllustrations(newIllustrations);

    if (success) {
      res.json({ message: "Fichier d'illustrations mis à jour avec succès" });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    console.error("Erreur updateFullIllustrations:", error);
    handleError(res, error);
  }
};

// Routes (protégées par authentification)
router.get("/", requireAuth, getAllIllustrationsHandler);
router.get("/:key", requireAuth, getIllustrationHandler);
router.put("/:key", requireAuth, updateIllustrationHandler);
router.post("/", requireAuth, addIllustrationHandler);
router.delete("/:key", requireAuth, deleteIllustrationHandler);
router.put("/full", requireAuth, updateFullIllustrationsHandler);

// Routes publiques (pas d'authentification requise)
router.get("/public", async (req: Request, res: Response) => {
  try {
    const illustrations = readIllustrations();

    // Retourner toutes les illustrations pour utilisation publique
    res.json(illustrations);
  } catch (error) {
    handleError(res, error);
  }
});

// Route publique pour téléchargement du JSON complet
router.get("/public/full", async (req: Request, res: Response) => {
  try {
    const illustrations = readIllustrations();

    // Augmenter la limite de taille pour les gros JSON
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="illustrations.json"'
    );
    res.setHeader("Content-Length", JSON.stringify(illustrations).length.toString());

    res.json(illustrations);
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
