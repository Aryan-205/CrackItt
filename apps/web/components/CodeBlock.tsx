"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={{
        margin: 0,
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
      }}
      showLineNumbers
    >
      {code}
    </SyntaxHighlighter>
  );
}
