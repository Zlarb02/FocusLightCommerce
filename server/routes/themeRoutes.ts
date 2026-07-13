import { Router, Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { handleError, requireAuth } from "../middleware/middlewares.js";

const router = Router();

/**
 * Réglages d'apparence, éditables depuis /gestion → Apparence.
 *
 * - `trueDark` : le thème sombre de la maquette a un fond BRUN (#4A2020). Cette
 *   option le remplace par un sombre neutre quasi noir, pour qui attend un
 *   sombre franc. Défaut : la maquette.
 * - `brownFooterOnFabrication` : la maquette met un footer BRUN sur la seule
 *   variante Fabrication desktop clair (web-11) — le même artboard en sombre
 *   (web-14) et sa version mobile (iphone-5) l'ont bleu. Intention ou
 *   étourderie : on laisse Anatole trancher. Défaut : la maquette.
 */
const themeConfigSchema = z.object({
  trueDark: z.boolean(),
  brownFooterOnFabrication: z.boolean(),
});

export type ThemeConfig = z.infer<typeof themeConfigSchema>;

const DEFAULTS: ThemeConfig = {
  trueDark: false,
  brownFooterOnFabrication: true,
};

const THEME_CONFIG_PATH = path.join(process.cwd(), "data", "themeConfig.json");

function readThemeConfig(): ThemeConfig {
  try {
    const raw = fs.readFileSync(THEME_CONFIG_PATH, "utf8");
    // Un fichier incomplet ne doit pas casser le site : on complète par défaut.
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (error) {
    console.error("Erreur lors de la lecture de la config thème:", error);
    return DEFAULTS;
  }
}

function writeThemeConfig(config: ThemeConfig): boolean {
  try {
    const dir = path.dirname(THEME_CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(THEME_CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'écriture de la config thème:", error);
    return false;
  }
}

// Route publique — lue par le site à chaque chargement
router.get("/config", (_req: Request, res: Response) => {
  try {
    res.json(readThemeConfig());
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin — mise à jour depuis /gestion
router.put("/config", requireAuth, (req: Request, res: Response) => {
  try {
    const config = themeConfigSchema.parse(req.body);

    if (!writeThemeConfig(config)) {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      return;
    }

    res.json({ message: "Apparence mise à jour", config });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
