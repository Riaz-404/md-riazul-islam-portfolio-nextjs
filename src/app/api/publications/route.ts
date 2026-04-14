import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PublicationService } from "@/lib/publication-service";

export const revalidate = 3600;

const pubService = new PublicationService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const publications = await pubService.getPublications(all);
    return NextResponse.json({ success: true, data: publications });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const publication = await pubService.createPublication(body);
    revalidatePath("/api/publications");
    revalidatePath("/");
    return NextResponse.json({ success: true, data: publication });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create publication",
      },
      { status: 500 }
    );
  }
}
