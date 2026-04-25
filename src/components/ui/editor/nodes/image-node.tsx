"use client";

import {
  $applyNodeReplacement,
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import type { JSX } from "react";

type ImageWidth = "small" | "medium" | "large" | "full";

export type SerializedImageNode = Spread<
  { src: string; alt: string; width: ImageWidth; caption: string },
  SerializedLexicalNode
>;

const WIDTH_MAP: Record<ImageWidth, string> = {
  small: "33%",
  medium: "50%",
  large: "75%",
  full: "100%",
};

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const node = $createImageNode({
      src: domNode.src,
      alt: domNode.alt || "",
      width: (domNode.getAttribute("data-width") as ImageWidth) || "full",
      caption: domNode.getAttribute("data-caption") || "",
    });
    return { node };
  }
  return null;
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;
  __width: ImageWidth;
  __caption: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__width, node.__caption, node.__key);
  }

  static importJSON(s: SerializedImageNode): ImageNode {
    return $createImageNode({ src: s.src, alt: s.alt, width: s.width, caption: s.caption });
  }

  static importDOM(): DOMConversionMap | null {
    return { img: () => ({ conversion: convertImageElement, priority: 0 }) };
  }

  constructor(src: string, alt = "", width: ImageWidth = "full", caption = "", key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__caption = caption;
  }

  exportJSON(): SerializedImageNode {
    return { type: "image", version: 1, src: this.__src, alt: this.__alt, width: this.__width, caption: this.__caption };
  }

  exportDOM(): DOMExportOutput {
    const div = document.createElement("div");
    div.style.cssText = `text-align:center;margin:1.5rem auto;max-width:${WIDTH_MAP[this.__width]}`;
    const img = document.createElement("img");
    img.src = this.__src;
    img.alt = this.__alt;
    img.setAttribute("data-width", this.__width);
    if (this.__caption) img.setAttribute("data-caption", this.__caption);
    img.style.cssText = "width:100%;border-radius:0.5rem";
    div.appendChild(img);
    if (this.__caption) {
      const p = document.createElement("p");
      p.style.cssText = "text-align:center;color:#6b7280;font-size:0.875rem;margin-top:0.5rem";
      p.textContent = this.__caption;
      div.appendChild(p);
    }
    return { element: div };
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.style.display = "block";
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string { return this.__src; }
  getAlt(): string { return this.__alt; }
  getWidth(): ImageWidth { return this.__width; }
  getCaption(): string { return this.__caption; }

  decorate(): JSX.Element {
    return (
      <EditorImage
        nodeKey={this.__key}
        src={this.__src}
        alt={this.__alt}
        width={this.__width}
        caption={this.__caption}
      />
    );
  }
}

function EditorImage({ src, alt, width, caption }: {
  nodeKey: NodeKey; src: string; alt: string; width: ImageWidth; caption: string;
}) {
  return (
    <div className="my-4 flex flex-col items-center" contentEditable={false}>
      <div style={{ maxWidth: WIDTH_MAP[width] }} className="w-full">
        <img
          src={src}
          alt={alt}
          className="w-full rounded-lg shadow-sm border border-border"
          draggable={false}
        />
        {caption && (
          <p className="text-center text-sm text-muted-foreground mt-2">{caption}</p>
        )}
      </div>
    </div>
  );
}

export function $createImageNode(opts: {
  src: string; alt?: string; width?: ImageWidth; caption?: string;
}): ImageNode {
  return $applyNodeReplacement(new ImageNode(opts.src, opts.alt ?? "", opts.width ?? "full", opts.caption ?? ""));
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
