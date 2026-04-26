import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { BlogService } from "@/lib/blog-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogEngagement, BlogStatsBadges } from "@/components/blog/blog-engagement";
import { BlogContent } from "@/components/blog/blog-content";
import { mongoDBConnection } from "@/databases/db-connection";
import { Comment } from "@/models/Comment";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blogService = new BlogService();
  const blog = await blogService.getBlogBySlug(slug);
  if (!blog) return { title: "Post Not Found" };
  return {
    title: `${blog.title} - Md. Riazul Islam`,
    description: blog.excerpt,
    openGraph: blog.coverImage?.url ? { images: [blog.coverImage.url] } : undefined,
  };
}

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(words / 200);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blogService = new BlogService();
  const blog = await blogService.getBlogBySlug(slug);

  if (!blog || blog.type !== "internal") {
    notFound();
  }

  let commentCount = 0;
  try {
    await mongoDBConnection();
    commentCount = await Comment.countDocuments({ blogId: blog._id, isHidden: false });
  } catch {}

  const readTime = blog.content ? estimateReadTime(blog.content) : 1;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <article className="pt-24 pb-16">
        <div className="container-custom content-constrained max-w-3xl mx-auto px-4">
          {/* Back */}
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
            <Link href="/blog" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {/* Category + Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.category && <Badge variant="outline">{blog.category}</Badge>}
            {blog.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta row — date · read time · views · loves · comments */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-8 border-b border-border pb-5">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readTime} min read
            </span>

            {/* Live stats (client-rendered, increments view immediately) */}
            <BlogStatsBadges
              blogId={String(blog._id)}
              initialViews={blog.views ?? 0}
              initialLoves={blog.loves ?? 0}
              initialCommentCount={commentCount}
            />
          </div>

          {/* Cover Image */}
          {blog.coverImage?.url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8 bg-muted">
              <Image
                src={blog.coverImage.url}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <BlogContent html={blog.content ?? ""} />

          {/* Engagement — love button + comments (always visible) */}
          <BlogEngagement
            blogId={String(blog._id)}
            initialViews={blog.views ?? 0}
            initialLoves={blog.loves ?? 0}
            initialCommentCount={commentCount}
          />
        </div>
      </article>

      <Footer />
    </main>
  );
}
