"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ExternalLink, Github, ArrowRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProjectData } from "@/types/project";
import { ProjectImageDisplay } from "@/components/ui/project-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectsClientSectionProps {
  projects: ProjectData[];
  showFilters?: boolean;
  featured?: boolean;
}

export function ProjectsClientSection({
  projects,
  showFilters = true,
  featured = false,
}: ProjectsClientSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Derive unique frameworks from actual data
  const frameworks = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.framework && p.framework !== "Other") set.add(p.framework);
    });
    return ["All", ...Array.from(set).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => p.framework === activeFilter);
  }, [projects, activeFilter]);

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      {showFilters && frameworks.length > 2 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex flex-wrap gap-2">
            {frameworks.map((fw) => (
              <button
                key={fw}
                onClick={() => setActiveFilter(fw)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  activeFilter === fw
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {fw}
              </button>
            ))}
          </div>
          {activeFilter !== "All" && (
            <span className="text-xs text-muted-foreground ml-1">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No projects found for this filter.</p>
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => setActiveFilter("All")}
          >
            Show all projects
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  layout: { duration: 0.3 },
                }}
                className={cn(
                  project.featured && !featured
                    ? "md:col-span-2 lg:col-span-1"
                    : ""
                )}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <ProjectImageDisplay
          image={project.mainImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 bg-white text-black text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors"
          >
            View Details
            <ArrowRight className="h-3 w-3" />
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              Live
            </a>
          )}
          {(project.frontendCodeUrl || project.backendCodeUrl) && (
            <a
              href={project.frontendCodeUrl || project.backendCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors border border-white/30"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-3 w-3" />
              Code
            </a>
          )}
        </div>
        {/* Framework badge */}
        {project.framework && (
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-black/70 text-white border-0 backdrop-blur-sm"
            >
              {project.framework}
            </Badge>
          </div>
        )}
        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="text-xs font-medium bg-primary/90 text-primary-foreground border-0">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/projects/${project.slug}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight line-clamp-2 hover:text-primary transition-colors">
              {project.title}
            </h3>
          </Link>
        </div>

        {project.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {project.shortDescription}
          </p>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
