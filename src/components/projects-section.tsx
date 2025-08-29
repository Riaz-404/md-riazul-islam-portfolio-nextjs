"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProjectImageDisplay } from "@/components/ui/project-image";
import { ProjectData } from "@/types/project";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface ProjectsSectionProps {
  featured?: boolean;
  limit?: number;
}

export function ProjectsSection({
  featured = true,
  limit = 6,
}: ProjectsSectionProps) {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [featured, limit]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let endpoint = featured ? "/api/projects/featured" : "/api/projects";
      let response = await fetch(endpoint);
      let result = await response.json();

      if (result.success) {
        let projectsData = result.data;

        // If we're looking for featured projects but don't have enough, fallback to all projects
        if (featured && projectsData.length < limit && limit > 0) {
          console.log(
            `[ProjectsSection] Only ${projectsData.length} featured projects found, fetching all projects`
          );
          response = await fetch("/api/projects");
          result = await response.json();
          if (result.success) {
            projectsData = result.data;
          }
        }

        if (limit && limit > 0) {
          projectsData = projectsData.slice(0, limit);
        }

        console.log(
          `[ProjectsSection] Fetched ${projectsData.length} projects (featured: ${featured}, limit: ${limit})`
        );
        setProjects(projectsData);
      } else {
        setError(result.message || "Failed to fetch projects");
      }
    } catch (err) {
      setError("Failed to load projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="section-padding bg-background text-foreground"
        id="projects"
      >
        <div className="container-custom content-constrained">
          <div className="text-center py-12">
            <p className="text-destructive">Error: {error}</p>
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
            <motion.div
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
            </motion.div>
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
