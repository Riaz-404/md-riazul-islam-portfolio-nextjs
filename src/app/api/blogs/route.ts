import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { BlogService } from "@/lib/blog-service";

export const revalidate = 3600;

const blogService = new BlogService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const blogs = await blogService.getBlogs(all);
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const type = formData.get("type") as "internal" | "external";
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = (formData.get("content") as string) || "";
    const externalUrl = (formData.get("externalUrl") as string) || undefined;
    const source = (formData.get("source") as string) || undefined;
    const category = (formData.get("category") as string) || "";
    const featured = formData.get("featured") === "true";
    const draft = formData.get("draft") === "true";
    const isActive = formData.get("isActive") !== "false";
    const order = parseInt(formData.get("order") as string) || 0;
    const publishedAt = formData.get("publishedAt")
      ? new Date(formData.get("publishedAt") as string)
      : new Date();
    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags") as string)
      : [];

    const coverImageFile = formData.get("coverImage") as File | null;
    let coverImageData:
      | { data: Buffer; type: string; name: string }
      | undefined;
    if (coverImageFile && coverImageFile.size > 0) {
      coverImageData = {
        data: Buffer.from(await coverImageFile.arrayBuffer()),
        type: coverImageFile.type,
        name: coverImageFile.name,
      };
    }

    const blog = await blogService.createBlog(
      {
        type,
        title,
        excerpt,
        content,
        externalUrl,
        source,
        category,
        featured,
        draft,
        isActive,
        order,
        publishedAt,
        tags,
        slug: "", // auto-generated in service
      },
      coverImageData
    );

    revalidatePath("/api/blogs");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create blog",
      },
      { status: 500 }
    );
  }
}
