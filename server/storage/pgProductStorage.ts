// Implémentation PostgreSQL spécifique pour la gestion des produits
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import {
  type Product,
  type InsertProduct,
  type ProductVariation,
  type InsertProductVariation,
  type ProductWithVariations,
  type VariationImage,
} from "../../shared/schema.js";


/**
 * Gestion des produits et leurs variations dans PostgreSQL
 */
export class PgProductStorage {
  /**
   * Récupère tous les produits avec leurs variations
   */
  async getAllProducts(): Promise<ProductWithVariations[]> {
    const rawProducts = await db.execute(sql`SELECT * FROM products`);
    const rawVariations = await db.execute(
      sql`SELECT * FROM product_variations`
    );
    const rawImages = await db.execute(sql`SELECT * FROM variation_images`);

    return rawProducts.rows.map((row) => {
      const productVariations = rawVariations.rows.filter(
        (v) => v.product_id === row.id
      );
      const variations: ProductVariation[] = productVariations.map((v) => {
        const images: VariationImage[] = rawImages.rows
          .filter((img) => img.variation_id === v.id)
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map((img) => ({ url: String(img.url), order: Number(img.order) }));
        return {
          id: Number(v.id),
          productId: Number(v.product_id),
          variationType: String(v.variation_type),
          variationValue: String(v.variation_value),
          price: v.price !== null ? Number(v.price) : null,
          stock: Number(v.stock),
          images,
        };
      });
      return {
        id: Number(row.id),
        name: String(row.name),
        description: String(row.description),
        price: Number(row.price),
        variations,
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
    const imagesResult = await db.execute(
      sql`SELECT * FROM variation_images WHERE variation_id IN (${
        variationsResult.rows.map((v) => v.id).join(",") || 0
      })`
    );
    const variations: ProductVariation[] = variationsResult.rows.map((row) => {
      const images: VariationImage[] = imagesResult.rows
        .filter((img) => img.variation_id === row.id)
        .sort((a, b) => Number(a.order) - Number(b.order))
        .map((img) => ({ url: String(img.url), order: Number(img.order) }));
      return {
        id: Number(row.id),
        productId: Number(row.product_id),
        variationType: String(row.variation_type),
        variationValue: String(row.variation_value),
        price: row.price !== null ? Number(row.price) : null,
        stock: Number(row.stock),
        images,
      };
    });
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
    const result = await db.execute(sql`SELECT * FROM products`);
    const rawVariations = await db.execute(
      sql`SELECT * FROM product_variations WHERE variation_type = ${type} AND variation_value = ${value}`
    );
    const rawImages = await db.execute(sql`SELECT * FROM variation_images`);
    return result.rows.map((row) => {
      const productVariations = rawVariations.rows.filter(
        (v) => v.product_id === row.id
      );
      const variations: ProductVariation[] = productVariations.map((v) => {
        const images: VariationImage[] = rawImages.rows
          .filter((img) => img.variation_id === v.id)
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map((img) => ({ url: String(img.url), order: Number(img.order) }));
        return {
          id: Number(v.id),
          productId: Number(v.product_id),
          variationType: String(v.variation_type),
          variationValue: String(v.variation_value),
          price: v.price !== null ? Number(v.price) : null,
          stock: Number(v.stock),
          images,
        };
      });
      return {
        id: Number(row.id),
        name: String(row.name),
        description: String(row.description),
        price: Number(row.price),
        variations,
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
    
    // Récupérer les images de la variation
    const imagesResult = await db.execute(
      sql`SELECT * FROM variation_images WHERE variation_id = ${id} ORDER BY "order"`
    );
    
    const images: VariationImage[] = imagesResult.rows.map((img) => ({
      url: String(img.url),
      order: Number(img.order),
    }));

    const variation = {
      id: Number(row.id),
      productId: Number(row.product_id),
      variationType: String(row.variation_type),
      variationValue: String(row.variation_value),
      price: row.price !== null ? Number(row.price) : null,
      stock: Number(row.stock),
      images,
    };

    return variation;
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
          (product_id, variation_type, variation_value, price, stock)
          VALUES (
            ${variation.productId}, 
            ${variation.variationType}, 
            ${variation.variationValue}, 
            ${variation.price}, 
            ${variation.stock}
          )
          RETURNING id, product_id, variation_type, variation_value, price, stock`
    );
    const row = result.rows[0];
    // Insérer les images
    if (variation.images && Array.isArray(variation.images)) {
      for (const image of variation.images) {
        await db.execute(sql`
          INSERT INTO variation_images (variation_id, url, "order")
          VALUES (${row.id}, ${image.url}, ${image.order})
        `);
      }
    }
    return {
      id: Number(row.id),
      productId: Number(row.product_id),
      variationType: String(row.variation_type),
      variationValue: String(row.variation_value),
      price: row.price !== null ? Number(row.price) : null,
      stock: Number(row.stock),
      images: variation.images ?? [],
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

    // Construire la requête SQL séparément pour chaque cas
    let result;
    
    if (product.name !== undefined && product.description !== undefined && product.price !== undefined) {
      result = await db.execute(sql`
        UPDATE products 
        SET name = ${product.name}, description = ${product.description}, price = ${product.price}
        WHERE id = ${id} 
        RETURNING id, name, description, price
      `);
    } else if (product.name !== undefined && product.description !== undefined) {
      result = await db.execute(sql`
        UPDATE products 
        SET name = ${product.name}, description = ${product.description}
        WHERE id = ${id} 
        RETURNING id, name, description, price
      `);
    } else if (product.name !== undefined && product.price !== undefined) {
      result = await db.execute(sql`
        UPDATE products 
        SET name = ${product.name}, price = ${product.price}
        WHERE id = ${id} 
        RETURNING id, name, description, price
      `);
    } else if (product.description !== undefined && product.price !== undefined) {
      result = await db.execute(sql`
        UPDATE products 
        SET description = ${product.description}, price = ${product.price}
        WHERE id = ${id} 
        RETURNING id, name, description, price
      `);
    } else if (product.name !== undefined) {
      result = await db.execute(sql`
        UPDATE products 
        SET name = ${product.name}
        WHERE id = ${id} 
        RETURNING id, name, description, price
      `);
    } else if (product.description !== undefined) {
      result = await db.execute(sql`
        UPDATE products 
        SET description = ${product.description}
        WHERE id = ${id} 
        RETURNING id, name, description, price
      `);
    } else if (product.price !== undefined) {
      result = await db.execute(sql`
        UPDATE products 
        SET price = ${product.price}
        WHERE id = ${id} 
        RETURNING id, name, description, price
      `);
    } else {
      // Cas par défaut : récupérer le produit existant
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
    // Gérer les images d'abord si elles sont fournies
    if (variation.images && Array.isArray(variation.images)) {
      console.log(`🖼️  Mise à jour des images pour la variation ${id}:`, variation.images);
      
      // Supprimer les anciennes images
      const deleteResult = await db.execute(
        sql`DELETE FROM variation_images WHERE variation_id = ${id}`
      );
      console.log(`🗑️  ${deleteResult.rowCount || 0} anciennes images supprimées`);
      
      // Insérer les nouvelles
      for (const image of variation.images) {
        const insertResult = await db.execute(sql`
          INSERT INTO variation_images (variation_id, url, "order")
          VALUES (${id}, ${image.url}, ${image.order})
        `);
        console.log(`✅ Image insérée: ${image.url} (ordre: ${image.order})`);
      }
    }

    // Si seules les images sont mises à jour, retourner la variation mise à jour
    const variationData = { ...variation };
    delete variationData.images;
    
    if (Object.keys(variationData).length === 0) {
      return this.getProductVariationById(id);
    }

    // Construire la requête SQL séparément pour chaque cas
    let result;
    
    if (variation.productId !== undefined && variation.variationType !== undefined && 
        variation.variationValue !== undefined && variation.price !== undefined && 
        variation.stock !== undefined) {
      result = await db.execute(sql`
        UPDATE product_variations 
        SET product_id = ${variation.productId}, 
            variation_type = ${variation.variationType}, 
            variation_value = ${variation.variationValue}, 
            price = ${variation.price}, 
            stock = ${variation.stock}
        WHERE id = ${id} 
        RETURNING id, product_id, variation_type, variation_value, price, stock
      `);
    } else if (variation.stock !== undefined) {
      result = await db.execute(sql`
        UPDATE product_variations 
        SET stock = ${variation.stock}
        WHERE id = ${id} 
        RETURNING id, product_id, variation_type, variation_value, price, stock
      `);
    } else if (variation.price !== undefined) {
      result = await db.execute(sql`
        UPDATE product_variations 
        SET price = ${variation.price}
        WHERE id = ${id} 
        RETURNING id, product_id, variation_type, variation_value, price, stock
      `);
    } else if (variation.variationType !== undefined) {
      result = await db.execute(sql`
        UPDATE product_variations 
        SET variation_type = ${variation.variationType}
        WHERE id = ${id} 
        RETURNING id, product_id, variation_type, variation_value, price, stock
      `);
    } else if (variation.variationValue !== undefined) {
      result = await db.execute(sql`
        UPDATE product_variations 
        SET variation_value = ${variation.variationValue}
        WHERE id = ${id} 
        RETURNING id, product_id, variation_type, variation_value, price, stock
      `);
    } else if (variation.productId !== undefined) {
      result = await db.execute(sql`
        UPDATE product_variations 
        SET product_id = ${variation.productId}
        WHERE id = ${id} 
        RETURNING id, product_id, variation_type, variation_value, price, stock
      `);
    } else {
      return this.getProductVariationById(id);
    }

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    
    // Récupérer les images de la variation
    const imagesResult = await db.execute(
      sql`SELECT * FROM variation_images WHERE variation_id = ${id} ORDER BY "order"`
    );
    
    const images: VariationImage[] = imagesResult.rows.map((img) => ({
      url: String(img.url),
      order: Number(img.order),
    }));

    return {
      id: Number(row.id),
      productId: Number(row.product_id),
      variationType: String(row.variation_type),
      variationValue: String(row.variation_value),
      price: row.price !== null ? Number(row.price) : null,
      stock: Number(row.stock),
      images,
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
          RETURNING id, product_id, variation_type, variation_value, price, stock`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    
    // Récupérer les images de la variation
    const imagesResult = await db.execute(
      sql`SELECT * FROM variation_images WHERE variation_id = ${id} ORDER BY "order"`
    );
    
    const images: VariationImage[] = imagesResult.rows.map((img) => ({
      url: String(img.url),
      order: Number(img.order),
    }));

    return {
      id: Number(row.id),
      productId: Number(row.product_id),
      variationType: String(row.variation_type),
      variationValue: String(row.variation_value),
      price: row.price !== null ? Number(row.price) : null,
      stock: Number(row.stock),
      images,
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
