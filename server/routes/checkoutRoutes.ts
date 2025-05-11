import { Router, Request, Response } from "express";
import { storage } from "../storage/index.js";
import { checkoutSchema } from "../../shared/schema.js";
import { handleError } from "../middleware/middlewares.js";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = checkoutSchema.parse(req.body);
    let customer = await storage.getCustomerByEmail(data.customer.email);
    if (!customer) {
      customer = await storage.createCustomer(data.customer);
    } else {
      customer =
        (await storage.updateCustomer(customer.id, data.customer)) || customer;
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
        // Mise à jour du stock de la variation (variation est identifiée par son ID)
        await storage.updateVariationStock(item.productId, -item.quantity);
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
});

export default router;
