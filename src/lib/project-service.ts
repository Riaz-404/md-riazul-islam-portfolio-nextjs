import { mongoDBConnection } from "@/databases/db-connection";
import Project from "@/models/Project";
import { ProjectData, ProjectFormData } from "@/types/project";
import { CloudinaryService } from "./cloudinary-service";

export class ProjectService {
  // Helper method to serialize MongoDB documents for client components
  private serializeProject(project: any): ProjectData {
    return JSON.parse(
      JSON.stringify(project, (key, value) => {
        // Convert ObjectId instances to strings
        if (value && typeof value === "object" && value._id) {
          return {
            ...value,
            _id: value._id.toString(),
          };
        }
        // Handle top-level _id
        if (key === "_id" && value && typeof value.toString === "function") {
          return value.toString();
        }
        return value;
      })
    );
  }

  async getProjects(): Promise<ProjectData[]> {
    await mongoDBConnection();

    try {
      const projects = await Project.find({})
        .sort({ featured: -1, order: 1, createdAt: -1 })
        .lean();
      return projects.map((project: any) =>
        this.serializeProject({
          ...project,
          _id: project._id.toString(),
        })
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  async getProjectBySlug(slug: string): Promise<ProjectData | null> {
    await mongoDBConnection();

    try {
      const project: any = await Project.findOne({ slug }).lean();

      if (!project) {
        return null;
      }

      return this.serializeProject({
        ...project,
        _id: project._id.toString(),
      });
    } catch (error) {
      console.error("Error fetching project by slug:", error);
      throw new Error("Failed to fetch project");
    }
  }

  async createProject(
    projectData: ProjectFormData,
    files: {
      mainImage: Buffer;
      mainImageType: string;
      mainImageName: string;
      fullPageImage?: Buffer;
      fullPageImageType?: string;
      fullPageImageName?: string;
      additionalImages?: Array<{
        data: Buffer;
        type: string;
        name: string;
      }>;
    }
  ): Promise<ProjectData> {
    await mongoDBConnection();

    try {
      // Generate slug from title
      const slug = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // Check if slug already exists
      const existingProject = await Project.findOne({ slug });
      if (existingProject) {
        throw new Error("A project with this title already exists");
      }

      // Upload main image to Cloudinary
      const mainImageResult = await CloudinaryService.uploadImage(
        files.mainImage,
        `projects/${slug}`,
        files.mainImageName
      );

      // Upload full page image if provided
      let fullPageImageResult;
      if (files.fullPageImage) {
        fullPageImageResult = await CloudinaryService.uploadImage(
          files.fullPageImage,
          `projects/${slug}`,
          files.fullPageImageName
        );
      }

      // Upload additional images if provided
      let additionalImagesResults: any[] = [];
      if (files.additionalImages && files.additionalImages.length > 0) {
        additionalImagesResults = await CloudinaryService.uploadMultipleImages(
          files.additionalImages,
          `projects/${slug}`
        );
      }

      const project = new Project({
        ...projectData,
        slug,
        mainImage: {
          filename: files.mainImageName,
          contentType: files.mainImageType,
          url: mainImageResult.url,
          publicId: mainImageResult.publicId,
        },
        fullPageImage: fullPageImageResult
          ? {
              filename: files.fullPageImageName!,
              contentType: files.fullPageImageType!,
              url: fullPageImageResult.url,
              publicId: fullPageImageResult.publicId,
            }
          : undefined,
        additionalImages: additionalImagesResults.map((result, index) => ({
          filename: files.additionalImages![index].name,
          contentType: files.additionalImages![index].type,
          url: result.url,
          publicId: result.publicId,
        })),
      });

      const savedProject = await project.save();
      const savedProjectObj = savedProject.toObject();

      return {
        ...savedProjectObj,
        _id: savedProjectObj._id.toString(),
      };
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async updateProject(
    id: string,
    projectData: Partial<ProjectFormData>,
    files?: {
      mainImage?: Buffer;
      mainImageType?: string;
      mainImageName?: string;
      fullPageImage?: Buffer;
      fullPageImageType?: string;
      fullPageImageName?: string;
      additionalImages?: Array<{
        data: Buffer;
        type: string;
        name: string;
      }>;
    }
  ): Promise<ProjectData> {
    await mongoDBConnection();

    try {
      const updateData: any = { ...projectData };

      // Get current project to access existing images for cleanup
      const currentProject = await Project.findById(id);
      if (!currentProject) {
        throw new Error("Project not found");
      }

      // If title is being updated, update slug too
      if (projectData.title) {
        const newSlug = projectData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        // Check if new slug conflicts with existing projects (excluding current one)
        const existingProject = await Project.findOne({
          slug: newSlug,
          _id: { $ne: id },
        });

        if (existingProject) {
          throw new Error("A project with this title already exists");
        }

        updateData.slug = newSlug;
      }

      const projectSlug = updateData.slug || currentProject.slug;

      // Update main image if provided
      if (files?.mainImage) {
        // Delete old image from Cloudinary
        if (currentProject.mainImage?.publicId) {
          await CloudinaryService.deleteImage(
            currentProject.mainImage.publicId
          );
        }

        const mainImageResult = await CloudinaryService.uploadImage(
          files.mainImage,
          `projects/${projectSlug}`,
          files.mainImageName
        );

        updateData.mainImage = {
          filename: files.mainImageName!,
          contentType: files.mainImageType!,
          url: mainImageResult.url,
          publicId: mainImageResult.publicId,
        };
      }

      // Update full page image if provided
      if (files?.fullPageImage) {
        // Delete old image from Cloudinary
        if (currentProject.fullPageImage?.publicId) {
          await CloudinaryService.deleteImage(
            currentProject.fullPageImage.publicId
          );
        }

        const fullPageImageResult = await CloudinaryService.uploadImage(
          files.fullPageImage,
          `projects/${projectSlug}`,
          files.fullPageImageName
        );

        updateData.fullPageImage = {
          filename: files.fullPageImageName!,
          contentType: files.fullPageImageType!,
          url: fullPageImageResult.url,
          publicId: fullPageImageResult.publicId,
        };
      }

      // Update additional images if provided
      if (files?.additionalImages) {
        // Delete old additional images from Cloudinary
        if (currentProject.additionalImages) {
          for (const img of currentProject.additionalImages) {
            if (img.publicId) {
              await CloudinaryService.deleteImage(img.publicId);
            }
          }
        }

        const additionalImagesResults =
          await CloudinaryService.uploadMultipleImages(
            files.additionalImages,
            `projects/${projectSlug}`
          );

        updateData.additionalImages = additionalImagesResults.map(
          (result, index) => ({
            filename: files.additionalImages![index].name,
            contentType: files.additionalImages![index].type,
            url: result.url,
            publicId: result.publicId,
          })
        );
      }

      const updatedProject = (await Project.findByIdAndUpdate(id, updateData, {
        new: true,
      }).lean()) as any;

      if (!updatedProject) {
        throw new Error("Project not found");
      }

      return {
        ...updatedProject,
        _id: updatedProject._id.toString(),
      };
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    await mongoDBConnection();

    try {
      // Get project first to access image public IDs for cleanup
      const project = await Project.findById(id);

      if (!project) {
        throw new Error("Project not found");
      }

      // Delete images from Cloudinary
      const imagesToDelete: string[] = [];

      if (project.mainImage?.publicId) {
        imagesToDelete.push(project.mainImage.publicId);
      }

      if (project.fullPageImage?.publicId) {
        imagesToDelete.push(project.fullPageImage.publicId);
      }

      if (project.additionalImages) {
        project.additionalImages.forEach((img: any) => {
          if (img.publicId) {
            imagesToDelete.push(img.publicId);
          }
        });
      }

      // Delete images from Cloudinary (don't wait for completion to avoid blocking)
      imagesToDelete.forEach((publicId) => {
        CloudinaryService.deleteImage(publicId).catch((err) =>
          console.error(`Failed to delete image ${publicId}:`, err)
        );
      });

      // Delete project from database
      await Project.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }

  async getFeaturedProjects(): Promise<ProjectData[]> {
    await mongoDBConnection();

    try {
      const projects = await Project.find({ featured: true })
        .sort({ order: 1, createdAt: -1 })
        .limit(6)
        .lean();

      return projects.map((project: any) => ({
        ...project,
        _id: project._id.toString(),
        mainImage: {
          ...project.mainImage,
          // Only add base64 data if it exists (legacy format)
          ...(project.mainImage?.data
            ? { data: project.mainImage.data.toString("base64") }
            : {}),
        },
        fullPageImage: project.fullPageImage
          ? {
              ...project.fullPageImage,
              // Only add base64 data if it exists (legacy format)
              ...(project.fullPageImage?.data
                ? { data: project.fullPageImage.data.toString("base64") }
                : {}),
            }
          : undefined,
        additionalImages: project.additionalImages?.map((img: any) => ({
          ...img,
          // Only add base64 data if it exists (legacy format)
          ...(img?.data ? { data: img.data.toString("base64") } : {}),
        })),
      }));
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      throw new Error("Failed to fetch featured projects");
    }
  }
}
