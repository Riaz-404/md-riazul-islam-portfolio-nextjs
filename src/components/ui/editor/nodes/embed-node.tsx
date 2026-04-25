"use client";

import {
  $applyNodeReplacement,
  DecoratorNode,
  type DOMExportOutput,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import type { JSX } from "react";

export type EmbedType = "youtube" | "twitter" | "facebook";

export type SerializedEmbedNode = Spread<
  { embedType: EmbedType; url: string },
  SerializedLexicalNode
>;

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  return match ? match[1] : null;
}

export class EmbedNode extends DecoratorNode<JSX.Element> {
  __embedType: EmbedType;
  __url: string;

  static getType(): string { return "embed"; }

  static clone(node: EmbedNode): EmbedNode {
    return new EmbedNode(node.__embedType, node.__url, node.__key);
  }

  static importJSON(s: SerializedEmbedNode): EmbedNode {
    return $createEmbedNode(s.embedType, s.url);
  }

  constructor(embedType: EmbedType, url: string, key?: NodeKey) {
    super(key);
    this.__embedType = embedType;
    this.__url = url;
  }

  exportJSON(): SerializedEmbedNode {
    return { type: "embed", version: 1, embedType: this.__embedType, url: this.__url };
  }

  exportDOM(): DOMExportOutput {
    const div = document.createElement("div");
    div.className = "embed-container";
    div.style.cssText = "margin:1.5rem auto;text-align:center";

    if (this.__embedType === "youtube") {
      const videoId = getYouTubeId(this.__url);
      if (videoId) {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "position:relative;padding-bottom:56.25%;height:0;overflow:hidden";
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        wrapper.appendChild(iframe);
        div.appendChild(wrapper);
      }
    } else if (this.__embedType === "twitter") {
      const blockquote = document.createElement("blockquote");
      blockquote.className = "twitter-tweet";
      const a = document.createElement("a");
      a.href = this.__url;
      a.textContent = this.__url;
      blockquote.appendChild(a);
      div.appendChild(blockquote);
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://platform.twitter.com/widgets.js";
      div.appendChild(script);
    } else if (this.__embedType === "facebook") {
      const fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";
      div.appendChild(fbRoot);
      const fbPost = document.createElement("div");
      fbPost.className = "fb-post";
      fbPost.setAttribute("data-href", this.__url);
      fbPost.setAttribute("data-width", "500");
      div.appendChild(fbPost);
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0";
      div.appendChild(script);
    }

    return { element: div };
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    return div;
  }

  updateDOM(): false { return false; }

  getEmbedType(): EmbedType { return this.__embedType; }
  getUrl(): string { return this.__url; }

  decorate(): JSX.Element {
    return <EmbedComponent embedType={this.__embedType} url={this.__url} nodeKey={this.__key} />;
  }
}

function EmbedComponent({ embedType, url }: { embedType: EmbedType; url: string; nodeKey: NodeKey }) {
  if (embedType === "youtube") {
    const videoId = getYouTubeId(url);
    if (!videoId) {
      return (
        <div className="my-4 p-4 bg-muted rounded-lg border border-border text-sm text-muted-foreground">
          Invalid YouTube URL: {url}
        </div>
      );
    }
    return (
      <div className="my-4 rounded-lg overflow-hidden border border-border" style={{ aspectRatio: "16/9" }} contentEditable={false}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="YouTube video"
        />
      </div>
    );
  }

  if (embedType === "twitter") {
    return (
      <div className="my-4 p-4 border border-border rounded-lg bg-muted/30" contentEditable={false}>
        <div className="flex items-center gap-2 mb-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.638 5.9-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-sm font-medium">Twitter / X Post</span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline break-all">{url}</a>
        <p className="text-xs text-muted-foreground mt-2">Twitter embed will render in published blog</p>
      </div>
    );
  }

  if (embedType === "facebook") {
    return (
      <div className="my-4 p-4 border border-border rounded-lg bg-muted/30" contentEditable={false}>
        <div className="flex items-center gap-2 mb-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#1877F2]" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-sm font-medium">Facebook Post</span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline break-all">{url}</a>
        <p className="text-xs text-muted-foreground mt-2">Facebook embed will render in published blog</p>
      </div>
    );
  }

  return null;
}

export function $createEmbedNode(embedType: EmbedType, url: string): EmbedNode {
  return $applyNodeReplacement(new EmbedNode(embedType, url));
}

export function $isEmbedNode(node: LexicalNode | null | undefined): node is EmbedNode {
  return node instanceof EmbedNode;
}
