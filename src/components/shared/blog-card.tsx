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
    <Link href={href} {...linkProps} className={cn("group block", className)}>
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        {/* Cover Image */}
        {blog.coverImage?.url ? (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <Image
              src={blog.coverImage.url}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {isExternal && (
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className="bg-black/70 text-white border-0 text-xs backdrop-blur-sm gap-1"
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                  {blog.source || "External"}
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center",
              compact && "aspect-[3/1]"
            )}
          >
            {isExternal && blog.source && (
              <span className="text-2xl font-bold text-primary/30">
                {blog.source[0]}
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center gap-2 mb-2">
            {blog.category && (
              <Badge variant="outline" className="text-xs">
                {blog.category}
              </Badge>
            )}
            {isExternal && (
              <Badge
                variant="secondary"
                className="text-xs gap-1"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                {blog.source || "External"}
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {blog.title}
          </h3>

          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-3">
              {blog.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {blog.tags && blog.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {blog.tags[0]}
                {blog.tags.length > 1 && ` +${blog.tags.length - 1}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
