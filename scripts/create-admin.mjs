#!/usr/bin/env node

// Load environment variables
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function createAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log("Usage: pnpm admin:create <email> <password>");
    console.log("Example: pnpm admin:create admin@example.com mypassword123");
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
    // Dynamically import the auth service
    const { AuthService } = await import("../src/lib/auth-service.js");

    console.log("Creating admin user...");
    const result = await AuthService.createAdmin(email, password);

    if (result.success) {
      console.log("✅ Admin user created successfully!");
      console.log(`Email: ${email}`);
      console.log(
        "You can now use these credentials to log in to the admin panel."
      );
    } else {
      console.error("❌ Failed to create admin user:", result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
}

createAdmin();
