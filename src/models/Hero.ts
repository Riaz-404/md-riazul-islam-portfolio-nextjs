import mongoose, { Schema, Document } from "mongoose";

// Define interfaces for MongoDB documents
interface ITechIcon {
  id: string;
  src: string;
  title: string;
}

interface IRotatingText {
  id: string;
  text: string;
}

interface IHero extends Document {
  id: string;
  name: string;
  rotatingTexts: IRotatingText[];
  description: string;
  profileImage: string;
  cvDownloadUrl: string;
  techIcons: ITechIcon[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for tech icons
const TechIconSchema = new Schema({
  id: { type: String, required: true },
  src: { type: String, required: true },
  title: { type: String, required: true },
});

// Schema for rotating texts
const RotatingTextSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

// Hero schema
const HeroSchema = new Schema<IHero>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rotatingTexts: [RotatingTextSchema],
    description: { type: String, required: true },
    profileImage: { type: String, required: true },
    cvDownloadUrl: { type: String, required: true },
    techIcons: [TechIconSchema],
  },
  {
    timestamps: true,
  }
);

// Create the model
const Hero = mongoose.models.Hero || mongoose.model<IHero>("Hero", HeroSchema);

export default Hero;
export type { IHero, ITechIcon, IRotatingText };
