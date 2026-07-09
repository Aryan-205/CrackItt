"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { BlogEditor } from "@/components/BlogEditor";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { createBlog } from "@/lib/api";

const PRESET_TAGS = ["System Design", "Frontend", "Backend", "Community", "General"];

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Community");
  const [excerpt, setExcerpt] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [tagMenuOpen, setTagMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content],
  );

  const canPublish = Boolean(title.trim() && content.trim()) && !publishing;

  function handlePublish() {
    if (!canPublish) return;

    setPublishing(true);
    setError(null);

    createBlog({
      title: title.trim(),
      content: content.trim(),
      tag,
      excerpt: excerpt.trim() || `${content.trim().slice(0, 120)}...`,
      author: "Aryan",
    })
      .then(() => {
        router.push("/community/blog");
        router.refresh();
      })
      .catch((err: unknown) => {
        console.error("Error publishing blog: ", err);
        setError("Could not publish. Check the API is running and try again.");
        setPublishing(false);
      });
  }

  return (
    <div className="min-h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/30 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Badge variant="secondary">Draft</Badge>
            <span className="text-muted-foreground">Save to community blog</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isPreview ? "secondary" : "ghost"}
              onClick={() => setIsPreview((prev) => !prev)}
            >
              {isPreview ? "Keep writing" : "Preview"}
            </Button>
            <Button onClick={handlePublish} disabled={!canPublish}>
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Collapsible open={tagMenuOpen} onOpenChange={setTagMenuOpen}>
            <div className="relative">
              <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
                Tag: <span className="font-semibold text-primary">{tag}</span>
                <ChevronDown
                  className={cn(
                    "ml-1 h-3 w-3 transition-transform duration-200 ease-out-strong",
                    tagMenuOpen && "rotate-180",
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent
                className={cn(
                  "absolute left-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-popover shadow-lg",
                  "origin-top transition-[opacity,transform] duration-150 ease-out-strong",
                  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
                  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
                )}
              >
                {PRESET_TAGS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setTag(preset);
                      setTagMenuOpen(false);
                    }}
                    className={cn(
                      "w-full cursor-pointer px-3 py-2 text-left text-xs transition-colors hover:bg-muted",
                      tag === preset && "bg-muted/60 font-medium text-primary",
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </CollapsibleContent>
            </div>
          </Collapsible>

          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-8 sm:px-8">
        <Input
          placeholder="Add a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-auto rounded-none border-0 border-b border-border bg-transparent px-0 pb-2 text-3xl font-bold focus-visible:ring-0 sm:text-4xl"
        />

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3">
          <label
            htmlFor="excerpt"
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Excerpt (short intro)
          </label>
          <input
            id="excerpt"
            placeholder="Summarize your post in a sentence or two (optional)..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {isPreview ? (
          <article className="min-h-[420px] rounded-lg border border-border bg-muted/20 p-5">
            {content.trim() ? (
              <Markdown content={content} />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nothing to preview yet. Start writing in the editor.
              </p>
            )}
          </article>
        ) : (
          <BlogEditor value={content} onChange={setContent} />
        )}
      </div>
    </div>
  );
}
