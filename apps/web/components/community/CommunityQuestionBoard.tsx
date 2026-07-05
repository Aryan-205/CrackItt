"use client";

import { type CommunityQuestion, type CommunityAnswer } from "@repo/types";
import { Filter, MessageSquare, Plus, Search, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SlideOverPanel } from "./SlideOverPanel";
import { VoteControls } from "./VoteControls";
import { cn } from "@/lib/utils";
import {
  getCommunityQuestions,
  createCommunityQuestion,
  voteCommunityQuestion,
  submitCommunityAnswer,
} from "@/lib/api";

const DEMO_USER_ID = "demo-user";
const PRESET_TAGS = [
  "Frontend",
  "Backend",
  "System Design",
  "Full Stack",
  "Behavioral",
] as const;

export function CommunityQuestionBoard() {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAskForm, setShowAskForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilterTag, setActiveFilterTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "upvotes-desc" | "upvotes-asc"
  >("latest");
  const [answerText, setAnswerText] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    body: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(["Frontend"]);
  const [useCustomTag, setUseCustomTag] = useState(false);
  const [customTag, setCustomTag] = useState("");

  useEffect(() => {
    getCommunityQuestions(DEMO_USER_ID)
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading forum questions: ", err);
        setLoading(false);
      });
  }, []);

  const selected = useMemo(
    () => questions.find((q) => q.id === selectedId) ?? null,
    [questions, selectedId],
  );

  const availableFilterTags = useMemo(
    () =>
      ["All", ...Array.from(new Set(questions.flatMap((q) => q.tags))).sort()],
    [questions],
  );

  const filteredQuestions = useMemo(() => {
    let list = questions;

    if (activeFilterTag !== "All") {
      list = list.filter((q) => q.tags.includes(activeFilterTag));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.body.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    const sorted = [...list];
    if (sortBy === "latest") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === "oldest") {
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (sortBy === "upvotes-asc") {
      sorted.sort((a, b) => getScore(a) - getScore(b));
    } else {
      sorted.sort((a, b) => getScore(b) - getScore(a));
    }

    return sorted;
  }, [activeFilterTag, questions, search, sortBy]);

  function getScore(q: CommunityQuestion) {
    return q.upvotes - q.downvotes;
  }

  function handleVote(questionId: string, direction: "up" | "down") {
    const q = questions.find((item) => item.id === questionId);
    if (!q) return;

    const current = q.userVote;
    const nextVote = current === direction ? null : direction;

    voteCommunityQuestion(questionId, nextVote, DEMO_USER_ID)
      .then((updated) => {
        setQuestions((prev) =>
          prev.map((item) => (item.id === questionId ? updated : item))
        );
      })
      .catch((err) => console.error("Error voting: ", err));
  }

  function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault();
    const custom = customTag.trim();
    const resolvedTags = [
      ...selectedTags,
      ...(useCustomTag && custom ? [custom] : []),
    ];

    if (
      !newQuestion.title.trim() ||
      !newQuestion.body.trim() ||
      resolvedTags.length === 0
    ) {
      return;
    }

    createCommunityQuestion({
      title: newQuestion.title.trim(),
      body: newQuestion.body.trim(),
      tags: resolvedTags,
      author: "Aryan",
    })
      .then((created) => {
        setQuestions((prev) => [created, ...prev]);
        setNewQuestion({ title: "", body: "" });
        setSelectedTags(["Frontend"]);
        setUseCustomTag(false);
        setCustomTag("");
        setShowAskForm(false);
        setSelectedId(created.id);
      })
      .catch((err) => console.error("Error creating question: ", err));
  }

  function togglePresetTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !answerText.trim()) return;

    submitCommunityAnswer(selected.id, answerText.trim(), "Aryan")
      .then((updated) => {
        setQuestions((prev) =>
          prev.map((q) => (q.id === selected.id ? updated : q))
        );
        setAnswerText("");
      })
      .catch((err) => console.error("Error submitting answer: ", err));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Questions</h1>
          <p className="mt-1 text-muted-foreground">
            Ask the community and upvote the best answers.
          </p>
        </div>
        <Button
          onClick={() => setShowAskForm(!showAskForm)}
          className="active:scale-[0.97] transition-all"
        >
          <Plus className="h-4 w-4" />
          Ask a question
        </Button>
      </div>

      {showAskForm && (
        <Card className="animate-in fade-in duration-200">
          <CardContent className="pt-6">
            <form onSubmit={handleAskQuestion} className="flex flex-col gap-3">
              <Input
                placeholder="Question title"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
                required
                className="focus-visible:ring-primary/20"
              />
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Tag</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TAGS.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      size="sm"
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      onClick={() => togglePresetTag(tag)}
                      className="active:scale-[0.95] transition-transform duration-100"
                    >
                      {tag}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant={useCustomTag ? "default" : "outline"}
                    onClick={() => setUseCustomTag((prev) => !prev)}
                    className="active:scale-[0.95] transition-transform duration-100"
                  >
                    Custom
                  </Button>
                </div>
              </div>
              {useCustomTag && (
                <Input
                  placeholder="Enter custom tag"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  required
                  className="focus-visible:ring-primary/20"
                />
              )}
              <textarea
                placeholder="Describe your question in detail..."
                value={newQuestion.body}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, body: e.target.value })
                }
                required
                rows={4}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-all focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20"
              />
              <div className="flex gap-2">
                <Button type="submit" className="active:scale-[0.97] transition-all">Post question</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAskForm(false);
                    setSelectedTags(["Frontend"]);
                    setUseCustomTag(false);
                    setCustomTag("");
                  }}
                  className="active:scale-[0.97] transition-all"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search questions by title, author, body, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 focus-visible:ring-primary/20"
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
                Filter by tags
              </p>
              <div className="flex flex-wrap gap-2">
                {availableFilterTags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    size="sm"
                    variant={activeFilterTag === tag ? "default" : "outline"}
                    onClick={() => setActiveFilterTag(tag)}
                    className="active:scale-[0.95] transition-transform duration-100"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sort
              </p>
              <div className="flex flex-wrap gap-2">
                {(["latest", "oldest", "upvotes-desc", "upvotes-asc"] as const).map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    size="sm"
                    variant={sortBy === mode ? "default" : "outline"}
                    onClick={() => setSortBy(mode)}
                    className="active:scale-[0.95] transition-transform duration-100 capitalize"
                  >
                    {mode.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredQuestions.map((q, index) => (
            <Card
              key={q.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-md border-border/80 active:scale-[0.99] animate-in fade-in slide-in-from-bottom-2",
                selectedId === q.id && "ring-2 ring-primary/30 bg-primary/[0.01]",
              )}
              onClick={() => setSelectedId(q.id)}
              style={{ animationDelay: `${index * 40}ms`, animationFillMode: "both" }}
            >
              <CardContent className="flex gap-4 py-4">
                <VoteControls
                  score={getScore(q)}
                  userVote={q.userVote ?? null}
                  onVote={(dir) => {
                    handleVote(q.id, dir);
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {q.tags.map((tag) => (
                      <Badge key={`${q.id}-${tag}`} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}
                    <span className="text-[11px] text-muted-foreground">
                      {q.author} ·{" "}
                      {new Date(q.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-medium leading-snug text-sm sm:text-base">{q.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {q.body}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>
                      {q.answers.length} {q.answers.length === 1 ? "answer" : "answers"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredQuestions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-muted-foreground">
            No community questions match your current search/filter.
          </CardContent>
        </Card>
      )}

      <SlideOverPanel
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        title="Question Details"
      >
        {selected && (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {selected.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                <span className="text-xs text-muted-foreground">
                  Asked by {selected.author} ·{" "}
                  {new Date(selected.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="text-xl font-bold leading-snug">{selected.title}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {selected.body}
              </p>

              <div className="my-6 h-px bg-border" />

              <h3 className="mb-4 font-semibold">
                Answers ({selected.answers.length})
              </h3>
              <div className="flex flex-col gap-4">
                {selected.answers.map((ans) => (
                  <Card key={ans.id} size="sm" className="bg-muted/10 border-border/60">
                    <CardContent className="py-3">
                      <div className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {ans.author}
                        </span>
                        <span>·</span>
                        <span>
                          {new Date(ans.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {ans.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                {selected.answers.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No answers yet. Be the first to share your thoughts!
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-border bg-card px-6 py-4">
              <form onSubmit={handleSubmitAnswer} className="flex flex-col gap-3">
                <textarea
                  placeholder="Type your answer here..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-all focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedId(null)}
                    className="active:scale-[0.97] transition-all"
                  >
                    Close
                  </Button>
                  <Button type="submit" className="active:scale-[0.97] transition-all">Submit Answer</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </SlideOverPanel>
    </div>
  );
}
