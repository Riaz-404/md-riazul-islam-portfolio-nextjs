import * as z from "zod";

// About schema
export const aboutSchema = z.object({
  myself: z.object({
    title: z.string().min(1, "Title is required"),
    description: z
      .array(z.string())
      .min(1, "At least one description is required"),
  }),
  skills: z.object({
    title: z.string().min(1, "Title is required"),
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Category name is required"),
        items: z.array(
          z.object({
            id: z.string(),
            name: z.string().min(1, "Skill name is required"),
            description: z.string().min(1, "Description is required"),
          })
        ),
      })
    ),
  }),
});

// Expertise schema
export const expertiseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Category name is required"),
      skills: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1, "Skill name is required"),
          percentage: z.number().min(0).max(100),
          category: z.string(),
        })
      ),
    })
  ),
});

// Project schema
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).optional(),
  shortDescription: z.string().min(1, "Short description is required").max(200),
  category: z.string().min(1, "Category is required"),
  framework: z.string().min(1, "Framework is required"),
  duration: z.string().min(1, "Duration is required"),
  createdDate: z.date(),
  responsive: z.boolean(),
  browserCompatible: z.boolean(),
  documentation: z.boolean(),
  tags: z.array(z.string().min(1, "Tag is required")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  frontendCodeUrl: z.string().url().optional().or(z.literal("")),
  backendCodeUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  order: z.number().min(0),
});

// Hero schema
export const heroSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rotatingTexts: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, "Text is required"),
      })
    )
    .min(1, "At least one rotating text is required"),
  description: z.string().min(1, "Description is required"),
  profileImage: z.string().optional(),
  cvDownloadUrl: z.string().min(1, "CV download URL is required"),
  techIcons: z.array(
    z.object({
      id: z.string(),
      src: z.string().min(1, "Icon source is required"),
      title: z.string().min(1, "Icon title is required"),
    })
  ),
});

// Navigation schema (only social links)
export const navigationSchema = z.object({
  socialLinks: z.array(
    z.object({
      id: z.string(),
      href: z.string().url("Must be a valid URL"),
      icon: z.string().url("Must be a valid image URL"),
      label: z.string().min(1, "Label is required"),
      order: z.number().min(0, "Order must be non-negative"),
      isActive: z.boolean(),
    })
  ),
});

// Blog schema
export const blogSchema = z.object({
  type: z.enum(["internal", "external"]),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(300),
  content: z.string().optional(),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  source: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  draft: z.boolean().optional(),
  isActive: z.boolean().optional(),
  order: z.number().min(0).optional(),
  publishedAt: z.date().optional(),
});

// Publication schema
export const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string().min(1, "Author name required")).min(1, "At least one author required"),
  venue: z.string().optional(),
  year: z.number().min(1900).max(2100),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  abstract: z.string().optional(),
  type: z.enum(["journal", "conference", "book", "thesis", "other"]),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

// Export types
export type AboutFormData = z.infer<typeof aboutSchema>;
export type ExpertiseFormData = z.infer<typeof expertiseSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type HeroFormData = z.infer<typeof heroSchema>;
export type NavigationFormData = z.infer<typeof navigationSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
export type PublicationFormData = z.infer<typeof publicationSchema>;
