#!/usr/bin/env node

// Standalone script to create admin user
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Admin Schema
const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      "Usage: node scripts/create-admin-standalone.mjs <email> <password>"
    );
    console.log(
      "Example: node scripts/create-admin-standalone.mjs admin@example.com mypassword123"
    );
    process.exit(1);
  }

  const [email, password] = args;

  if (!email || !password) {
    console.error("Email and password are required");
    process.exit(1);
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Please provide a valid email address");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("Password must be at least 6 characters long");
    process.exit(1);
  }

  try {
    // Connect to database
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    console.log("Connecting to database...");
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to database successfully");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.error("❌ Admin with this email already exists");
      process.exit(1);
    }

    // Hash password
    console.log("Hashing password...");
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin
    console.log("Creating admin user...");
    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(
      "You can now use these credentials to log in to the admin panel at /admin/login"
    );
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

createAdmin();
