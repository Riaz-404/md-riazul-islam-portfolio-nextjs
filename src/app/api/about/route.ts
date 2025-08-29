import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAboutData, updateAboutData } from "@/lib/about-service";

// Cache for 1 hour
export const revalidate = 3600;

export async function GET() {
  try {
    const aboutData = await getAboutData();

    return NextResponse.json({
      success: true,
      data: aboutData,
    });
  } catch (error) {
    console.error("GET /api/about error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch about data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the data structure
    if (!body.myself || !body.skills) {
      return NextResponse.json(
        { success: false, error: "Invalid data structure" },
        { status: 400 }
      );
    }

    const aboutData = await updateAboutData({
      myself: body.myself,
      skills: body.skills,
    });

    // Revalidate the cache after successful update
    revalidatePath("/api/about");

    return NextResponse.json({
      success: true,
      data: aboutData,
      message: "About data updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/about error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update about data" },
      { status: 500 }
    );
  }
}
