"use client";

import {
  INITIAL_COMMUNITY_QUESTIONS,
  type CommunityAnswer,
  type CommunityQuestion,
} from "@/lib/community-data";
import { Filter, MessageSquare, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SlideOverPanel } from "./SlideOverPanel";
import { VoteControls, type VoteDirection } from "./VoteControls";
import { cn } from "@/lib/utils";

const QUESTIONS_KEY = "crackitt-community-questions";
const VOTES_KEY = "crackitt-question-votes";
const PRESET_TAGS = [
  "Frontend",
  "Backend",
  "System Design",
  "Full Stack",
  "Behavioral",
] as const;

type StoredVotes = Record<string, VoteDirection>;
type LegacyQuestion = Omit<CommunityQuestion, "tags"> & { tag?: string };

function loadQuestions(): CommunityQuestion[] {
  if (typeof window === "undefined") return INITIAL_COMMUNITY_QUESTIONS;
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (!raw) return INITIAL_COMMUNITY_QUESTIONS;
    const parsed = JSON.parse(raw) as Array<CommunityQuestion | LegacyQuestion>;
    return parsed.map((q) => ({
      ...q,
      tags:
        "tags" in q && Array.isArray(q.tags)
          ? q.tags
          : "tag" in q && q.tag
            ? [q.tag]
            : ["General"],
    }));
  } catch {
    return INITIAL_COMMUNITY_QUESTIONS;
  }
}

function saveQuestions(questions: CommunityQuestion[]) {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
}

function loadVotes(): StoredVotes {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    return raw ? (JSON.parse(raw) as StoredVotes) : {};
  } catch {
    return {};
  }
}

function saveVotes(votes: StoredVotes) {
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

export function CommunityQuestionBoard() {
  const [questions, setQuestions] = useState<CommunityQuestion[]>(
    INITIAL_COMMUNITY_QUESTIONS,
  );
  const [votes, setVotes] = useState<StoredVotes>({});

  useEffect(() => {
    setQuestions(loadQuestions());
    setVotes(loadVotes());
  }, []);
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
    const current = votes[questionId] ?? null;
    const nextVote: VoteDirection = current === direction ? null : direction;

    setQuestions((prev) => {
      const updated = prev.map((q) => {
        if (q.id !== questionId) return q;
        let up = q.upvotes;
        let down = q.downvotes;
        if (current === "up") up--;
        if (current === "down") down--;
        if (nextVote === "up") up++;
        if (nextVote === "down") down++;
        return { ...q, upvotes: up, downvotes: down };
      });
      saveQuestions(updated);
      return updated;
    });

    setVotes((prev) => {
      const next = { ...prev, [questionId]: nextVote };
      saveVotes(next);
      return next;
    });
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

    const q: CommunityQuestion = {
      id: `cq-user-${Date.now()}`,
      title: newQuestion.title.trim(),
      body: newQuestion.body.trim(),
      author: "You",
      tags: resolvedTags,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      answers: [],
    };

    const updated = [q, ...questions];
    setQuestions(updated);
    saveQuestions(updated);
    setNewQuestion({ title: "", body: "" });
    setSelectedTags(["Frontend"]);
    setUseCustomTag(false);
    setCustomTag("");
    setShowAskForm(false);
    setSelectedId(q.id);
  }

  function togglePresetTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !answerText.trim()) return;

    const answer: CommunityAnswer = {
      id: `ca-user-${Date.now()}`,
      author: "You",
      content: answerText.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
    };

    const updated = questions.map((q) =>
      q.id === selected.id
        ? { ...q, answers: [...q.answers, answer] }
        : q,
    );
    setQuestions(updated);
    saveQuestions(updated);
    setAnswerText("");
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
        <Button onClick={() => setShowAskForm(!showAskForm)}>
          <Plus className="h-4 w-4" />
          Ask a question
        </Button>
      </div>

      {showAskForm && (
        <Card>
          <CardContent>
            <form onSubmit={handleAskQuestion} className="flex flex-col gap-3">
              <Input
                placeholder="Question title"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
                required
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
                    >
                      {tag}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant={useCustomTag ? "default" : "outline"}
                    onClick={() => setUseCustomTag((prev) => !prev)}
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
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <div className="flex gap-2">
                <Button type="submit">Post question</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAskForm(false);
                    setSelectedTags(["Frontend"]);
                    setUseCustomTag(false);
                    setCustomTag("");
                  }}
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
            className="pl-8"
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
          <CardContent className="flex flex-col gap-4">
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
                <Button
                  type="button"
                  size="sm"
                  variant={sortBy === "latest" ? "default" : "outline"}
                  onClick={() => setSortBy("latest")}
                >
                  Latest
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={sortBy === "oldest" ? "default" : "outline"}
                  onClick={() => setSortBy("oldest")}
                >
                  Oldest
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={sortBy === "upvotes-desc" ? "default" : "outline"}
                  onClick={() => setSortBy("upvotes-desc")}
                >
                  Upvotes Desc
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={sortBy === "upvotes-asc" ? "default" : "outline"}
                  onClick={() => setSortBy("upvotes-asc")}
                >
                  Upvotes Asc
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {filteredQuestions.map((q) => (
          <Card
            key={q.id}
            className={cn(
              "cursor-pointer transition-shadow hover:shadow-md",
              selectedId === q.id && "ring-2 ring-primary/30",
            )}
            onClick={() => setSelectedId(q.id)}
          >
            <CardContent className="flex gap-4 py-4">
              <VoteControls
                score={getScore(q)}
                userVote={votes[q.id] ?? null}
                onVote={(dir) => {
                  handleVote(q.id, dir);
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  {q.tags.map((tag) => (
                    <Badge key={`${q.id}-${tag}`} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-xs text-muted-foreground">
                    {q.author} ·{" "}
                    {new Date(q.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="font-medium leading-snug">{q.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {q.body}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {q.answers.length}{" "}
                  {q.answers.length === 1 ? "answer" : "answers"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredQuestions.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No questions match your current search/filter.
            </CardContent>
          </Card>
        )}
      </div>

      <SlideOverPanel
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        title={selected?.title}
      >
        {selected && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {selected.tags.map((tag) => (
                  <Badge key={`${selected.id}-${tag}`} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                <span className="text-xs text-muted-foreground">
                  Asked by {selected.author} ·{" "}
                  {new Date(selected.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {selected.body}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">
                {selected.answers.length}{" "}
                {selected.answers.length === 1 ? "Answer" : "Answers"}
              </h3>
              {selected.answers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No answers yet. Be the first to help!
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {selected.answers.map((a) => (
                    <Card key={a.id} size="sm">
                      <CardContent>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium">{a.author}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(a.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{a.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitAnswer} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Your answer</h3>
              <textarea
                placeholder="Share your knowledge..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button type="submit" className="w-fit">
                Post answer
              </Button>
            </form>
          </div>
        )}
      </SlideOverPanel>
    </div>
  );
}
