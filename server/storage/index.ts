import { IStorage } from "./interfaces.js";
import { ProductStorage } from "./productStorage.js";
import { CustomerStorage } from "./customerStorage.js";
import { OrderStorage } from "./orderStorage.js";
import { UserStorage } from "./userStorage.js";
import {
  type Product,
  type InsertProduct,
  type ProductVariation,
  type InsertProductVariation,
  type ProductWithVariations,
  type Customer,
  type InsertCustomer,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type User,
  type InsertUser,
} from "../../shared/schema.js";

// In-memory storage implementation
export class MemStorage implements IStorage {
  private productStorage: ProductStorage;
  private customerStorage: CustomerStorage;
  private orderStorage: OrderStorage;
  private userStorage: UserStorage;

  constructor() {
    this.productStorage = new ProductStorage();
    this.customerStorage = new CustomerStorage();
    this.orderStorage = new OrderStorage();
    this.userStorage = new UserStorage();

    // Initialize with default admin user
    this.userStorage.initializeDefaultAdmin();

    // Initialize with products (the 4 lamp variants)
    this.productStorage.initializeProducts();
  }

  // Products Implementation
  async getAllProducts(): Promise<ProductWithVariations[]> {
    return this.productStorage.getAllProducts();
  }

  async getProductById(id: number): Promise<ProductWithVariations | undefined> {
    return this.productStorage.getProductById(id);
  }

  async getProductsByVariation(
    type: string,
    value: string
  ): Promise<ProductWithVariations[]> {
    return this.productStorage.getProductsByVariation(type, value);
  }

  async getProductVariationById(
    id: number
  ): Promise<ProductVariation | undefined> {
    return this.productStorage.getProductVariationById(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    return this.productStorage.createProduct(product);
  }

  async createProductVariation(
    variation: InsertProductVariation
  ): Promise<ProductVariation> {
    return this.productStorage.createProductVariation(variation);
  }

  async updateProduct(
    id: number,
    product: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    return this.productStorage.updateProduct(id, product);
  }

  async updateProductVariation(
    id: number,
    variation: Partial<InsertProductVariation>
  ): Promise<ProductVariation | undefined> {
    return this.productStorage.updateProductVariation(id, variation);
  }

  async updateVariationStock(
    id: number,
    quantity: number
  ): Promise<ProductVariation | undefined> {
    return this.productStorage.updateVariationStock(id, quantity);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.productStorage.deleteProduct(id);
  }

  async deleteProductVariation(id: number): Promise<boolean> {
    return this.productStorage.deleteProductVariation(id);
  }

  // Customers Implementation
  async getCustomerById(id: number): Promise<Customer | undefined> {
    return this.customerStorage.getCustomerById(id);
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return this.customerStorage.getCustomerByEmail(email);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    return this.customerStorage.createCustomer(customer);
  }

  async updateCustomer(
    id: number,
    customer: Partial<InsertCustomer>
  ): Promise<Customer | undefined> {
    return this.customerStorage.updateCustomer(id, customer);
  }

  // Orders Implementation
  async getAllOrders(): Promise<Order[]> {
    return this.orderStorage.getAllOrders();
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orderStorage.getOrderById(id);
  }

  async getOrdersByCustomerId(customerId: number): Promise<Order[]> {
    return this.orderStorage.getOrdersByCustomerId(customerId);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    return this.orderStorage.createOrder(order);
  }

  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<Order | undefined> {
    return this.orderStorage.updateOrderStatus(id, status);
  }

  // Order Items Implementation
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.orderStorage.getOrderItemsByOrderId(orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    return this.orderStorage.createOrderItem(item);
  }

  // Admin Users Implementation
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.userStorage.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.userStorage.createUser(user);
  }

  async verifyUser(
    username: string,
    password: string
  ): Promise<User | undefined> {
    return this.userStorage.verifyUser(username, password);
  }
}

// Export a singleton instance
export const storage = new MemStorage();
