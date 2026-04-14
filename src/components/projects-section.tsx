import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectData } from "@/types/project";
import { Button } from "@/components/ui/button";
import { ProjectService } from "@/lib/project-service";
import { ProjectsClientSection } from "@/components/projects-client-section";
import { MotionDiv } from "@/components/motion/motion-html-element";

interface ProjectsSectionProps {
  featured?: boolean;
  limit?: number;
}

const ease = [0.25, 0.46, 0.45, 0.94] as const;

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
      const all = await projectService.getProjects();
      projects = limit > 0 ? all.slice(0, limit) : all;
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <section className="py-24 lg:py-32 bg-background" id="projects">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <p className="text-destructive text-center">
            Failed to load projects.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 lg:py-32 bg-background" id="projects">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Section header */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-3">
              Selected Work
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              What I&apos;ve Built
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md text-base">
              Full-stack web apps, e-commerce platforms, and scalable systems —
              built to perform.
            </p>
          </div>

          {featured && (
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 shrink-0 group"
            >
              View all projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </MotionDiv>

        <ProjectsClientSection
          projects={projects}
          showFilters={!featured}
          featured={featured}
        />

        {featured && projects.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" size="lg" className="gap-2 hover:border-primary hover:text-primary transition-colors">
              <Link href="/projects">
                Browse All Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </MotionDiv>
        )}
      </div>
    </section>
  );
}
