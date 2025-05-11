import {
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "../../shared/schema.js";

export class OrderStorage {
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private orderId: number;
  private orderItemId: number;

  constructor(
    orderId: number = 1,
    orderItemId: number = 1,
    orders: Map<number, Order> = new Map(),
    orderItems: Map<number, OrderItem> = new Map()
  ) {
    this.orders = orders;
    this.orderItems = orderItems;
    this.orderId = orderId;
    this.orderItemId = orderItemId;
  }

  // Orders Implementation
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByCustomerId(customerId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.customerId === customerId
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const newOrder = {
      ...order,
      id,
      status: order.status || "pending", // Providing a default status if none is given
      createdAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order Items Implementation
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const newItem = { ...item, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }

  // Getter for internal state
  getOrderIdCounter(): number {
    return this.orderId;
  }

  getOrderItemIdCounter(): number {
    return this.orderItemId;
  }

  getOrdersMap(): Map<number, Order> {
    return this.orders;
  }

  getOrderItemsMap(): Map<number, OrderItem> {
    return this.orderItems;
  }
}
