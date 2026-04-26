"use client";

import { useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { cn } from "@/lib/utils";
import { editorTheme } from "./themes/editor-theme";
import { ToolbarPlugin } from "./plugins/toolbar-plugin";
import { InitialContentPlugin } from "./plugins/initial-content-plugin";
import { HtmlExportPlugin } from "./plugins/html-export-plugin";
import { CodeActionPlugin } from "./plugins/code-action-plugin";
import { ImagePlugin } from "./plugins/image-plugin";
import { LinkDialogPlugin } from "./plugins/link-dialog-plugin";
import { EmbedPlugin } from "./plugins/embed-plugin";
import { ImageNode } from "./nodes/image-node";
import { EmbedNode } from "./nodes/embed-node";
import { EnhancedCodeNode } from "./nodes/enhanced-code-node";

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
  const editorContainerRef = useRef<HTMLDivElement>(null);

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
      EnhancedCodeNode,
      LinkNode,
      AutoLinkNode,
      HorizontalRuleNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      ImageNode,
      EmbedNode,
    ],
  };

  return (
    <div className={cn("rounded-md border border-input bg-background text-sm shadow-sm", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div ref={editorContainerRef} className="relative">
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
          <CodeActionPlugin containerRef={editorContainerRef} />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <HorizontalRulePlugin />
        <TablePlugin hasCellMerge hasCellBackgroundColor={false} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <InitialContentPlugin content={content} />
        <HtmlExportPlugin onChange={onChange} />
        <ImagePlugin />
        <LinkDialogPlugin />
        <EmbedPlugin />
      </LexicalComposer>
    </div>
  );
}
