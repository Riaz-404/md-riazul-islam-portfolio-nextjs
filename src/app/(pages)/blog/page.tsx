import { Metadata } from "next";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { BlogService } from "@/lib/blog-service";
import { BlogData } from "@/types/blog";
import { BlogCard } from "@/components/shared/blog-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog - Md. Riazul Islam",
  description:
    "Articles, tutorials, and thoughts on web development and software engineering.",
};

export default async function BlogPage() {
  const blogService = new BlogService();
  let blogs: BlogData[] = [];
  try {
    blogs = await blogService.getBlogs();
  } catch {
    blogs = [];
  }

  const internalPosts = blogs.filter((b) => b.type === "internal");
  const externalArticles = blogs.filter((b) => b.type === "external");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-custom content-constrained text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Articles, tutorials, and thoughts on web development and technology.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom content-constrained space-y-12">
          {/* Internal Posts */}
          {internalPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internalPosts.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            </div>
          )}

          {/* External Articles */}
          {externalArticles.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Featured on Other Platforms
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Articles I&apos;ve published on Medium, Dev.to, and other
                platforms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {externalArticles.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            </div>
          )}

          {blogs.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
