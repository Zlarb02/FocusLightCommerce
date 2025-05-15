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
  type ThemeDecoration,
  type ShopMode,
} from "../../shared/schema.js";

import { ProductStorage } from "./productStorage.js";
import { CustomerStorage } from "./customerStorage.js";
import { OrderStorage } from "./orderStorage.js";
import { UserStorage } from "./userStorage.js";
import { MediaStorage } from "./mediaStorage.js";
import { VersionStorage, SiteVersionData } from "./versionStorage.js";

/**
 * Implémentation du stockage en mémoire, utilisant les classes spécifiques
 * Cette classe est principalement utilisée pour le développement et les tests
 */
export class MemoryStorage implements IStorage {
  private productStorage: ProductStorage;
  private customerStorage: CustomerStorage;
  private orderStorage: OrderStorage;
  private userStorage: UserStorage;
  private mediaStorage: MediaStorage;
  private versionStorage: VersionStorage;

  constructor() {
    this.productStorage = new ProductStorage();
    this.customerStorage = new CustomerStorage();
    this.orderStorage = new OrderStorage();
    this.userStorage = new UserStorage();
    this.mediaStorage = new MediaStorage();
    this.versionStorage = new VersionStorage();

    // Initialiser avec l'utilisateur admin par défaut
    this.userStorage.initializeDefaultAdmin();

    // Initialiser avec les produits (les 4 variantes de lampe)
    this.productStorage.initializeProducts();
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

  // Clients
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

  // Commandes
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

  // Éléments de commande
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.orderStorage.getOrderItemsByOrderId(orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    return this.orderStorage.createOrderItem(item);
  }

  // Utilisateurs admin
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

  // Médias
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

  // Versions (fonctionnalités optionnelles)
  async getAllVersions() {
    return this.versionStorage.getAllVersions();
  }

  async getVersionById(id: number) {
    return this.versionStorage.getVersionById(id);
  }

  async getActiveVersion() {
    return this.versionStorage.getActiveVersion();
  }

  async activateVersion(id: number) {
    return this.versionStorage.setActiveVersion(id);
  }

  // Alias pour compatibilité avec l'ancienne API
  async setActiveVersion(id: number) {
    return this.versionStorage.setActiveVersion(id);
  }

  async createVersion(
    versionData: Omit<SiteVersionData, "id" | "createdAt" | "updatedAt">
  ) {
    return this.versionStorage.createVersion(versionData);
  }

  async updateVersion(versionData: Partial<SiteVersionData> & { id: number }) {
    return this.versionStorage.updateVersion(versionData.id, versionData);
  }

  async setShopMode(mode: ShopMode) {
    return this.versionStorage.setShopMode(mode);
  }

  async setThemeDecoration(decoration: ThemeDecoration) {
    return this.versionStorage.setThemeDecoration(decoration);
  }

  // Nouvelles méthodes requises par l'interface
  async getCurrentTheme(): Promise<string> {
    const activeVersion = await this.getActiveVersion();
    return activeVersion?.themeDecoration || "none";
  }

  async getCurrentDecorations(): Promise<Record<string, any>> {
    const activeVersion = await this.getActiveVersion();
    const decoration = activeVersion?.themeDecoration || "none";

    // Mêmes valeurs par défaut que dans pgVersionStorage
    switch (decoration) {
      case "summer-sale":
        return {
          banner: true,
          colors: ["#FFD700", "#FF6347"],
          promotion: "20%",
        };
      case "halloween":
        return {
          banner: true,
          colors: ["#FF6347", "#000000"],
          specialEffects: true,
        };
      case "christmas":
        return {
          banner: true,
          colors: ["#006400", "#FF0000", "#FFFFFF"],
          snowEffect: true,
        };
      case "april-fools":
        return { banner: true, colors: ["#FF00FF", "#00FFFF"], funMode: true };
      default:
        return {};
    }
  }

  async getCurrentShopMode(): Promise<string> {
    const activeVersion = await this.getActiveVersion();
    return activeVersion?.shopMode || "focus";
  }

  async updateTheme(theme: string): Promise<void> {
    await this.setThemeDecoration(theme as ThemeDecoration);
  }

  async updateDecorations(decorations: Record<string, any>): Promise<void> {
    // Si 'decoration' est une propriété de l'objet, utiliser cette valeur
    if (decorations.decoration) {
      await this.setThemeDecoration(decorations.decoration as ThemeDecoration);
    }
  }

  async updateShopMode(mode: string): Promise<void> {
    await this.setShopMode(mode as ShopMode);
  }
}
