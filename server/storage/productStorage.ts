import {
  type Product,
  type InsertProduct,
  type ProductVariation,
  type InsertProductVariation,
  type ProductWithVariations,
} from "../../shared/schema.js";

export class ProductStorage {
  private products: Map<number, Product>;
  private productVariations: Map<number, ProductVariation>;
  private productId: number;
  private variationId: number;

  constructor(
    productId: number = 1,
    variationId: number = 1,
    products: Map<number, Product> = new Map(),
    productVariations: Map<number, ProductVariation> = new Map()
  ) {
    this.products = products;
    this.productVariations = productVariations;
    this.productId = productId;
    this.variationId = variationId;
  }

  async initializeProducts() {
    // Créer le produit de base
    const lampProduct = await this.createProduct({
      name: "FOCUS.01",
      description:
        "Lampe d'appoint imaginée et fabriquée par Anatole Collet. Réaliser en PLA écoresponsable et en chêne écogéré, livré avec une ampoule LED de 60W E14 et un câble avec interrupteur de 1m50.",
      price: 70.0,
    });

    // Ajouter les variations de couleur avec les nouvelles URLs
    await this.createProductVariation({
      productId: lampProduct.id,
      variationType: "color",
      variationValue: "Blanc",
      stock: 10,
      imageUrl:
        "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
    });

    await this.createProductVariation({
      productId: lampProduct.id,
      variationType: "color",
      variationValue: "Bleu",
      stock: 10,
      imageUrl:
        "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
    });

    await this.createProductVariation({
      productId: lampProduct.id,
      variationType: "color",
      variationValue: "Rouge",
      stock: 10,
      imageUrl:
        "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
    });

    await this.createProductVariation({
      productId: lampProduct.id,
      variationType: "color",
      variationValue: "Orange",
      stock: 10,
      imageUrl:
        "https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png",
    });
  }

  async getAllProducts(): Promise<ProductWithVariations[]> {
    const products = Array.from(this.products.values());
    const result: ProductWithVariations[] = [];

    for (const product of products) {
      const variations = Array.from(this.productVariations.values()).filter(
        (variation) => variation.productId === product.id
      );
      result.push({
        ...product,
        variations,
      });
    }

    return result;
  }

  async getProductById(id: number): Promise<ProductWithVariations | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const variations = Array.from(this.productVariations.values()).filter(
      (variation) => variation.productId === id
    );

    return {
      ...product,
      variations,
    };
  }

  async getProductVariationById(
    id: number
  ): Promise<ProductVariation | undefined> {
    return this.productVariations.get(id);
  }

  async getProductsByVariation(
    type: string,
    value: string
  ): Promise<ProductWithVariations[]> {
    const variations = Array.from(this.productVariations.values()).filter(
      (variation) =>
        variation.variationType.toLowerCase() === type.toLowerCase() &&
        variation.variationValue.toLowerCase() === value.toLowerCase()
    );

    const result: ProductWithVariations[] = [];

    for (const variation of variations) {
      const product = this.products.get(variation.productId);
      if (product) {
        const allProductVariations = Array.from(
          this.productVariations.values()
        ).filter((v) => v.productId === product.id);

        result.push({
          ...product,
          variations: allProductVariations,
        });
      }
    }

    return result;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async createProductVariation(
    variation: InsertProductVariation
  ): Promise<ProductVariation> {
    const id = this.variationId++;
    // Assurez-vous que les propriétés requises ont des valeurs par défaut
    const newVariation = {
      ...variation,
      id,
      price: variation.price ?? null,
      stock: variation.stock ?? 0,
    };
    this.productVariations.set(id, newVariation);
    return newVariation;
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

  async updateProductVariation(
    id: number,
    variation: Partial<InsertProductVariation>
  ): Promise<ProductVariation | undefined> {
    const existingVariation = this.productVariations.get(id);
    if (!existingVariation) return undefined;

    const updatedVariation = { ...existingVariation, ...variation };
    this.productVariations.set(id, updatedVariation);
    return updatedVariation;
  }

  async updateVariationStock(
    id: number,
    quantity: number
  ): Promise<ProductVariation | undefined> {
    const variation = this.productVariations.get(id);
    if (!variation) return undefined;

    const updatedVariation = {
      ...variation,
      stock: variation.stock + quantity,
    };
    this.productVariations.set(id, updatedVariation);
    return updatedVariation;
  }

  async deleteProduct(id: number): Promise<boolean> {
    // Supprimer également toutes les variations associées
    Array.from(this.productVariations.values())
      .filter((variation) => variation.productId === id)
      .forEach((variation) => this.productVariations.delete(variation.id));

    return this.products.delete(id);
  }

  async deleteProductVariation(id: number): Promise<boolean> {
    return this.productVariations.delete(id);
  }

  // Getter for internal state
  getProductIdCounter(): number {
    return this.productId;
  }

  getVariationIdCounter(): number {
    return this.variationId;
  }

  getProductsMap(): Map<number, Product> {
    return this.products;
  }

  getProductVariationsMap(): Map<number, ProductVariation> {
    return this.productVariations;
  }
}
