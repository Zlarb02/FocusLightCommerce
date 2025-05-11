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
}
