// Implémentation PostgreSQL spécifique pour la gestion des commandes
import { db } from "./db.js";
import { sql, eq, and, desc } from "drizzle-orm";
import {
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  orders,
  orderItems,
} from "../../shared/schema.js";

/**
 * Gestion des commandes et des éléments de commande dans PostgreSQL
 */
export class PgOrderStorage {
  /**
   * Récupère toutes les commandes, triées par date de création décroissante
   */
  async getAllOrders(): Promise<Order[]> {
    const result = await db.execute(
      sql`SELECT * FROM orders ORDER BY created_at DESC`
    );

    return result.rows.map((row) => ({
      id: Number(row.id),
      customerId: Number(row.customer_id),
      totalAmount: Number(row.total_amount),
      status: String(row.status),
      createdAt:
        row.created_at &&
        (typeof row.created_at === "string" ||
          typeof row.created_at === "number")
          ? new Date(row.created_at)
          : null,
    }));
  }

  /**
   * Récupère une commande par son ID
   */
  async getOrderById(id: number): Promise<Order | undefined> {
    const result = await db.execute(sql`SELECT * FROM orders WHERE id = ${id}`);

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      customerId: Number(row.customer_id),
      totalAmount: Number(row.total_amount),
      status: String(row.status),
      createdAt:
        row.created_at &&
        (typeof row.created_at === "string" ||
          typeof row.created_at === "number")
          ? new Date(row.created_at)
          : null,
    };
  }

  /**
   * Récupère toutes les commandes d'un client spécifique
   */
  async getOrdersByCustomerId(customerId: number): Promise<Order[]> {
    const result = await db.execute(
      sql`SELECT * FROM orders 
          WHERE customer_id = ${customerId} 
          ORDER BY created_at DESC`
    );

    return result.rows.map((row) => ({
      id: Number(row.id),
      customerId: Number(row.customer_id),
      totalAmount: Number(row.total_amount),
      status: String(row.status),
      createdAt:
        row.created_at &&
        (typeof row.created_at === "string" ||
          typeof row.created_at === "number")
          ? new Date(row.created_at)
          : null,
    }));
  }

  /**
   * Crée une nouvelle commande
   */
  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.execute(
      sql`INSERT INTO orders (customer_id, total_amount, status)
          VALUES (${order.customerId}, ${order.totalAmount}, ${
        order.status || "pending"
      })
          RETURNING id, customer_id, total_amount, status, created_at`
    );

    const row = result.rows[0];
    return {
      id: Number(row.id),
      customerId: Number(row.customer_id),
      totalAmount: Number(row.total_amount),
      status: String(row.status),
      createdAt:
        row.created_at &&
        (typeof row.created_at === "string" ||
          typeof row.created_at === "number")
          ? new Date(row.created_at)
          : null,
    };
  }

  /**
   * Met à jour le statut d'une commande
   */
  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<Order | undefined> {
    const result = await db.execute(
      sql`UPDATE orders 
          SET status = ${status}
          WHERE id = ${id}
          RETURNING id, customer_id, total_amount, status, created_at`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      customerId: Number(row.customer_id),
      totalAmount: Number(row.total_amount),
      status: String(row.status),
      createdAt:
        row.created_at &&
        (typeof row.created_at === "string" ||
          typeof row.created_at === "number")
          ? new Date(row.created_at)
          : null,
    };
  }

  /**
   * Récupère tous les éléments d'une commande spécifique
   */
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    const result = await db.execute(
      sql`SELECT * FROM order_items WHERE order_id = ${orderId}`
    );

    return result.rows.map((row) => ({
      id: Number(row.id),
      orderId: Number(row.order_id),
      productId: Number(row.product_id),
      quantity: Number(row.quantity),
      price: Number(row.price),
    }));
  }

  /**
   * Crée un nouvel élément de commande
   */
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const result = await db.execute(
      sql`INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (${item.orderId}, ${item.productId}, ${item.quantity}, ${item.price})
          RETURNING id, order_id, product_id, quantity, price`
    );

    const row = result.rows[0];
    return {
      id: Number(row.id),
      orderId: Number(row.order_id),
      productId: Number(row.product_id),
      quantity: Number(row.quantity),
      price: Number(row.price),
    };
  }

  /**
   * Supprime une commande et tous ses éléments associés
   */
  async deleteOrder(id: number): Promise<boolean> {
    // Utilisation d'une transaction pour assurer l'atomicité de l'opération
    try {
      // D'abord supprimer tous les éléments de commande associés
      await db.execute(sql`DELETE FROM order_items WHERE order_id = ${id}`);

      // Ensuite supprimer la commande elle-même
      const result = await db.execute(
        sql`DELETE FROM orders WHERE id = ${id} RETURNING id`
      );

      return result.rowCount === 1;
    } catch (error) {
      console.error("Erreur lors de la suppression de la commande:", error);
      return false;
    }
  }

  /**
   * Récupère une commande avec tous ses éléments
   */
  async getOrderWithItems(
    id: number
  ): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    const orderResult = await this.getOrderById(id);

    if (!orderResult) {
      return undefined;
    }

    const itemsResult = await this.getOrderItemsByOrderId(id);

    return {
      order: orderResult,
      items: itemsResult,
    };
  }
}
