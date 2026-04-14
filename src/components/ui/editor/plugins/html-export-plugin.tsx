"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";

interface HtmlExportPluginProps {
  onChange: (html: string) => void;
}

/**
 * Listens to editor changes and exports HTML via the onChange callback.
 * Properly uses the editor instance from context, avoiding closure bugs.
 */
export function HtmlExportPlugin({ onChange }: HtmlExportPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        onChange(html);
      });
    });
  }, [editor, onChange]);

  return null;
}
