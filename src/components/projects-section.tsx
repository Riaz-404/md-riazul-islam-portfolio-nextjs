import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      <section className="py-24 lg:py-32 bg-muted/20" id="projects">
        <div className="container">
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
    <section className="py-24 lg:py-32 bg-muted/20" id="projects">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div className="space-y-3 max-w-xl">
              <p className="text-primary text-sm font-semibold uppercase tracking-[0.15em]">
                {featured ? "Featured Work" : "All Projects"}
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Projects I&apos;ve Built
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg">
                A curated selection of full-stack web apps, SaaS tools, and
                creative builds.
              </p>
            </div>

            {featured && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="shrink-0 rounded-xl border-border hover:border-primary/50 hover:bg-primary/8 font-semibold group"
              >
                <Link href="/projects" className="inline-flex items-center gap-2">
                  All Projects
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            )}
          </div>

          <ProjectsClientSection
            projects={projects}
            showFilters={!featured}
            featured={featured}
          />

          {/* Mobile: View All button below grid */}
          {featured && (
            <div className="flex sm:hidden justify-center mt-10">
              <Button asChild variant="default" size="lg" className="rounded-xl font-semibold">
                <Link href="/projects" className="inline-flex items-center gap-2">
                  View All Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
