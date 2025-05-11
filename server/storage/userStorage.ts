import { type User, type InsertUser } from "../../shared/schema.js";
import bcrypt from "bcrypt";

export class UserStorage {
  private users: Map<number, User>;
  private userId: number;

  constructor(userId: number = 1, users: Map<number, User> = new Map()) {
    this.users = users;
    this.userId = userId;
  }

  async initializeDefaultAdmin() {
    // Initialize with default admin user only if ADMIN_PASSWORD is set
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword) {
      await this.createUser({
        username: "admin",
        password: adminPassword,
      });
    } else {
      console.log("No ADMIN_PASSWORD set, fake admin user creation");
      await this.createUser({
        username: "admin",
        password: "admin",
      });
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, id, isAdmin: true, password: hashedPassword };
    this.users.set(id, newUser);
    return newUser;
  }

  async verifyUser(
    username: string,
    password: string
  ): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    }
    return undefined;
  }

  // Getter for internal state
  getUserIdCounter(): number {
    return this.userId;
  }

  getUsersMap(): Map<number, User> {
    return this.users;
  }
}
