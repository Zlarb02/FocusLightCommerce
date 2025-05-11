import { type Product, type InsertProduct } from "../../shared/schema.js";

export class ProductStorage {
  private products: Map<number, Product>;
  private productId: number;

  constructor(
    productId: number = 1,
    products: Map<number, Product> = new Map()
  ) {
    this.products = products;
    this.productId = productId;
  }

  initializeProducts() {
    const lampBase = {
      name: "FOCUS.01",
      description:
        "Lampe d'appoint imaginée et fabriquée par Anatole Collet. Réaliser en PLA écoresponsable et en chêne écogéré, livré avec une ampoule LED de 60W E14 et un câble avec interrupteur de 1m50.",
      price: 80.0,
      stock: 10,
    };

    this.createProduct({
      ...lampBase,
      color: "Blanc",
      imageUrl: "blanche.png",
    });

    this.createProduct({
      ...lampBase,
      color: "Bleu",
      imageUrl: "bleue.png",
    });

    this.createProduct({
      ...lampBase,
      color: "Rouge",
      imageUrl: "rouge.png",
    });

    this.createProduct({
      ...lampBase,
      color: "Orange",
      imageUrl: "orange.png",
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByColor(color: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.color.toLowerCase() === color.toLowerCase()
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct = { ...product, id, stock: product.stock ?? 0 };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(
    id: number,
    product: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;

    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async updateProductStock(
    id: number,
    quantity: number
  ): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, stock: product.stock + quantity };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Getter for internal state
  getProductIdCounter(): number {
    return this.productId;
  }

  getProductsMap(): Map<number, Product> {
    return this.products;
  }
}
