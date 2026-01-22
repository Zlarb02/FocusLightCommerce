import { Router, Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { handleError, requireAuth } from "../middleware/middlewares.js";
import { storage } from "../storage/index.js";

const router = Router();

// Schémas de validation
const slideSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  order: z.number().int().positive(),
});

const sliderConfigSchema = z.object({
  featuredProductId: z.number().int().positive(),
  autoPlayInterval: z.number().int().min(1000).max(10000).default(3500),
  slides: z.array(slideSchema),
});

const addSlideSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});

const updateSlideSchema = z.object({
  url: z.string().min(1).optional(),
  alt: z.string().min(1).optional(),
});

// Chemin vers le fichier de configuration du slider
const SLIDER_CONFIG_PATH = path.join(process.cwd(), "data", "sliderConfig.json");

// Fonction utilitaire pour lire la configuration
function readSliderConfig() {
  try {
    const data = fs.readFileSync(SLIDER_CONFIG_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lors de la lecture de la config slider:", error);
    return {
      featuredProductId: 1,
      autoPlayInterval: 3500,
      slides: [],
    };
  }
}

// Fonction utilitaire pour écrire la configuration
function writeSliderConfig(config: any) {
  try {
    const dir = path.dirname(SLIDER_CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      SLIDER_CONFIG_PATH,
      JSON.stringify(config, null, 2),
      "utf8"
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de l'écriture de la config slider:", error);
    return false;
  }
}

// Route publique - récupérer la config du slider avec le nom du produit
router.get("/config", async (req: Request, res: Response) => {
  try {
    const config = readSliderConfig();

    // Récupérer le nom du produit depuis la base de données
    let productName = "Lampe Focus.01"; // Valeur par défaut
    try {
      const product = await storage.getProductById(config.featuredProductId);
      if (product) {
        productName = product.name;
      }
    } catch (err) {
      console.warn("Impossible de récupérer le produit vedette:", err);
    }

    res.json({
      ...config,
      productName,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - mettre à jour la config complète
router.put("/config", requireAuth, async (req: Request, res: Response) => {
  try {
    const data = sliderConfigSchema.parse(req.body);

    const success = writeSliderConfig(data);

    if (success) {
      res.json({ message: "Configuration mise à jour avec succès", config: data });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - ajouter un slide
router.post("/slides", requireAuth, async (req: Request, res: Response) => {
  try {
    const data = addSlideSchema.parse(req.body);
    const config = readSliderConfig();

    // Calculer le nouvel ordre (max + 1)
    const maxOrder = config.slides.length > 0
      ? Math.max(...config.slides.map((s: any) => s.order))
      : 0;

    const newSlide = {
      url: data.url,
      alt: data.alt,
      order: maxOrder + 1,
    };

    config.slides.push(newSlide);

    const success = writeSliderConfig(config);

    if (success) {
      res.json({ message: "Slide ajouté avec succès", slide: newSlide, config });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - modifier un slide par son ordre
router.put("/slides/:order", requireAuth, async (req: Request, res: Response) => {
  try {
    const order = parseInt(req.params.order);
    const data = updateSlideSchema.parse(req.body);
    const config = readSliderConfig();

    const slideIndex = config.slides.findIndex((s: any) => s.order === order);

    if (slideIndex === -1) {
      res.status(404).json({ error: "Slide non trouvé" });
      return;
    }

    config.slides[slideIndex] = {
      ...config.slides[slideIndex],
      ...data,
    };

    const success = writeSliderConfig(config);

    if (success) {
      res.json({
        message: "Slide mis à jour avec succès",
        slide: config.slides[slideIndex],
        config,
      });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - supprimer un slide
router.delete("/slides/:order", requireAuth, async (req: Request, res: Response) => {
  try {
    const order = parseInt(req.params.order);
    const config = readSliderConfig();

    const slideIndex = config.slides.findIndex((s: any) => s.order === order);

    if (slideIndex === -1) {
      res.status(404).json({ error: "Slide non trouvé" });
      return;
    }

    config.slides.splice(slideIndex, 1);

    // Réordonner les slides restants
    config.slides.forEach((slide: any, index: number) => {
      slide.order = index + 1;
    });

    const success = writeSliderConfig(config);

    if (success) {
      res.json({ message: "Slide supprimé avec succès", config });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - réordonner les slides
router.put("/reorder", requireAuth, async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      res.status(400).json({ error: "Un tableau d'ordres est requis" });
      return;
    }

    const config = readSliderConfig();

    // Vérifier que tous les ordres sont valides
    const currentOrders = config.slides.map((s: any) => s.order);
    const allValid = orders.every((o: number) => currentOrders.includes(o));

    if (!allValid || orders.length !== config.slides.length) {
      res.status(400).json({ error: "Ordres invalides" });
      return;
    }

    // Créer un mapping des slides par ancien ordre
    const slideMap = new Map();
    config.slides.forEach((slide: any) => {
      slideMap.set(slide.order, slide);
    });

    // Réordonner
    config.slides = orders.map((oldOrder: number, index: number) => ({
      ...slideMap.get(oldOrder),
      order: index + 1,
    }));

    const success = writeSliderConfig(config);

    if (success) {
      res.json({ message: "Slides réordonnés avec succès", config });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - mettre à jour le produit vedette
router.put("/featured-product", requireAuth, async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    if (!productId || typeof productId !== "number") {
      res.status(400).json({ error: "productId requis et doit être un nombre" });
      return;
    }

    // Vérifier que le produit existe
    const product = await storage.getProductById(productId);
    if (!product) {
      res.status(404).json({ error: "Produit non trouvé" });
      return;
    }

    const config = readSliderConfig();
    config.featuredProductId = productId;

    const success = writeSliderConfig(config);

    if (success) {
      res.json({
        message: "Produit vedette mis à jour",
        featuredProductId: productId,
        productName: product.name,
        config,
      });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - mettre à jour l'intervalle auto-play
router.put("/autoplay", requireAuth, async (req: Request, res: Response) => {
  try {
    const { interval } = req.body;

    if (!interval || typeof interval !== "number" || interval < 1000 || interval > 10000) {
      res.status(400).json({ error: "Intervalle invalide (1000-10000ms)" });
      return;
    }

    const config = readSliderConfig();
    config.autoPlayInterval = interval;

    const success = writeSliderConfig(config);

    if (success) {
      res.json({ message: "Intervalle mis à jour", autoPlayInterval: interval, config });
    } else {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
