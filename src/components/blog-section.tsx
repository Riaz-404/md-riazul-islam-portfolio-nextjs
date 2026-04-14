import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogService } from "@/lib/blog-service";
import { BlogCard } from "@/components/shared/blog-card";
import { MotionDiv } from "@/components/motion/motion-html-element";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

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
    <section
      className="py-24 lg:py-32 bg-muted/25 border-y border-border/40"
      id="blog"
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-3">
              Writing & Thoughts
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              From the Blog
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md text-base">
              Articles, tutorials, and opinions on engineering, systems, and
              the web.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 shrink-0 group"
          >
            All posts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </MotionDiv>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog, i) => (
            <MotionDiv
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease }}
            >
              <BlogCard blog={blog} />
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}
