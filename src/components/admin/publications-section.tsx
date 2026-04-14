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
  Loader2,
  X,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { publicationSchema, type PublicationFormData } from "./schemas";
import { PublicationData, publicationTypes } from "@/types/publication";

interface PublicationsSectionProps {
  publications: PublicationData[];
  onPublicationsChange: () => void;
  isLoading: boolean;
}

export function PublicationsSection({
  publications,
  onPublicationsChange,
  isLoading,
}: PublicationsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingPub, setEditingPub] = React.useState<PublicationData | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  const [authorInput, setAuthorInput] = React.useState("");
  const [tagInput, setTagInput] = React.useState("");

  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      authors: [],
      venue: "",
      year: new Date().getFullYear(),
      url: "",
      abstract: "",
      type: "journal",
      tags: [],
      featured: false,
      order: 0,
      isActive: true,
    },
  });

  const watchAuthors = form.watch("authors") ?? [];
  const watchTags = form.watch("tags") ?? [];

  const openCreateDialog = () => {
    setEditingPub(null);
    setAuthorInput("");
    setTagInput("");
    form.reset({
      title: "",
      authors: [],
      venue: "",
      year: new Date().getFullYear(),
      url: "",
      abstract: "",
      type: "journal",
      tags: [],
      featured: false,
      order: 0,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (pub: PublicationData) => {
    setEditingPub(pub);
    setAuthorInput("");
    setTagInput("");
    form.reset({
      title: pub.title,
      authors: pub.authors ?? [],
      venue: pub.venue ?? "",
      year: pub.year,
      url: pub.url ?? "",
      abstract: pub.abstract ?? "",
      type: pub.type,
      tags: pub.tags ?? [],
      featured: pub.featured,
      order: pub.order,
      isActive: pub.isActive !== false,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (pub: PublicationData) => {
    setTogglingId(pub._id!);
    try {
      const res = await fetch(`/api/publications/${pub._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !pub.isActive }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(pub.isActive ? "Publication hidden" : "Publication visible");
        onPublicationsChange();
      } else {
        toast.error(result.message ?? "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setTogglingId(null);
    }
  };

  const addAuthor = () => {
    const a = authorInput.trim();
    if (a && !watchAuthors.includes(a)) {
      form.setValue("authors", [...watchAuthors, a]);
    }
    setAuthorInput("");
  };

  const removeAuthor = (name: string) => {
    form.setValue(
      "authors",
      watchAuthors.filter((a) => a !== name)
    );
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !watchTags.includes(tag)) {
      form.setValue("tags", [...watchTags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    form.setValue(
      "tags",
      watchTags.filter((t) => t !== tag)
    );
  };

  const onSubmit = async (data: PublicationFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingPub
        ? `/api/publications/${editingPub._id}`
        : "/api/publications";
      const method = editingPub ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(editingPub ? "Publication updated!" : "Publication created!");
        setIsDialogOpen(false);
        onPublicationsChange();
      } else {
        toast.error(result.message ?? "Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this publication?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/publications/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Publication deleted");
        onPublicationsChange();
      } else {
        toast.error(result.message ?? "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const typeLabel = (type: string) =>
    publicationTypes.find((t) => t.value === type)?.label ?? type;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Publications</h2>
          <p className="text-sm text-muted-foreground">
            Manage your research publications
          </p>
        </div>
        <Button onClick={openCreateDialog} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Publication
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : publications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No publications yet. Add your first publication!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {publications.map((pub) => (
            <Card key={pub._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{pub.title}</h3>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {typeLabel(pub.type)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {pub.year}
                      </Badge>
                      {pub.featured && (
                        <Badge variant="outline" className="text-xs shrink-0 border-primary text-primary">
                          Featured
                        </Badge>
                      )}
                      {pub.isActive === false && (
                        <Badge variant="secondary" className="text-xs shrink-0 text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pub.authors.join(", ")}
                    </p>
                    {pub.venue && (
                      <p className="text-sm text-muted-foreground italic">
                        {pub.venue}
                      </p>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Paper
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title={pub.isActive === false ? "Show publicly" : "Hide from public"}
                      onClick={() => handleToggleActive(pub)}
                      disabled={togglingId === pub._id}
                    >
                      {togglingId === pub._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : pub.isActive === false ? (
                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openEditDialog(pub)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(pub._id!)}
                      disabled={deletingId === pub._id}
                    >
                      {deletingId === pub._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPub ? "Edit Publication" : "Add Publication"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Publication title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Authors */}
              <div className="space-y-2">
                <Label>Authors</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Author name"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAuthor();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAuthor}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {watchAuthors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {watchAuthors.map((author) => (
                      <Badge
                        key={author}
                        variant="secondary"
                        className="gap-1 cursor-pointer"
                        onClick={() => removeAuthor(author)}
                      >
                        {author}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
                {form.formState.errors.authors && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.authors.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {publicationTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1900}
                          max={2100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || new Date().getFullYear())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal / Conference</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Nature, ICML 2024"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL / DOI</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://doi.org/..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="abstract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abstract</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Publication abstract (optional)"
                        rows={3}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {watchTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {watchTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value ?? false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 rounded border-input"
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Featured
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value ?? true}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 rounded border-input"
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Active (visible publicly)
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        className="w-32"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingPub ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
