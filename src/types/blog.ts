export interface BlogImage {
  filename: string;
  contentType: string;
  url: string;
  publicId: string;
}

export interface BlogData {
  _id?: string;
  title: string;
  slug: string;
  type: "internal" | "external";
  // Internal
  content?: string;
  draft?: boolean;
  // External
  externalUrl?: string;
  source?: string;
  // Common
  excerpt: string;
  coverImage?: BlogImage;
  tags: string[];
  category: string;
  publishedAt: Date;
  featured: boolean;
  isActive: boolean;
  order: number;
  views?: number;
  loves?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogsResponse {
  success: boolean;
  data?: BlogData[];
  message?: string;
}

export interface BlogResponse {
  success: boolean;
  data?: BlogData;
  message?: string;
}

export const blogCategories = [
  "Tutorial",
  "Tips & Tricks",
  "Project Showcase",
  "Career",
  "Technology",
  "Web Development",
  "Open Source",
  "Other",
];
