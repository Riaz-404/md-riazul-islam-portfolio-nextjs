import mongoose, { Schema, Document } from "mongoose";

// Define interfaces for MongoDB documents
interface ISkillItem {
  id: string;
  name: string;
  description: string;
}

interface ISkillCategory {
  id: string;
  name: string;
  items: ISkillItem[];
}

interface IAboutMyself {
  title: string;
  description: string[];
}

interface IAboutSkills {
  title: string;
  categories: ISkillCategory[];
}

interface IAbout extends Document {
  id: string;
  myself: IAboutMyself;
  skills: IAboutSkills;
  updatedAt: Date;
  createdAt: Date;
}

// Define the skill item schema
const SkillItemSchema = new Schema<ISkillItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

// Define the skill category schema
const SkillCategorySchema = new Schema<ISkillCategory>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    items: [SkillItemSchema],
  },
  { _id: false }
);

// Define the about myself schema
const AboutMyselfSchema = new Schema<IAboutMyself>(
  {
    title: { type: String, required: true },
    description: [{ type: String, required: true }],
  },
  { _id: false }
);

// Define the about skills schema
const AboutSkillsSchema = new Schema<IAboutSkills>(
  {
    title: { type: String, required: true },
    categories: [SkillCategorySchema],
  },
  { _id: false }
);

// Define the main about schema
const AboutSchema = new Schema<IAbout>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: "default-about",
    },
    myself: {
      type: AboutMyselfSchema,
      required: true,
    },
    skills: {
      type: AboutSkillsSchema,
      required: true,
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
    collection: "about",
  }
);

// Export the model
const About =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
export type { IAbout };
