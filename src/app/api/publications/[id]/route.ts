import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PublicationService } from "@/lib/publication-service";

export const revalidate = 3600;

const pubService = new PublicationService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pub = await pubService.getPublicationById(id);
    if (!pub) {
      return NextResponse.json(
        { success: false, message: "Publication not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: pub });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch publication" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await pubService.updatePublication(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Publication not found" },
        { status: 404 }
      );
    }
    revalidatePath("/api/publications");
    revalidatePath("/");
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update publication" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isActive } = await request.json();
    const updated = await pubService.toggleActive(id, isActive);
    revalidatePath("/api/publications");
    revalidatePath("/");
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update publication" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await pubService.deletePublication(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Publication not found" },
        { status: 404 }
      );
    }
    revalidatePath("/api/publications");
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Publication deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete publication" },
      { status: 500 }
    );
  }
}
