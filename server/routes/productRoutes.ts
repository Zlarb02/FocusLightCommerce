import { Router, Request, Response } from "express";
import { storage } from "../storage/index.js";
import { insertProductSchema } from "../../shared/schema.js";
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

// Routes
router.get("/", getAllProductsHandler);
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

export default router;
