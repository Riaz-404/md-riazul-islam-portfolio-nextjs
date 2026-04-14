import { Schema, model, models, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  type: "internal" | "external";
  // Internal post fields
  content?: string; // Rich text HTML
  draft?: boolean;
  // External article fields
  externalUrl?: string;
  source?: string; // e.g. "Medium", "Dev.to"
  // Common fields
  excerpt: string;
  coverImage?: {
    filename: string;
    contentType: string;
    url: string;
    publicId: string;
  };
  tags: string[];
  category: string;
  publishedAt: Date;
  featured: boolean;
  isActive: boolean;
  order: number;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["internal", "external"],
      required: true,
      default: "internal",
    },
    content: {
      type: String,
      default: "",
    },
    draft: {
      type: Boolean,
      default: true,
    },
    externalUrl: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    coverImage: {
      filename: String,
      contentType: String,
      url: String,
      publicId: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
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

// Auto-generate slug from title before saving
BlogSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

export const Blog = models.Blog || model<IBlog>("Blog", BlogSchema);
