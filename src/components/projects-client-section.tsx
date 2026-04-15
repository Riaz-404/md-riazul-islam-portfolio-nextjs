"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
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
      {/* ── Filter Bar ── */}
      {showFilters && frameworks.length > 2 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {frameworks.map((fw) => (
              <button
                key={fw}
                onClick={() => setActiveFilter(fw)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  activeFilter === fw
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                )}
              >
                {fw}
              </button>
            ))}
          </div>
          {activeFilter !== "All" && (
            <span className="text-xs text-muted-foreground">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* ── Projects Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
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
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06,
                  layout: { duration: 0.3 },
                }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">

      {/* ── Image ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <ProjectImageDisplay
          image={project.mainImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5">
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition-colors shadow-md"
          >
            View Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-md"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </a>
          )}
          {(project.frontendCodeUrl || project.backendCodeUrl) && (
            <a
              href={project.frontendCodeUrl || project.backendCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-white/25 transition-colors border border-white/30 shadow-md"
            >
              <Github className="h-3.5 w-3.5" />
              Code
            </a>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {project.framework && (
            <Badge
              variant="secondary"
              className="text-xs font-semibold bg-black/75 text-white border-0 backdrop-blur-md px-2.5"
            >
              {project.framework}
            </Badge>
          )}
        </div>
        {project.featured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="text-xs font-semibold bg-primary/95 text-primary-foreground border-0 px-2.5">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Index + Title */}
        <div className="flex items-start gap-3 mb-2.5">
          <span className="text-xs font-mono text-muted-foreground/60 mt-0.5 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Link href={`/projects/${project.slug}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-snug text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {project.title}
            </h3>
          </Link>
        </div>

        {/* Description */}
        {project.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed pl-7">
            {project.shortDescription}
          </p>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pl-7">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/60"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/60">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
