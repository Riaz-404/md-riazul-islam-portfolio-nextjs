export interface ProjectImage {
  filename: string;
  contentType: string;
  data: Buffer | string; // Buffer for server, base64 string for client
}

export interface ProjectData {
  _id?: string;
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
  mainImage: ProjectImage;
  fullPageImage?: ProjectImage;
  additionalImages?: ProjectImage[];
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectFormData {
  title: string;
  description: string[];
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
  mainImageFile?: File;
  fullPageImageFile?: File;
  additionalImageFiles?: File[];
  featured: boolean;
  order: number;
}

export interface ProjectsResponse {
  success: boolean;
  data?: ProjectData[];
  message?: string;
}

export interface ProjectResponse {
  success: boolean;
  data?: ProjectData;
  message?: string;
}

export const defaultProjectData: ProjectFormData = {
  title: "",
  description: [""],
  features: [""],
  shortDescription: "",
  category: "",
  framework: "",
  duration: "",
  createdDate: new Date(),
  responsive: true,
  browserCompatible: true,
  documentation: true,
  tags: [""],
  liveUrl: "",
  frontendCodeUrl: "",
  backendCodeUrl: "",
  featured: false,
  order: 0,
};

export const projectCategories = [
  "Web Application",
  "E-commerce",
  "Portfolio",
  "Blog",
  "Dashboard",
  "Landing Page",
  "Mobile App",
  "Desktop App",
  "Game",
  "Tool",
  "API",
  "Other",
];

export const frameworks = [
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express.js",
  "Laravel",
  "Django",
  "Flask",
  "Spring Boot",
  "ASP.NET",
  "React Native",
  "Flutter",
  "Electron",
  "Other",
];
