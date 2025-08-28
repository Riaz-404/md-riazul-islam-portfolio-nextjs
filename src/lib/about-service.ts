import { mongoDBConnection } from "@/databases/db-connection";
import About from "@/models/About";
import { defaultAboutData } from "@/types/about";

/**
 * Initialize the about collection with default data if it doesn't exist
 */
export async function initializeAboutData() {
  try {
    await mongoDBConnection();

    const existingData = await About.findOne({ id: "default-about" });

    if (!existingData) {
      const aboutDocument = new About({
        id: "default-about",
        myself: defaultAboutData.myself,
        skills: defaultAboutData.skills,
      });

      await aboutDocument.save();
      console.log("✅ Initialized about data with default values");
      return aboutDocument;
    }

    console.log("ℹ️ About data already exists");
    return existingData;
  } catch (error) {
    console.error("❌ Failed to initialize about data:", error);
    throw error;
  }
}

/**
 * Get about data from database
 */
export async function getAboutData() {
  try {
    await mongoDBConnection();

    let aboutDocument = await About.findOne({ id: "default-about" });

    if (!aboutDocument) {
      aboutDocument = await initializeAboutData();
    }

    return {
      id: aboutDocument.id,
      myself: aboutDocument.myself,
      skills: aboutDocument.skills,
      updatedAt: aboutDocument.updatedAt.toISOString(),
      createdAt: aboutDocument.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("❌ Failed to get about data:", error);
    throw error;
  }
}

/**
 * Update about data in database
 */
export async function updateAboutData(data: { myself: any; skills: any }) {
  try {
    await mongoDBConnection();

    const aboutDocument = await About.findOneAndUpdate(
      { id: "default-about" },
      {
        myself: data.myself,
        skills: data.skills,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return {
      id: aboutDocument.id,
      myself: aboutDocument.myself,
      skills: aboutDocument.skills,
      updatedAt: aboutDocument.updatedAt.toISOString(),
      createdAt: aboutDocument.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("❌ Failed to update about data:", error);
    throw error;
  }
}
