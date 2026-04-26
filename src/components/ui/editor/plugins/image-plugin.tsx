"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  type LexicalCommand,
} from "lexical";
import { $createImageNode } from "../nodes/image-node";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader2, Upload, Link } from "lucide-react";

export const INSERT_IMAGE_COMMAND: LexicalCommand<void> = createCommand("INSERT_IMAGE_COMMAND");

type ImageWidth = "small" | "medium" | "large" | "full";

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [width, setWidth] = useState<ImageWidth>("full");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      () => {
        setOpen(true);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }
    setUploadError("");
    setUploading(true);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog-content");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUploadedUrl(data.url);
    } catch {
      setUploadError("Failed to upload image. Please try again.");
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleInsert = useCallback(() => {
    const src = tab === "upload" ? uploadedUrl : externalUrl.trim();
    if (!src) return;

    editor.update(() => {
      const selection = $getSelection();
      const imageNode = $createImageNode({ src, alt: alt.trim(), width, caption: caption.trim() });
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor.getNode();
        const topNode = anchor.getTopLevelElementOrThrow();
        topNode.insertAfter(imageNode);
        const para = $createParagraphNode();
        imageNode.insertAfter(para);
        para.select();
      } else {
        const root = editor.getEditorState()._nodeMap.get("root");
        if (root) {
          // fallback: just append
        }
      }
    });

    // Reset
    setPreviewUrl("");
    setUploadedUrl("");
    setExternalUrl("");
    setAlt("");
    setCaption("");
    setWidth("full");
    setUploadError("");
    setOpen(false);
  }, [editor, tab, uploadedUrl, externalUrl, alt, caption, width]);

  const handleClose = () => {
    setPreviewUrl("");
    setUploadedUrl("");
    setExternalUrl("");
    setAlt("");
    setCaption("");
    setWidth("full");
    setUploadError("");
    setOpen(false);
  };

  const activePreview = tab === "upload" ? previewUrl : externalUrl;
  const canInsert = tab === "upload" ? !!uploadedUrl : !!externalUrl.trim();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Insert Image
          </DialogTitle>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex border border-border rounded-md overflow-hidden">
          <button
            onClick={() => setTab("upload")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm transition-colors ${
              tab === "upload" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
          <button
            onClick={() => setTab("url")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm transition-colors ${
              tab === "url" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            External URL
          </button>
        </div>

        {/* Upload area */}
        {tab === "upload" && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              uploading ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading to Cloudinary...</p>
              </div>
            ) : previewUrl ? (
              <div className="flex flex-col items-center gap-2">
                <img src={previewUrl} alt="Preview" className="max-h-40 rounded-md object-contain" />
                <p className="text-xs text-muted-foreground">
                  {uploadedUrl ? "✓ Uploaded successfully" : "Processing..."}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="text-xs text-primary hover:underline"
                >
                  Choose different image
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="w-8 h-8" />
                <p className="text-sm">Drop image here or click to browse</p>
                <p className="text-xs">JPG, PNG, GIF, WebP up to 10MB</p>
              </div>
            )}
          </div>
        )}

        {/* URL area */}
        {tab === "url" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="img-url">Image URL</Label>
              <Input
                id="img-url"
                placeholder="https://example.com/image.jpg"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
              />
            </div>
            {externalUrl && (
              <div className="rounded-lg overflow-hidden border border-border bg-muted/30 flex items-center justify-center p-2 h-36">
                <img
                  src={externalUrl}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain rounded"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              </div>
            )}
          </div>
        )}

        {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}

        {/* Common fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="img-alt">Alt Text</Label>
            <Input
              id="img-alt"
              placeholder="Describe the image"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="img-width">Size</Label>
            <select
              id="img-width"
              value={width}
              onChange={(e) => setWidth(e.target.value as ImageWidth)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="small">Small (33%)</option>
              <option value="medium">Medium (50%)</option>
              <option value="large">Large (75%)</option>
              <option value="full">Full width</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="img-caption">Caption (optional)</Label>
          <Input
            id="img-caption"
            placeholder="Image caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {activePreview && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                tab === "upload"
                  ? uploadedUrl
                    ? "bg-green-500"
                    : "bg-yellow-500"
                  : "bg-blue-500"
              }`}
            />
            {tab === "upload"
              ? uploadedUrl
                ? "Ready to insert"
                : "Uploading..."
              : "Using external URL"}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!canInsert || uploading}>
            {uploading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
            Insert Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
