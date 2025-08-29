import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ProjectService } from "@/lib/project-service";

// Cache for 1 hour
export const revalidate = 3600;

const projectService = new ProjectService();

export async function GET() {
  try {
    const projects = await projectService.getProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const category = formData.get("category") as string;
    const framework = formData.get("framework") as string;
    const duration = formData.get("duration") as string;
    const createdDate = new Date(formData.get("createdDate") as string);
    const responsive = formData.get("responsive") === "true";
    const browserCompatible = formData.get("browserCompatible") === "true";
    const documentation = formData.get("documentation") === "true";
    const featured = formData.get("featured") === "true";
    const order = parseInt(formData.get("order") as string) || 0;
    const liveUrl = (formData.get("liveUrl") as string) || undefined;
    const frontendCodeUrl =
      (formData.get("frontendCodeUrl") as string) || undefined;
    const backendCodeUrl =
      (formData.get("backendCodeUrl") as string) || undefined;

    // Parse arrays
    const description = JSON.parse(formData.get("description") as string);
    const features = JSON.parse(formData.get("features") as string);
    const tags = JSON.parse(formData.get("tags") as string);

    // Extract main image
    const mainImageFile = formData.get("mainImage") as File;
    if (!mainImageFile) {
      return NextResponse.json(
        { success: false, message: "Main image is required" },
        { status: 400 }
      );
    }

    const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());

    // Extract optional images
    const fullPageImageFile = formData.get("fullPageImage") as File | null;
    let fullPageImageBuffer: Buffer | undefined;
    if (fullPageImageFile && fullPageImageFile.size > 0) {
      fullPageImageBuffer = Buffer.from(await fullPageImageFile.arrayBuffer());
    }

    // Extract additional images
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

    const projectData = {
      title,
      description,
      features,
      shortDescription,
      category,
      framework,
      duration,
      createdDate,
      responsive,
      browserCompatible,
      documentation,
      tags,
      liveUrl,
      frontendCodeUrl,
      backendCodeUrl,
      featured,
      order,
    };

    const files = {
      mainImage: mainImageBuffer,
      mainImageType: mainImageFile.type,
      mainImageName: mainImageFile.name,
      fullPageImage: fullPageImageBuffer,
      fullPageImageType: fullPageImageFile?.type,
      fullPageImageName: fullPageImageFile?.name,
      additionalImages:
        additionalImages.length > 0 ? additionalImages : undefined,
    };

    const newProject = await projectService.createProject(projectData, files);

    // Revalidate the cache after successful creation
    revalidatePath("/api/projects");
    revalidatePath("/api/projects/featured");

    return NextResponse.json({ success: true, data: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 500 }
    );
  }
}
