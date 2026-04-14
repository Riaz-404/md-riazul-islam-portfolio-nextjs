"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { cn } from "@/lib/utils";
import { editorTheme } from "./themes/editor-theme";
import { ToolbarPlugin } from "./plugins/toolbar-plugin";
import { InitialContentPlugin } from "./plugins/initial-content-plugin";
import { HtmlExportPlugin } from "./plugins/html-export-plugin";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className,
  minHeight = "200px",
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: "portfolio-editor",
    theme: editorTheme,
    onError: (error: Error) => {
      console.error("Editor error:", error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
    ],
  };

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background text-sm shadow-sm",
        className
      )}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="focus:outline-none px-4 py-3 leading-relaxed"
                style={{ minHeight }}
              />
            }
            placeholder={
              <div
                className="pointer-events-none absolute left-4 top-3 text-muted-foreground select-none"
                style={{ minHeight }}
              >
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <InitialContentPlugin content={content} />
        <HtmlExportPlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}
