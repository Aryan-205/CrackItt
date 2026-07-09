"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { LearnArticle } from "@repo/types";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Markdown } from "./Markdown";
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
      
      <article>
        <Markdown content={article.content} />
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
