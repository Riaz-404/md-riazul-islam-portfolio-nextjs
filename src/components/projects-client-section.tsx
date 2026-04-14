"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ExternalLink, Github, ArrowRight, SlidersHorizontal } from "lucide-react";
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
      {/* Filter bar */}
      {showFilters && frameworks.length > 2 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </div>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((fw) => (
              <button
                key={fw}
                onClick={() => setActiveFilter(fw)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
                  activeFilter === fw
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {fw}
              </button>
            ))}
          </div>
          {activeFilter !== "All" && (
            <span className="text-xs text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-base">No projects match this filter.</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-primary hover:text-primary"
            onClick={() => setActiveFilter("All")}
          >
            Show all →
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  layout: { duration: 0.25 },
                }}
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
    <div className="group relative bg-card border border-border/70 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col hover:border-primary/40 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <ProjectImageDisplay
          image={project.mainImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Link
              href={`/projects/${project.slug}`}
              className="flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors"
            >
              View Details
              <ArrowRight className="h-3 w-3" />
            </Link>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
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
                className="flex items-center gap-1 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors border border-white/25 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-3 w-3" />
                Code
              </a>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          {project.featured && (
            <Badge className="text-[10px] font-semibold bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm px-2 py-0.5">
              Featured
            </Badge>
          )}
          <div className="ml-auto">
            {project.framework && (
              <Badge
                variant="secondary"
                className="text-[10px] font-semibold bg-black/60 text-white border-0 backdrop-blur-sm px-2 py-0.5"
              >
                {project.framework}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/projects/${project.slug}`} className="block mb-2">
          <h3 className="font-bold text-[15px] leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {project.title}
          </h3>
        </Link>

        {project.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
            {project.shortDescription}
          </p>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/50">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
