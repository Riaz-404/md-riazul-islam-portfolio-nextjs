"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Globe,
  FileText,
  Loader2,
  X,
  Tag,
  Eye,
  EyeOff,
  Monitor,
  PenLine,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { blogSchema, type BlogFormData } from "./schemas";
import { BlogData, blogCategories } from "@/types/blog";
import type { CommentData } from "@/types/comment";

interface BlogSectionProps {
  blogs: BlogData[];
  onBlogsChange: () => void;
  isBlogsLoading: boolean;
}

// ─── Comment Moderation Panel ─────────────────────────────────────────────────
function CommentPanel({ blogId }: { blogId: string }) {
  const [comments, setComments] = React.useState<CommentData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [toggling, setToggling] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (loaded) return;
    setLoading(true);
    fetch(`/api/blogs/${blogId}/comments?all=true`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setComments(d.data); })
      .catch(() => {})
      .finally(() => { setLoading(false); setLoaded(true); });
  }, [blogId, loaded]);

  const handleToggle = async (comment: CommentData) => {
    setToggling(comment._id!);
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments/${comment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !comment.isHidden }),
      });
      const d = await res.json();
      if (d.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === comment._id ? { ...c, isHidden: !c.isHidden } : c))
        );
      }
    } catch {}
    setToggling(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/blogs/${blogId}/comments/${id}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch {}
    setDeleting(null);
  };

  const active = comments.filter((c) => !c.isHidden).length;
  const hidden = comments.filter((c) => c.isHidden).length;

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading comments…
      </div>
    );
  }

  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground py-3">No comments yet.</p>;
  }

  return (
    <div className="space-y-2 pt-1">
      <p className="text-xs text-muted-foreground">
        {active} visible · {hidden} hidden
      </p>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {comments.map((c) => (
          <div
            key={c._id}
            className={`flex items-start gap-3 p-3 rounded-lg border text-sm transition-opacity ${
              c.isHidden ? "opacity-50 bg-muted/30" : "bg-background"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {c.authorName ? c.authorName[0].toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium text-xs">{c.authorName || "Anonymous"}</span>
                <span className="text-xs text-muted-foreground">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                </span>
                {c.isHidden && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/80 whitespace-pre-wrap break-words line-clamp-3">
                {c.content}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleToggle(c)}
                disabled={toggling === c._id}
                title={c.isHidden ? "Show comment" : "Hide comment"}
                className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                {toggling === c._id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : c.isHidden ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={() => handleDelete(c._id!)}
                disabled={deleting === c._id}
                title="Delete comment"
                className="h-7 w-7 flex items-center justify-center rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
              >
                {deleting === c._id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Live Preview ─────────────────────────────────────────────────────────────
function BlogPreview({ data }: { data: BlogFormData }) {
  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      {/* Simulated browser bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-background rounded px-2 py-0.5 text-xs text-muted-foreground truncate">
          yoursite.com/blog/{data.title
            ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
            : "post-slug"}
        </div>
      </div>

      {/* Preview content */}
      <div className="p-6 max-h-[600px] overflow-y-auto text-sm space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {data.category && (
            <span className="px-2 py-0.5 rounded-full border border-border text-xs">
              {data.category}
            </span>
          )}
          {(data.tags ?? []).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-xs">
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold leading-tight">
          {data.title || <span className="text-muted-foreground">Post title will appear here…</span>}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground border-b border-border pb-4">
          <span>
            {data.publishedAt
              ? new Date(data.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
          </span>
          {data.content && (
            <span>
              {Math.ceil(data.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200)} min read
            </span>
          )}
          {data.draft && (
            <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs">
              Draft
            </span>
          )}
        </div>

        {/* Cover image placeholder */}
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">
          Cover image
        </div>

        {/* Body */}
        {data.type === "internal" ? (
          data.content ? (
            <div
              className="prose prose-sm max-w-none prose-neutral dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          ) : (
            <p className="text-muted-foreground italic text-xs">
              Start writing content to see it previewed here…
            </p>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-muted-foreground">
            <ExternalLink className="h-8 w-8 opacity-30" />
            <p className="text-sm">
              External article — readers will be redirected to{" "}
              <span className="text-primary">{data.source || "the external source"}</span>
            </p>
            {data.externalUrl && (
              <p className="text-xs truncate max-w-full">{data.externalUrl}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function BlogSection({
  blogs,
  onBlogsChange,
  isBlogsLoading,
}: BlogSectionProps) {
  const [editingBlog, setEditingBlog] = React.useState<BlogData | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  const [publishingId, setPublishingId] = React.useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null);
  const [tagInput, setTagInput] = React.useState("");
  const [expandedComments, setExpandedComments] = React.useState<string | null>(null);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      type: "internal",
      title: "",
      excerpt: "",
      content: "",
      externalUrl: "",
      source: "",
      category: "",
      tags: [],
      featured: false,
      draft: true,
      isActive: true,
      order: 0,
      publishedAt: new Date(),
    },
  });

  // Watch values for live preview
  const watchedValues = form.watch();
  const watchType = watchedValues.type;
  const watchTags = watchedValues.tags ?? [];

  const openCreateForm = () => {
    setEditingBlog(null);
    setCoverImageFile(null);
    setTagInput("");
    setShowPreview(false);
    form.reset({
      type: "internal",
      title: "",
      excerpt: "",
      content: "",
      externalUrl: "",
      source: "",
      category: "",
      tags: [],
      featured: false,
      draft: true,
      isActive: true,
      order: 0,
      publishedAt: new Date(),
    });
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById("blog-form-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const openEditForm = (blog: BlogData) => {
    setEditingBlog(blog);
    setCoverImageFile(null);
    setTagInput("");
    setShowPreview(false);
    form.reset({
      type: blog.type,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content ?? "",
      externalUrl: blog.externalUrl ?? "",
      source: blog.source ?? "",
      category: blog.category ?? "",
      tags: blog.tags ?? [],
      featured: blog.featured,
      draft: blog.draft ?? true,
      isActive: blog.isActive !== false,
      order: blog.order,
      publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
    });
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById("blog-form-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBlog(null);
    setShowPreview(false);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !watchTags.includes(tag)) {
      form.setValue("tags", [...watchTags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    form.setValue("tags", watchTags.filter((t) => t !== tag));
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("title", data.title);
      formData.append("excerpt", data.excerpt);
      formData.append("content", data.content ?? "");
      formData.append("externalUrl", data.externalUrl ?? "");
      formData.append("source", data.source ?? "");
      formData.append("category", data.category ?? "");
      formData.append("featured", String(data.featured ?? false));
      formData.append("draft", String(data.draft ?? true));
      formData.append("isActive", String(data.isActive !== false));
      formData.append("order", String(data.order ?? 0));
      formData.append("publishedAt", (data.publishedAt ?? new Date()).toISOString());
      formData.append("tags", JSON.stringify(data.tags ?? []));
      if (coverImageFile) formData.append("coverImage", coverImageFile);

      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";
      const res = await fetch(url, { method, body: formData });
      const result = await res.json();

      if (result.success) {
        toast.success(editingBlog ? "Blog updated!" : "Blog created!");
        closeForm();
        onBlogsChange();
      } else {
        toast.error(result.message ?? "Failed to save blog");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (blog: BlogData) => {
    setTogglingId(blog._id!);
    try {
      const res = await fetch(`/api/blogs/${blog._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: blog.isActive === false }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`Blog ${blog.isActive === false ? "activated" : "deactivated"}`);
        onBlogsChange();
      } else {
        toast.error("Failed to update blog status");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setTogglingId(null);
    }
  };

  const handlePublish = async (blog: BlogData) => {
    setPublishingId(blog._id!);
    try {
      const res = await fetch(`/api/blogs/${blog._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: false }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Blog published!");
        onBlogsChange();
      } else {
        toast.error("Failed to publish blog");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Blog deleted");
        onBlogsChange();
      } else {
        toast.error(result.message ?? "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Blog Management</h2>
        <Button
          onClick={openCreateForm}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Blog List */}
      {isBlogsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-3">
          {blogs.map((blog) => (
            <Card
              key={blog._id}
              className={blog.isActive === false ? "opacity-60" : ""}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 text-muted-foreground">
                    {blog.type === "internal" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium truncate">{blog.title}</h3>
                      <Badge variant={blog.type === "internal" ? "default" : "secondary"} className="text-xs shrink-0">
                        {blog.type === "internal" ? "Post" : "External"}
                      </Badge>
                      {blog.isActive === false && (
                        <Badge variant="outline" className="text-xs shrink-0 text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                      {blog.type === "internal" && blog.draft && (
                        <Badge variant="outline" className="text-xs shrink-0">Draft</Badge>
                      )}
                      {blog.featured && (
                        <Badge variant="outline" className="text-xs shrink-0 border-primary text-primary">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{blog.excerpt}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                      {blog.category && <span>{blog.category}</span>}
                      {blog.type === "external" && blog.source && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />{blog.source}
                        </span>
                      )}
                      <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      {/* Engagement stats */}
                      <span className="flex items-center gap-1 text-muted-foreground/70">
                        <Eye className="h-3 w-3" />{blog.views ?? 0}
                      </span>
                      <span className="flex items-center gap-1 text-rose-400/80">
                        <Heart className="h-3 w-3" />{blog.loves ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Quick publish — shown only for internal draft posts */}
                    {blog.type === "internal" && blog.draft && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 gap-1.5 text-xs text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950/30"
                        title="Publish this draft"
                        onClick={() => handlePublish(blog)}
                        disabled={publishingId === blog._id}
                      >
                        {publishingId === blog._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                        Publish
                      </Button>
                    )}

                    {/* Comments toggle */}
                    {blog.type === "internal" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 gap-1 text-xs"
                        title="Manage comments"
                        onClick={() =>
                          setExpandedComments(
                            expandedComments === blog._id ? null : blog._id!
                          )
                        }
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        {expandedComments === blog._id ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title={blog.isActive === false ? "Activate" : "Deactivate"}
                      onClick={() => handleToggleActive(blog)}
                      disabled={togglingId === blog._id}
                    >
                      {togglingId === blog._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : blog.isActive === false ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openEditForm(blog)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(blog._id!)}
                      disabled={deletingId === blog._id}
                    >
                      {deletingId === blog._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expandable comments panel */}
                {expandedComments === blog._id && blog.type === "internal" && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Comment Moderation
                    </p>
                    <CommentPanel blogId={blog._id!} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {!isBlogsLoading && blogs.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No blog posts yet. Click &ldquo;New Post&rdquo; to create your first post.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Inline Form */}
      {isFormOpen && (
        <Card className="mt-6" id="blog-form-section">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle>{editingBlog ? "Edit Post" : "New Blog Post"}</CardTitle>
              <div className="flex items-center gap-2">
                {/* Preview toggle — only meaningful for internal posts */}
                {watchType === "internal" && (
                  <Button
                    type="button"
                    variant={showPreview ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPreview((v) => !v)}
                    className="gap-1.5"
                  >
                    <Monitor className="h-4 w-4" />
                    {showPreview ? "Hide Preview" : "Preview"}
                  </Button>
                )}
                <Button variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className={showPreview ? "grid grid-cols-1 xl:grid-cols-2 gap-6" : ""}>
              {/* ── Form ── */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="internal">
                              <span className="flex items-center gap-2">
                                <PenLine className="h-3.5 w-3.5" />
                                Internal Post (written here)
                              </span>
                            </SelectItem>
                            <SelectItem value="external">
                              <span className="flex items-center gap-2">
                                <Globe className="h-3.5 w-3.5" />
                                External Article (Medium, Dev.to…)
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Blog post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Excerpt */}
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description (max 300 chars)"
                            maxLength={300}
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content — internal only */}
                  {watchType === "internal" && (
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value ?? ""}
                              onChange={field.onChange}
                              placeholder="Write your blog post…"
                              minHeight="300px"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* External fields */}
                  {watchType === "external" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="externalUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>External URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://medium.com/…" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source Platform</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Medium, Dev.to, Hashnode" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Category + Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select value={field.value ?? ""} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {blogCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="publishedAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Published Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag and press Enter…"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addTag}>
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                    {watchTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {watchTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeTag(tag)}>
                            {tag}<X className="h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cover Image */}
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverImageFile(e.target.files?.[0] ?? null)}
                    />
                    {editingBlog?.coverImage && !coverImageFile && (
                      <p className="text-xs text-muted-foreground">Current image kept unless you upload a new one.</p>
                    )}
                  </div>

                  <Separator />

                  {/* Toggles row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <input type="checkbox" checked={field.value ?? false}
                              onChange={(e) => field.onChange(e.target.checked)} className="h-4 w-4 rounded border-input" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Featured</FormLabel>
                        </FormItem>
                      )}
                    />
                    {watchType === "internal" && (
                      <FormField
                        control={form.control}
                        name="draft"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <input type="checkbox" checked={field.value ?? true}
                                onChange={(e) => field.onChange(e.target.checked)} className="h-4 w-4 rounded border-input" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Draft</FormLabel>
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <input type="checkbox" checked={field.value !== false}
                              onChange={(e) => field.onChange(e.target.checked)} className="h-4 w-4 rounded border-input" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Active</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {editingBlog ? "Update Post" : "Create Post"}
                    </Button>
                  </div>
                </form>
              </Form>

              {/* ── Preview Panel ── */}
              {showPreview && watchType === "internal" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Monitor className="h-4 w-4" />
                    Live Preview
                  </div>
                  <BlogPreview data={watchedValues} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
