import { NextRequest, NextResponse } from "next/server";
import { getHeroData, updateHeroData } from "@/lib/hero-service";
import { defaultHeroData } from "@/types/hero";

export async function GET() {
  try {
    const heroData = await getHeroData();

    if (!heroData) {
      // Return default data if no data exists
      return NextResponse.json(defaultHeroData);
    }

    return NextResponse.json(heroData);
  } catch (error) {
    console.error("Error in GET /api/hero:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.profileImage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedHero = await updateHeroData(body);

    if (!updatedHero) {
      return NextResponse.json(
        { error: "Failed to update hero data" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedHero);
  } catch (error) {
    console.error("Error in PUT /api/hero:", error);
    return NextResponse.json(
      { error: "Failed to update hero data" },
      { status: 500 }
    );
  }
}
