import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, type } = body;

    if (type === "path" && path) {
      revalidatePath(path);
      return NextResponse.json({
        success: true,
        message: `Revalidated path: ${path}`,
        revalidated: path,
      });
    }

    if (type === "tag" && tag) {
      revalidateTag(tag);
      return NextResponse.json({
        success: true,
        message: `Revalidated tag: ${tag}`,
        revalidated: tag,
      });
    }

    if (type === "all") {
      // Revalidate all main API endpoints
      const paths = [
        "/api/hero",
        "/api/about",
        "/api/expertise",
        "/api/navigation",
        "/api/projects",
        "/api/projects/featured",
      ];

      paths.forEach((path) => revalidatePath(path));

      return NextResponse.json({
        success: true,
        message: "Revalidated all paths",
        revalidated: paths,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request. Specify type as 'path', 'tag', or 'all'",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
