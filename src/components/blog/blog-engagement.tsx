"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { CommentData } from "@/types/comment";

interface BlogEngagementProps {
  blogId: string;
  initialViews: number;
  initialLoves: number;
  initialCommentCount: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function BlogEngagement({
  blogId,
  initialViews,
  initialLoves,
  initialCommentCount,
}: BlogEngagementProps) {
  const [loves, setLoves] = useState(initialLoves);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [loadingComments, setLoadingComments] = useState(true);
  const [lovePulse, setLovePulse] = useState(false);
  const viewTracked = useRef(false);

  // Track view on mount
  useEffect(() => {
    if (viewTracked.current) return;
    viewTracked.current = true;
    fetch(`/api/blogs/${blogId}/view`, { method: "POST" }).catch(() => {});
  }, [blogId]);

  // Load comments on mount
  useEffect(() => {
    fetch(`/api/blogs/${blogId}/comments`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setComments(d.data);
          setCommentCount(d.data.length);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, [blogId]);

  const handleLove = async () => {
    setLovePulse(true);
    setTimeout(() => setLovePulse(false), 600);
    try {
      const res = await fetch(`/api/blogs/${blogId}/love`, { method: "POST" });
      const data = await res.json();
      if (data.success) setLoves(data.loves);
    } catch {}
  };

  return (
    <div className="mt-10 space-y-10">
      {/* Love button */}
      <div className="flex justify-center">
        <button
          onClick={handleLove}
          className={`group flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-200 font-medium
            ${lovePulse
              ? "border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-500 scale-105"
              : "border-border hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-500"
            }`}
          aria-label="Love this post"
        >
          <Heart
            className={`h-5 w-5 transition-all ${
              lovePulse ? "fill-rose-500 text-rose-500 scale-125" : "group-hover:text-rose-500"
            }`}
          />
          <span>{formatCount(loves)} {loves === 1 ? "Love" : "Loves"}</span>
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          Comments
          {commentCount > 0 && (
            <span className="text-base font-normal text-muted-foreground">({commentCount})</span>
          )}
        </h3>

        <CommentForm
          blogId={blogId}
          onPosted={(c) => {
            setComments((prev) => [c, ...prev]);
            setCommentCount((n) => n + 1);
          }}
        />

        {loadingComments ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-muted rounded w-32" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No comments yet</p>
            <p className="text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {comments.map((c) => (
              <CommentCard key={c._id} comment={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Inline stats for the meta row at the top of the article ──────────────────
// These are client-rendered so the view count updates live after tracking.
export function BlogStatsBadges({
  blogId,
  initialViews,
  initialLoves,
  initialCommentCount,
}: {
  blogId: string;
  initialViews: number;
  initialLoves: number;
  initialCommentCount: number;
}) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    // Optimistically show +1 for current view
    setViews((v) => v + 1);
  }, []);

  return (
    <>
      <span className="flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5" />
        {formatCount(views)}
      </span>
      <span className="flex items-center gap-1.5">
        <Heart className="h-3.5 w-3.5 text-rose-500" />
        {formatCount(initialLoves)}
      </span>
      <span className="flex items-center gap-1.5">
        <MessageCircle className="h-3.5 w-3.5" />
        {formatCount(initialCommentCount)}
      </span>
    </>
  );
}

// ─── Comment Form ──────────────────────────────────────────────────────────────
function CommentForm({
  blogId,
  onPosted,
}: {
  blogId: string;
  onPosted: (comment: CommentData) => void;
}) {
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) { setError("Please write something."); return; }
    if (content.trim().length > 1000) { setError("Comment is too long (max 1000 chars)."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), authorName: authorName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        onPosted(data.data as CommentData);
        setContent("");
        setAuthorName("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message ?? "Failed to post comment.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl border border-border bg-muted/20">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
          {authorName ? authorName[0].toUpperCase() : "?"}
        </div>
        <Input
          placeholder="Your name (optional)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={50}
          className="h-8 text-sm"
        />
      </div>
      <Textarea
        placeholder="Share your thoughts…"
        value={content}
        onChange={(e) => { setContent(e.target.value); setError(""); }}
        rows={3}
        maxLength={1000}
        className="resize-none"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{content.length}/1000</p>
        <div className="flex items-center gap-2">
          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && <p className="text-xs text-green-600 dark:text-green-400">Posted!</p>}
          <Button type="submit" size="sm" disabled={submitting || !content.trim()} className="gap-1.5">
            {submitting ? (
              <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Post
          </Button>
        </div>
      </div>
    </form>
  );
}

// ─── Comment Card ──────────────────────────────────────────────────────────────
function CommentCard({ comment }: { comment: CommentData }) {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold shrink-0 mt-0.5">
        {comment.authorName ? comment.authorName[0].toUpperCase() : "A"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-sm">{comment.authorName || "Anonymous"}</span>
          <span className="text-xs text-muted-foreground">
            {comment.createdAt ? timeAgo(comment.createdAt) : ""}
          </span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground/90">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
