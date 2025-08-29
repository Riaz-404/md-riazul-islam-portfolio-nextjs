import mongoose, { Schema, Document } from "mongoose";

interface IExpertiseSkill {
  id: string;
  name: string;
  percentage: number;
  category: string;
}

interface IExpertiseCategory {
  id: string;
  name: string;
  skills: IExpertiseSkill[];
}

interface IExpertise extends Document {
  id: string;
  title: string;
  subtitle: string;
  categories: IExpertiseCategory[];
  updatedAt: Date;
  createdAt: Date;
}

// Define the expertise skill schema
const ExpertiseSkillSchema = new Schema<IExpertiseSkill>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    category: { type: String, required: true },
  },
  { _id: false }
);

// Define the expertise category schema
const ExpertiseCategorySchema = new Schema<IExpertiseCategory>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    skills: [ExpertiseSkillSchema],
  },
  { _id: false }
);

// Define the main expertise schema
const ExpertiseSchema = new Schema<IExpertise>(
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

// Create the model
const Expertise =
  mongoose.models.Expertise ||
  mongoose.model<IExpertise>("Expertise", ExpertiseSchema);

export default Expertise;
