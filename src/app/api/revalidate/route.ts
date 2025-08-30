import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, type, force = false } = body;

    if (type === "path" && path) {
      // Revalidate both API endpoint and corresponding page paths
      const pathsToRevalidate = [path];

      // Map API endpoints to actual pages that use the data
      const apiToPageMapping: { [key: string]: string[] } = {
        "/api/hero": ["/"],
        "/api/about": ["/"],
        "/api/expertise": ["/"],
        "/api/navigation": ["/", "/projects"],
        "/api/projects": ["/", "/projects"],
        "/api/projects/featured": ["/"],
      };

      if (apiToPageMapping[path]) {
        pathsToRevalidate.push(...apiToPageMapping[path]);
      }

      // Remove duplicates and revalidate all paths
      const uniquePaths = [...new Set(pathsToRevalidate)];

      // Use Promise.all to revalidate concurrently with better error handling
      await Promise.all(
        uniquePaths.map(async (pathToRevalidate) => {
          try {
            // Use layout type for more aggressive revalidation if force is true
            revalidatePath(pathToRevalidate, force ? "layout" : "page");
            console.log(`Revalidated: ${pathToRevalidate}`);
          } catch (error) {
            console.error(`Failed to revalidate ${pathToRevalidate}:`, error);
          }
        })
      );

      return NextResponse.json({
        success: true,
        message: `Revalidated paths: ${uniquePaths.join(", ")}`,
        revalidated: uniquePaths,
        force,
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
      // Revalidate all main pages where data is actually displayed
      const paths = [
        "/", // Home page (hero, about, expertise, featured projects)
        "/projects", // Projects page
        "/api/hero",
        "/api/about",
        "/api/expertise",
        "/api/navigation",
        "/api/projects",
        "/api/projects/featured",
      ];

      // Use Promise.all to revalidate all paths concurrently
      await Promise.all(
        paths.map((path) => {
          try {
            // Use layout type for more aggressive revalidation if force is true
            revalidatePath(path, force ? "layout" : "page");
            console.log(`Revalidated: ${path}`);
          } catch (error) {
            console.error(`Failed to revalidate ${path}:`, error);
          }
        })
      );

      return NextResponse.json({
        success: true,
        message: "Revalidated all paths",
        revalidated: paths,
        force,
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
