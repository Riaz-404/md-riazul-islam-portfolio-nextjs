"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  type TextFormatType,
} from "lexical";
import { $isHeadingNode, $createHeadingNode, type HeadingTagType } from "@lexical/rich-text";
import {
  $isListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { mergeRegister } from "@lexical/utils";
import { $setBlocksType, $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { $createQuoteNode, $isQuoteNode } from "@lexical/rich-text";
import { $isCodeNode } from "@lexical/code";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, Code, Link2, Image, Minus, Table, IndentDecrease, IndentIncrease,
  Superscript, Subscript, Palette, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { $createEnhancedCodeNode, $isEnhancedCodeNode } from "../nodes/enhanced-code-node";
import { INSERT_IMAGE_COMMAND } from "./image-plugin";
import { OPEN_LINK_DIALOG_COMMAND } from "./link-dialog-plugin";
import { INSERT_EMBED_COMMAND } from "./embed-plugin";
import type { EmbedType } from "../nodes/embed-node";

const BLOCK_TYPES = {
  paragraph: "Normal",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  bullet: "Bullet List",
  number: "Numbered List",
  quote: "Quote",
  code: "Code Block",
} as const;

type BlockType = keyof typeof BLOCK_TYPES;

const PRESET_COLORS = [
  "#000000", "#374151", "#6b7280", "#9ca3af", "#ffffff",
  "#dc2626", "#ea580c", "#d97706", "#16a34a", "#2563eb",
  "#7c3aed", "#db2777", "#0891b2", "#059669", "#65a30d",
];

function getSelectedBlockType(selection: ReturnType<typeof $getSelection>): BlockType {
  if (!$isRangeSelection(selection)) return "paragraph";
  const anchorNode = selection.anchor.getNode();
  const element =
    anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

  if ($isHeadingNode(element)) {
    const tag = element.getTag();
    if (tag === "h1") return "h1";
    if (tag === "h2") return "h2";
    if (tag === "h3") return "h3";
    if (tag === "h4") return "h4";
  }
  if ($isListNode(element)) {
    return element.getListType() === "bullet" ? "bullet" : "number";
  }
  if ($isQuoteNode(element)) return "quote";
  if ($isCodeNode(element) || $isEnhancedCodeNode(element)) return "code";

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
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [textColor, setTextColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableRows, setTableRows] = useState("3");
  const [tableCols, setTableCols] = useState("3");
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const insertMenuRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsSubscript(selection.hasFormat("subscript"));
      setBlockType(getSelectedBlockType(selection));

      const color = $getSelectionStyleValueForProperty(selection, "color", "#000000");
      setTextColor(color);

      // Check if in a link
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink(!!(parent && parent.getType() === "link"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateToolbar());
      })
    );
  }, [editor, updateToolbar]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
      if (insertMenuRef.current && !insertMenuRef.current.contains(e.target as Node)) {
        setShowInsertMenu(false);
        setShowTableDialog(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatBlock = useCallback(
    (type: BlockType) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        if (blockType === "bullet" || blockType === "number") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }

        switch (type) {
          case "paragraph":
            $setBlocksType(selection, () => $createParagraphNode());
            break;
          case "h1":
          case "h2":
          case "h3":
          case "h4":
            $setBlocksType(selection, () => $createHeadingNode(type as HeadingTagType));
            break;
          case "bullet":
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            break;
          case "number":
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            break;
          case "quote":
            $setBlocksType(selection, () => $createQuoteNode());
            break;
          case "code":
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            $setBlocksType(selection, () => $createEnhancedCodeNode() as any);
            break;
        }
      });
    },
    [editor, blockType]
  );

  const applyColor = useCallback(
    (color: string) => {
      setTextColor(color);
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { color });
        }
      });
    },
    [editor]
  );

  const insertTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: tableRows,
      columns: tableCols,
      includeHeaders: true,
    });
    setShowTableDialog(false);
    setShowInsertMenu(false);
  };

  const Btn = ({
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
      className="h-7 w-7 p-0 shrink-0"
    >
      {children}
    </Button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-1.5">
      {/* Undo / Redo */}
      <Btn onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} title="Undo (Ctrl+Z)">
        <Undo className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} title="Redo (Ctrl+Y)">
        <Redo className="h-3.5 w-3.5" />
      </Btn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Block Type */}
      <Select value={blockType} onValueChange={(v) => formatBlock(v as BlockType)}>
        <SelectTrigger className="h-7 w-[120px] text-xs border-0 bg-transparent hover:bg-muted focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(BLOCK_TYPES).map(([key, label]) => (
            <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Text Formatting */}
      <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} active={isBold} title="Bold (Ctrl+B)">
        <Bold className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} active={isItalic} title="Italic (Ctrl+I)">
        <Italic className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} active={isUnderline} title="Underline (Ctrl+U)">
        <Underline className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")} active={isStrikethrough} title="Strikethrough">
        <Strikethrough className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")} active={isCode} title="Inline Code">
        <Code className="h-3.5 w-3.5" />
      </Btn>
      <Btn
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript" as TextFormatType)}
        active={isSuperscript}
        title="Superscript"
      >
        <Superscript className="h-3.5 w-3.5" />
      </Btn>
      <Btn
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript" as TextFormatType)}
        active={isSubscript}
        title="Subscript"
      >
        <Subscript className="h-3.5 w-3.5" />
      </Btn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Text Color */}
      <div className="relative" ref={colorPickerRef}>
        <button
          type="button"
          onClick={() => setShowColorPicker((v) => !v)}
          title="Text Color"
          className="h-7 w-7 flex flex-col items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <Palette className="h-3.5 w-3.5" />
          <div className="w-4 h-1 rounded-full mt-0.5" style={{ backgroundColor: textColor }} />
        </button>

        {showColorPicker && (
          <div className="absolute top-9 left-0 z-50 p-2 rounded-lg border border-border bg-popover shadow-lg min-w-[180px]">
            <p className="text-xs font-medium text-muted-foreground mb-2">Text Color</p>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { applyColor(c); setShowColorPicker(false); }}
                  className="w-7 h-7 rounded-md border border-border/50 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Custom:</label>
              <input
                ref={colorInputRef}
                type="color"
                value={textColor}
                onChange={(e) => applyColor(e.target.value)}
                className="w-8 h-7 rounded cursor-pointer border-0 p-0"
              />
            </div>
          </div>
        )}
      </div>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Alignment */}
      <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")} title="Align Left">
        <AlignLeft className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")} title="Align Center">
        <AlignCenter className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")} title="Align Right">
        <AlignRight className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")} title="Justify">
        <AlignJustify className="h-3.5 w-3.5" />
      </Btn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Indentation */}
      <Btn onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)} title="Decrease Indent">
        <IndentDecrease className="h-3.5 w-3.5" />
      </Btn>
      <Btn onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)} title="Increase Indent">
        <IndentIncrease className="h-3.5 w-3.5" />
      </Btn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Link */}
      <Btn
        onClick={() => editor.dispatchCommand(OPEN_LINK_DIALOG_COMMAND, undefined)}
        active={isLink}
        title="Insert/Edit Link (Ctrl+K)"
      >
        <Link2 className="h-3.5 w-3.5" />
      </Btn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Insert dropdown */}
      <div className="relative" ref={insertMenuRef}>
        <button
          type="button"
          onClick={() => setShowInsertMenu((v) => !v)}
          className="h-7 flex items-center gap-1 px-2 rounded-md text-xs hover:bg-muted transition-colors"
          title="Insert element"
        >
          <span>Insert</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {showInsertMenu && (
          <div className="absolute top-8 left-0 z-50 min-w-[180px] rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
            {/* Image */}
            <MenuAction
              icon={<Image className="h-3.5 w-3.5" />}
              label="Image"
              onClick={() => {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, undefined);
                setShowInsertMenu(false);
              }}
            />

            {/* Horizontal Rule */}
            <MenuAction
              icon={<Minus className="h-3.5 w-3.5" />}
              label="Horizontal Rule"
              onClick={() => {
                editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
                setShowInsertMenu(false);
              }}
            />

            {/* Table — shows inline sub-form */}
            <MenuAction
              icon={<Table className="h-3.5 w-3.5" />}
              label="Table"
              onClick={() => setShowTableDialog((v) => !v)}
            />
            {showTableDialog && (
              <div className="px-3 pb-3 pt-1 bg-muted/30 border-t border-border">
                <p className="text-xs font-medium mb-2">Table size</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Rows</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={tableRows}
                      onChange={(e) => setTableRows(e.target.value)}
                      className="w-16 h-7 rounded border border-input bg-background px-2 text-xs"
                    />
                  </div>
                  <span className="text-muted-foreground mt-4">×</span>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Cols</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={tableCols}
                      onChange={(e) => setTableCols(e.target.value)}
                      className="w-16 h-7 rounded border border-input bg-background px-2 text-xs"
                    />
                  </div>
                </div>
                <Button size="sm" className="w-full h-7 text-xs" onClick={insertTable}>
                  Insert Table
                </Button>
              </div>
            )}

            <div className="border-t border-border my-0.5" />

            {/* Social embeds */}
            <MenuAction
              icon={
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#FF0000]" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              }
              label="YouTube Video"
              onClick={() => {
                editor.dispatchCommand(INSERT_EMBED_COMMAND, "youtube" as EmbedType);
                setShowInsertMenu(false);
              }}
            />
            <MenuAction
              icon={
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.638 5.9-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              }
              label="Twitter / X Post"
              onClick={() => {
                editor.dispatchCommand(INSERT_EMBED_COMMAND, "twitter" as EmbedType);
                setShowInsertMenu(false);
              }}
            />
            <MenuAction
              icon={
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#1877F2]" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              }
              label="Facebook Post"
              onClick={() => {
                editor.dispatchCommand(INSERT_EMBED_COMMAND, "facebook" as EmbedType);
                setShowInsertMenu(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MenuAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted transition-colors text-left"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </button>
  );
}
