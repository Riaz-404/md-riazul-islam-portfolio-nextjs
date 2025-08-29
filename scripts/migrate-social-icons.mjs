#!/usr/bin/env node

/**
 * Migration script to update social links from Lucide icons to Icons8 URLs
 * This script should be run once to migrate existing data
 */

import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

// Mapping of common Lucide icon names to Icons8 URLs
const iconMapping = {
  Facebook: "https://img.icons8.com/fluency/48/facebook-new.png",
  Linkedin: "https://img.icons8.com/fluency/48/linkedin.png",
  Github: "https://img.icons8.com/fluency/48/github.png",
  Twitter: "https://img.icons8.com/fluency/48/twitter.png",
  Instagram: "https://img.icons8.com/fluency/48/instagram-new.png",
  Youtube: "https://img.icons8.com/fluency/48/youtube-play.png",
  Mail: "https://img.icons8.com/fluency/48/email.png",
  ExternalLink: "https://img.icons8.com/fluency/48/external-link.png",
  Globe: "https://img.icons8.com/fluency/48/globe.png",
  Phone: "https://img.icons8.com/fluency/48/phone.png",
};

async function migrateSocialIcons() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();

    const db = client.db();
    const collection = db.collection("navigations");

    console.log("Finding navigation documents...");
    const navigations = await collection.find({}).toArray();

    for (const navigation of navigations) {
      let updated = false;

      if (navigation.socialLinks && Array.isArray(navigation.socialLinks)) {
        navigation.socialLinks.forEach((link) => {
          // Check if icon is a Lucide icon name (not a URL)
          if (link.icon && !link.icon.startsWith("http")) {
            const mappedUrl = iconMapping[link.icon];
            if (mappedUrl) {
              console.log(
                `Updating icon for ${link.label}: ${link.icon} -> ${mappedUrl}`
              );
              link.icon = mappedUrl;
              updated = true;
            } else {
              console.warn(
                `No mapping found for icon: ${link.icon} (${link.label})`
              );
              // Set a default external link icon for unmapped icons
              link.icon = iconMapping["ExternalLink"];
              updated = true;
            }
          }

          // Remove iconType field if it exists
          if (link.iconType !== undefined) {
            delete link.iconType;
            updated = true;
          }
        });
      }

      if (updated) {
        console.log(`Updating navigation document: ${navigation._id}`);
        await collection.updateOne(
          { _id: navigation._id },
          { $set: { socialLinks: navigation.socialLinks } }
        );
      }
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run migration
migrateSocialIcons().catch(console.error);
