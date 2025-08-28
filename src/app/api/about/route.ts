import { NextRequest, NextResponse } from "next/server";
import { AboutData, defaultAboutData } from "@/types/about";

// In-memory storage (data resets when server restarts)
let aboutData: AboutData = defaultAboutData;

export async function GET() {
  try {
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

    // Update in-memory data
    aboutData = {
      id: aboutData.id,
      myself: body.myself || aboutData.myself,
      skills: body.skills,
      updatedAt: new Date().toISOString(),
    };

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
