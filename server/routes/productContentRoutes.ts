import { Router, Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { handleError, requireAuth } from "../middleware/middlewares.js";

const router = Router();

// Schémas de validation
const sectionItemSchema = z.object({
  icon: z.string().optional(),
  titleKey: z.string().optional(),
  textKey: z.string().optional(),
  labelKey: z.string().optional(),
  valueKey: z.string().optional(),
});

const sectionSchema = z.object({
  id: z.string(),
  type: z.enum(["features", "details", "specifications", "elfsight", "custom"]),
  enabled: z.boolean(),
  items: z.array(sectionItemSchema).optional(),
  cards: z.array(sectionItemSchema).optional(),
  widgetId: z.string().optional(),
  customContent: z.string().optional(),
});

const productContentSchema = z.object({
  sections: z.array(sectionSchema),
  images: z.record(z.string()).optional(),
});

// Chemin vers le fichier de contenu produits
const PRODUCT_CONTENT_PATH = path.join(process.cwd(), "data", "productContent.json");

// Fonction utilitaire pour lire le contenu
function readProductContent(): Record<string, any> {
  try {
    const data = fs.readFileSync(PRODUCT_CONTENT_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lors de la lecture du contenu produits:", error);
    return {};
  }
}

// Fonction utilitaire pour écrire le contenu
function writeProductContent(content: Record<string, any>): boolean {
  try {
    const dir = path.dirname(PRODUCT_CONTENT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      PRODUCT_CONTENT_PATH,
      JSON.stringify(content, null, 2),
      "utf8"
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de l'écriture du contenu produits:", error);
    return false;
  }
}

// Route publique - récupérer le contenu d'un produit
router.get("/:productId/content", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const content = readProductContent();

    if (!content[productId]) {
      // Retourner un contenu par défaut vide pour les nouveaux produits
      res.json({
        sections: [],
        images: {},
      });
      return;
    }

    res.json(content[productId]);
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - mettre à jour le contenu complet d'un produit
router.put("/:productId/content", requireAuth, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const data = productContentSchema.parse(req.body);
    const content = readProductContent();

    content[productId] = data;

    const success = writeProductContent(content);

    if (success) {
      res.json({
        message: "Contenu produit mis à jour avec succès",
        content: content[productId],
      });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - activer/désactiver une section
router.put("/:productId/content/sections/:sectionId/toggle", requireAuth, async (req: Request, res: Response) => {
  try {
    const { productId, sectionId } = req.params;
    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      res.status(400).json({ error: "enabled doit être un booléen" });
      return;
    }

    const content = readProductContent();

    if (!content[productId]) {
      res.status(404).json({ error: "Produit non trouvé" });
      return;
    }

    const sectionIndex = content[productId].sections.findIndex(
      (s: any) => s.id === sectionId
    );

    if (sectionIndex === -1) {
      res.status(404).json({ error: "Section non trouvée" });
      return;
    }

    content[productId].sections[sectionIndex].enabled = enabled;

    const success = writeProductContent(content);

    if (success) {
      res.json({
        message: "Section mise à jour",
        section: content[productId].sections[sectionIndex],
      });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - ajouter une section
router.post("/:productId/content/sections", requireAuth, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const section = sectionSchema.parse(req.body);
    const content = readProductContent();

    if (!content[productId]) {
      content[productId] = {
        sections: [],
        images: {},
      };
    }

    // Vérifier si l'ID existe déjà
    const existingIndex = content[productId].sections.findIndex(
      (s: any) => s.id === section.id
    );

    if (existingIndex !== -1) {
      res.status(400).json({ error: "Une section avec cet ID existe déjà" });
      return;
    }

    content[productId].sections.push(section);

    const success = writeProductContent(content);

    if (success) {
      res.json({
        message: "Section ajoutée avec succès",
        section,
      });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - modifier une section
router.put("/:productId/content/sections/:sectionId", requireAuth, async (req: Request, res: Response) => {
  try {
    const { productId, sectionId } = req.params;
    const section = sectionSchema.parse(req.body);
    const content = readProductContent();

    if (!content[productId]) {
      res.status(404).json({ error: "Produit non trouvé" });
      return;
    }

    const sectionIndex = content[productId].sections.findIndex(
      (s: any) => s.id === sectionId
    );

    if (sectionIndex === -1) {
      res.status(404).json({ error: "Section non trouvée" });
      return;
    }

    content[productId].sections[sectionIndex] = section;

    const success = writeProductContent(content);

    if (success) {
      res.json({
        message: "Section mise à jour avec succès",
        section,
      });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - supprimer une section
router.delete("/:productId/content/sections/:sectionId", requireAuth, async (req: Request, res: Response) => {
  try {
    const { productId, sectionId } = req.params;
    const content = readProductContent();

    if (!content[productId]) {
      res.status(404).json({ error: "Produit non trouvé" });
      return;
    }

    const sectionIndex = content[productId].sections.findIndex(
      (s: any) => s.id === sectionId
    );

    if (sectionIndex === -1) {
      res.status(404).json({ error: "Section non trouvée" });
      return;
    }

    content[productId].sections.splice(sectionIndex, 1);

    const success = writeProductContent(content);

    if (success) {
      res.json({ message: "Section supprimée avec succès" });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - récupérer tous les contenus produits
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const content = readProductContent();
    res.json(content);
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
