import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { ProjectImageDisplay } from "@/components/ui/project-image";
import { ProjectActionButton } from "@/components/ui/project-action-button";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/ui/image-gallery";
import { ProjectService } from "@/lib/project-service";
import { ArrowLeft } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const projectService = new ProjectService();

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  try {
    const awaitedParams = await params;
    const project = await projectService.getProjectBySlug(awaitedParams.slug);

    if (!project) {
      return {
        title: "Project Not Found",
      };
    }

    return {
      title: `${project.title} - Md. Riazul Islam`,
      description: project.shortDescription,
      openGraph: {
        title: project.title,
        description: project.shortDescription,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Project Not Found",
      description: error instanceof Error ? error.message : String(error),
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const awaitedParams = await params;
  let project;

  try {
    project = await projectService.getProjectBySlug(awaitedParams.slug);
  } catch (error) {
    console.error("Error fetching project:", error);
    notFound();
  }

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Page Title Section */}
      <section className="section-padding bg-background">
        <div className="container-custom content-constrained">
          <div className="text-center">
            <Button
              variant="ghost"
              asChild
              className="mb-6 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <Link
                href="/projects"
                className="flex items-center justify-center w-fit mx-auto"
                style={{ textDecoration: "none" }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
            <h1 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider text-foreground">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="section-padding">
        <div className="container-custom content-constrained">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {/* Full Page Image */}
              {project.fullPageImage ? (
                <ProjectImageDisplay
                  image={project.fullPageImage}
                  alt={`${project.title} - Full Page`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ) : (
                <ProjectImageDisplay
                  image={project.mainImage}
                  alt={project.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              )}

              {/* Description */}
              <div className="mt-8">
                <h4 className="text-xl font-semibold mb-4 text-foreground flex items-center">
                  <i className="ti-desktop mr-3"></i>
                  Description
                </h4>
                <div
                  className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>

              {/* Features */}
              {project.features[0] !== "" && (
                <div className="mt-8">
                  <h4 className="text-xl font-semibold mb-4 text-foreground flex items-center">
                    <i className="ti-layout mr-3"></i>
                    Features
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {project.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Images */}
              {project.additionalImages &&
                project.additionalImages.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-xl font-semibold mb-4 text-foreground flex items-center">
                      <i className="ti-gallery mr-3"></i>
                      Additional Images ({project.additionalImages.length})
                    </h4>
                    <ImageGallery
                      images={project.additionalImages}
                      projectTitle={project.title}
                    />
                  </div>
                )}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                <h4 className="text-xl font-semibold text-center mb-6 pt-4 text-card-foreground">
                  Project Summary
                </h4>

                <ul className="space-y-4 text-card-foreground">
                  <li className="flex justify-between items-center">
                    <span>Created:</span>
                    <span className="text-muted-foreground">
                      {new Date(project.createdDate).toLocaleDateString()}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Category:</span>
                    <span className="text-muted-foreground">
                      {project.category}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Duration:</span>
                    <span className="text-muted-foreground">
                      {project.duration}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Framework:</span>
                    <span className="text-muted-foreground">
                      {project.framework}
                    </span>
                  </li>
                  {project.responsive && (
                    <li className="flex justify-between items-center">
                      <span>Responsive:</span>
                      <span className="text-muted-foreground">
                        {project.responsive ? "yes" : "no"}
                      </span>
                    </li>
                  )}
                  {project.browserCompatible && (
                    <li className="flex justify-between items-center">
                      <span>Browser Compatible:</span>
                      <span className="text-muted-foreground">
                        {project.browserCompatible ? "yes" : "no"}
                      </span>
                    </li>
                  )}
                  <li className="flex justify-between items-center">
                    <span>Documentation:</span>
                    <span className="text-muted-foreground">
                      {project.documentation ? "included" : "not included"}
                    </span>
                  </li>

                  {/* Tags */}
                  <li className="mt-6">
                    <h3 className="text-center mb-4 font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </li>

                  {/* Action Buttons */}
                  <li className="mt-6">
                    <div className="space-y-3">
                      {project.liveUrl && (
                        <ProjectActionButton
                          href={project.liveUrl}
                          icon="fa-solid fa-desktop"
                        >
                          Live Site
                        </ProjectActionButton>
                      )}

                      {project.frontendCodeUrl && (
                        <ProjectActionButton
                          href={project.frontendCodeUrl}
                          icon="fa-solid fa-laptop-code"
                        >
                          Front-End Code
                        </ProjectActionButton>
                      )}

                      {project.backendCodeUrl && (
                        <ProjectActionButton
                          href={project.backendCodeUrl}
                          icon="fa-solid fa-server"
                          className="mb-0"
                        >
                          Back-End Code
                        </ProjectActionButton>
                      )}
                    </div>
                  </li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="bg-card border border-border rounded-lg p-6 mt-6 shadow-lg">
                <h3 className="text-center mb-4 font-semibold text-card-foreground">
                  Have any project on mind?
                </h3>
                <Button
                  asChild
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/#contact">Contact me</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
