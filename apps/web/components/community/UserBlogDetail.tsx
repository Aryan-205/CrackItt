"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserBlogDraft } from "@/lib/community-data";

const USER_BLOGS_KEY = "crackitt-user-blogs";

export function UserBlogDetail({ slug }: { slug: string }) {
  const [post, setPost] = useState<UserBlogDraft | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_BLOGS_KEY);
      const blogs: UserBlogDraft[] = raw ? JSON.parse(raw) : [];
      setPost(blogs.find((b) => b.slug === slug) ?? null);
    } catch {
      setPost(null);
    }
    setLoaded(true);
  }, [slug]);

  if (!loaded) return null;
  if (!post) notFound();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Button
        variant="link"
        className="w-fit px-0"
        render={<Link href="/community/blog" />}
      >
        ← Back to Blog
      </Button>
      <div>
        <Badge variant="secondary">{post.tag}</Badge>
        <Badge variant="outline" className="ml-2">
          Your post
        </Badge>
        <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          By {post.author} ·{" "}
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <article className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {post.content}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
