import { Metadata } from "next";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { ProjectService } from "@/lib/project-service";
import { ProjectData } from "@/types/project";
import { ProjectsClientSection } from "@/components/projects-client-section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects - Md. Riazul Islam",
  description:
    "Explore my portfolio of web development projects including full-stack applications, e-commerce solutions, and modern web experiences.",
};

export default async function ProjectsPage() {
  const projectService = new ProjectService();
  let projects: ProjectData[] = [];
  try {
    projects = await projectService.getProjects();
  } catch {
    projects = [];
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-custom content-constrained text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            My Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of my web development projects — modern tech stacks,
            creative solutions, and attention to detail.
          </p>
        </div>
      </section>

      {/* Projects with filters */}
      <section className="section-padding">
        <div className="container-custom content-constrained">
          <ProjectsClientSection
            projects={projects}
            showFilters={true}
            featured={false}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
