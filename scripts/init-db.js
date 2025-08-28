#!/usr/bin/env node

/**
 * Database initialization script
 * This script will initialize the MongoDB database with default data
 *
 * Usage: node scripts/init-db.js
 */

const { initializeAboutData } = require("../src/lib/about-service");

async function main() {
  console.log("🚀 Starting database initialization...");

  try {
    await initializeAboutData();
    console.log("✅ Database initialization completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

main();
