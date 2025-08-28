import { mongoDBConnection } from "@/databases/db-connection";
import Project from "@/models/Project";
import { ProjectData, ProjectFormData } from "@/types/project";

export class ProjectService {
  async getProjects(): Promise<ProjectData[]> {
    await mongoDBConnection();

    try {
      const projects = await Project.find({})
        .sort({ featured: -1, order: 1, createdAt: -1 })
        .lean();

      return projects.map((project: any) => ({
        ...project,
        _id: project._id.toString(),
        mainImage: {
          ...project.mainImage,
          data: project.mainImage.data.toString("base64"),
        },
        fullPageImage: project.fullPageImage
          ? {
              ...project.fullPageImage,
              data: project.fullPageImage.data.toString("base64"),
            }
          : undefined,
        additionalImages: project.additionalImages?.map((img: any) => ({
          ...img,
          data: img.data.toString("base64"),
        })),
      }));
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

      return {
        ...project,
        _id: project._id.toString(),
        mainImage: {
          ...project.mainImage,
          data: project.mainImage.data.toString("base64"),
        },
        fullPageImage: project.fullPageImage
          ? {
              ...project.fullPageImage,
              data: project.fullPageImage.data.toString("base64"),
            }
          : undefined,
        additionalImages: project.additionalImages?.map((img: any) => ({
          ...img,
          data: img.data.toString("base64"),
        })),
      };
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

      const project = new Project({
        ...projectData,
        slug,
        mainImage: {
          filename: files.mainImageName,
          contentType: files.mainImageType,
          data: files.mainImage,
        },
        fullPageImage: files.fullPageImage
          ? {
              filename: files.fullPageImageName!,
              contentType: files.fullPageImageType!,
              data: files.fullPageImage,
            }
          : undefined,
        additionalImages: files.additionalImages?.map((img) => ({
          filename: img.name,
          contentType: img.type,
          data: img.data,
        })),
      });

      const savedProject = await project.save();
      const savedProjectObj = savedProject.toObject();

      return {
        ...savedProjectObj,
        _id: savedProjectObj._id.toString(),
        mainImage: {
          ...savedProjectObj.mainImage,
          data: savedProjectObj.mainImage.data.toString("base64"),
        },
        fullPageImage: savedProjectObj.fullPageImage
          ? {
              ...savedProjectObj.fullPageImage,
              data: savedProjectObj.fullPageImage.data.toString("base64"),
            }
          : undefined,
        additionalImages: savedProjectObj.additionalImages?.map((img: any) => ({
          ...img,
          data: img.data.toString("base64"),
        })),
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

      // Update images if provided
      if (files?.mainImage) {
        updateData.mainImage = {
          filename: files.mainImageName!,
          contentType: files.mainImageType!,
          data: files.mainImage,
        };
      }

      if (files?.fullPageImage) {
        updateData.fullPageImage = {
          filename: files.fullPageImageName!,
          contentType: files.fullPageImageType!,
          data: files.fullPageImage,
        };
      }

      if (files?.additionalImages) {
        updateData.additionalImages = files.additionalImages.map((img) => ({
          filename: img.name,
          contentType: img.type,
          data: img.data,
        }));
      }

      const updatedProject: any = await Project.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedProject) {
        throw new Error("Project not found");
      }

      return {
        ...updatedProject,
        _id: updatedProject._id.toString(),
        mainImage: {
          ...updatedProject.mainImage,
          data: updatedProject.mainImage.data.toString("base64"),
        },
        fullPageImage: updatedProject.fullPageImage
          ? {
              ...updatedProject.fullPageImage,
              data: updatedProject.fullPageImage.data.toString("base64"),
            }
          : undefined,
        additionalImages: updatedProject.additionalImages?.map((img: any) => ({
          ...img,
          data: img.data.toString("base64"),
        })),
      };
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    await mongoDBConnection();

    try {
      const deletedProject = await Project.findByIdAndDelete(id);

      if (!deletedProject) {
        throw new Error("Project not found");
      }
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
          data: project.mainImage.data.toString("base64"),
        },
        fullPageImage: project.fullPageImage
          ? {
              ...project.fullPageImage,
              data: project.fullPageImage.data.toString("base64"),
            }
          : undefined,
        additionalImages: project.additionalImages?.map((img: any) => ({
          ...img,
          data: img.data.toString("base64"),
        })),
      }));
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      throw new Error("Failed to fetch featured projects");
    }
  }
}
