import { Router, Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { handleError } from "../middleware/middlewares.js";

const router = Router();

// Schémas de validation
const updateTranslationSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  language: z.enum(["fr", "en"]),
});

const addTranslationSchema = z.object({
  key: z.string().min(1),
  fr: z.string(),
  en: z.string(),
});

const updateBulkTranslationsSchema = z.array(
  z.object({
    key: z.string().min(1),
    value: z.string(),
    language: z.enum(["fr", "en"]),
  })
);

// Chemin vers le fichier de traductions
const TRANSLATIONS_PATH = path.join(
  process.cwd(),
  "../client/src/contexts/translations.json"
);

// Fonction utilitaire pour lire les traductions
function readTranslations() {
  try {
    const data = fs.readFileSync(TRANSLATIONS_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lors de la lecture des traductions:", error);
    return { fr: {}, en: {} };
  }
}

// Fonction utilitaire pour écrire les traductions
function writeTranslations(translations: any) {
  try {
    fs.writeFileSync(
      TRANSLATIONS_PATH,
      JSON.stringify(translations, null, 2),
      "utf8"
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de l'écriture des traductions:", error);
    return false;
  }
}

// Handlers
const getAllTranslationsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 50, search = "" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const searchTerm = (search as string).toLowerCase();

    const translations = readTranslations();

    // Convertir en tableau pour faciliter la pagination
    const translationsArray: Array<{ key: string; fr: string; en: string }> =
      [];
    const frTranslations = translations.fr || {};
    const enTranslations = translations.en || {};

    const allKeys = new Set([
      ...Object.keys(frTranslations),
      ...Object.keys(enTranslations),
    ]);

    allKeys.forEach((key) => {
      const frValue = frTranslations[key] || "";
      const enValue = enTranslations[key] || "";

      // Filtrer par recherche si un terme est fourni
      if (
        !searchTerm ||
        key.toLowerCase().includes(searchTerm) ||
        frValue.toLowerCase().includes(searchTerm) ||
        enValue.toLowerCase().includes(searchTerm)
      ) {
        translationsArray.push({
          key,
          fr: frValue,
          en: enValue,
        });
      }
    });

    // Trier par clé
    translationsArray.sort((a, b) => a.key.localeCompare(b.key));

    // Calculer la pagination
    const total = translationsArray.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedTranslations = translationsArray.slice(startIndex, endIndex);

    res.json({
      translations: paginatedTranslations,
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

const updateSingleTranslationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key, value, language } = updateTranslationSchema.parse(req.body);

    const translations = readTranslations();

    if (!translations[language]) {
      translations[language] = {};
    }

    translations[language][key] = value;

    const success = writeTranslations(translations);

    if (success) {
      res.json({ message: "Traduction mise à jour avec succès" });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const updateBulkTranslationsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updates = updateBulkTranslationsSchema.parse(req.body);

    const translations = readTranslations();

    updates.forEach(({ key, value, language }) => {
      if (!translations[language]) {
        translations[language] = {};
      }
      translations[language][key] = value;
    });

    const success = writeTranslations(translations);

    if (success) {
      res.json({ message: "Traductions mises à jour avec succès" });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const addTranslationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key, fr, en } = addTranslationSchema.parse(req.body);

    const translations = readTranslations();

    // Vérifier si la clé existe déjà
    if (translations.fr[key] || translations.en[key]) {
      res.status(400).json({ error: "Cette clé de traduction existe déjà" });
      return;
    }

    translations.fr[key] = fr;
    translations.en[key] = en;

    const success = writeTranslations(translations);

    if (success) {
      res.json({ message: "Traduction ajoutée avec succès" });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const deleteTranslationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key } = req.params;

    if (!key) {
      res.status(400).json({ error: "Clé de traduction requise" });
      return;
    }

    const translations = readTranslations();

    // Supprimer la clé dans toutes les langues
    delete translations.fr[key];
    delete translations.en[key];

    const success = writeTranslations(translations);

    if (success) {
      res.json({ message: "Traduction supprimée avec succès" });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const updateFullTranslationsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newTranslations = req.body;

    // Validation basique
    if (!newTranslations || typeof newTranslations !== "object") {
      res.status(400).json({ error: "Format de données invalide" });
      return;
    }

    // Headers pour gros payloads
    res.setHeader("Content-Type", "application/json");
    
    const success = writeTranslations(newTranslations);

    if (success) {
      res.json({ message: "Fichier de traductions mis à jour avec succès" });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const getFullTranslationsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const translations = readTranslations();
    res.json(translations);
  } catch (error) {
    handleError(res, error);
  }
};

const getTranslationStatsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const translations = readTranslations();
    const frKeys = Object.keys(translations.fr || {});
    const enKeys = Object.keys(translations.en || {});
    const allKeys = new Set([...frKeys, ...enKeys]);

    const stats = {
      totalKeys: allKeys.size,
      frTranslations: frKeys.length,
      enTranslations: enKeys.length,
      missingFr: enKeys.filter((key) => !translations.fr?.[key]).length,
      missingEn: frKeys.filter((key) => !translations.en?.[key]).length,
    };

    res.json(stats);
  } catch (error) {
    handleError(res, error);
  }
};

const searchTranslationsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Paramètre de recherche requis" });
      return;
    }

    const translations = readTranslations();
    const results: any = { fr: {}, en: {} };

    const searchTerm = q.toLowerCase();

    // Rechercher dans les clés et valeurs françaises
    Object.entries(translations.fr).forEach(([key, value]) => {
      if (
        key.toLowerCase().includes(searchTerm) ||
        (value as string).toLowerCase().includes(searchTerm)
      ) {
        results.fr[key] = value;
        results.en[key] = translations.en[key] || "";
      }
    });

    // Rechercher dans les valeurs anglaises (si pas déjà trouvé)
    Object.entries(translations.en).forEach(([key, value]) => {
      if (
        !results.fr[key] &&
        (value as string).toLowerCase().includes(searchTerm)
      ) {
        results.fr[key] = translations.fr[key] || "";
        results.en[key] = value;
      }
    });

    res.json(results);
  } catch (error) {
    handleError(res, error);
  }
};

// Routes
router.get("/", getAllTranslationsHandler);
router.get("/full", getFullTranslationsHandler);
router.get("/stats", getTranslationStatsHandler);
router.put("/single", updateSingleTranslationHandler);
router.put("/bulk", updateBulkTranslationsHandler);
router.post("/", addTranslationHandler);
router.delete("/:key", deleteTranslationHandler);
router.put("/full", updateFullTranslationsHandler);
router.get("/search", searchTranslationsHandler);

// Routes publiques (pas d'authentification requise)
router.get("/public", async (req: Request, res: Response) => {
  try {
    const translations = readTranslations();

    // Retourner seulement les traductions, pas les détails internes
    res.json({
      fr: translations.fr || {},
      en: translations.en || {},
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Route publique pour le JSON complet (utile pour téléchargement ou backup)
router.get("/public/full", async (req: Request, res: Response) => {
  try {
    const translations = readTranslations();

    // Augmenter la limite de taille pour les gros JSON
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'inline; filename="translations.json"');
    
    // Augmenter les limites pour les gros JSON
    res.setHeader("Content-Length", JSON.stringify(translations).length.toString());
    
    res.json(translations);
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
