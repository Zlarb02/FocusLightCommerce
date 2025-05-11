import { Router, Request, Response } from "express";
import { storage } from "../storage/index.js";
import {
  insertProductSchema,
  insertProductVariationSchema,
} from "../../shared/schema.js";
import { handleError, requireAuth } from "../middleware/middlewares.js";

const router = Router();

// Handlers
const getProductHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await storage.getProductById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
};

const getAllProductsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await storage.getAllProducts();
    res.json(products);
  } catch (error) {
    handleError(res, error);
  }
};

// Handlers pour les variations
const getProductVariationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const variation = await storage.getProductVariationById(id);
    if (!variation) {
      res.status(404).json({ message: "Product variation not found" });
      return;
    }
    res.json(variation);
  } catch (error) {
    handleError(res, error);
  }
};

const getProductsByVariationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, value } = req.query;
    if (!type || !value) {
      res.status(400).json({ message: "Type and value are required" });
      return;
    }
    const products = await storage.getProductsByVariation(
      type.toString(),
      value.toString()
    );
    res.json(products);
  } catch (error) {
    handleError(res, error);
  }
};

// Routes
router.get("/", getAllProductsHandler);
router.get("/variation/:id", getProductVariationHandler);
router.get("/by-variation", getProductsByVariationHandler);
router.get("/:id", getProductHandler);

router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      handleError(res, error);
    }
  }
);

router.put(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, data);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error) {
      handleError(res, error);
    }
  }
);

router.delete(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  }
);

// Routes pour les variations
router.post(
  "/variation",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data = insertProductVariationSchema.parse(req.body);
      const variation = await storage.createProductVariation(data);
      res.status(201).json(variation);
    } catch (error) {
      handleError(res, error);
    }
  }
);

router.put(
  "/variation/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = insertProductVariationSchema.partial().parse(req.body);
      const variation = await storage.updateProductVariation(id, data);
      if (!variation) {
        res.status(404).json({ message: "Product variation not found" });
        return;
      }
      res.json(variation);
    } catch (error) {
      handleError(res, error);
    }
  }
);

router.put(
  "/variation/:id/stock",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { stock } = req.body;
      if (stock === undefined) {
        res.status(400).json({ message: "Stock quantity is required" });
        return;
      }
      const variation = await storage.updateVariationStock(id, stock);
      if (!variation) {
        res.status(404).json({ message: "Product variation not found" });
        return;
      }
      res.json(variation);
    } catch (error) {
      handleError(res, error);
    }
  }
);

router.delete(
  "/variation/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProductVariation(id);
      if (!deleted) {
        res.status(404).json({ message: "Product variation not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  }
);

export default router;
