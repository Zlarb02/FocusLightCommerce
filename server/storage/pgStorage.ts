// Implémentation du stockage avec PostgreSQL
import {
  pgTable,
  serial,
  text,
  integer,
  real,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, sql } from "drizzle-orm";
import pkg from "pg";
const { Pool } = pkg;

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
  products,
  productVariations,
  customers,
  orders,
  orderItems,
  users,
  media,
  ThemeDecoration,
  ShopMode,
  siteVersions,
} from "../../shared/schema.js";

import { IStorage } from "./interfaces.js";

export type SiteVersionData = {
  id: number;
  shopMode: ShopMode;
  themeDecoration: ThemeDecoration;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Table pour les versions du site
const siteVersions = pgTable("site_versions", {
  id: serial("id").primaryKey(),
  shopMode: text("shop_mode").notNull(),
  themeDecoration: text("theme_decoration").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export class PgStorage implements IStorage {
  private db;
  private pool;

  constructor() {
    // Récupérer la chaîne de connexion depuis les variables d'environnement
    const connectionString = process.env.DB_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error(
        "DB_CONNECTION_STRING n'est pas définie dans les variables d'environnement"
      );
    }

    this.pool = new Pool({ connectionString });
    this.db = drizzle(this.pool);

    console.log("PgStorage: Connexion à la base de données établie");
  }

  async initDatabase() {
    console.log("PgStorage: Initialisation de la base de données");

    try {
      // Vérifier si des produits existent déjà
      const existingProducts = await this.db.select().from(products).limit(1);

      if (existingProducts.length === 0) {
        console.log("PgStorage: Initialisation des données de base");
        await this.initializeBaseData();
      } else {
        console.log(
          "PgStorage: Des données existent déjà, pas besoin d'initialiser"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation de la base de données:",
        error
      );
    }
  }

  async initializeBaseData() {
    // Création d'un produit de base (lampe)
    const lampProduct = await this.createProduct({
      name: "FOCUS.01",
      description:
        "Lampe d'appoint imaginée et fabriquée par Anatole Collet. Réaliser en PLA écoresponsable et en chêne écogéré, livré avec une ampoule LED de 60W E14 et un câble avec interrupteur de 1m50.",
      price: 70.0,
    });

    // Ajouter les variations de couleur
    await this.createProductVariation({
      productId: lampProduct.id,
      variationType: "color",
      variationValue: "Blanc",
      stock: 10,
      imageUrl: "https://www.alto-lille.fr/images/blanche.png",
    });

    await this.createProductVariation({
      productId: lampProduct.id,
      variationType: "color",
      variationValue: "Bleu",
      stock: 10,
      imageUrl: "https://www.alto-lille.fr/images/bleue.png",
    });

    await this.createProductVariation({
      productId: lampProduct.id,
      variationType: "color",
      variationValue: "Rouge",
      stock: 10,
      imageUrl: "https://www.alto-lille.fr/images/rouge.png",
    });

    await this.createProductVariation({
      productId: lampProduct.id,
      variationType: "color",
      variationValue: "Orange",
      stock: 10,
      imageUrl: "https://www.alto-lille.fr/images/orange.png",
    });

    // Initialiser la version par défaut
    await this.db.insert(siteVersions).values({
      shopMode: "focus",
      themeDecoration: "none",
      isActive: true,
      updatedAt: new Date(),
    });

    // Créer un utilisateur admin par défaut si ADMIN_PASSWORD est défini
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword) {
      await this.createUser({
        username: "admin",
        password: adminPassword,
      });
    }
  }

  // Products Implementation
  async getAllProducts(): Promise<ProductWithVariations[]> {
    const productsData = await this.db.select().from(products);
    const result: ProductWithVariations[] = [];

    for (const product of productsData) {
      const variations = await this.db
        .select()
        .from(productVariations)
        .where(eq(productVariations.productId, product.id));

      result.push({
        ...product,
        variations: variations,
      });
    }

    return result;
  }

  async getProductById(id: number): Promise<ProductWithVariations | undefined> {
    const product = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (product.length === 0) {
      return undefined;
    }

    const variations = await this.db
      .select()
      .from(productVariations)
      .where(eq(productVariations.productId, id));

    return {
      ...product[0],
      variations: variations,
    };
  }

  async getProductsByVariation(
    type: string,
    value: string
  ): Promise<ProductWithVariations[]> {
    const variations = await this.db
      .select()
      .from(productVariations)
      .where(
        and(
          eq(productVariations.variationType, type),
          eq(productVariations.variationValue, value)
        )
      );

    const result: ProductWithVariations[] = [];
    for (const variation of variations) {
      const product = await this.getProductById(variation.productId);
      if (product) {
        result.push(product);
      }
    }

    return result;
  }

  async getProductVariationById(
    id: number
  ): Promise<ProductVariation | undefined> {
    const variation = await this.db
      .select()
      .from(productVariations)
      .where(eq(productVariations.id, id))
      .limit(1);

    return variation.length > 0 ? variation[0] : undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await this.db.insert(products).values(product).returning();
    return result[0];
  }

  async createProductVariation(
    variation: InsertProductVariation
  ): Promise<ProductVariation> {
    const result = await this.db
      .insert(productVariations)
      .values(variation)
      .returning();
    return result[0];
  }

  async updateProduct(
    id: number,
    product: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    const result = await this.db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async updateProductVariation(
    id: number,
    variation: Partial<InsertProductVariation>
  ): Promise<ProductVariation | undefined> {
    const result = await this.db
      .update(productVariations)
      .set(variation)
      .where(eq(productVariations.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async updateVariationStock(
    id: number,
    quantity: number
  ): Promise<ProductVariation | undefined> {
    const variation = await this.getProductVariationById(id);
    if (!variation) return undefined;

    // Mise à jour du stock
    return this.updateProductVariation(id, {
      stock: variation.stock + quantity,
    });
  }

  async deleteProduct(id: number): Promise<boolean> {
    // Supprimer d'abord les variations liées
    await this.db
      .delete(productVariations)
      .where(eq(productVariations.productId, id));

    // Puis supprimer le produit
    const result = await this.db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  async deleteProductVariation(id: number): Promise<boolean> {
    const result = await this.db
      .delete(productVariations)
      .where(eq(productVariations.id, id));
    return result.rowCount > 0;
  }

  // Customers Implementation
  async getCustomerById(id: number): Promise<Customer | undefined> {
    const result = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const result = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, email.toLowerCase()))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await this.db
      .insert(customers)
      .values({
        ...customer,
        email: customer.email.toLowerCase(),
      })
      .returning();
    return result[0];
  }

  async updateCustomer(
    id: number,
    customer: Partial<InsertCustomer>
  ): Promise<Customer | undefined> {
    if (customer.email) {
      customer.email = customer.email.toLowerCase();
    }

    const result = await this.db
      .update(customers)
      .set(customer)
      .where(eq(customers.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  // Orders Implementation
  async getAllOrders(): Promise<Order[]> {
    return this.db.select().from(orders);
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const result = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getOrdersByCustomerId(customerId: number): Promise<Order[]> {
    return this.db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await this.db
      .insert(orders)
      .values({
        ...order,
        status: order.status || "pending",
      })
      .returning();
    return result[0];
  }

  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<Order | undefined> {
    const result = await this.db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  // Order Items Implementation
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const result = await this.db.insert(orderItems).values(item).returning();
    return result[0];
  }

  // Admin Users Implementation
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.default.hash(user.password, 10);

    const result = await this.db
      .insert(users)
      .values({
        username: user.username,
        password: hashedPassword,
        isAdmin: true,
      })
      .returning();
    return result[0];
  }

  async verifyUser(
    username: string,
    password: string
  ): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;

    const bcrypt = await import("bcrypt");
    const match = await bcrypt.default.compare(password, user.password);
    if (match) {
      return user;
    }
    return undefined;
  }

  // Media Implementation
  async getAllMedias(): Promise<Media[]> {
    return this.db.select().from(media);
  }

  async getMediaById(id: number): Promise<Media | null> {
    const result = await this.db
      .select()
      .from(media)
      .where(eq(media.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async createMedia(
    mediaData: Omit<Media, "id" | "createdAt">
  ): Promise<Media> {
    const result = await this.db.insert(media).values(mediaData).returning();
    return result[0];
  }

  async deleteMedia(id: number): Promise<boolean> {
    const result = await this.db.delete(media).where(eq(media.id, id));
    return result.rowCount > 0;
  }

  // Versions Implementation
  async getAllVersions() {
    return this.db.select().from(siteVersions);
  }

  async getVersionById(id: number) {
    const result = await this.db
      .select()
      .from(siteVersions)
      .where(eq(siteVersions.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getActiveVersion() {
    const result = await this.db
      .select()
      .from(siteVersions)
      .where(eq(siteVersions.isActive, true))
      .limit(1);

    if (result.length > 0) {
      return result[0];
    }

    // Si aucune version active, récupérer la plus récente
    const versions = await this.db
      .select()
      .from(siteVersions)
      .orderBy(siteVersions.updatedAt)
      .limit(1);

    if (versions.length > 0) {
      // Activer cette version
      await this.setActiveVersion(versions[0].id);
      return versions[0];
    }

    // Aucune version trouvée, en créer une par défaut
    const defaultVersion = await this.db
      .insert(siteVersions)
      .values({
        shopMode: "focus",
        themeDecoration: "none",
        isActive: true,
        updatedAt: new Date(),
      })
      .returning();

    return defaultVersion[0];
  }

  async setActiveVersion(id: number) {
    // Désactiver toutes les versions
    await this.db.update(siteVersions).set({ isActive: false });

    // Activer la version spécifiée
    const result = await this.db
      .update(siteVersions)
      .set({ isActive: true })
      .where(eq(siteVersions.id, id))
      .returning();

    return result.length > 0;
  }

  async createVersion(
    versionData: Omit<SiteVersionData, "id" | "createdAt" | "updatedAt">
  ) {
    const now = new Date();
    const result = await this.db
      .insert(siteVersions)
      .values({
        ...versionData,
        updatedAt: now,
      })
      .returning();

    return result[0];
  }

  async updateVersion(versionData: Partial<SiteVersionData> & { id: number }) {
    const { id, ...data } = versionData;

    const result = await this.db
      .update(siteVersions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(siteVersions.id, id))
      .returning();

    return result[0];
  }

  async setShopMode(mode: ShopMode) {
    const activeVersion = await this.getActiveVersion();
    if (activeVersion) {
      await this.db
        .update(siteVersions)
        .set({
          shopMode: mode,
          updatedAt: new Date(),
        })
        .where(eq(siteVersions.id, activeVersion.id));
    }
  }

  async setThemeDecoration(decoration: ThemeDecoration) {
    const activeVersion = await this.getActiveVersion();
    if (activeVersion) {
      await this.db
        .update(siteVersions)
        .set({
          themeDecoration: decoration,
          updatedAt: new Date(),
        })
        .where(eq(siteVersions.id, activeVersion.id));
    }
  }
}
