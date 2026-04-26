import { NextRequest, NextResponse } from "next/server";
import { mongoDBConnection } from "@/databases/db-connection";
import { Blog } from "@/models/Blog";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoDBConnection();
    const { id } = await params;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { loves: 1 } },
      { new: true, select: "loves" }
    );
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, loves: blog.loves });
  } catch (error) {
    console.error("Love error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
