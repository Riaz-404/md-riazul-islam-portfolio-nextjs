import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { ProjectImageDisplay } from "@/components/ui/project-image";
import { ProjectActionButton } from "@/components/ui/project-action-button";
import { Button } from "@/components/ui/button";
import { ProjectService } from "@/lib/project-service";
import { ArrowLeft } from "lucide-react";

interface ProjectPageProps {
  params: {
    slug: string;
  };
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
    <main
      className="min-h-screen"
      style={{ background: "#0b090a", color: "#fff" }}
    >
      <Navigation />

      {/* Page Title Section */}
      <section className="page-title">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="page-title text-center">
                <Button
                  variant="outline"
                  asChild
                  className="mb-6"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    background: "transparent",
                    color: "#fff",
                  }}
                >
                  <Link
                    href="/#projects"
                    className="flex items-center justify-center w-fit mx-auto"
                    style={{ textDecoration: "none" }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Projects
                  </Link>
                </Button>
                <h1
                  style={{
                    fontSize: "40px",
                    lineHeight: "50px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#fff",
                  }}
                >
                  {project.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="projects-single">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Full Page Image */}
              {project.fullPageImage ? (
                <ProjectImageDisplay
                  image={project.fullPageImage}
                  alt={`${project.title} - Full Page`}
                  className="img-fluid rounded w-full h-auto"
                />
              ) : (
                <ProjectImageDisplay
                  image={project.mainImage}
                  alt={project.title}
                  className="img-fluid rounded w-full h-auto"
                />
              )}

              {/* Description */}
              <div className="mt-4">
                <h4 className="mb-3">
                  <i className="ti-desktop mr-3"></i>
                  Description
                </h4>
                <div
                  className="prose prose-lg prose-invert max-w-none"
                  style={{ color: "#8b98af" }}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>

              {/* Features */}
              <div className="mt-4">
                <h4 className="mb-3">
                  <i className="ti-layout mr-3"></i>
                  Features
                </h4>
                <ul>
                  {project.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="projects-sidebar mt-5 mt-lg-0">
                <div
                  className="card p-4"
                  style={{
                    background: "#050406",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <h4 className="card-title text-center mb-5 pt-4">
                    Project Summary
                  </h4>

                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between align-content-center">
                      Created:
                      <span>
                        {new Date(project.createdDate).toLocaleDateString()}
                      </span>
                    </li>
                    <li className="d-flex justify-content-between align-content-center">
                      Category:
                      <span>{project.category}</span>
                    </li>
                    <li className="d-flex justify-content-between align-content-center">
                      Duration:
                      <span>{project.duration}</span>
                    </li>
                    <li className="d-flex justify-content-between align-content-center">
                      Framework:
                      <span>{project.framework}</span>
                    </li>
                    <li className="d-flex justify-content-between align-content-center">
                      Responsive:
                      <span>{project.responsive ? "yes" : "no"}</span>
                    </li>
                    <li className="d-flex justify-content-between align-content-center">
                      Browser Compatible:
                      <span>{project.browserCompatible ? "yes" : "no"}</span>
                    </li>
                    <li className="d-flex justify-content-between align-content-center">
                      Documentation:
                      <span>
                        {project.documentation ? "included" : "not included"}
                      </span>
                    </li>

                    {/* Tags */}
                    <li className="tags mt-4">
                      <h3 className="text-center mb-4">Tags</h3>
                      <ul>
                        {project.tags.map((tag, index) => (
                          <li key={index}>{tag}</li>
                        ))}
                      </ul>
                    </li>

                    {/* Action Buttons */}
                    <li>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <div
                          className="text-right mt-4"
                          style={{ width: "100%" }}
                        >
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
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Contact Section */}
                <div
                  className="card p-5 mt-4"
                  style={{
                    background: "#050406",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <h3 className="text-center mb-4" style={{ color: "#fff" }}>
                    Have any project on mind?
                  </h3>
                  <Link href="/#contact" className="btn btn-solid-border">
                    Contact me
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
