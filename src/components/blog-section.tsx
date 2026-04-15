import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogService } from "@/lib/blog-service";
import { BlogCard } from "@/components/shared/blog-card";

export async function BlogSection() {
  const blogService = new BlogService();

  let blogs = [];
  try {
    blogs = await blogService.getFeaturedBlogs();
  } catch {
    return null;
  }

  if (blogs.length === 0) return null;

  return (
    <section className="py-24 lg:py-32" id="blog">
      <div className="container-custom content-constrained">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-xl">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.15em]">
              Writing &amp; Thoughts
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              From the Blog
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg">
              Articles, tutorials, and perspectives on web development and technology.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="shrink-0 rounded-xl border-border hover:border-primary/50 hover:bg-primary/8 font-semibold group"
          >
            <Link href="/blog" className="inline-flex items-center gap-2">
              All Posts
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
