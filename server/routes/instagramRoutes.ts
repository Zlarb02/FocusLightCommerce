import { Router, Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { handleError, requireAuth } from "../middleware/middlewares.js";

const router = Router();

const postSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  order: z.number().int().positive(),
});

const feedSchema = z.object({
  profileUrl: z.string().min(1),
  posts: z.array(postSchema),
});

const addPostSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});

const updatePostSchema = z.object({
  url: z.string().min(1).optional(),
  alt: z.string().min(1).optional(),
});

const FEED_PATH = path.join(process.cwd(), "data", "instagramFeed.json");

const DEFAULT_FEED = {
  profileUrl: "https://www.instagram.com/alto_lille/",
  posts: [] as Array<z.infer<typeof postSchema>>,
};

function readFeed() {
  try {
    return JSON.parse(fs.readFileSync(FEED_PATH, "utf8"));
  } catch (error) {
    console.error("Erreur lors de la lecture du feed Instagram:", error);
    return { ...DEFAULT_FEED };
  }
}

function writeFeed(feed: any) {
  try {
    const dir = path.dirname(FEED_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'écriture du feed Instagram:", error);
    return false;
  }
}

// Route publique - le feed affiché sur les pages Studio / Fabrication / Sur-mesure
router.get("/feed", (_req: Request, res: Response) => {
  try {
    const feed = readFeed();
    const posts = [...(feed.posts ?? [])].sort(
      (a: any, b: any) => a.order - b.order
    );
    res.json({ ...feed, posts });
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - remplacer le feed complet
router.put("/feed", requireAuth, (req: Request, res: Response) => {
  try {
    const data = feedSchema.parse(req.body);
    if (!writeFeed(data)) {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      return;
    }
    res.json({ message: "Feed Instagram mis à jour", feed: data });
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - ajouter une photo (le feed n'est pas limité à 3)
router.post("/posts", requireAuth, (req: Request, res: Response) => {
  try {
    const data = addPostSchema.parse(req.body);
    const feed = readFeed();

    const maxOrder = feed.posts.length
      ? Math.max(...feed.posts.map((p: any) => p.order))
      : 0;
    const newPost = { url: data.url, alt: data.alt, order: maxOrder + 1 };
    feed.posts.push(newPost);

    if (!writeFeed(feed)) {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      return;
    }
    res.json({ message: "Photo ajoutée", post: newPost, feed });
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - modifier une photo
router.put("/posts/:order", requireAuth, (req: Request, res: Response) => {
  try {
    const order = parseInt(req.params.order, 10);
    const data = updatePostSchema.parse(req.body);
    const feed = readFeed();

    const index = feed.posts.findIndex((p: any) => p.order === order);
    if (index === -1) {
      res.status(404).json({ error: "Photo non trouvée" });
      return;
    }

    feed.posts[index] = { ...feed.posts[index], ...data };

    if (!writeFeed(feed)) {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      return;
    }
    res.json({ message: "Photo mise à jour", post: feed.posts[index], feed });
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - supprimer une photo
router.delete("/posts/:order", requireAuth, (req: Request, res: Response) => {
  try {
    const order = parseInt(req.params.order, 10);
    const feed = readFeed();

    const index = feed.posts.findIndex((p: any) => p.order === order);
    if (index === -1) {
      res.status(404).json({ error: "Photo non trouvée" });
      return;
    }

    feed.posts.splice(index, 1);
    feed.posts.forEach((post: any, i: number) => {
      post.order = i + 1;
    });

    if (!writeFeed(feed)) {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      return;
    }
    res.json({ message: "Photo supprimée", feed });
  } catch (error) {
    handleError(res, error);
  }
});

// Route admin - réordonner les photos
router.put("/reorder", requireAuth, (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      res.status(400).json({ error: "Un tableau d'ordres est requis" });
      return;
    }

    const feed = readFeed();
    const currentOrders = feed.posts.map((p: any) => p.order);
    const allValid =
      orders.length === feed.posts.length &&
      orders.every((o: number) => currentOrders.includes(o));

    if (!allValid) {
      res.status(400).json({ error: "Ordres invalides" });
      return;
    }

    const byOrder = new Map(feed.posts.map((p: any) => [p.order, p]));
    feed.posts = orders.map((oldOrder: number, index: number) => ({
      ...(byOrder.get(oldOrder) as object),
      order: index + 1,
    }));

    if (!writeFeed(feed)) {
      res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      return;
    }
    res.json({ message: "Photos réordonnées", feed });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
