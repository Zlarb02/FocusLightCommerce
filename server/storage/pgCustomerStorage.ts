// Implémentation PostgreSQL spécifique pour la gestion des clients
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import { type Customer, type InsertCustomer } from "../../shared/schema.js";

/**
 * Gestion des clients dans PostgreSQL
 */
export class PgCustomerStorage {
  /**
   * Récupère un client par son ID
   */
  async getCustomerById(id: number): Promise<Customer | undefined> {
    const result = await db.execute(
      sql`SELECT * FROM customers WHERE id = ${id}`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      firstName: String(row.first_name),
      lastName: String(row.last_name),
      email: String(row.email),
      phone: String(row.phone),
      address: row.address ? String(row.address) : null,
      city: row.city ? String(row.city) : null,
      postalCode: row.postal_code ? String(row.postal_code) : null,
      country: row.country ? String(row.country) : null,
    };
  }

  /**
   * Récupère un client par son email
   */
  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const result = await db.execute(
      sql`SELECT * FROM customers WHERE email = ${email}`
    );

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      firstName: String(row.first_name),
      lastName: String(row.last_name),
      email: String(row.email),
      phone: String(row.phone),
      address: row.address ? String(row.address) : null,
      city: row.city ? String(row.city) : null,
      postalCode: row.postal_code ? String(row.postal_code) : null,
      country: row.country ? String(row.country) : null,
    };
  }

  /**
   * Crée un nouveau client
   */
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.execute(
      sql`INSERT INTO customers 
          (first_name, last_name, email, phone, address, city, postal_code, country)
          VALUES (
            ${customer.firstName}, 
            ${customer.lastName}, 
            ${customer.email}, 
            ${customer.phone}, 
            ${customer.address}, 
            ${customer.city}, 
            ${customer.postalCode}, 
            ${customer.country}
          )
          RETURNING id, first_name, last_name, email, phone, address, city, postal_code, country`
    );

    const row = result.rows[0];
    return {
      id: Number(row.id),
      firstName: String(row.first_name),
      lastName: String(row.last_name),
      email: String(row.email),
      phone: String(row.phone),
      address: row.address ? String(row.address) : null,
      city: row.city ? String(row.city) : null,
      postalCode: row.postal_code ? String(row.postal_code) : null,
      country: row.country ? String(row.country) : null,
    };
  }

  /**
   * Met à jour un client existant
   */
  async updateCustomer(
    id: number,
    customer: Partial<InsertCustomer>
  ): Promise<Customer | undefined> {
    // Si aucune mise à jour demandée, simplement récupérer le client
    if (Object.keys(customer).length === 0) {
      return this.getCustomerById(id);
    }

    // Construire la requête avec template literals et paramètres
    let queryParts = ["UPDATE customers SET "];
    let values: any[] = [];

    if (customer.firstName !== undefined) {
      queryParts.push(queryParts.length > 1 ? ", " : "", "first_name = ");
      values.push(customer.firstName);
    }
    if (customer.lastName !== undefined) {
      queryParts.push(queryParts.length > 1 ? ", " : "", "last_name = ");
      values.push(customer.lastName);
    }
    if (customer.email !== undefined) {
      queryParts.push(queryParts.length > 1 ? ", " : "", "email = ");
      values.push(customer.email);
    }
    if (customer.phone !== undefined) {
      queryParts.push(queryParts.length > 1 ? ", " : "", "phone = ");
      values.push(customer.phone);
    }
    if (customer.address !== undefined) {
      queryParts.push(queryParts.length > 1 ? ", " : "", "address = ");
      values.push(customer.address);
    }
    if (customer.city !== undefined) {
      queryParts.push(queryParts.length > 1 ? ", " : "", "city = ");
      values.push(customer.city);
    }
    if (customer.postalCode !== undefined) {
      queryParts.push(queryParts.length > 1 ? ", " : "", "postal_code = ");
      values.push(customer.postalCode);
    }
    if (customer.country !== undefined) {
      queryParts.push(queryParts.length > 1 ? ", " : "", "country = ");
      values.push(customer.country);
    }

    queryParts.push(" WHERE id = ");
    values.push(id);
    queryParts.push(
      " RETURNING id, first_name, last_name, email, phone, address, city, postal_code, country"
    );

    // Utiliser la syntaxe template de sql avec les valeurs séparément
    const updateQuery = sql`UPDATE customers SET 
      first_name = COALESCE(${customer.firstName}, first_name),
      last_name = COALESCE(${customer.lastName}, last_name),
      email = COALESCE(${customer.email}, email),
      phone = COALESCE(${customer.phone}, phone),
      address = COALESCE(${customer.address}, address),
      city = COALESCE(${customer.city}, city),
      postal_code = COALESCE(${customer.postalCode}, postal_code),
      country = COALESCE(${customer.country}, country)
      WHERE id = ${id}
      RETURNING id, first_name, last_name, email, phone, address, city, postal_code, country`;

    const result = await db.execute(updateQuery);

    if (result.rowCount === 0 || result.rowCount === undefined) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      firstName: String(row.first_name),
      lastName: String(row.last_name),
      email: String(row.email),
      phone: String(row.phone || ""),
      address: String(row.address || ""),
      city: String(row.city || ""),
      postalCode: String(row.postal_code || ""),
      country: String(row.country || "FR"),
    };
  }
}
