"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TOOLBAR_ICONS = [Bold, Italic, MessageSquareQuote, List, ListOrdered, Link2];

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const wordCount = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [content]);

  return (
    <div className="min-h-full rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="border-b border-zinc-800 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-md bg-violet-900/40 px-2 py-1 font-medium text-violet-200">
              Draft
            </span>
            <span className="text-zinc-400">Last saved just now</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className={cn(
                "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100",
                isPreview && "bg-zinc-800 text-zinc-100",
              )}
              onClick={() => setIsPreview((prev) => !prev)}
            >
              Preview
            </Button>
            <Button>Publish</Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-zinc-800 pt-3">
          {TOOLBAR_ICONS.map((Icon, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="icon-sm"
              className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              aria-label="Editor action"
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
          <span className="mx-2 h-5 w-px bg-zinc-800" />
          <Button
            variant="ghost"
            className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Sparkles className="h-4 w-4" />
            Insert
          </Button>
          <span className="ml-auto text-sm text-zinc-400">{wordCount} words</span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-8 sm:px-8">
        <Input
          placeholder="Add a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-auto border-0 bg-transparent px-0 text-4xl font-bold text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0"
        />

        <div className="flex items-center gap-3">
          <Image
            src="/images/aryan-bola.jpg"
            alt="Aryan Bola"
            width={34}
            height={34}
            className="rounded-full border border-zinc-700"
          />
          <div>
            <p className="text-sm font-semibold">Aryan Bola</p>
            <p className="text-xs text-zinc-400">@BolatwtX</p>
          </div>
        </div>

        {isPreview ? (
          <article className="min-h-[360px] whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 leading-7 text-zinc-200">
            {content.trim() || "Nothing to preview yet..."}
          </article>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing"
            className="min-h-[420px] w-full resize-y border-0 bg-transparent p-0 text-lg leading-8 text-zinc-200 outline-none placeholder:text-zinc-500"
          />
        )}
      </div>
    </div>
  );
}
