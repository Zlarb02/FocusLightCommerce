import { IStorage } from "./interfaces.js";
import { PgStorage } from "./pgStorage.js";

// Export a singleton instance
export const storage = new PgStorage();
