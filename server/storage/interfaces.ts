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
  type Media,
} from "../../shared/schema.js";

// Storage interface
export interface IStorage {
  // Products
  getAllProducts(): Promise<ProductWithVariations[]>;
  getProductById(id: number): Promise<ProductWithVariations | undefined>;
  getProductsByVariation(
    type: string,
    value: string
  ): Promise<ProductWithVariations[]>;
  getProductVariationById(id: number): Promise<ProductVariation | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  createProductVariation(
    variation: InsertProductVariation
  ): Promise<ProductVariation>;
  updateProduct(
    id: number,
    product: Partial<InsertProduct>
  ): Promise<Product | undefined>;
  updateProductVariation(
    id: number,
    variation: Partial<InsertProductVariation>
  ): Promise<ProductVariation | undefined>;
  updateVariationStock(
    id: number,
    quantity: number
  ): Promise<ProductVariation | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  deleteProductVariation(id: number): Promise<boolean>;

  // Customers
  getCustomerById(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(
    id: number,
    customer: Partial<InsertCustomer>
  ): Promise<Customer | undefined>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByCustomerId(customerId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order Items
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Admin Users
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUser(username: string, password: string): Promise<User | undefined>;

  // Media
  getAllMedias(): Promise<Media[]>;
  getMediaById(id: number): Promise<Media | null>;
  createMedia(media: Omit<Media, "id" | "createdAt">): Promise<Media>;
  deleteMedia(id: number): Promise<boolean>;

  // Versions du site
  getActiveVersion(): Promise<any>;
  getAllVersions(): Promise<any[]>;
  createVersion(version: any): Promise<any>;
  updateVersion(version: any): Promise<any>;
  activateVersion(id: number): Promise<any>;

  // Méthodes pour le thème et les décorations
  getCurrentTheme(): Promise<string>;
  getCurrentDecorations(): Promise<Record<string, any>>;
  getCurrentShopMode(): Promise<string>;
  updateTheme(theme: string): Promise<void>;
  updateDecorations(decorations: Record<string, any>): Promise<void>;
  setThemeDecoration(decoration: string): Promise<void>;
  updateShopMode(mode: string): Promise<void>;
  setShopMode(mode: string): Promise<void>;
}
