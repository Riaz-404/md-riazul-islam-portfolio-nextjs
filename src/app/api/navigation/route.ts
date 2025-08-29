import { NextRequest, NextResponse } from "next/server";
import { NavigationService } from "@/lib/navigation-service";
import { defaultNavigationData } from "@/types/navigation";

export async function GET() {
  try {
    const navigation = await NavigationService.getNavigation();

    if (!navigation) {
      // Return default navigation if none exists
      return NextResponse.json({
        id: "navigation-default",
        ...defaultNavigationData,
      });
    }

    return NextResponse.json(navigation);
  } catch (error) {
    console.error("Error in GET /api/navigation:", error);
    return NextResponse.json(
      { error: "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const navigation = await NavigationService.createNavigation(body);
    return NextResponse.json(navigation, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/navigation:", error);
    return NextResponse.json(
      { error: "Failed to create navigation" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const navigation = await NavigationService.updateNavigation(body);
    return NextResponse.json(navigation);
  } catch (error) {
    console.error("Error in PUT /api/navigation:", error);
    return NextResponse.json(
      { error: "Failed to update navigation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Navigation ID is required" },
        { status: 400 }
      );
    }

    const success = await NavigationService.deleteNavigation(id);

    if (!success) {
      return NextResponse.json(
        { error: "Navigation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Navigation deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/navigation:", error);
    return NextResponse.json(
      { error: "Failed to delete navigation" },
      { status: 500 }
    );
  }
}
