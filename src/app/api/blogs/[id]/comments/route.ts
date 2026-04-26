import { NextRequest, NextResponse } from "next/server";
import { mongoDBConnection } from "@/databases/db-connection";
import { Blog } from "@/models/Blog";
import { Comment } from "@/models/Comment";

// GET /api/blogs/[id]/comments — public gets visible only, admin (all=true) gets all
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoDBConnection();
    const { id } = await params;
    const all = req.nextUrl.searchParams.get("all") === "true";

    const query: Record<string, unknown> = { blogId: id };
    if (!all) query.isHidden = false;

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// POST /api/blogs/[id]/comments — create a new comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoDBConnection();
    const { id } = await params;
    const body = await req.json();

    const content = (body.content ?? "").trim();
    const authorName = (body.authorName ?? "").trim() || "Anonymous";

    if (!content || content.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Comment must be 1–1000 characters" },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(id).select("slug").lean();
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      blogId: id,
      blogSlug: (blog as unknown as { slug: string }).slug,
      content,
      authorName,
      isHidden: false,
    });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
