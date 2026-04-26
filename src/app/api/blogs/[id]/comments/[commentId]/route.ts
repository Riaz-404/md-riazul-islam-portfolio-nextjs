import { NextRequest, NextResponse } from "next/server";
import { mongoDBConnection } from "@/databases/db-connection";
import { Comment } from "@/models/Comment";

// PATCH /api/blogs/[id]/comments/[commentId] — toggle visibility (admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    await mongoDBConnection();
    const { commentId } = await params;
    const body = await req.json();

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { isHidden: body.isHidden },
      { new: true }
    );

    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error("Patch comment error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/blogs/[id]/comments/[commentId] — delete (admin)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    await mongoDBConnection();
    const { commentId } = await params;
    await Comment.findByIdAndDelete(commentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
