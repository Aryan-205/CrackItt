import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { LearnArticle } from "@/lib/learn-articles";
import { Lock } from "lucide-react";
import Link from "next/link";

function renderContent(content: string) {
  const blocks = content.split("\n\n");

  return blocks.map((block, index) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="mt-8 mb-3 text-lg font-semibold text-foreground first:mt-0"
        >
          {block.replace(/^## /, "")}
        </h2>
      );
    }

    if (block.startsWith("### ")) {
      return (
        <h3 key={index} className="mt-6 mb-2 font-semibold text-foreground">
          {block.replace(/^### /, "")}
        </h3>
      );
    }

    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((line) => line.startsWith("- "));
      return (
        <ul key={index} className="my-3 list-disc space-y-1.5 pl-5">
          {items.map((item, i) => (
            <li key={i}>{item.replace(/^- /, "")}</li>
          ))}
        </ul>
      );
    }

    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={index} className="my-3 leading-relaxed">
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    );
  });
}

export function LearnArticleView({ article }: { article: LearnArticle }) {
  const categoryHref = `/learn/${article.categorySlug}`;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{article.sectionTitle}</Badge>
        <span>·</span>
        <span>{article.readTimeMinutes} min read</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {article.categoryTitle} · {article.sectionTitle}
        </p>
      </div>

      {article.locked ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Premium content</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Upgrade to Crackitt Premium to unlock this lesson and the full
                Patterns library.
              </p>
            </div>
            <Button size="sm">Get Premium</Button>
          </CardContent>
        </Card>
      ) : (
        <article className="text-muted-foreground">
          {renderContent(article.content)}
        </article>
      )}

      <div className="border-t border-border pt-6">
        <Button
          variant="link"
          className="h-auto px-0 text-muted-foreground"
          render={<Link href={categoryHref} />}
        >
          ← Back to {article.categoryTitle}
        </Button>
      </div>
    </div>
  );
}
