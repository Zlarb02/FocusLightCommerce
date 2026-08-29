import { Router, Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { handleError, requireAuth } from "../middleware/middlewares.js";

const router = Router();

/**
 * Couleurs produit : le nom d'une variation (« Bleu », « Vert olive »…) et la
 * pastille qui l'illustre sur la fiche produit.
 *
 * Même principe que les pages annexes : le contenu vit dans
 * `data/productColors.json`, sur le volume Docker, et s'édite depuis la gestion.
 * Ajouter une couleur au catalogue ne demande donc plus de livrer du code.
 */
const colorSchema = z.object({
  // Un chemin de média (`/uploads/…`) ou un fichier du dossier public.
  swatchUrl: z.string().trim().default(""),
  // Aplat de repli, utilisé tant qu'aucune pastille n'est fournie.
  hex: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Couleur hexadécimale attendue (ex : #F97316)")
    .optional()
    .or(z.literal("")),
});

const PRODUCT_COLORS_PATH = path.join(
  process.cwd(),
  "data",
  "productColors.json"
);

function readColors(): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(PRODUCT_COLORS_PATH, "utf8"));
  } catch (error) {
    console.error("Erreur lors de la lecture des couleurs produit:", error);
    return {};
  }
}

function writeColors(colors: Record<string, unknown>): boolean {
  try {
    const dir = path.dirname(PRODUCT_COLORS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      PRODUCT_COLORS_PATH,
      JSON.stringify(colors, null, 2) + "\n",
      "utf8"
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de l'écriture des couleurs produit:", error);
    return false;
  }
}

// Route publique - tout le registre (la boutique s'en sert à chaque page)
router.get("/", async (_req: Request, res: Response) => {
  try {
    res.json(readColors());
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - créer ou modifier une couleur
router.put("/:name", requireAuth, async (req: Request, res: Response) => {
  try {
    const name = req.params.name.trim();
    if (!name) {
      res.status(400).json({ error: "Nom de couleur manquant" });
      return;
    }

    const data = colorSchema.parse(req.body);
    const colors = readColors();
    colors[name] = {
      swatchUrl: data.swatchUrl,
      ...(data.hex ? { hex: data.hex } : {}),
    };

    if (!writeColors(colors)) {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      return;
    }

    res.json({ message: "Couleur enregistrée", name, color: colors[name] });
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - supprimer une couleur du registre
router.delete("/:name", requireAuth, async (req: Request, res: Response) => {
  try {
    const name = req.params.name.trim();
    const colors = readColors();
    if (!(name in colors)) {
      res.status(404).json({ error: "Couleur introuvable" });
      return;
    }
    delete colors[name];

    if (!writeColors(colors)) {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      return;
    }

    res.json({ message: "Couleur supprimée", name });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
