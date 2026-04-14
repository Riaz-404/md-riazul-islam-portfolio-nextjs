import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogData } from "@/types/blog";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: BlogData;
  className?: string;
  compact?: boolean;
}

export function BlogCard({ blog, className, compact = false }: BlogCardProps) {
  const isExternal = blog.type === "external";
  const href = isExternal ? blog.externalUrl! : `/blog/${blog.slug}`;
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link href={href} {...linkProps} className={cn("group block h-full", className)}>
      <article className="relative bg-card border border-border/70 rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-1">
        {/* Cover */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted shrink-0",
            compact ? "aspect-[3/1]" : "aspect-video"
          )}
        >
          {blog.coverImage?.url ? (
            <Image
              src={blog.coverImage.url}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/15 via-primary/5 to-muted flex items-center justify-center">
              {isExternal && blog.source ? (
                <span className="text-3xl font-extrabold text-primary/25 select-none">
                  {blog.source[0]}
                </span>
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Tag className="h-4 w-4 text-primary/50" />
                </div>
              )}
            </div>
          )}

          {/* External badge overlay */}
          {isExternal && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="bg-black/65 text-white border-0 text-[10px] font-semibold backdrop-blur-sm gap-1 px-2 py-0.5"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                {blog.source || "External"}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Category row */}
          <div className="flex items-center gap-2 mb-3">
            {blog.category && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {blog.category}
              </span>
            )}
            {blog.category && isExternal && (
              <span className="text-muted-foreground/40 text-xs">·</span>
            )}
            {isExternal && !blog.coverImage?.url && (
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <ExternalLink className="h-2.5 w-2.5" />
                {blog.source || "External"}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-[15px] leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
            {blog.title}
          </h3>

          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-4 pt-4 border-t border-border/50">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {blog.tags && blog.tags.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Tag className="h-3 w-3" />
                {blog.tags[0]}
                {blog.tags.length > 1 && (
                  <span className="text-muted-foreground/60">
                    +{blog.tags.length - 1}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
