import { Schema, model, models, Document } from "mongoose";

export interface IPublication extends Document {
  title: string;
  authors: string[];
  venue: string; // Journal name or conference
  year: number;
  url?: string; // DOI or external link
  abstract?: string;
  type: "journal" | "conference" | "book" | "thesis" | "other";
  tags: string[];
  featured: boolean;
  isActive: boolean;
  order: number;
}

const PublicationSchema = new Schema<IPublication>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    authors: {
      type: [String],
      required: true,
      default: [],
    },
    venue: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      trim: true,
    },
    abstract: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["journal", "conference", "book", "thesis", "other"],
      default: "journal",
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Publication =
  models.Publication || model<IPublication>("Publication", PublicationSchema);
