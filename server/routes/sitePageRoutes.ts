import { Router, Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { handleError, requireAuth } from "../middleware/middlewares.js";

const router = Router();

/**
 * Pages annexes (Livraison, Retours, FAQ, Mentions légales, Politique de
 * confidentialité, CGV).
 *
 * Le contenu vit dans `data/sitePages.json`, sur le même modèle que les
 * traductions et le contenu produit : une suite de blocs bilingues qu'Anatole
 * ajoute, réordonne et supprime depuis la gestion, sans toucher au code.
 */

// Un texte est toujours bilingue ; l'anglais peut rester vide, le rendu
// retombe alors sur le français.
const phraseSchema = z.object({
  fr: z.string(),
  en: z.string(),
});

const blockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: phraseSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal("paragraph"),
    text: phraseSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal("list"),
    items: z.array(phraseSchema),
  }),
  z.object({
    id: z.string(),
    type: z.literal("faq"),
    items: z.array(z.object({ question: phraseSchema, answer: phraseSchema })),
  }),
  z.object({
    id: z.string(),
    type: z.literal("callout"),
    text: phraseSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal("image"),
    src: z.string(),
    alt: phraseSchema,
  }),
]);

const pageSchema = z.object({
  slug: z.string().min(1),
  route: z.string().min(1),
  label: z.string().min(1),
  title: phraseSchema,
  blocks: z.array(blockSchema),
});

const SITE_PAGES_PATH = path.join(process.cwd(), "data", "sitePages.json");

function readPages(): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(SITE_PAGES_PATH, "utf8"));
  } catch (error) {
    console.error("Erreur lors de la lecture des pages annexes:", error);
    return {};
  }
}

function writePages(pages: Record<string, unknown>): boolean {
  try {
    const dir = path.dirname(SITE_PAGES_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      SITE_PAGES_PATH,
      JSON.stringify(pages, null, 2) + "\n",
      "utf8"
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de l'écriture des pages annexes:", error);
    return false;
  }
}

// Route publique - toutes les pages (sert aussi la liste de la gestion)
router.get("/", async (_req: Request, res: Response) => {
  try {
    res.json(readPages());
  } catch (error) {
    handleError(res, error);
  }
});

// Route publique - une page
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const page = readPages()[req.params.slug];
    if (!page) {
      res.status(404).json({ error: "Page introuvable" });
      return;
    }
    res.json(page);
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - remplacer une page
router.put("/:slug", requireAuth, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const data = pageSchema.parse({ ...req.body, slug });

    const ids = data.blocks.map((b) => b.id);
    if (new Set(ids).size !== ids.length) {
      res.status(400).json({ error: "Deux blocs portent le même identifiant" });
      return;
    }

    const pages = readPages();
    pages[slug] = data;

    if (!writePages(pages)) {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      return;
    }

    res.json({ message: "Page mise à jour", page: data });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
