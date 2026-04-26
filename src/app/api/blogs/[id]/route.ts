import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { BlogService } from "@/lib/blog-service";

export const revalidate = 3600;

const blogService = new BlogService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await blogService.getBlogById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const type = formData.get("type") as "internal" | "external" | null;
    const title = formData.get("title") as string | null;
    const excerpt = formData.get("excerpt") as string | null;
    const content = formData.get("content") as string | null;
    const externalUrl = formData.get("externalUrl") as string | null;
    const source = formData.get("source") as string | null;
    const category = formData.get("category") as string | null;
    const featured = formData.has("featured")
      ? formData.get("featured") === "true"
      : undefined;
    const draft = formData.has("draft")
      ? formData.get("draft") === "true"
      : undefined;
    const order = formData.has("order")
      ? parseInt(formData.get("order") as string) || 0
      : undefined;
    const publishedAt = formData.get("publishedAt")
      ? new Date(formData.get("publishedAt") as string)
      : undefined;
    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags") as string)
      : undefined;

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

    const updateData: Record<string, unknown> = {};
    if (type) updateData.type = type;
    if (title) updateData.title = title;
    if (excerpt) updateData.excerpt = excerpt;
    if (content !== null) updateData.content = content;
    if (externalUrl !== null) updateData.externalUrl = externalUrl;
    if (source !== null) updateData.source = source;
    if (category !== null) updateData.category = category;
    if (featured !== undefined) updateData.featured = featured;
    if (draft !== undefined) updateData.draft = draft;
    if (order !== undefined) updateData.order = order;
    if (publishedAt) updateData.publishedAt = publishedAt;
    if (tags) updateData.tags = tags;

    const updated = await blogService.updateBlog(id, updateData as any, coverImageData);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    revalidatePath("/api/blogs");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    let updated;
    if (typeof body.draft === "boolean") {
      // Quick publish/unpublish
      updated = await blogService.updateBlog(id, { draft: body.draft } as any, undefined);
    } else {
      // Toggle active (existing behaviour)
      updated = await blogService.toggleActive(id, body.isActive);
    }

    revalidatePath("/api/blogs");
    revalidatePath("/blog");
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await blogService.deleteBlog(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    revalidatePath("/api/blogs");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
