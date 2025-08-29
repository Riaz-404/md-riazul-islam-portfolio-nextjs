import Link from "next/link";
import { ProjectImageDisplay } from "@/components/ui/project-image";
import { ProjectData } from "@/types/project";
import { Button } from "@/components/ui/button";
import { ProjectService } from "@/lib/project-service";
import { MotionDiv } from "@/components/motion/motion-html-element";

interface ProjectsSectionProps {
  featured?: boolean;
  limit?: number;
}

export async function ProjectsSection({
  featured = true,
  limit = 6,
}: ProjectsSectionProps) {
  const projectService = new ProjectService();

  let projects: ProjectData[] = [];

  try {
    if (featured) {
      // First try to get featured projects
      projects = await projectService.getFeaturedProjects();

      // If we don't have enough featured projects, fallback to all projects
      if (projects.length < limit && limit > 0) {
        console.log(
          `[ProjectsSection] Only ${projects.length} featured projects found, fetching all projects`
        );
        const allProjects = await projectService.getProjects();
        projects = allProjects.slice(0, limit);
      }
    } else {
      // Get all projects
      const allProjects = await projectService.getProjects();
      projects = limit && limit > 0 ? allProjects.slice(0, limit) : allProjects;
    }

    console.log(
      `[ProjectsSection] Fetched ${projects.length} projects (featured: ${featured}, limit: ${limit})`
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    // Return error state but still show the section structure
    return (
      <section
        className="section-padding bg-background text-foreground"
        id="projects"
      >
        <div className="container-custom content-constrained">
          <div className="text-center mb-12">
            <span className="mb-0 text-uppercase text-sm text-muted-foreground">
              <i className="ti-minus mr-2"></i>What I have done
            </span>
            <h2 className="title text-foreground">Projects</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-destructive">
              Failed to load projects. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="section-padding bg-background text-foreground"
      id="projects"
      data-aos="fade-up"
    >
      <div className="container-custom content-constrained">
        <div className="text-center mb-12">
          <span className="mb-0 text-uppercase text-sm text-muted-foreground">
            <i className="ti-minus mr-2"></i>What I have done
          </span>
          <h2 className="title text-foreground">Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project, index) => (
            <MotionDiv
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="project-card bg-card text-card-foreground border border-border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <Link
                  href={`/projects/${project.slug}`}
                  className="block h-full"
                >
                  <div className="aspect-video overflow-hidden">
                    <ProjectImageDisplay
                      image={project.mainImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="project-title text-xl font-semibold line-clamp-2">
                      {project.title}
                    </h3>
                    {project.shortDescription && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {project.shortDescription}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            </MotionDiv>
          ))}
        </div>

        {/* More Projects Button - Only show on home page with featured projects */}
        {featured && (
          <div className="text-center mt-2 mb-6">
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">View More Projects</Link>
            </Button>
          </div>
        )}

        {/* Work Together Section */}
        <div className="row align-items-center mt-5 hire" data-aos="fade-up">
          <div className="col-lg-6 mt-5">
            <h2 className="mb-5 text-lg-2 text-foreground">
              Let's <span className="text-primary">work together</span> on your
              next project
            </h2>
          </div>
          <div className="col-lg-4 ml-auto text-right">
            <Link href="#contact" className="btn btn-main smoth-scroll">
              Hire Me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
