import { IStorage } from "./interfaces.js";
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

import { PgProductStorage } from "./pgProductStorage.js";
import { PgCustomerStorage } from "./pgCustomerStorage.js";
import { PgOrderStorage } from "./pgOrderStorage.js";
import { PgUserStorage } from "./pgUserStorage.js";
import { PgMediaStorage } from "./pgMediaStorage.js";
import { PgVersionStorage } from "./pgVersionStorage.js";

/**
 * Implémentation du stockage PostgreSQL, utilisant les classes spécifiques
 * Cette classe est principalement utilisée en production et pour les tests avec PostgreSQL
 */
export class PgStorage implements IStorage {
  private productStorage: PgProductStorage;
  private customerStorage: PgCustomerStorage;
  private orderStorage: PgOrderStorage;
  private userStorage: PgUserStorage;
  private mediaStorage: PgMediaStorage;
  private versionStorage: PgVersionStorage;

  constructor() {
    this.productStorage = new PgProductStorage();
    this.customerStorage = new PgCustomerStorage();
    this.orderStorage = new PgOrderStorage();
    this.userStorage = new PgUserStorage();
    this.mediaStorage = new PgMediaStorage();
    this.versionStorage = new PgVersionStorage();

    // Initialiser l'utilisateur admin par défaut si nécessaire
    this.userStorage.initializeDefaultAdmin();
  }

  // Produits
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

  // Customers
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

  // Orders
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

  // Order Items
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.orderStorage.getOrderItemsByOrderId(orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    return this.orderStorage.createOrderItem(item);
  }

  // Admin Users
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

  // Media
  async getAllMedias(): Promise<Media[]> {
    return this.mediaStorage.getAllMedias();
  }

  async getMediaById(id: number): Promise<Media | null> {
    return this.mediaStorage.getMediaById(id);
  }

  async createMedia(media: Omit<Media, "id" | "createdAt">): Promise<Media> {
    return this.mediaStorage.createMedia(media);
  }

  async deleteMedia(id: number): Promise<boolean> {
    return this.mediaStorage.deleteMedia(id);
  }

  // Fonctions de version du site
  async getCurrentTheme(): Promise<string> {
    return this.versionStorage.getCurrentTheme();
  }

  async getCurrentDecorations(): Promise<Record<string, any>> {
    return this.versionStorage.getCurrentDecorations();
  }

  async getCurrentShopMode(): Promise<string> {
    return this.versionStorage.getCurrentShopMode();
  }

  async updateTheme(theme: string): Promise<void> {
    return this.versionStorage.updateTheme(theme);
  }

  async updateDecorations(decorations: Record<string, any>): Promise<void> {
    return this.versionStorage.updateDecorations(decorations);
  }

  // Alias pour compatibilité avec les routes existantes
  async setThemeDecoration(decoration: string): Promise<void> {
    return this.updateDecorations({ decoration });
  }

  async updateShopMode(mode: string): Promise<void> {
    return this.versionStorage.updateShopMode(mode);
  }

  // Alias pour compatibilité avec les routes existantes
  async setShopMode(mode: string): Promise<void> {
    return this.updateShopMode(mode);
  }

  // Nouvelles méthodes pour l'API des versions
  async getActiveVersion(): Promise<any> {
    return this.versionStorage.getActiveVersion();
  }

  async getAllVersions(): Promise<any[]> {
    return this.versionStorage.getAllVersions();
  }

  async createVersion(version: any): Promise<any> {
    return this.versionStorage.createVersion(version);
  }

  async updateVersion(version: any): Promise<any> {
    return this.versionStorage.updateVersion(version.id, version);
  }

  async activateVersion(id: number): Promise<any> {
    return this.versionStorage.activateVersion(id);
  }
}
