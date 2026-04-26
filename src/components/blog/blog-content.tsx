"use client";

import { useEffect, useRef } from "react";

interface BlogContentProps {
  html: string;
  className?: string;
}

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript", typescript: "TypeScript", jsx: "JSX", tsx: "TSX",
  python: "Python", java: "Java", c: "C", cpp: "C++", csharp: "C#",
  go: "Go", rust: "Rust", php: "PHP", ruby: "Ruby", swift: "Swift",
  kotlin: "Kotlin", html: "HTML", css: "CSS", scss: "SCSS",
  markdown: "Markdown", json: "JSON", yaml: "YAML", xml: "XML",
  sql: "SQL", bash: "Bash", shell: "Shell", dockerfile: "Dockerfile",
  git: "Git", text: "Plain Text",
};

function getLanguageLabel(raw: string): string {
  if (!raw) return "";
  return LANGUAGE_LABELS[raw.toLowerCase()] ?? raw;
}

export function BlogContent({ html, className = "" }: BlogContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Lexical's CodeNode.exportDOM produces <pre class="blog-code-block" data-language="..." data-highlight-language="..." data-filename="...">
    // We find ALL block-level code elements by any of these selectors.
    const codeEls = container.querySelectorAll<HTMLElement>(
      "pre.blog-code-block, pre[data-language], pre[data-highlight-language], pre[data-filename]"
    );

    codeEls.forEach((preEl) => {
      // Skip if already enhanced
      if (preEl.parentElement?.classList.contains("blog-code-wrapper")) return;

      // Ensure the class is present for consistent styling
      preEl.classList.add("blog-code-block");

      const rawLang =
        preEl.getAttribute("data-language") ||
        preEl.getAttribute("data-highlight-language") ||
        "";
      const filename = preEl.getAttribute("data-filename") || "";
      const langLabel = getLanguageLabel(rawLang);
      // innerText respects <br> elements (Lexical uses them for line breaks)
      // textContent would collapse everything onto one line
      const codeText = preEl.innerText ?? "";

      // ── Wrapper ─────────────────────────────────────────────────────────
      const wrapper = document.createElement("div");
      wrapper.className = "blog-code-wrapper";

      // ── Header ──────────────────────────────────────────────────────────
      const header = document.createElement("div");
      header.className = "blog-code-header";

      // Left: mac dots + filename
      const left = document.createElement("div");
      left.style.cssText = "display:flex;align-items:center;gap:0.5rem;flex:1;min-width:0;overflow:hidden";

      const dots = document.createElement("div");
      dots.className = "blog-code-mac-dots";
      dots.innerHTML =
        '<span style="background:#ff5f57"></span>' +
        '<span style="background:#febc2e"></span>' +
        '<span style="background:#28c840"></span>';
      left.appendChild(dots);

      if (filename) {
        const fnEl = document.createElement("span");
        fnEl.className = "blog-code-filename";
        fnEl.textContent = filename;
        left.appendChild(fnEl);
      }

      // Center: language label
      const center = document.createElement("div");
      center.style.cssText = "flex:1;display:flex;justify-content:center;pointer-events:none";
      if (langLabel) {
        const langEl = document.createElement("span");
        langEl.className = "blog-code-lang";
        langEl.textContent = langLabel;
        center.appendChild(langEl);
      }

      // Right: copy button
      const right = document.createElement("div");
      right.style.cssText = "display:flex;align-items:center;flex-shrink:0";

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "blog-code-copy-btn";
      copyBtn.innerHTML = `${COPY_ICON} Copy`;
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = `${CHECK_ICON} Copied!`;
          copyBtn.style.color = "#4ade80";
          setTimeout(() => {
            copyBtn.innerHTML = `${COPY_ICON} Copy`;
            copyBtn.style.color = "";
          }, 2000);
        }).catch(() => {});
      });
      right.appendChild(copyBtn);

      header.appendChild(left);
      header.appendChild(center);
      header.appendChild(right);

      // ── Assemble ────────────────────────────────────────────────────────
      preEl.parentNode?.insertBefore(wrapper, preEl);
      wrapper.appendChild(header);
      wrapper.appendChild(preEl);

      // Ensure the <pre> radius matches (flat top, rounded bottom)
      preEl.style.borderRadius = "0 0 0.5rem 0.5rem";
      preEl.style.marginTop = "0";
      preEl.style.marginBottom = "0";
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className={`prose prose-neutral dark:prose-invert max-w-none
        prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg
        prose-code:before:content-none prose-code:after:content-none
        prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-none
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
