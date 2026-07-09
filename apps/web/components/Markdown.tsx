import { isValidElement, type ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/utils";

/** Flatten a react-markdown child tree back into its raw text. */
function toText(node: ReactNode): string {
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return toText(node.props.children);
  }
  return "";
}

const components: Components = {
  // Fenced code arrives as <pre><code class="language-x">. Intercepting at `pre`
  // is the only reliable way to tell a block from inline code: many of our
  // fences carry no language tag, so a class check on `code` alone misses them.
  pre({ children }) {
    if (isValidElement<{ className?: string; children?: ReactNode }>(children)) {
      const match = /language-([\w-]+)/.exec(children.props.className ?? "");
      const code = toText(children.props.children).replace(/\n$/, "");
      return <CodeBlock code={code} language={match?.[1] ?? "text"} />;
    }
    return <pre>{children}</pre>;
  },

  code({ className, children }) {
    // Anything still reaching here is inline; blocks were consumed by `pre`.
    return (
      <code
        className={cn(
          "rounded border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[0.85em] font-normal text-foreground",
          "before:content-none after:content-none",
          className,
        )}
      >
        {children}
      </code>
    );
  },

  a({ href, children }) {
    const url = href ?? "#";
    if (url.startsWith("/")) {
      return (
        <Link href={url} className="font-medium text-primary underline underline-offset-4">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-4"
      >
        {children}
      </a>
    );
  },

  img({ src, alt }) {
    if (typeof src !== "string") return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        className="my-5 w-full rounded-lg border border-border bg-muted/30"
      />
    );
  },

  table({ children }) {
    return (
      <div className="my-5 w-full overflow-x-auto rounded-lg border border-border">
        <table className="my-0 w-full text-sm">{children}</table>
      </div>
    );
  },

  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-primary/50 pl-4 text-muted-foreground not-italic">
        {children}
      </blockquote>
    );
  },
};

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground",
        "prose-p:leading-relaxed prose-li:leading-relaxed",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-th:text-foreground prose-td:align-top",
        "prose-hr:border-border",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
