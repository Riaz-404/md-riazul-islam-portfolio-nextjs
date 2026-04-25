"use client";

import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  type LexicalCommand,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $findMatchingParent } from "@lexical/utils";
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
import { Link, ExternalLink } from "lucide-react";

export const OPEN_LINK_DIALOG_COMMAND: LexicalCommand<void> = createCommand("OPEN_LINK_DIALOG_COMMAND");

export function LinkDialogPlugin() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      OPEN_LINK_DIALOG_COMMAND,
      () => {
        // Read current selection for pre-filling
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const selectedText = selection.getTextContent();
            setText(selectedText);

            // Check if selection is already a link
            const node = selection.anchor.getNode();
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if (linkNode && $isLinkNode(linkNode)) {
              setUrl(linkNode.getURL());
              setIsEditing(true);
            } else {
              setUrl("");
              setIsEditing(false);
            }
          }
        });
        setOpen(true);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  const handleInsert = useCallback(() => {
    if (!url.trim()) return;
    const finalUrl = url.startsWith("http") ? url : `https://${url}`;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
      url: finalUrl,
      target: openInNewTab ? "_blank" : "_self",
      rel: openInNewTab ? "noopener noreferrer" : undefined,
    });
    handleClose();
  }, [editor, url, openInNewTab]);

  const handleRemove = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    handleClose();
  }, [editor]);

  const handleClose = () => {
    setUrl("");
    setText("");
    setOpen(false);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            {isEditing ? "Edit Link" : "Insert Link"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {text && (
            <div className="space-y-1.5">
              <Label>Selected text</Label>
              <p className="text-sm bg-muted px-3 py-2 rounded-md text-muted-foreground truncate">{text}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="link-url">URL</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => { if (e.key === "Enter") handleInsert(); }}
                autoFocus
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Open in new tab</span>
          </label>
        </div>

        <DialogFooter>
          {isEditing && (
            <Button variant="destructive" size="sm" onClick={handleRemove} className="mr-auto">
              Remove Link
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleInsert} disabled={!url.trim()}>
            {isEditing ? "Update Link" : "Insert Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
