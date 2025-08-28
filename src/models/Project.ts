import { Schema, model, models, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string; // Rich text HTML content
  features: string[];
  shortDescription: string;
  category: string;
  framework: string;
  duration: string;
  createdDate: Date;
  responsive: boolean;
  browserCompatible: boolean;
  documentation: boolean;
  tags: string[];
  liveUrl?: string;
  frontendCodeUrl?: string;
  backendCodeUrl?: string;
  mainImage: {
    filename: string;
    contentType: string;
    data: Buffer;
  };
  fullPageImage?: {
    filename: string;
    contentType: string;
    data: Buffer;
  };
  additionalImages?: Array<{
    filename: string;
    contentType: string;
    data: Buffer;
  }>;
  featured: boolean;
  order: number;
}

const ProjectSchema = new Schema<IProject>(
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
    description: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
    },
    framework: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      required: true,
    },
    responsive: {
      type: Boolean,
      default: true,
    },
    browserCompatible: {
      type: Boolean,
      default: true,
    },
    documentation: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    liveUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Live URL must be a valid URL",
      },
    },
    frontendCodeUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Frontend code URL must be a valid URL",
      },
    },
    backendCodeUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Backend code URL must be a valid URL",
      },
    },
    mainImage: {
      filename: { type: String, required: true },
      contentType: { type: String, required: true },
      data: { type: Buffer, required: true },
    },
    fullPageImage: {
      filename: { type: String },
      contentType: { type: String },
      data: { type: Buffer },
    },
    additionalImages: [
      {
        filename: { type: String, required: true },
        contentType: { type: String, required: true },
        data: { type: Buffer, required: true },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
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

// Create slug from title before saving
ProjectSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

const Project = models.Project || model<IProject>("Project", ProjectSchema);

export default Project;
