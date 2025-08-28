import { NextRequest, NextResponse } from "next/server";
import { AboutData, defaultAboutData } from "@/types/about";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Try to get existing about data from database
    let about = await prisma.about.findFirst();

    // If no data exists, create default data
    if (!about) {
      about = await prisma.about.create({
        data: {
          myself: defaultAboutData.myself,
          skills: defaultAboutData.skills,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: about,
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

    // Get existing record or create if doesn't exist
    let about = await prisma.about.findFirst();

    if (!about) {
      // Create new record
      about = await prisma.about.create({
        data: {
          myself: body.myself || defaultAboutData.myself,
          skills: body.skills,
        },
      });
    } else {
      // Update existing record
      about = await prisma.about.update({
        where: { id: about.id },
        data: {
          myself: body.myself || about.myself,
          skills: body.skills,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: about,
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
