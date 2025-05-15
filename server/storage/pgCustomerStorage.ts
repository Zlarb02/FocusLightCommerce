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

    // Construire la requête dynamiquement dans un style similaire aux autres méthodes
    let updateSQL = sql`UPDATE customers SET `;
    const updates: string[] = [];

    if (customer.firstName !== undefined) {
      updates.push(sql`first_name = ${customer.firstName}`.toString());
    }

    if (customer.lastName !== undefined) {
      updates.push(sql`last_name = ${customer.lastName}`.toString());
    }

    if (customer.email !== undefined) {
      updates.push(sql`email = ${customer.email}`.toString());
    }

    if (customer.phone !== undefined) {
      updates.push(sql`phone = ${customer.phone}`.toString());
    }

    if (customer.address !== undefined) {
      updates.push(sql`address = ${customer.address}`.toString());
    }

    if (customer.city !== undefined) {
      updates.push(sql`city = ${customer.city}`.toString());
    }

    if (customer.postalCode !== undefined) {
      updates.push(sql`postal_code = ${customer.postalCode}`.toString());
    }

    if (customer.country !== undefined) {
      updates.push(sql`country = ${customer.country}`.toString());
    }

    const updateClause = updates.join(", ");

    const result = await db.execute(
      sql`UPDATE customers SET ${sql.raw(updateClause)} 
          WHERE id = ${id} 
          RETURNING id, first_name, last_name, email, phone, address, city, postal_code, country`
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
}
