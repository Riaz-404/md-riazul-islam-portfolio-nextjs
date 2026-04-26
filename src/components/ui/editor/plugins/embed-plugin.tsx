"use client";

import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  type LexicalCommand,
} from "lexical";
import { $createEmbedNode, type EmbedType } from "../nodes/embed-node";
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

export const INSERT_EMBED_COMMAND: LexicalCommand<EmbedType> = createCommand("INSERT_EMBED_COMMAND");

const EMBED_CONFIG: Record<EmbedType, { label: string; placeholder: string; icon: React.ReactNode }> = {
  youtube: {
    label: "YouTube Video",
    placeholder: "https://www.youtube.com/watch?v=...",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF0000]" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  twitter: {
    label: "Twitter / X Post",
    placeholder: "https://twitter.com/user/status/...",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.638 5.9-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  facebook: {
    label: "Facebook Post",
    placeholder: "https://www.facebook.com/...",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1877F2]" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
};

export function EmbedPlugin() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [embedType, setEmbedType] = useState<EmbedType>("youtube");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return editor.registerCommand(
      INSERT_EMBED_COMMAND,
      (type: EmbedType) => {
        setEmbedType(type);
        setUrl("");
        setError("");
        setOpen(true);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  const validateUrl = (u: string): boolean => {
    if (embedType === "youtube") {
      return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(u);
    }
    if (embedType === "twitter") {
      return /(?:twitter\.com|x\.com)\/\w+\/status\//.test(u);
    }
    if (embedType === "facebook") {
      return /facebook\.com\//.test(u);
    }
    return true;
  };

  const handleInsert = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL");
      return;
    }
    if (!validateUrl(trimmed)) {
      setError(`Please enter a valid ${EMBED_CONFIG[embedType].label} URL`);
      return;
    }

    editor.update(() => {
      const selection = $getSelection();
      const embedNode = $createEmbedNode(embedType, trimmed);
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor.getNode();
        const topNode = anchor.getTopLevelElementOrThrow();
        topNode.insertAfter(embedNode);
        const para = $createParagraphNode();
        embedNode.insertAfter(para);
        para.select();
      }
    });

    setUrl("");
    setError("");
    setOpen(false);
  }, [editor, embedType, url]);

  const config = EMBED_CONFIG[embedType];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && setOpen(false)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config.icon}
            Embed {config.label}
          </DialogTitle>
        </DialogHeader>

        {/* Embed type selector */}
        <div className="flex gap-2">
          {(Object.keys(EMBED_CONFIG) as EmbedType[]).map((type) => (
            <button
              key={type}
              onClick={() => { setEmbedType(type); setError(""); }}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border text-xs transition-colors ${
                embedType === type ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
              }`}
            >
              {EMBED_CONFIG[type].icon}
              {type === "youtube" ? "YouTube" : type === "twitter" ? "Twitter" : "Facebook"}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="embed-url">{config.label} URL</Label>
          <Input
            id="embed-url"
            placeholder={config.placeholder}
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleInsert(); }}
            autoFocus
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleInsert} disabled={!url.trim()}>
            Embed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
