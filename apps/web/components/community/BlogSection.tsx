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
import { useMemo, useState } from "react";
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
import { slugify, type UserBlogDraft } from "@/lib/community-data";
import { cn } from "@/lib/utils";

const BOOKMARKS_KEY = "crackitt-blog-bookmarks";
const USER_BLOGS_KEY = "crackitt-user-blogs";

function loadBookmarks(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveBookmarks(ids: Set<string>) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...ids]));
}

function loadUserBlogs(): UserBlogDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_BLOGS_KEY);
    return raw ? (JSON.parse(raw) as UserBlogDraft[]) : [];
  } catch {
    return [];
  }
}

function saveUserBlogs(blogs: UserBlogDraft[]) {
  localStorage.setItem(USER_BLOGS_KEY, JSON.stringify(blogs));
}

type BlogItem = BlogPost & { isUserSubmitted?: boolean };

export function BlogSection({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [showCompose, setShowCompose] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => loadBookmarks());
  const [userBlogs, setUserBlogs] = useState<UserBlogDraft[]>(() =>
    loadUserBlogs(),
  );
  const [draft, setDraft] = useState({
    title: "",
    excerpt: "",
    content: "",
    tag: "",
    author: "You",
  });

  const allPosts: BlogItem[] = useMemo(
    () => [
      ...userBlogs.map((b) => ({ ...b, isUserSubmitted: true })),
      ...initialPosts,
    ],
    [initialPosts, userBlogs],
  );

  const availableTags = useMemo(
    () => ["All", ...Array.from(new Set(allPosts.map((p) => p.tag))).sort()],
    [allPosts],
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
          p.tag.toLowerCase().includes(q),
      );
    }
    return posts;
  }, [allPosts, bookmarks, search, selectedTag, showBookmarks]);

  function toggleBookmark(id: string) {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveBookmarks(next);
      return next;
    });
  }

  function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) return;

    const newBlog: UserBlogDraft = {
      id: `user-${Date.now()}`,
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim() || draft.content.trim().slice(0, 120),
      content: draft.content.trim(),
      author: draft.author.trim() || "You",
      tag: draft.tag.trim() || "Community",
      slug: slugify(draft.title),
      publishedAt: new Date().toISOString(),
    };

    const updated = [newBlog, ...userBlogs];
    setUserBlogs(updated);
    saveUserBlogs(updated);
    setDraft({ title: "", excerpt: "", content: "", tag: "", author: "You" });
    setShowCompose(false);
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
        <Button onClick={() => setShowCompose(!showCompose)}>
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
            className="pl-8 w-full"
          />
        </div>
        <Button
          type="button"
          variant={showFilters ? "secondary" : "outline"}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card>
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
                >
                  {showBookmarks ? (
                    <BookmarkCheck className="h-4 w-4" />
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

      {showCompose && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publish a new blog</CardTitle>
            <CardDescription>
              Share your interview prep insights with the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePublish} className="flex flex-col gap-3">
              <Input
                placeholder="Title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                required
              />
              <Input
                placeholder="Tag (e.g. System Design, Frontend)"
                value={draft.tag}
                onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              />
              <Input
                placeholder="Short excerpt"
                value={draft.excerpt}
                onChange={(e) =>
                  setDraft({ ...draft, excerpt: e.target.value })
                }
              />
              <textarea
                placeholder="Write your blog content..."
                value={draft.content}
                onChange={(e) =>
                  setDraft({ ...draft, content: e.target.value })
                }
                required
                rows={6}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <div className="flex gap-2">
                <Button type="submit">Publish</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCompose(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {showBookmarks
              ? "No bookmarked blogs yet. Save posts you want to revisit."
              : "No blogs match your search."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((post) => (
            <Card
              key={post.id}
              className="relative transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{post.tag}</Badge>
                    {post.isUserSubmitted && (
                      <Badge variant="outline" className="text-[10px]">
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
                      bookmarks.has(post.id) && "text-primary",
                    )}
                    onClick={() => toggleBookmark(post.id)}
                  >
                    {bookmarks.has(post.id) ? (
                      <Bookmark fill="currentColor" className="h-6 w-6" />
                    ) : (
                      <Bookmark className="h-6 w-6" />
                    )}
                  </Button>
                </div>
                <CardTitle className="text-base">
                  <Link
                    href={`/community/blog/${post.slug}`}
                    className="hover:text-primary hover:underline"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
                <p className="text-xs text-muted-foreground">
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
