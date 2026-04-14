import { mongoDBConnection } from "@/databases/db-connection";
import { Blog } from "@/models/Blog";
import { BlogData } from "@/types/blog";
import { CloudinaryService } from "./cloudinary-service";
import { toPlain } from "./serialize";

export class BlogService {
  private serializeBlog(blog: any): BlogData {
    return toPlain(blog);
  }

  async getBlogs(includeAll = false): Promise<BlogData[]> {
    await mongoDBConnection();
    try {
      const query = includeAll
        ? {}
        : {
            isActive: { $ne: false },
            $or: [{ type: "external" }, { type: "internal", draft: false }],
          };
      const blogs = await Blog.find(query)
        .sort({ featured: -1, publishedAt: -1, order: 1 })
        .lean();
      return blogs.map((b: any) =>
        this.serializeBlog(b)
      );
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw new Error("Failed to fetch blogs");
    }
  }

  async getFeaturedBlogs(): Promise<BlogData[]> {
    await mongoDBConnection();
    try {
      const blogs = await Blog.find({
        featured: true,
        isActive: { $ne: false },
        $or: [{ type: "external" }, { type: "internal", draft: false }],
      })
        .sort({ publishedAt: -1, order: 1 })
        .limit(3)
        .lean();
      return blogs.map((b: any) =>
        this.serializeBlog(b)
      );
    } catch (error) {
      console.error("Error fetching featured blogs:", error);
      throw new Error("Failed to fetch featured blogs");
    }
  }

  async getBlogBySlug(slug: string): Promise<BlogData | null> {
    await mongoDBConnection();
    try {
      const blog: any = await Blog.findOne({ slug }).lean();
      if (!blog) return null;
      return this.serializeBlog(blog);
    } catch (error) {
      console.error("Error fetching blog by slug:", error);
      throw new Error("Failed to fetch blog");
    }
  }

  async getBlogById(id: string): Promise<BlogData | null> {
    await mongoDBConnection();
    try {
      const blog: any = await Blog.findById(id).lean();
      if (!blog) return null;
      return this.serializeBlog(blog);
    } catch (error) {
      console.error("Error fetching blog by id:", error);
      throw new Error("Failed to fetch blog");
    }
  }

  async createBlog(
    data: Omit<BlogData, "_id" | "createdAt" | "updatedAt">,
    coverImageFile?: { data: Buffer; type: string; name: string }
  ): Promise<BlogData> {
    await mongoDBConnection();
    try {
      // Generate slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      let coverImage;
      if (coverImageFile) {
        const result = await CloudinaryService.uploadImage(
          coverImageFile.data,
          "blogs",
          coverImageFile.name
        );
        coverImage = {
          filename: coverImageFile.name,
          contentType: coverImageFile.type,
          url: result.url,
          publicId: result.publicId,
        };
      }

      const blog = new Blog({ ...data, slug, coverImage });
      await blog.save();
      return this.serializeBlog(blog.toObject());
    } catch (error) {
      console.error("Error creating blog:", error);
      throw new Error("Failed to create blog");
    }
  }

  async updateBlog(
    id: string,
    data: Partial<BlogData>,
    coverImageFile?: { data: Buffer; type: string; name: string }
  ): Promise<BlogData | null> {
    await mongoDBConnection();
    try {
      const existing: any = await Blog.findById(id).lean();
      if (!existing) return null;

      let coverImage = existing.coverImage;

      if (coverImageFile) {
        // Delete old image
        if (existing.coverImage?.publicId) {
          await CloudinaryService.deleteImage(existing.coverImage.publicId);
        }
        const result = await CloudinaryService.uploadImage(
          coverImageFile.data,
          "blogs",
          coverImageFile.name
        );
        coverImage = {
          filename: coverImageFile.name,
          contentType: coverImageFile.type,
          url: result.url,
          publicId: result.publicId,
        };
      }

      const updated: any = await Blog.findByIdAndUpdate(
        id,
        { ...data, coverImage },
        { new: true }
      ).lean();
      if (!updated) return null;
      return this.serializeBlog(updated);
    } catch (error) {
      console.error("Error updating blog:", error);
      throw new Error("Failed to update blog");
    }
  }

  async toggleActive(id: string, isActive: boolean): Promise<BlogData | null> {
    await mongoDBConnection();
    const updated: any = await Blog.findByIdAndUpdate(id, { isActive }, { new: true }).lean();
    if (!updated) return null;
    return this.serializeBlog(updated);
  }

  async deleteBlog(id: string): Promise<boolean> {
    await mongoDBConnection();
    try {
      const blog: any = await Blog.findById(id).lean();
      if (!blog) return false;

      if (blog.coverImage?.publicId) {
        await CloudinaryService.deleteImage(blog.coverImage.publicId);
      }

      await Blog.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw new Error("Failed to delete blog");
    }
  }
}
