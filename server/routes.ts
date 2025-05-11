import express, {
  type Express,
  Request,
  Response,
  NextFunction,
} from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertProductSchema, checkoutSchema } from "../shared/schema.js";
import { z } from "zod";
import session, { MemoryStore } from "express-session";

// Extend Express Session
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      isAdmin: boolean;
    };
  }
}

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) return next();
  res.status(401).json({ message: "Unauthorized" });
};

const handleError = (res: Response, error: unknown) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: error.errors });
    return;
  }
  res.status(500).json({
    message: error instanceof Error ? error.message : "Unknown error",
  });
};

const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Ce middleware n'est plus utilisé car CORS est géré dans vite.ts
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const isProd = process.env.NODE_ENV === "production";

  // Configuration des cookies pour la production et le développement
  const cookieConfig = isProd
    ? {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      }
    : {
        httpOnly: true,
        secure: false,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      };

  app.use(
    session({
      name: "alto.sid",
      secret: process.env.SESSION_SECRET || "focus-lamp-secret",
      resave: true,
      saveUninitialized: false,
      rolling: true,
      store: new MemoryStore(),
      cookie: cookieConfig,
    })
  );

  // Products CRUD
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

  app.get("/api/products", getAllProductsHandler);
  app.get("/api/products/:id", getProductHandler);

  app.post(
    "/api/products",
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

  app.put(
    "/api/products/:id",
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

  app.delete(
    "/api/products/:id",
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

  // Checkout
  app.post(
    "/api/checkout",
    async (req: Request, res: Response): Promise<void> => {
      try {
        const data = checkoutSchema.parse(req.body);
        let customer = await storage.getCustomerByEmail(data.customer.email);
        if (!customer) {
          customer = await storage.createCustomer(data.customer);
        } else {
          customer =
            (await storage.updateCustomer(customer.id, data.customer)) ||
            customer;
        }

        const order = await storage.createOrder({
          customerId: customer.id,
          totalAmount: data.totalAmount,
          status: "pending",
        });

        await Promise.all(
          data.items.map(async (item: any) => {
            await storage.createOrderItem({
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            });
            await storage.updateProductStock(item.productId, -item.quantity);
          })
        );

        res.status(201).json({
          orderId: order.id,
          orderNumber: `FC-${new Date().getFullYear()}${order.id
            .toString()
            .padStart(4, "0")}`,
          customer,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
        });
      } catch (error) {
        handleError(res, error);
      }
    }
  );

  // Auth
  app.post(
    "/api/auth/login",
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          res
            .status(400)
            .json({ message: "Username and password are required" });
          return;
        }

        const user = await storage.verifyUser(username, password);
        if (!user) {
          res.status(401).json({ message: "Invalid credentials" });
          return;
        }

        // Log session avant
        console.log("Session avant login:", req.session);

        req.session.user = {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin ?? false,
        };

        // Force la sauvegarde de la session
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) {
              console.error("Erreur de sauvegarde de session:", err);
              reject(err);
              return;
            }
            console.log("Session après login:", req.session);
            resolve();
          });
        });

        res.json({
          ...req.session.user,
          sessionId: req.session.id,
        });
      } catch (error) {
        handleError(res, error);
      }
    }
  );

  app.post("/api/auth/logout", (req: Request, res: Response): void => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Could not log out" });
        return;
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/status", (req: Request, res: Response): void => {
    console.log("Session status:", req.session);
    if (req.session.user) {
      res.json({
        authenticated: true,
        user: req.session.user,
        sessionId: req.session.id,
      });
    } else {
      console.log("No user in session");
      res.json({
        authenticated: false,
        sessionId: req.session.id,
      });
    }
  });

  // Orders
  app.get(
    "/api/orders",
    requireAuth,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const orders = await storage.getAllOrders();
        const detailed = await Promise.all(
          orders.map(async (order) => ({
            ...order,
            customer: await storage.getCustomerById(order.customerId),
            items: await storage.getOrderItemsByOrderId(order.id),
            orderNumber: `FC-${new Date(
              order.createdAt || new Date()
            ).getFullYear()}${order.id.toString().padStart(4, "0")}`,
          }))
        );
        res.json(detailed);
      } catch (error) {
        handleError(res, error);
      }
    }
  );

  app.get(
    "/api/orders/:id",
    requireAuth,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        const order = await storage.getOrderById(id);
        if (!order) {
          res.status(404).json({ message: "Order not found" });
          return;
        }

        res.json({
          ...order,
          customer: await storage.getCustomerById(order.customerId),
          items: await storage.getOrderItemsByOrderId(order.id),
          orderNumber: `FC-${new Date(
            order.createdAt || new Date()
          ).getFullYear()}${order.id.toString().padStart(4, "0")}`,
        });
      } catch (error) {
        handleError(res, error);
      }
    }
  );

  app.put(
    "/api/orders/:id/status",
    requireAuth,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        if (!status) {
          res.status(400).json({ message: "Status is required" });
          return;
        }

        const updated = await storage.updateOrderStatus(id, status);
        if (!updated) {
          res.status(404).json({ message: "Order not found" });
          return;
        }

        res.json(updated);
      } catch (error) {
        handleError(res, error);
      }
    }
  );

  return createServer(app);
}
