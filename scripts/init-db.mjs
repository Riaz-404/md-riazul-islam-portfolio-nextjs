#!/usr/bin/env node

/**
 * Simple database initialization script using plain JavaScript
 * This approach doesn't require additional dependencies like tsx or ts-node
 */

import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../.env") });

import { mongoDBConnection } from "../src/databases/db-connection.js";
import mongoose from "mongoose";

// Default data
const defaultAboutData = {
  id: "default-about",
  myself: {
    title: "About Myself",
    description: [
      "I'm a passionate Full Stack Web Developer with expertise in modern web technologies. I love creating efficient, scalable, and user-friendly applications.",
      "With a strong foundation in both frontend and backend development, I enjoy solving complex problems and building innovative solutions.",
    ],
  },
  skills: {
    title: "My Skills",
    categories: [
      {
        id: "frontend",
        name: "Frontend Development",
        items: [
          {
            id: "react",
            name: "React.js",
            description: "Building dynamic and interactive user interfaces",
          },
          {
            id: "nextjs",
            name: "Next.js",
            description:
              "Full-stack React framework for production applications",
          },
          {
            id: "typescript",
            name: "TypeScript",
            description: "Type-safe JavaScript development",
          },
          {
            id: "tailwind",
            name: "Tailwind CSS",
            description: "Utility-first CSS framework for rapid styling",
          },
        ],
      },
      {
        id: "backend",
        name: "Backend Development",
        items: [
          {
            id: "nodejs",
            name: "Node.js",
            description: "Server-side JavaScript runtime",
          },
          {
            id: "mongodb",
            name: "MongoDB",
            description: "NoSQL database for modern applications",
          },
          {
            id: "api",
            name: "RESTful APIs",
            description: "Designing and implementing web APIs",
          },
        ],
      },
    ],
  },
};

const defaultExpertiseData = {
  id: "default-expertise",
  title: "Expertise",
  subtitle: "Skills Set",
  categories: [
    {
      id: "programming",
      name: "Programming Languages",
      skills: [
        { id: "cpp", name: "C++", percentage: 90, category: "programming" },
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
        { id: "react", name: "React", percentage: 90, category: "frontend" },
        { id: "nextjs", name: "Next.js", percentage: 85, category: "frontend" },
        { id: "html", name: "HTML5", percentage: 95, category: "frontend" },
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
        { id: "nodejs", name: "Node.js", percentage: 80, category: "backend" },
        {
          id: "express",
          name: "Express.js",
          percentage: 75,
          category: "backend",
        },
        { id: "mongodb", name: "MongoDB", percentage: 85, category: "backend" },
        { id: "mysql", name: "MySQL", percentage: 70, category: "backend" },
      ],
    },
    {
      id: "tools",
      name: "Tools & Technologies",
      skills: [
        { id: "git", name: "Git", percentage: 85, category: "tools" },
        { id: "github", name: "GitHub", percentage: 90, category: "tools" },
        { id: "vscode", name: "VS Code", percentage: 95, category: "tools" },
        { id: "figma", name: "Figma", percentage: 70, category: "tools" },
      ],
    },
  ],
};

async function createSchemas() {
  // About Schema
  const SkillItemSchema = new mongoose.Schema(
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
    },
    { _id: false }
  );

  const SkillCategorySchema = new mongoose.Schema(
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      items: [SkillItemSchema],
    },
    { _id: false }
  );

  const AboutSchema = new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      myself: {
        title: { type: String, required: true },
        description: [{ type: String, required: true }],
      },
      skills: {
        title: { type: String, required: true },
        categories: [SkillCategorySchema],
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

  // Expertise Schema
  const ExpertiseSkillSchema = new mongoose.Schema(
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      percentage: { type: Number, required: true, min: 0, max: 100 },
      category: { type: String, required: true },
    },
    { _id: false }
  );

  const ExpertiseCategorySchema = new mongoose.Schema(
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      skills: [ExpertiseSkillSchema],
    },
    { _id: false }
  );

  const ExpertiseSchema = new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      categories: [ExpertiseCategorySchema],
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

  return {
    About: mongoose.models.About || mongoose.model("About", AboutSchema),
    Expertise:
      mongoose.models.Expertise || mongoose.model("Expertise", ExpertiseSchema),
  };
}

async function initializeData() {
  try {
    console.log("🚀 Starting database initialization...");

    await mongoDBConnection();
    const { About, Expertise } = await createSchemas();

    // Initialize About data
    const existingAbout = await About.findOne({ id: "default-about" });
    if (!existingAbout) {
      const aboutDocument = new About(defaultAboutData);
      await aboutDocument.save();
      console.log("✅ Initialized about data with default values");
    } else {
      console.log("ℹ️ About data already exists");
    }

    // Initialize Expertise data
    const existingExpertise = await Expertise.findOne({
      id: "default-expertise",
    });
    if (!existingExpertise) {
      const expertiseDocument = new Expertise(defaultExpertiseData);
      await expertiseDocument.save();
      console.log("✅ Initialized expertise data with default values");
    } else {
      console.log("ℹ️ Expertise data already exists");
    }

    console.log("✅ Database initialization completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

initializeData();
