import { CodeNode, type SerializedCodeNode } from "@lexical/code";
import type { ElementFormatType, LexicalUpdateJSON, NodeKey, Spread } from "lexical";

export type SerializedEnhancedCodeNode = Spread<
  { filename: string },
  SerializedCodeNode
>;

export class EnhancedCodeNode extends CodeNode {
  __filename: string;

  static getType(): string {
    return "enhanced-code";
  }

  static clone(node: EnhancedCodeNode): EnhancedCodeNode {
    return new EnhancedCodeNode(
      node.__language as string | undefined,
      node.__filename,
      node.__key
    );
  }

  constructor(language?: string | null, filename = "", key?: NodeKey) {
    super(language, key);
    this.__filename = filename;
  }

  getFilename(): string {
    return this.__filename;
  }

  setFilename(filename: string): void {
    const writable = this.getWritable();
    writable.__filename = filename;
  }

  exportDOM(): { element: HTMLElement } {
    const result = super.exportDOM({} as never);
    const el = result.element as HTMLElement;
    if (this.__filename) {
      el.setAttribute("data-filename", this.__filename);
    }
    if (this.__language) {
      el.setAttribute("data-language", this.__language as string);
    }
    return { element: el };
  }

  exportJSON(): SerializedEnhancedCodeNode {
    return {
      ...(super.exportJSON() as SerializedCodeNode),
      type: "enhanced-code",
      version: 1,
      filename: this.__filename,
    };
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedEnhancedCodeNode>): this {
    super.updateFromJSON(serializedNode as LexicalUpdateJSON<SerializedCodeNode>);
    this.__filename = serializedNode.filename ?? "";
    return this;
  }

  static importJSON(s: SerializedEnhancedCodeNode): EnhancedCodeNode {
    const node = new EnhancedCodeNode(s.language, s.filename ?? "");
    node.setFormat(s.format as ElementFormatType);
    node.setDirection(s.direction ?? null);
    return node;
  }

  static importDOM() {
    return null;
  }
}

export function $createEnhancedCodeNode(language?: string, filename?: string): EnhancedCodeNode {
  return new EnhancedCodeNode(language, filename ?? "");
}

export function $isEnhancedCodeNode(node: unknown): node is EnhancedCodeNode {
  return node instanceof EnhancedCodeNode;
}
