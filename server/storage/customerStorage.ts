import { type Customer, type InsertCustomer } from "../../shared/schema.js";

export class CustomerStorage {
  private customers: Map<number, Customer>;
  private customerId: number;

  constructor(
    customerId: number = 1,
    customers: Map<number, Customer> = new Map()
  ) {
    this.customers = customers;
    this.customerId = customerId;
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.customerId++;
    const newCustomer = {
      ...customer,
      id,
      address: customer.address ?? null,
      city: customer.city ?? null,
      postalCode: customer.postalCode ?? null,
      country: customer.country ?? null,
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(
    id: number,
    customer: Partial<InsertCustomer>
  ): Promise<Customer | undefined> {
    const existingCustomer = this.customers.get(id);
    if (!existingCustomer) return undefined;

    const updatedCustomer = { ...existingCustomer, ...customer };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  // Getter for internal state
  getCustomerIdCounter(): number {
    return this.customerId;
  }

  getCustomersMap(): Map<number, Customer> {
    return this.customers;
  }
}
