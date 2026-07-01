"use client";

import {
  INITIAL_COMMUNITY_QUESTIONS,
  type CommunityAnswer,
  type CommunityQuestion,
} from "@/lib/community-data";
import { MessageSquare, Plus } from "lucide-react";
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

type StoredVotes = Record<string, VoteDirection>;

function loadQuestions(): CommunityQuestion[] {
  if (typeof window === "undefined") return INITIAL_COMMUNITY_QUESTIONS;
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    return raw
      ? (JSON.parse(raw) as CommunityQuestion[])
      : INITIAL_COMMUNITY_QUESTIONS;
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
  const [answerText, setAnswerText] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    body: "",
    tag: "",
  });

  const selected = useMemo(
    () => questions.find((q) => q.id === selectedId) ?? null,
    [questions, selectedId],
  );

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
    if (!newQuestion.title.trim() || !newQuestion.body.trim()) return;

    const q: CommunityQuestion = {
      id: `cq-user-${Date.now()}`,
      title: newQuestion.title.trim(),
      body: newQuestion.body.trim(),
      author: "You",
      tag: newQuestion.tag.trim() || "General",
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      answers: [],
    };

    const updated = [q, ...questions];
    setQuestions(updated);
    saveQuestions(updated);
    setNewQuestion({ title: "", body: "", tag: "" });
    setShowAskForm(false);
    setSelectedId(q.id);
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
          <CardContent className="pt-6">
            <form onSubmit={handleAskQuestion} className="flex flex-col gap-3">
              <Input
                placeholder="Question title"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
                required
              />
              <Input
                placeholder="Tag (e.g. Frontend, System Design)"
                value={newQuestion.tag}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, tag: e.target.value })
                }
              />
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
                  onClick={() => setShowAskForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {questions.map((q) => (
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
                  <Badge variant="secondary">{q.tag}</Badge>
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
                <Badge variant="secondary">{selected.tag}</Badge>
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
