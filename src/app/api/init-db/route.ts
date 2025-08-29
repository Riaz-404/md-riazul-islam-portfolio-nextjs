import { NextResponse } from "next/server";
import { initializeAboutData } from "@/lib/about-service";
import { initializeExpertiseData } from "@/lib/expertise-service";

export async function POST() {
  try {
    // Starting database initialization...

    await initializeAboutData();
    await initializeExpertiseData();

    // Database initialization completed successfully!

    return NextResponse.json({
      success: true,
      message: "Database initialization completed successfully!",
    });
  } catch (error) {
    console.error("❌ Database initialization failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Database initialization failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
