import { Router, Request, Response } from "express";
import { storage } from "../storage/index.js";
import { handleError, requireAuth } from "../middleware/middlewares.js";

const router = Router();

router.get(
  "/",
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

router.get(
  "/:id",
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

router.put(
  "/:id/status",
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

export default router;
