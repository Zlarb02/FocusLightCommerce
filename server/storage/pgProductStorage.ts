// Implémentation PostgreSQL spécifique pour la gestion des produits
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import {
  type Product,
  type InsertProduct,
  type ProductVariation,
  type InsertProductVariation,
  type ProductWithVariations,
} from "../../shared/schema.js";

/**
 * Gestion des produits et leurs variations dans PostgreSQL
 */
export class PgProductStorage {
  /**
   * Récupère tous les produits avec leurs variations
   */
  async getAllProducts(): Promise<ProductWithVariations[]> {
    const rawProducts = await db.execute(
      sql`SELECT p.*, 
          json_agg(
            json_build_object(
              'id', pv.id,
              'productId', pv.product_id,
              'variationType', pv.variation_type,
              'variationValue', pv.variation_value,
              'price', pv.price,
              'stock', pv.stock,
              'imageUrl', pv.image_url
            )
          ) as variations
        FROM products p
        LEFT JOIN product_variations pv ON p.id = pv.product_id
        GROUP BY p.id`
    );

    return rawProducts.rows.map((row) => {
      return {
        id: Number(row.id),
        name: String(row.name),
        description: String(row.description),
        price: Number(row.price),
        variations:
          row.variations &&
          Array.isArray(row.variations) &&
          row.variations.length > 0 &&
          row.variations[0] &&
          row.variations[0].id !== null
            ? row.variations.map((v: any) => ({
                id: Number(v.id),
                productId: Number(v.productId),
                variationType: String(v.variationType),
                variationValue: String(v.variationValue),
                price: v.price !== null ? Number(v.price) : null,
                stock: Number(v.stock),
                imageUrl: String(v.imageUrl),
              }))
            : [],
      };
    });
  }

  /**
   * Récupère un produit par son ID avec ses variations
   */
  async getProductById(id: number): Promise<ProductWithVariations | undefined> {
    const productResult = await db.execute(
      sql`SELECT * FROM products WHERE id = ${id}`
    );

    if (productResult.rowCount === 0 || productResult.rowCount === undefined) {
      return undefined;
    }

    const product = productResult.rows[0];

    const variationsResult = await db.execute(
      sql`SELECT * FROM product_variations WHERE product_id = ${id}`
    );

    const variations: ProductVariation[] = variationsResult.rows.map((row) => ({
      id: Number(row.id),
      productId: Number(row.product_id),
      variationType: String(row.variation_type),
      variationValue: String(row.variation_value),
      price: row.price !== null ? Number(row.price) : null,
      stock: Number(row.stock),
      imageUrl: String(row.image_url),
    }));

    return {
      id: Number(product.id),
      name: String(product.name),
      description: String(product.description),
      price: Number(product.price),
      variations,
    };
  }

  /**
   * Recherche des produits par type et valeur de variation
   */
  async getProductsByVariation(
    type: string,
    value: string
  ): Promise<ProductWithVariations[]> {
    const result = await db.execute(
      sql`SELECT p.*, 
          json_agg(
            json_build_object(
              'id', pv.id,
              'productId', pv.product_id,
              'variationType', pv.variation_type,
              'variationValue', pv.variation_value,
              'price', pv.price,
              'stock', pv.stock,
              'imageUrl', pv.image_url
            )
          ) as variations
        FROM products p
        JOIN product_variations pv ON p.id = pv.product_id
        WHERE pv.variation_type = ${type} AND pv.variation_value = ${value}
        GROUP BY p.id`
    );

    return result.rows.map((row) => {
      return {
        id: Number(row.id),
        name: String(row.name),
        description: String(row.description),
        price: Number(row.price),
        variations:
          row.variations &&
          Array.isArray(row.variations) &&
          row.variations.length > 0 &&
          row.variations[0] &&
          row.variations[0].id !== null
            ? row.variations.map((v: any) => ({
                id: Number(v.id),
                productId: Number(v.productId),
                variationType: String(v.variationType),
                variationValue: String(v.variationValue),
                price: v.price !== null ? Number(v.price) : null,
                stock: Number(v.stock),
                imageUrl: String(v.imageUrl),
              }))
            : [],
      };
    });
  }

  /**
   * Récupère une variation de produit par son ID
   */
  async getProductVariationById(
    id: number
  ): Promise<ProductVariation | undefined> {
    const result = await db.execute(
      sql`SELECT * FROM product_variations WHERE id = ${id}`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      productId: Number(row.product_id),
      variationType: String(row.variation_type),
      variationValue: String(row.variation_value),
      price: row.price !== null ? Number(row.price) : null,
      stock: Number(row.stock),
      imageUrl: String(row.image_url),
    };
  }

  /**
   * Crée un nouveau produit
   */
  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.execute(
      sql`INSERT INTO products (name, description, price)
          VALUES (${product.name}, ${product.description}, ${product.price})
          RETURNING id, name, description, price`
    );

