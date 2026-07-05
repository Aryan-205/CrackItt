"use client";

import type { BlogPost } from "@repo/types";
import {
  Bookmark,
  BookmarkCheck,
  Filter,
  PenLine,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getBookmarkedBlogs, toggleBlogBookmark } from "@/lib/api";

const DEMO_USER_ID = "demo-user";

type BlogItem = BlogPost & { isUserSubmitted?: boolean };

export function BlogSection({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    getBookmarkedBlogs(DEMO_USER_ID)
      .then((data) => {
        setBookmarks(new Set(data));
      })
      .catch((err) => console.error("Error loading bookmarks: ", err));
  }, []);

  const allPosts: BlogItem[] = useMemo(() => {
    return initialPosts.map((p) => ({
      ...p,
      // If the author is Aryan, we can mark it as user submitted for demonstration
      isUserSubmitted: p.author === "Aryan" || p.author === "You",
    }));
  }, [initialPosts]);

  const availableTags = useMemo(
    () => ["All", ...Array.from(new Set(allPosts.map((p) => p.tag))).sort()],
    [allPosts]
  );

  const filtered = useMemo(() => {
    let posts = allPosts;
    if (showBookmarks) {
      posts = posts.filter((p) => bookmarks.has(p.id));
    }
    if (selectedTag !== "All") {
      posts = posts.filter((p) => p.tag === selectedTag);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q)
      );
    }
    return posts;
  }, [allPosts, bookmarks, search, selectedTag, showBookmarks]);

  function toggleBookmark(id: string) {
    toggleBlogBookmark(id, DEMO_USER_ID)
      .then((res) => {
        setBookmarks((prev) => {
          const next = new Set(prev);
          if (res.bookmarked) {
            next.add(id);
          } else {
            next.delete(id);
          }
          return next;
        });
      })
      .catch((err) => console.error("Error toggling bookmark: ", err));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="mt-1 text-muted-foreground">
            Read, write, and bookmark community blogs.
          </p>
        </div>
        <Button
          render={<Link href="/community/blog/create" />}
          className="active:scale-[0.97] transition-transform duration-150"
        >
          <PenLine className="h-4 w-4" />
          Write a blog
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blogs by title, author, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-full focus-visible:ring-primary/20"
          />
        </div>
        <Button
          type="button"
          variant={showFilters ? "secondary" : "outline"}
          onClick={() => setShowFilters((prev) => !prev)}
          className="active:scale-[0.97] transition-all"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="animate-in fade-in duration-200">
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Filter by tag
              </p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    size="sm"
                    variant={selectedTag === tag ? "default" : "outline"}
                    onClick={() => setSelectedTag(tag)}
                    className="active:scale-[0.95] transition-all duration-100"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Extra filters
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={showBookmarks ? "default" : "outline"}
                  onClick={() => setShowBookmarks((prev) => !prev)}
                  className="active:scale-[0.95] transition-all duration-100"
                >
                  {showBookmarks ? (
                    <BookmarkCheck className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  {showBookmarks ? "Bookmarked only" : "Include all blogs"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-muted-foreground">
            {showBookmarks
              ? "No bookmarked blogs yet. Save posts you want to revisit."
              : "No blogs match your search."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((post, index) => (
            <Card
              key={post.id}
              className="relative transition-all duration-300 hover:shadow-md border-border/80 active:scale-[0.99] animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{post.tag}</Badge>
                    {post.isUserSubmitted && (
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                        Your post
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      "active:scale-90 transition-transform duration-100",
                      bookmarks.has(post.id) && "text-primary hover:text-primary/80"
                    )}
                    onClick={() => toggleBookmark(post.id)}
                  >
                    {bookmarks.has(post.id) ? (
                      <Bookmark fill="currentColor" className="h-5 w-5 animate-in zoom-in duration-200" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <CardTitle className="text-base mt-2">
                  <Link
                    href={`/community/blog/${post.slug}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-2">
                  By {post.author}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
