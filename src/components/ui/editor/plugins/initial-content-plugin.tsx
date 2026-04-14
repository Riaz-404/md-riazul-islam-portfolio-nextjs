"use client";

import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $createParagraphNode } from "lexical";

interface InitialContentPluginProps {
  content: string;
}

/**
 * Initializes editor with HTML content exactly once on mount.
 * Uses a ref to prevent re-initialization on subsequent renders.
 */
export function InitialContentPlugin({ content }: InitialContentPluginProps) {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!content || content.trim() === "") return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(content, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();

      if (nodes.length > 0) {
        root.append(...nodes);
      } else {
        root.append($createParagraphNode());
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]); // only depends on editor instance, not content

  return null;
}
