import type { EditorThemeClasses } from "lexical";

export const editorTheme: EditorThemeClasses = {
  paragraph: "mb-2 leading-relaxed",
  heading: {
    h1: "text-3xl font-bold mb-4 mt-6",
    h2: "text-2xl font-semibold mb-3 mt-5",
    h3: "text-xl font-semibold mb-2 mt-4",
    h4: "text-lg font-semibold mb-2 mt-3",
    h5: "text-base font-semibold mb-1 mt-2",
    h6: "text-sm font-semibold mb-1 mt-2",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "font-mono bg-muted px-1 py-0.5 rounded text-sm",
  },
  list: {
    ul: "list-disc list-outside ml-6 mb-2 space-y-1",
    ol: "list-decimal list-outside ml-6 mb-2 space-y-1",
    listitem: "pl-1",
    nested: {
      listitem: "list-none",
    },
  },
  quote:
    "border-l-4 border-primary pl-4 italic text-muted-foreground my-4 ml-2",
  code: "block font-mono bg-muted p-4 rounded-lg text-sm my-3 overflow-x-auto",
  link: "text-primary underline hover:text-primary/80 cursor-pointer",
  table: "w-full border-collapse my-4",
  tableRow: "",
  tableCell: "border border-border p-2 text-left",
  tableCellHeader: "border border-border p-2 text-left font-semibold bg-muted",
};
