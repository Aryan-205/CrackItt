"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

/** Obsidian/GFM fence tags that Prism doesn't know by that name. */
const LANGUAGE_ALIASES: Record<string, string> = {
  plaintext: "text",
  txt: "text",
  mermaid: "text",
  proto: "protobuf",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  node: "javascript",
  js: "javascript",
  ts: "typescript",
};

export function CodeBlock({
  code,
  language,
  showLineNumbers,
}: {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const lang = LANGUAGE_ALIASES[language.toLowerCase()] ?? language.toLowerCase();
  const lineCount = code.split("\n").length;
  // Line numbers on a three-line snippet are noise, not navigation.
  const withLineNumbers = showLineNumbers ?? lineCount > 6;

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="group/code relative my-4 overflow-hidden rounded-lg">
      <div className="pointer-events-none absolute top-2 right-2 z-10 flex items-center gap-2">
        {lang !== "text" && (
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-white/50 uppercase">
            {lang}
          </span>
        )}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className={cn(
            "pointer-events-auto flex size-7 cursor-pointer items-center justify-center rounded-md",
            "bg-white/10 text-white/70 opacity-0 transition-all duration-150 ease-out-strong",
            "hover:bg-white/20 hover:text-white active:scale-[0.94]",
            "group-hover/code:opacity-100 focus-visible:opacity-100",
          )}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.8125rem",
          padding: "1rem",
        }}
        codeTagProps={{ style: { fontFamily: "var(--font-geist-mono), monospace" } }}
        showLineNumbers={withLineNumbers}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
