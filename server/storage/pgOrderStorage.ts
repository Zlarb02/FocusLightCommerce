// Implémentation PostgreSQL spécifique pour la gestion des commandes - Version enrichie
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import {
  type Order,
  type OrderWithParsedRelay,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "../../shared/schema.js";

/**
 * Gestion des commandes et des éléments de commande dans PostgreSQL
 * Version enrichie avec toutes les informations nécessaires pour les commandes complètes
 */
export class PgOrderStorage {
  /**
   * Récupère toutes les commandes, triées par date de création décroissante
   */
  async getAllOrders(): Promise<OrderWithParsedRelay[]> {
    const result = await db.execute(
      sql`SELECT * FROM orders ORDER BY created_at DESC`
    );

    return result.rows.map((row) => this.mapRowToOrder(row));
  }

  /**
   * Récupère une commande par son ID
   */
  async getOrderById(id: number): Promise<OrderWithParsedRelay | undefined> {
    const result = await db.execute(sql`SELECT * FROM orders WHERE id = ${id}`);

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Récupère une commande par son numéro de commande
   */
  async getOrderByNumber(
    orderNumber: string
  ): Promise<OrderWithParsedRelay | undefined> {
    const result = await db.execute(
      sql`SELECT * FROM orders WHERE order_number = ${orderNumber}`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Récupère toutes les commandes d'un client spécifique
   */
  async getOrdersByCustomerId(
    customerId: number
  ): Promise<OrderWithParsedRelay[]> {
    const result = await db.execute(
      sql`SELECT * FROM orders 
          WHERE customer_id = ${customerId} 
          ORDER BY created_at DESC`
    );

    return result.rows.map((row) => this.mapRowToOrder(row));
  }

  /**
   * Crée une nouvelle commande avec toutes les informations nécessaires
   */
  async createOrder(order: InsertOrder): Promise<OrderWithParsedRelay> {
    // Génération du numéro de commande unique
    const orderNumber = `ALTO-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const result = await db.execute(
      sql`INSERT INTO orders (
        customer_id, order_number, customer_first_name, customer_last_name, 
        customer_email, customer_phone, relay_point, total_amount, status
      )
      VALUES (
        ${order.customerId}, ${orderNumber}, ${order.customerFirstName}, ${
        order.customerLastName
      },
        ${order.customerEmail}, ${order.customerPhone}, ${
        order.relayPoint || null
      }, 
        ${order.totalAmount}, ${order.status || "pending"}
      )
      RETURNING *`
    );

    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Met à jour le statut d'une commande
   */
  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<OrderWithParsedRelay | undefined> {
    const updateData: any = { status };

    // Ajouter les timestamps selon le statut
    if (status === "shipped") {
      updateData.shipped_at = new Date().toISOString();
    } else if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    }

    const result = await db.execute(
      sql`UPDATE orders 
          SET status = ${status}
              ${status === "shipped" ? sql`, shipped_at = NOW()` : sql``}
              ${status === "delivered" ? sql`, delivered_at = NOW()` : sql``}
          WHERE id = ${id}
          RETURNING *`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Enregistre l'envoi de la notification d'expédition (email et/ou SMS)
   * et passe la commande en "shipped" si elle ne l'était pas encore.
   */
  async markShippingNotificationSent(
    id: number,
    emailSent: boolean,
    smsSent: boolean
  ): Promise<OrderWithParsedRelay | undefined> {
    const result = await db.execute(
      sql`UPDATE orders
          SET status = CASE WHEN status IN ('pending', 'processing') THEN 'shipped' ELSE status END,
              shipped_at = COALESCE(shipped_at, NOW())
              ${emailSent ? sql`, shipping_email_sent_at = NOW()` : sql``}
              ${smsSent ? sql`, shipping_sms_sent_at = NOW()` : sql``}
          WHERE id = ${id}
          RETURNING *`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Annule le marquage "SMS envoyé" (fausse manip depuis la gestion).
   * Ne touche pas au statut de la commande.
   */
  async clearShippingSmsSent(
    id: number
  ): Promise<OrderWithParsedRelay | undefined> {
    const result = await db.execute(
      sql`UPDATE orders
          SET shipping_sms_sent_at = NULL
          WHERE id = ${id}
          RETURNING *`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Récupère tous les éléments d'une commande spécifique
   */
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    const result = await db.execute(
      sql`SELECT * FROM order_items WHERE order_id = ${orderId}`
    );

    return result.rows.map((row) => this.mapRowToOrderItem(row));
  }

  /**
   * Crée un nouvel élément de commande avec toutes les informations produit
   */
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const result = await db.execute(
      sql`INSERT INTO order_items (
        order_id, product_id, product_name, variation_type, variation_value,
        quantity, unit_price, total_price
      )
      VALUES (
        ${item.orderId}, ${item.productId}, ${item.productName}, 
        ${item.variationType || null}, ${item.variationValue || null},
        ${item.quantity}, ${item.unitPrice}, ${item.totalPrice}
      )
      RETURNING *`
    );

    return this.mapRowToOrderItem(result.rows[0]);
  }

  /**
   * Supprime une commande et tous ses éléments associés
   */
  async deleteOrder(id: number): Promise<boolean> {
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
  ): Promise<{ order: OrderWithParsedRelay; items: OrderItem[] } | undefined> {
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

  /**
   * Mappe une ligne de base de données vers un objet Order
   */
  private mapRowToOrder(row: any): OrderWithParsedRelay {
    let parsedRelayPoint = null;
    try {
      if (row.relay_point) {
        parsedRelayPoint = JSON.parse(row.relay_point);
      }
    } catch (error) {
      console.error("Erreur parsing relayPoint:", error);
    }

    return {
      id: Number(row.id),
      customerId: Number(row.customer_id),
      orderNumber: row.order_number ? String(row.order_number) : null,
      customerFirstName: String(row.customer_first_name || ""),
      customerLastName: String(row.customer_last_name || ""),
      customerEmail: String(row.customer_email || ""),
      customerPhone: String(row.customer_phone || ""),
      relayPoint: parsedRelayPoint,
      totalAmount: Number(row.total_amount),
      status: String(row.status),
      createdAt: row.created_at ? new Date(row.created_at) : null,
      shippedAt: row.shipped_at ? new Date(row.shipped_at) : null,
      deliveredAt: row.delivered_at ? new Date(row.delivered_at) : null,
      shippingEmailSentAt: row.shipping_email_sent_at
        ? new Date(row.shipping_email_sent_at)
        : null,
      shippingSmsSentAt: row.shipping_sms_sent_at
        ? new Date(row.shipping_sms_sent_at)
        : null,
    };
  }

  /**
   * Mappe une ligne de base de données vers un objet OrderItem
   */
  private mapRowToOrderItem(row: any): OrderItem {
    return {
      id: Number(row.id),
      orderId: Number(row.order_id),
      productId: Number(row.product_id),
      productName: String(row.product_name || ""),
      variationType: row.variation_type ? String(row.variation_type) : null,
      variationValue: row.variation_value ? String(row.variation_value) : null,
      quantity: Number(row.quantity),
      unitPrice: Number(row.unit_price),
      totalPrice: Number(row.total_price),
    };
  }
}
