import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/project-service";

// Cache for 1 hour
export const revalidate = 3600;

const projectService = new ProjectService();

export async function GET() {
  try {
    const projects = await projectService.getFeaturedProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured projects" },
      { status: 500 }
    );
  }
}
