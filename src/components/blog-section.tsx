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
    <section className="section-padding bg-muted/30 text-foreground" id="blog">
      <div className="container-custom content-constrained">
        <div className="text-center mb-10">
          <span className="text-sm text-muted-foreground uppercase tracking-widest">
            Writing & Thoughts
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
            Blog
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Articles, tutorials, and thoughts on web development and technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog" className="gap-2">
              View All Posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
