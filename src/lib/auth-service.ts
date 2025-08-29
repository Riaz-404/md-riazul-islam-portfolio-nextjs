import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import Admin from "@/models/Admin";
import { mongoDBConnection } from "@/databases/db-connection";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async generateToken(email: string): Promise<string> {
    const token = await new SignJWT({ email, isAdmin: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    return token;
  }

  static async verifyToken(
    token: string
  ): Promise<{ email: string; isAdmin: boolean } | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return {
        email: payload.email as string,
        isAdmin: payload.isAdmin as boolean,
      };
    } catch {
      return null;
    }
  }

  static async authenticateAdmin(
    email: string,
    password: string
  ): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
      await mongoDBConnection();

      const admin = await Admin.findOne({ email });
      if (!admin) {
        return { success: false, message: "Invalid credentials" };
      }

      const isPasswordValid = await this.verifyPassword(
        password,
        admin.password
      );
      if (!isPasswordValid) {
        return { success: false, message: "Invalid credentials" };
      }

      const token = await this.generateToken(admin.email);
      return { success: true, token };
    } catch (error) {
      console.error("Authentication error:", error);
      return { success: false, message: "Authentication failed" };
    }
  }

  static async createAdmin(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await mongoDBConnection();

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return { success: false, message: "Admin already exists" };
      }

      const hashedPassword = await this.hashPassword(password);
      const admin = new Admin({
        email,
        password: hashedPassword,
      });

      await admin.save();
      return { success: true, message: "Admin created successfully" };
    } catch (error) {
      console.error("Create admin error:", error);
      return { success: false, message: "Failed to create admin" };
    }
  }
}
