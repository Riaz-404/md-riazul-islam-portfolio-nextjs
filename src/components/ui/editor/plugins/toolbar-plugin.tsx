"use client";

import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  type TextFormatType,
} from "lexical";
import { $isHeadingNode, $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $isListNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, ListNode } from "@lexical/list";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $wrapNodes } from "@lexical/selection";
import { $createQuoteNode, $isQuoteNode } from "@lexical/rich-text";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $getRoot } from "lexical";
import { $createCodeNode, $isCodeNode } from "@lexical/code";

const BLOCK_TYPES = {
  paragraph: "Normal",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  bullet: "Bullet List",
  number: "Numbered List",
  quote: "Quote",
  code: "Code Block",
} as const;

type BlockType = keyof typeof BLOCK_TYPES;

function getSelectedBlockType(selection: ReturnType<typeof $getSelection>): BlockType {
  if (!$isRangeSelection(selection)) return "paragraph";

  const anchorNode = selection.anchor.getNode();
  const element =
    anchorNode.getKey() === "root"
      ? anchorNode
      : anchorNode.getTopLevelElementOrThrow();

  if ($isHeadingNode(element)) {
    const tag = element.getTag();
    if (tag === "h1") return "h1";
    if (tag === "h2") return "h2";
    if (tag === "h3") return "h3";
  }
  if ($isListNode(element)) {
    const listType = element.getListType();
    return listType === "bullet" ? "bullet" : "number";
  }
  if ($isQuoteNode(element)) return "quote";
  if ($isCodeNode(element)) return "code";

  // Check parent for list nodes
  const parent = element.getParent();
  if ($isListNode(parent)) {
    return parent.getListType() === "bullet" ? "bullet" : "number";
  }

  return "paragraph";
}

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setBlockType(getSelectedBlockType(selection));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        UNDO_COMMAND,
        () => { setCanUndo(true); return false; },
        1
      ),
    );
  }, [editor, updateToolbar]);

  // Track undo/redo state via history plugin events
  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ tags }) => {
      // Simply update canUndo/canRedo based on editor state
    });
    return unregister;
  }, [editor]);

  const formatBlock = useCallback((type: BlockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      // Remove list if switching away from list
      if (blockType === "bullet" || blockType === "number") {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      }

      switch (type) {
        case "paragraph":
          $wrapNodes(selection, () => $createParagraphNode());
          break;
        case "h1":
        case "h2":
        case "h3":
          $wrapNodes(selection, () => $createHeadingNode(type as HeadingTagType));
          break;
        case "bullet":
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          break;
        case "number":
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          break;
        case "quote":
          $wrapNodes(selection, () => $createQuoteNode());
          break;
        case "code":
          $wrapNodes(selection, () => $createCodeNode());
          break;
      }
    });
  }, [editor, blockType]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
    disabled,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-1.5">
      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="h-3.5 w-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Block Type Selector */}
      <Select value={blockType} onValueChange={(v) => formatBlock(v as BlockType)}>
        <SelectTrigger className="h-8 w-[130px] text-xs border-0 bg-transparent hover:bg-muted focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(BLOCK_TYPES).map(([key, label]) => (
            <SelectItem key={key} value={key} className="text-xs">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => formatText("bold")}
        active={isBold}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText("italic")}
        active={isItalic}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText("underline")}
        active={isUnderline}
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText("strikethrough")}
        active={isStrikethrough}
        title="Strikethrough"
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText("code")}
        active={isCode}
        title="Inline Code"
      >
        <Code className="h-3.5 w-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        title="Align Left"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        title="Align Center"
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        title="Align Right"
      >
        <AlignRight className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
        title="Justify"
      >
        <AlignJustify className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}
