import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { BlogService } from "@/lib/blog-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

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
    openGraph: blog.coverImage?.url
      ? { images: [blog.coverImage.url] }
      : undefined,
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
            {blog.category && (
              <Badge variant="outline">{blog.category}</Badge>
            )}
            {blog.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
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
          <div
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
          />
        </div>
      </article>

      <Footer />
    </main>
  );
}
