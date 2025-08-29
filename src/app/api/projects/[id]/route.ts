import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/lib/project-service";

const projectService = new ProjectService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if id is a slug or MongoDB ObjectId
    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId, find by id
      project = await projectService.getProjectBySlug(id);
    } else {
      // It's a slug
      project = await projectService.getProjectBySlug(id);
    }

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    // Extract form fields (same as POST but all optional)
    const updates: any = {};

    if (formData.get("title")) updates.title = formData.get("title") as string;
    if (formData.get("shortDescription"))
      updates.shortDescription = formData.get("shortDescription") as string;
    if (formData.get("category"))
      updates.category = formData.get("category") as string;
    if (formData.get("framework"))
      updates.framework = formData.get("framework") as string;
    if (formData.get("duration"))
      updates.duration = formData.get("duration") as string;
    if (formData.get("createdDate"))
      updates.createdDate = new Date(formData.get("createdDate") as string);
    if (formData.get("responsive"))
      updates.responsive = formData.get("responsive") === "true";
    if (formData.get("browserCompatible"))
      updates.browserCompatible = formData.get("browserCompatible") === "true";
    if (formData.get("documentation"))
      updates.documentation = formData.get("documentation") === "true";
    if (formData.get("featured"))
      updates.featured = formData.get("featured") === "true";
    if (formData.get("order"))
      updates.order = parseInt(formData.get("order") as string);
    if (formData.get("liveUrl"))
      updates.liveUrl = formData.get("liveUrl") as string;
    if (formData.get("frontendCodeUrl"))
      updates.frontendCodeUrl = formData.get("frontendCodeUrl") as string;
    if (formData.get("backendCodeUrl"))
      updates.backendCodeUrl = formData.get("backendCodeUrl") as string;

    // Parse arrays if they exist
    if (formData.get("description"))
      updates.description = JSON.parse(formData.get("description") as string);
    if (formData.get("features"))
      updates.features = JSON.parse(formData.get("features") as string);
    if (formData.get("tags"))
      updates.tags = JSON.parse(formData.get("tags") as string);

    // Handle image updates
    const files: any = {};

    const mainImageFile = formData.get("mainImage") as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      files.mainImage = Buffer.from(await mainImageFile.arrayBuffer());
      files.mainImageType = mainImageFile.type;
      files.mainImageName = mainImageFile.name;
    }

    const fullPageImageFile = formData.get("fullPageImage") as File | null;
    if (fullPageImageFile && fullPageImageFile.size > 0) {
      files.fullPageImage = Buffer.from(await fullPageImageFile.arrayBuffer());
      files.fullPageImageType = fullPageImageFile.type;
      files.fullPageImageName = fullPageImageFile.name;
    }

    // Handle additional images
    const additionalImages: Array<{
      data: Buffer;
      type: string;
      name: string;
    }> = [];
    let index = 0;
    while (formData.get(`additionalImage_${index}`)) {
      const file = formData.get(`additionalImage_${index}`) as File;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        additionalImages.push({
          data: buffer,
          type: file.type,
          name: file.name,
        });
      }
      index++;
    }

    if (additionalImages.length > 0) {
      files.additionalImages = additionalImages;
    }

    const updatedProject = await projectService.updateProject(
      id,
      updates,
      Object.keys(files).length > 0 ? files : undefined
    );

    return NextResponse.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update project",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await projectService.deleteProject(id);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete project",
      },
      { status: 500 }
    );
  }
}
