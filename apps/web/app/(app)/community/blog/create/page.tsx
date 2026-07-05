"use client";

import { useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  MessageSquareQuote,
  Sparkles,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [showTagMenu, setShowTagMenu] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [content]);

  function insertMarkdown(syntaxBefore: string, syntaxAfter = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const replacement = syntaxBefore + (selectedText || "text") + syntaxAfter;

    setContent(text.substring(0, start) + replacement + text.substring(end));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + syntaxBefore.length,
        start + syntaxBefore.length + (selectedText || "text").length
      );
    }, 0);
  }

  function handlePublish() {
    if (!title.trim() || !content.trim()) return;

    setPublishing(true);
    createBlog({
      title: title.trim(),
      content: content.trim(),
      tag,
      excerpt: excerpt.trim() || content.trim().slice(0, 120) + "...",
      author: "Aryan",
    })
      .then(() => {
        router.push("/community/blog");
        router.refresh();
      })
      .catch((err) => {
        console.error("Error publishing blog: ", err);
        setPublishing(false);
      });
  }

  return (
    <div className="min-h-full rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden animate-in fade-in duration-300">
      <div className="border-b border-zinc-800 p-3 sm:p-4 bg-zinc-900/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="rounded-md bg-violet-900/40 px-2.5 py-1 font-semibold text-violet-200 border border-violet-800/40">
              Draft
            </span>
            <span className="text-zinc-400">Save to community blog</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className={cn(
                "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 active:scale-[0.96] transition-transform",
                isPreview && "bg-zinc-800 text-zinc-100",
              )}
              onClick={() => setIsPreview((prev) => !prev)}
            >
              Preview
            </Button>
            <Button
              onClick={handlePublish}
              disabled={publishing || !title.trim() || !content.trim()}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold active:scale-[0.96] transition-all disabled:opacity-50"
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-zinc-800 pt-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => insertMarkdown("**", "**")}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => insertMarkdown("*", "*")}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => insertMarkdown("> ")}
            title="Quote"
          >
            <MessageSquareQuote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => insertMarkdown("- ")}
            title="Unordered List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => insertMarkdown("1. ")}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => insertMarkdown("[", "](url)")}
            title="Insert Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>

          <span className="mx-2 h-5 w-px bg-zinc-800" />
          
          <div className="relative">
            <Button
              variant="ghost"
              className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 text-xs py-1 h-8"
              onClick={() => setShowTagMenu(!showTagMenu)}
            >
              Tag: <span className="font-semibold text-primary">{tag}</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            {showTagMenu && (
              <div className="absolute left-0 mt-1 w-40 rounded-md border border-zinc-850 bg-zinc-900 shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                {PRESET_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTag(t);
                      setShowTagMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors",
                      tag === t && "bg-zinc-800/60 text-primary font-medium"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="ml-auto text-xs text-zinc-400">{wordCount} words</span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-8 sm:px-8">
        <Input
          placeholder="Add a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-auto border-0 bg-transparent px-0 text-3xl sm:text-4xl font-bold text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-0 rounded-none pb-2 border-b border-zinc-900/60"
        />

        <div className="flex flex-col gap-2 bg-zinc-900/20 p-3 rounded-lg border border-zinc-900">
          <label className="text-xs font-semibold text-zinc-400">EXCERPT (SHORT INTRO)</label>
          <input
            placeholder="Summarize your blog in a sentence or two (optional)..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-zinc-300 text-sm placeholder:text-zinc-600"
          />
        </div>

        {isPreview ? (
          <article className="min-h-[360px] whitespace-pre-wrap rounded-lg border border-zinc-850 bg-zinc-900/20 p-4 leading-8 text-zinc-200 prose prose-invert max-w-none">
            {content.trim() ? (
              <div className="space-y-4">
                {content.split("\n\n").map((para, i) => {
                  if (para.startsWith("# ")) {
                    return <h1 key={i} className="text-2xl font-bold text-white mt-4">{para.slice(2)}</h1>;
                  }
                  if (para.startsWith("## ")) {
                    return <h2 key={i} className="text-xl font-bold text-white mt-3">{para.slice(3)}</h2>;
                  }
                  if (para.startsWith("> ")) {
                    return <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-zinc-400">{para.slice(2)}</blockquote>;
                  }
                  return <p key={i} className="leading-relaxed text-zinc-300">{para}</p>;
                })}
              </div>
            ) : (
              <span className="text-zinc-600 italic">Nothing to preview yet. Start writing in the editor pane.</span>
            )}
          </article>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts in markdown here..."
            className="min-h-[420px] w-full resize-y border-0 bg-transparent p-0 text-base sm:text-lg leading-8 text-zinc-200 outline-none placeholder:text-zinc-600"
          />
        )}
      </div>
    </div>
  );
}