    const row = result.rows[0];
    return {
      id: Number(row.id),
      name: String(row.name),
      description: String(row.description),
      price: Number(row.price),
    };
  }

  /**
   * Crée une nouvelle variation de produit
   */
  async createProductVariation(
    variation: InsertProductVariation
  ): Promise<ProductVariation> {
    const result = await db.execute(
      sql`INSERT INTO product_variations 
          (product_id, variation_type, variation_value, price, stock, image_url)
          VALUES (
            ${variation.productId}, 
            ${variation.variationType}, 
            ${variation.variationValue}, 
            ${variation.price}, 
            ${variation.stock}, 
            ${variation.imageUrl}
          )
          RETURNING id, product_id, variation_type, variation_value, price, stock, image_url`
    );

    const row = result.rows[0];
    return {
      id: Number(row.id),
      productId: Number(row.product_id),
      variationType: String(row.variation_type),
      variationValue: String(row.variation_value),
      price: row.price !== null ? Number(row.price) : null,
      stock: Number(row.stock),
      imageUrl: String(row.image_url),
    };
  }

  /**
   * Met à jour un produit existant
   */
  async updateProduct(
    id: number,
    product: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    // Si aucune mise à jour demandée, simplement récupérer le produit
    if (Object.keys(product).length === 0) {
      const existingProduct = await this.getProductById(id);
      return existingProduct
        ? {
            id: existingProduct.id,
            name: existingProduct.name,
            description: existingProduct.description,
            price: existingProduct.price,
          }
        : undefined;
    }

    // Construire la requête dynamiquement dans un style similaire aux autres méthodes
    const updates: string[] = [];

    if (product.name !== undefined) {
      updates.push(sql`name = ${product.name}`.toString());
    }

    if (product.description !== undefined) {
      updates.push(sql`description = ${product.description}`.toString());
    }

    if (product.price !== undefined) {
      updates.push(sql`price = ${product.price}`.toString());
    }

    const updateClause = updates.join(", ");

    const result = await db.execute(
      sql`UPDATE products SET ${sql.raw(updateClause)} 
          WHERE id = ${id} 
          RETURNING id, name, description, price`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      name: String(row.name),
      description: String(row.description),
      price: Number(row.price),
    };
  }

  /**
   * Met à jour une variation de produit existante
   */
  async updateProductVariation(
    id: number,
    variation: Partial<InsertProductVariation>
  ): Promise<ProductVariation | undefined> {
    // Si aucune mise à jour demandée, simplement récupérer la variation
    if (Object.keys(variation).length === 0) {
      return this.getProductVariationById(id);
    }

    // Construire la requête dynamiquement dans un style similaire aux autres méthodes
    const updates: string[] = [];

    if (variation.productId !== undefined) {
      updates.push(sql`product_id = ${variation.productId}`.toString());
    }

    if (variation.variationType !== undefined) {
      updates.push(sql`variation_type = ${variation.variationType}`.toString());
    }

    if (variation.variationValue !== undefined) {
      updates.push(
        sql`variation_value = ${variation.variationValue}`.toString()
      );
    }

    if (variation.price !== undefined) {
      updates.push(sql`price = ${variation.price}`.toString());
    }

    if (variation.stock !== undefined) {
      updates.push(sql`stock = ${variation.stock}`.toString());
    }

    if (variation.imageUrl !== undefined) {
      updates.push(sql`image_url = ${variation.imageUrl}`.toString());
    }

    const updateClause = updates.join(", ");

    const result = await db.execute(
      sql`UPDATE product_variations SET ${sql.raw(updateClause)} 
          WHERE id = ${id} 
          RETURNING id, product_id, variation_type, variation_value, price, stock, image_url`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      productId: Number(row.product_id),
      variationType: String(row.variation_type),
      variationValue: String(row.variation_value),
      price: row.price !== null ? Number(row.price) : null,
      stock: Number(row.stock),
      imageUrl: String(row.image_url),
    };
  }

  /**
   * Met à jour le stock d'une variation de produit
   */
  async updateVariationStock(
    id: number,
    quantity: number
  ): Promise<ProductVariation | undefined> {
    const result = await db.execute(
      sql`UPDATE product_variations 
          SET stock = stock + ${quantity}
          WHERE id = ${id}
          RETURNING id, product_id, variation_type, variation_value, price, stock, image_url`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      productId: Number(row.product_id),
      variationType: String(row.variation_type),
      variationValue: String(row.variation_value),
      price: row.price !== null ? Number(row.price) : null,
      stock: Number(row.stock),
      imageUrl: String(row.image_url),
    };
  }

  /**
   * Supprime un produit et toutes ses variations
   */
  async deleteProduct(id: number): Promise<boolean> {
    // Supprimer d'abord les variations associées
    await db.execute(
      sql`DELETE FROM product_variations WHERE product_id = ${id}`
    );

    const result = await db.execute(sql`DELETE FROM products WHERE id = ${id}`);

    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Supprime une variation de produit
   */
  async deleteProductVariation(id: number): Promise<boolean> {
    const result = await db.execute(
      sql`DELETE FROM product_variations WHERE id = ${id}`
    );

    return (result.rowCount ?? 0) > 0;
  }
}
