import Link from "next/link";
import { ProjectData } from "@/types/project";
import { Button } from "@/components/ui/button";
import { ProjectService } from "@/lib/project-service";
import { ProjectsClientSection } from "@/components/projects-client-section";

interface ProjectsSectionProps {
  featured?: boolean;
  limit?: number;
}

export async function ProjectsSection({
  featured = true,
  limit = 100,
}: ProjectsSectionProps) {
  const projectService = new ProjectService();

  let projects: ProjectData[] = [];

  try {
    if (featured) {
      projects = await projectService.getFeaturedProjects();
    } else {
      const allProjects = await projectService.getProjects();
      projects = limit && limit > 0 ? allProjects.slice(0, limit) : allProjects;
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <section
        className="section-padding bg-background text-foreground"
        id="projects"
      >
        <div className="container-custom content-constrained">
          <div className="text-center mb-12">
            <span className="text-sm text-muted-foreground uppercase tracking-widest">
              What I have done
            </span>
            <h2 className="text-3xl font-bold mt-2 text-foreground">
              Projects
            </h2>
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
    >
      <div className="container-custom content-constrained">
        <div className="text-center mb-10">
          <span className="text-sm text-muted-foreground uppercase tracking-widest">
            What I have done
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
            Projects
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm sm:text-base">
            A selection of projects I&apos;ve built — from full-stack web apps
            to modern e-commerce platforms.
          </p>
        </div>

        <ProjectsClientSection
          projects={projects}
          showFilters={!featured}
          featured={featured}
        />

        {/* More Projects Button */}
        {featured && (
          <div className="text-center mt-10">
            <Button asChild variant="default" size="lg">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
