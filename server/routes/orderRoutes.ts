import { Router, Request, Response } from "express";
import { storage } from "../storage/index.js";
import { handleError, requireAuth } from "../middleware/middlewares.js";
import { notificationService } from "../services/notificationService.js";

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
          orderNumber: order.orderNumber || `ALTO-${new Date(
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
        orderNumber: order.orderNumber || `ALTO-${new Date(
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

/**
 * Envoie la notification d'expédition au client (email + SMS si configuré),
 * passe la commande en "shipped" et enregistre les dates d'envoi en base.
 */
router.post(
  "/:id/notify-shipping",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      const orderNumber =
        order.orderNumber ||
        `ALTO-${new Date(order.createdAt || new Date()).getFullYear()}${order.id
          .toString()
          .padStart(4, "0")}`;

      const result = await notificationService.sendShippingNotification({
        orderNumber,
        customerName: `${order.customerFirstName} ${order.customerLastName}`.trim(),
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        relayPoint: order.relayPoint,
      });

      if (!result.emailSent && !result.smsSent) {
        res.status(502).json({
          message:
            "Échec de l'envoi : ni l'email ni le SMS n'ont pu être envoyés",
          ...result,
        });
        return;
      }

      const updated = await storage.markShippingNotificationSent(
        id,
        result.emailSent,
        result.smsSent
      );

      res.json({ ...result, order: updated });
    } catch (error) {
      handleError(res, error);
    }
  }
);

/**
 * Marque le SMS de suivi comme envoyé (déclenché quand l'admin ouvre son
 * appli SMS via le lien sms: pré-rempli depuis la gestion des commandes).
 */
router.post(
  "/:id/mark-sms-sent",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.markShippingNotificationSent(
        id,
        false,
        true
      );
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

/**
 * Annule le marquage "SMS envoyé" (si l'admin n'a finalement pas envoyé le SMS).
 */
router.delete(
  "/:id/mark-sms-sent",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.clearShippingSmsSent(id);
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
