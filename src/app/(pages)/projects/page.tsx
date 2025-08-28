import { Metadata } from "next";
import { Navigation } from "@/components/shared/navigation";
import { ProjectsSection } from "@/components/projects-section";

export const metadata: Metadata = {
  title: "Projects - Md. Riazul Islam",
  description:
    "Explore my portfolio of web development projects including full-stack applications, e-commerce solutions, and modern web experiences.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">My Projects</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A collection of my web development projects showcasing modern
              technologies, creative solutions, and attention to detail. From
              e-commerce platforms to interactive web applications.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <ProjectsSection featured={false} />
    </main>
  );
}
