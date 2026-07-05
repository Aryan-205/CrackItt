"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { LearnArticle } from "@/lib/learn-articles";
import { ArrowLeft, Check, Lock, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

import { CompletionButton } from "./CompletionButton";

export function LearnArticleView({
  article,
  initialCompleted,
}: {
  article: LearnArticle;
  initialCompleted: boolean;
}) {
  const categoryHref = `/learn/${article.categorySlug}`;
  const [rating, setRating] = useState(0);

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
          By {article.authorName} | {article.categoryTitle} | {article.sectionTitle}
        </p>
      </div>
      
      <article className="text-muted-foreground">
        {renderContent(article.content)}
      </article>

      <div className="border-t border-border pt-6 flex justify-between w-full ">
        <Button
          variant="outline"
          className="h-auto px-0 text-muted-foreground p-2"
          render={<Link href={categoryHref} />}
        >
          <ArrowLeft className="h-4 w-4 shrink-0 text-primary" /> Back to {article.categoryTitle}
        </Button>
        <CompletionButton
          itemId={`la-${article.categorySlug}-${article.slug}`}
          itemType="learn_article"
          initialCompleted={initialCompleted}
        />
      </div>
      <div>
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Rate this article:
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    className="rounded-sm p-1 text-muted-foreground transition hover:text-primary"
                  >
                    <Star
                      className={star <= rating ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-start gap-2 rounded-md border border-border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Got a question? Ask the community.
              </p>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/community/questions" />}
              >
                Go to Community Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
