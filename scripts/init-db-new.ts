#!/usr/bin/env tsx

/**
 * Database initialization script
 * This script will initialize the MongoDB database with default data
 *
 * Usage: npx tsx scripts/init-db.ts
 */

import { initializeAboutData } from "../src/lib/about-service";
import { initializeExpertiseData } from "../src/lib/expertise-service";

async function main() {
  console.log("🚀 Starting database initialization...");

  try {
    await initializeAboutData();
    await initializeExpertiseData();
    console.log("✅ Database initialization completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

main();
