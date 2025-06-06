import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Media schema
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  path: text("path").notNull(),
  type: text("type", { enum: ["image", "video", "other"] }).notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export type Media = {
  id: number;
  filename: string;
  path: string;
  type: "image" | "video" | "other";
  size: number;
  createdAt: string;
};

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Product Variations schema
export const productVariations = pgTable("product_variations", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  variationType: text("variation_type").notNull(), // color, size, material, etc.
  variationValue: text("variation_value").notNull(), // Blanc, Rouge, 'S', 'M', 'L', etc.
  price: real("price"), // Price override for this variation (optional)
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url").notNull(),
});

export const insertProductVariationSchema = createInsertSchema(
  productVariations
).omit({
  id: true,
});

// Customer schema
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country"),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

// Order Item schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

// Admin user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
});

// Type definitions
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductVariation = typeof productVariations.$inferSelect;
export type InsertProductVariation = z.infer<
  typeof insertProductVariationSchema
>;

// Extended Product type with variations
export type ProductWithVariations = Product & {
  variations?: ProductVariation[];
};

// Helper type for product with selected variation
export type ProductWithSelectedVariation = ProductVariation & {
  productName: string;
  productDescription: string;
  basePrice: number;
};

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Type pour les décorations thématiques
export type ThemeDecoration =
  | "none"
  | "summer-sale"
  | "halloween"
  | "christmas"
  | "april-fools";
export type ShopMode = "general" | "focus";

// Settings schema (pour les paramètres généraux du site)
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type SiteSettingsEntry = typeof siteSettings.$inferSelect;
export type InsertSiteSettingsEntry = z.infer<typeof insertSettingsSchema>;

// Versions schema (complètement distinct des settings)
export const siteVersions = pgTable("site_versions", {
  id: serial("id").primaryKey(),
  shopMode: text("shop_mode", { enum: ["general", "focus"] })
    .notNull()
    .default("focus"),
  themeDecoration: text("theme_decoration", {
    enum: ["none", "summer-sale", "halloween", "christmas", "april-fools"],
  })
    .notNull()
    .default("none"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVersionSchema = createInsertSchema(siteVersions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SiteVersion = typeof siteVersions.$inferSelect;
export type InsertSiteVersion = z.infer<typeof insertVersionSchema>;

// For cart and checkout
export const checkoutSchema = z.object({
  customer: insertCustomerSchema,
  items: z.array(
    z.object({
      productId: z.number(), // Maintenant, il s'agit de l'ID de la variation
      quantity: z.number().min(1),
      price: z.number(),
      variationType: z.string().optional(), // Type de variation (color, size, etc.)
      variationValue: z.string().optional(), // Valeur de la variation (Rouge, M, etc.)
    })
  ),
  totalAmount: z.number(),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;
