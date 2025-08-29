import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getExpertiseData, updateExpertiseData } from "@/lib/expertise-service";

// Cache for 1 hour
export const revalidate = 3600;

export async function GET() {
  try {
    const expertiseData = await getExpertiseData();
    return NextResponse.json(expertiseData);
  } catch (error) {
    console.error("❌ API Error - GET /api/expertise:", error);
    return NextResponse.json(
      { error: "Failed to fetch expertise data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const updatedData = await updateExpertiseData(body);

    // Revalidate the cache after successful update
    revalidatePath("/api/expertise");

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("❌ API Error - PUT /api/expertise:", error);
    return NextResponse.json(
      { error: "Failed to update expertise data" },
      { status: 500 }
    );
  }
}
