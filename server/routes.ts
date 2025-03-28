import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertProductSchema,
  insertCustomerSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertUserSchema,
  checkoutSchema,
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

// Extend Express Session with custom properties
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      isAdmin: boolean | null;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "focus-lamp-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      },
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Auth middleware
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Support pour CORS en mode développement
  if (process.env.NODE_ENV !== "production") {
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:5173");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Credentials", "true");
      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      }
      next();
    });
  }

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin product routes
  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Checkout process
  app.post("/api/checkout", async (req, res) => {
    try {
      const checkoutData = checkoutSchema.parse(req.body);

      // Create or get customer
      let customer = await storage.getCustomerByEmail(
        checkoutData.customer.email
      );

      if (!customer) {
        customer = await storage.createCustomer(checkoutData.customer);
      } else {
        // Update customer info if necessary
        customer =
          (await storage.updateCustomer(customer.id, checkoutData.customer)) ||
          customer;
      }

      // Create order
      const order = await storage.createOrder({
        customerId: customer.id,
        totalAmount: checkoutData.totalAmount,
        status: "pending",
      });

      // Create order items and update inventory
      for (const item of checkoutData.items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });

        // Update product stock
        await storage.updateProductStock(item.productId, -item.quantity);
      }

      // Return order confirmation
      res.status(201).json({
        orderId: order.id,
        orderNumber: `FC-${new Date().getFullYear()}${order.id
          .toString()
          .padStart(4, "0")}`,
        customer: customer,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Admin auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const user = await storage.verifyUser(username, password);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set user in session
      req.session.user = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      };

      res.json({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    if (req.session.user) {
      res.json({
        authenticated: true,
        user: {
          id: req.session.user.id,
          username: req.session.user.username,
          isAdmin: req.session.user.isAdmin,
        },
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Admin order routes
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();

      // Get customer details for each order
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const customer = await storage.getCustomerById(order.customerId);
          const items = await storage.getOrderItemsByOrderId(order.id);

          return {
            ...order,
            customer,
            items,
            orderNumber: `FC-${new Date(
              order.createdAt || new Date()
            ).getFullYear()}${order.id.toString().padStart(4, "0")}`,
          };
        })
      );

      res.json(ordersWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const customer = await storage.getCustomerById(order.customerId);
      const items = await storage.getOrderItemsByOrderId(order.id);

      const orderWithDetails = {
        ...order,
        customer,
        items,
        orderNumber: `FC-${new Date(
          order.createdAt || new Date()
        ).getFullYear()}${order.id.toString().padStart(4, "0")}`,
      };

      res.json(orderWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/orders/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedOrder = await storage.updateOrderStatus(id, status);

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
