import { mongoDBConnection } from "@/databases/db-connection";
import Expertise from "@/models/Expertise";

/**
 * Initialize the expertise collection with default data if it doesn't exist
 */
export async function initializeExpertiseData() {
  try {
    await mongoDBConnection();

    const existingData = await Expertise.findOne({ id: "default-expertise" });

    if (!existingData) {
      const defaultExpertiseData = {
        id: "default-expertise",
        title: "Expertise",
        subtitle: "Skills Set",
        categories: [
          {
            id: "programming",
            name: "Programming Languages",
            skills: [
              {
                id: "cpp",
                name: "C++",
                percentage: 90,
                category: "programming",
              },
              {
                id: "python",
                name: "Python",
                percentage: 70,
                category: "programming",
              },
              {
                id: "javascript",
                name: "JavaScript",
                percentage: 85,
                category: "programming",
              },
              {
                id: "typescript",
                name: "TypeScript",
                percentage: 80,
                category: "programming",
              },
            ],
          },
          {
            id: "frontend",
            name: "Frontend Development",
            skills: [
              {
                id: "react",
                name: "React",
                percentage: 90,
                category: "frontend",
              },
              {
                id: "nextjs",
                name: "Next.js",
                percentage: 85,
                category: "frontend",
              },
              {
                id: "html",
                name: "HTML5",
                percentage: 95,
                category: "frontend",
              },
              { id: "css", name: "CSS3", percentage: 90, category: "frontend" },
              {
                id: "tailwind",
                name: "Tailwind CSS",
                percentage: 85,
                category: "frontend",
              },
              {
                id: "bootstrap",
                name: "Bootstrap",
                percentage: 80,
                category: "frontend",
              },
            ],
          },
          {
            id: "backend",
            name: "Backend Development",
            skills: [
              {
                id: "nodejs",
                name: "Node.js",
                percentage: 80,
                category: "backend",
              },
              {
                id: "express",
                name: "Express.js",
                percentage: 75,
                category: "backend",
              },
              {
                id: "mongodb",
                name: "MongoDB",
                percentage: 85,
                category: "backend",
              },
              {
                id: "mysql",
                name: "MySQL",
                percentage: 70,
                category: "backend",
              },
            ],
          },
          {
            id: "tools",
            name: "Tools & Technologies",
            skills: [
              { id: "git", name: "Git", percentage: 85, category: "tools" },
              {
                id: "github",
                name: "GitHub",
                percentage: 90,
                category: "tools",
              },
              {
                id: "vscode",
                name: "VS Code",
                percentage: 95,
                category: "tools",
              },
              { id: "figma", name: "Figma", percentage: 70, category: "tools" },
            ],
          },
        ],
      };

      const expertiseDocument = new Expertise(defaultExpertiseData);

      await expertiseDocument.save();
      // Initialized expertise data with default values
      return expertiseDocument;
    }

    // Expertise data already exists
    return existingData;
  } catch (error) {
    console.error("❌ Failed to initialize expertise data:", error);
    throw error;
  }
}

/**
 * Get expertise data from database
 */
export async function getExpertiseData() {
  try {
    await mongoDBConnection();

    let expertiseDocument = await Expertise.findOne({
      id: "default-expertise",
    });

    if (!expertiseDocument) {
      expertiseDocument = await initializeExpertiseData();
    }

    return {
      id: expertiseDocument.id,
      title: expertiseDocument.title,
      subtitle: expertiseDocument.subtitle,
      categories: expertiseDocument.categories,
      updatedAt: expertiseDocument.updatedAt.toISOString(),
      createdAt: expertiseDocument.createdAt?.toISOString(),
    };
  } catch (error) {
    console.error("❌ Failed to get expertise data:", error);
    throw error;
  }
}

/**
 * Update expertise data in database
 */
export async function updateExpertiseData(data: {
  title?: string;
  subtitle?: string;
  categories?: any[];
}) {
  try {
    await mongoDBConnection();

    const updatedDocument = await Expertise.findOneAndUpdate(
      { id: "default-expertise" },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedDocument) {
      throw new Error("Failed to update expertise data");
    }

    return {
      id: updatedDocument.id,
      title: updatedDocument.title,
      subtitle: updatedDocument.subtitle,
      categories: updatedDocument.categories,
      updatedAt: updatedDocument.updatedAt.toISOString(),
      createdAt: updatedDocument.createdAt?.toISOString(),
    };
  } catch (error) {
    console.error("❌ Failed to update expertise data:", error);
    throw error;
  }
}
