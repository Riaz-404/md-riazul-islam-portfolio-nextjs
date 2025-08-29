import { NextRequest, NextResponse } from "next/server";
import { mongoDBConnection } from "@/databases/db-connection";
import Hero from "@/models/Hero";
import { defaultHeroData } from "@/types/hero";

export async function POST() {
  try {
    // Connecting to database...
    await mongoDBConnection();

    // Check if hero data already exists
    const existingHero = await Hero.findOne();

    if (existingHero) {
      return NextResponse.json({
        message: "Hero data already exists. Skipping initialization.",
        success: true,
        existing: true,
      });
    }

    // Creating initial hero data...

    const heroData = new Hero({
      id: "hero-1",
      ...defaultHeroData,
    });

    await heroData.save();

    return NextResponse.json({
      message: "Hero data initialized successfully!",
      success: true,
      data: heroData,
    });
  } catch (error) {
    console.error("Error initializing hero data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to initialize hero data",
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
