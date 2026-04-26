"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { CodeNode, $isCodeNode } from "@lexical/code";
import { Check, ChevronDown, Copy } from "lucide-react";
import { EnhancedCodeNode, $isEnhancedCodeNode } from "../nodes/enhanced-code-node";

const LANGUAGES = [
  { value: "", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "scss", label: "SCSS" },
  { value: "markdown", label: "Markdown" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "xml", label: "XML" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash/Shell" },
  { value: "dockerfile", label: "Dockerfile" },
  { value: "git", label: "Git" },
];

interface CodeOverlayInfo {
  nodeKey: string;
  language: string;
  filename: string;
  isEnhanced: boolean;
  top: number;
  left: number;
  width: number;
}

interface CodeActionPluginProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function CodeActionPlugin({ containerRef }: CodeActionPluginProps) {
  const [editor] = useLexicalComposerContext();
  const codeNodeKeysRef = useRef<Set<string>>(new Set());
  const [overlays, setOverlays] = useState<CodeOverlayInfo[]>([]);

  const recalculate = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;

    const newOverlays: CodeOverlayInfo[] = [];

    editor.getEditorState().read(() => {
      codeNodeKeysRef.current.forEach((key) => {
        const node = $getNodeByKey(key);
        if (!node || !(node instanceof CodeNode)) return;

        const element = editor.getElementByKey(key);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const isEnhanced = $isEnhancedCodeNode(node);

        newOverlays.push({
          nodeKey: key,
          language: (node as CodeNode).getLanguage() ?? "",
          filename: isEnhanced ? (node as EnhancedCodeNode).getFilename() : "",
          isEnhanced,
          top: rect.top - containerRect.top + scrollTop,
          left: rect.left - containerRect.left,
          width: rect.width,
        });
      });
    });

    setOverlays(newOverlays);
  }, [editor, containerRef]);

  useEffect(() => {
    return editor.registerMutationListener(CodeNode, (mutations) => {
      mutations.forEach((type, key) => {
        if (type === "destroyed") {
          codeNodeKeysRef.current.delete(key);
        } else {
          codeNodeKeysRef.current.add(key);
        }
      });
      requestAnimationFrame(recalculate);
    });
  }, [editor, recalculate]);

  useEffect(() => {
    return editor.registerMutationListener(EnhancedCodeNode, (mutations) => {
      mutations.forEach((type, key) => {
        if (type === "destroyed") {
          codeNodeKeysRef.current.delete(key);
        } else {
          codeNodeKeysRef.current.add(key);
        }
      });
      requestAnimationFrame(recalculate);
    });
  }, [editor, recalculate]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      requestAnimationFrame(recalculate);
    });
  }, [editor, recalculate]);

  useEffect(() => {
    const onResize = () => requestAnimationFrame(recalculate);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalculate]);

  if (!containerRef.current) return null;

  return createPortal(
    <>
      {overlays.map((info) => (
        <CodeBlockHeader
          key={info.nodeKey}
          nodeKey={info.nodeKey}
          language={info.language}
          filename={info.filename}
          isEnhanced={info.isEnhanced}
          top={info.top}
          left={info.left}
          width={info.width}
          editor={editor}
        />
      ))}
    </>,
    containerRef.current
  );
}

interface HeaderProps extends CodeOverlayInfo {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
}

function CodeBlockHeader({ nodeKey, language, filename, isEnhanced, top, left, width, editor }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [editingFilename, setEditingFilename] = useState(false);
  const [filenameValue, setFilenameValue] = useState(filename);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.value === language) ?? LANGUAGES[0];

  const handleCopy = () => {
    editor.getEditorState().read(() => {
      const node = $getNodeByKey(nodeKey);
      if (node && node instanceof CodeNode) {
        const text = node.getTextContent();
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    });
  };

  const handleLanguageChange = (lang: string) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node && node instanceof CodeNode) {
        (node as CodeNode).setLanguage(lang);
      }
    });
    setShowLangDropdown(false);
  };

  const handleFilenameBlur = () => {
    setEditingFilename(false);
    if (isEnhanced) {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node && $isEnhancedCodeNode(node)) {
          node.setFilename(filenameValue);
        }
      });
    }
  };

  useEffect(() => {
    setFilenameValue(filename);
  }, [filename]);

  useEffect(() => {
    if (!showLangDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLangDropdown]);

  return (
    <div
      style={{ position: "absolute", top, left, width, zIndex: 10 }}
      className="pointer-events-none"
    >
      <div
        className="pointer-events-auto flex items-center justify-between px-3 py-1.5 rounded-t-lg"
        style={{ background: "#1e1e2e", borderBottom: "1px solid #313244", height: "36px" }}
        contentEditable={false}
      >
        {/* Mac dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Filename input (center) */}
        <div className="flex-1 flex justify-center px-3">
          {isEnhanced ? (
            editingFilename ? (
              <input
                type="text"
                value={filenameValue}
                onChange={(e) => setFilenameValue(e.target.value)}
                onBlur={handleFilenameBlur}
                onKeyDown={(e) => { if (e.key === "Enter") handleFilenameBlur(); }}
                className="bg-transparent text-xs text-[#cdd6f4] text-center outline-none border-b border-[#89b4fa] w-40"
                placeholder="filename.ext"
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingFilename(true)}
                className="text-xs text-[#cdd6f4]/60 hover:text-[#cdd6f4] transition-colors"
              >
                {filenameValue || <span className="opacity-40 italic">click to add filename</span>}
              </button>
            )
          ) : null}
        </div>

        {/* Right side: language selector + copy */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowLangDropdown((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#89b4fa] hover:text-[#cdd6f4] transition-colors"
            >
              {currentLang.label}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showLangDropdown && (
              <div
                className="absolute right-0 top-6 z-50 min-w-[140px] max-h-64 overflow-y-auto rounded-md border border-[#313244] shadow-xl"
                style={{ background: "#181825" }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    type="button"
                    key={lang.value}
                    onClick={() => handleLanguageChange(lang.value)}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#313244] transition-colors ${
                      lang.value === language ? "text-[#89b4fa]" : "text-[#cdd6f4]"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            className="text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#a6e3a1]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
