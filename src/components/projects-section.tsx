"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProjectImageDisplay } from "@/components/ui/project-image";
import { ProjectData } from "@/types/project";
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
      const endpoint = featured ? "/api/projects/featured" : "/api/projects";
      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        let projectsData = result.data;

        if (limit && limit > 0) {
          projectsData = projectsData.slice(0, limit);
        }

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
      <section className="projects-section" id="projects">
        <div className="container content-constrained">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="section-title text-center">
                <span className="mb-0 text-uppercase text-sm">
                  <i className="ti-minus mr-2"></i>What I have done
                </span>
                <h2 className="title">Projects</h2>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: "#e1a34c" }}
            ></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="projects-section" id="projects">
        <div className="container content-constrained">
          <div className="text-center py-12">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-section" id="projects" data-aos="fade-up">
      <div className="container content-constrained">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-title text-center">
              <span className="mb-0 text-uppercase text-sm">
                <i className="ti-minus mr-2"></i>What I have done
              </span>
              <h2 className="title">Projects</h2>
            </div>
          </div>
        </div>

        <div className="row">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              className="col-lg-4 col-md-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="project-card">
                <Link href={`/projects/${project.slug}`}>
                  <ProjectImageDisplay
                    image={project.mainImage}
                    alt={project.title}
                    className="w-full"
                  />
                  <h3 className="my-4 text-capitalize">{project.title}</h3>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Work Together Section */}
        <div className="row align-items-center mt-5 hire" data-aos="fade-up">
          <div className="col-lg-6 mt-5">
            <h2 className="mb-5 text-lg-2">
              Let's <span>work together</span> on your next project
            </h2>
          </div>
          <div className="col-lg-4 ml-auto text-right">
            <a href="#contact" className="btn btn-main smoth-scroll">
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
