"use client";

import {
  averageRating,
  INITIAL_COMMUNITY_PROJECTS,
  type CommunityProject,
} from "@/lib/community-data";
import { ExternalLink, Github, Plus, Star } from "lucide-react";
import { useState } from "react";
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
import { VoteControls, type VoteDirection } from "./VoteControls";
import { cn } from "@/lib/utils";

const PROJECTS_KEY = "crackitt-community-projects";
const PROJECT_VOTES_KEY = "crackitt-project-votes";
const PROJECT_RATINGS_KEY = "crackitt-project-ratings";

type StoredVotes = Record<string, VoteDirection>;
type StoredRatings = Record<string, number>;

function loadProjects(): CommunityProject[] {
  if (typeof window === "undefined") return INITIAL_COMMUNITY_PROJECTS;
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw
      ? (JSON.parse(raw) as CommunityProject[])
      : INITIAL_COMMUNITY_PROJECTS;
  } catch {
    return INITIAL_COMMUNITY_PROJECTS;
  }
}

function saveProjects(projects: CommunityProject[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function loadProjectVotes(): StoredVotes {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROJECT_VOTES_KEY);
    return raw ? (JSON.parse(raw) as StoredVotes) : {};
  } catch {
    return {};
  }
}

function saveProjectVotes(votes: StoredVotes) {
  localStorage.setItem(PROJECT_VOTES_KEY, JSON.stringify(votes));
}

function loadProjectRatings(): StoredRatings {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROJECT_RATINGS_KEY);
    return raw ? (JSON.parse(raw) as StoredRatings) : {};
  } catch {
    return {};
  }
}

function saveProjectRatings(ratings: StoredRatings) {
  localStorage.setItem(PROJECT_RATINGS_KEY, JSON.stringify(ratings));
}

function StarRating({
  value,
  userRating,
  onRate,
}: {
  value: number;
  userRating?: number;
  onRate: (stars: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          className="rounded p-0.5 transition-colors hover:text-primary"
        >
          <Star
            className={cn(
              "h-4 w-4",
              star <= Math.round(value)
                ? "fill-primary text-primary"
                : "text-muted-foreground/40",
              userRating && star <= userRating && "fill-primary text-primary",
            )}
          />
        </button>
      ))}
      <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">
        {value > 0 ? value.toFixed(1) : "—"}
      </span>
    </div>
  );
}

export function ProjectShowcase() {
  const [projects, setProjects] = useState<CommunityProject[]>(() =>
    loadProjects(),
  );
  const [votes, setVotes] = useState<StoredVotes>(() => loadProjectVotes());
  const [ratings, setRatings] = useState<StoredRatings>(() =>
    loadProjectRatings(),
  );
  const [showSubmit, setShowSubmit] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    repoUrl: "",
    demoUrl: "",
    tags: "",
  });

  function handleVote(projectId: string, direction: "up" | "down") {
    const current = votes[projectId] ?? null;
    const nextVote: VoteDirection = current === direction ? null : direction;

    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== projectId) return p;
        let up = p.upvotes;
        if (current === "up") up--;
        if (nextVote === "up") up++;
        return { ...p, upvotes: up };
      });
      saveProjects(updated);
      return updated;
    });

    setVotes((prev) => {
      const next = { ...prev, [projectId]: nextVote };
      saveProjectVotes(next);
      return next;
    });
  }

  function handleRate(projectId: string, stars: number) {
    const previous = ratings[projectId];

    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== projectId) return p;
        let sum = p.ratingSum;
        let count = p.ratingCount;
        if (previous) {
          sum -= previous;
        } else {
          count++;
        }
        sum += stars;
        return { ...p, ratingSum: sum, ratingCount: count };
      });
      saveProjects(updated);
      return updated;
    });

    setRatings((prev) => {
      const next = { ...prev, [projectId]: stars };
      saveProjectRatings(next);
      return next;
    });
  }

  function handleSubmitProject(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.description.trim()) return;

    const project: CommunityProject = {
      id: `cp-user-${Date.now()}`,
      title: draft.title.trim(),
      description: draft.description.trim(),
      author: "You",
      repoUrl: draft.repoUrl.trim() || undefined,
      demoUrl: draft.demoUrl.trim() || undefined,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      ratingSum: 0,
      ratingCount: 0,
    };

    const updated = [project, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setDraft({ title: "", description: "", repoUrl: "", demoUrl: "", tags: "" });
    setShowSubmit(false);
  }

  const sorted = [...projects].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Showcase complex builds and rate community projects.
          </p>
        </div>
        <Button onClick={() => setShowSubmit(!showSubmit)}>
          <Plus className="h-4 w-4" />
          Submit project
        </Button>
      </div>

      {showSubmit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submit your project</CardTitle>
            <CardDescription>
              Share a complex project you built for interview prep or learning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProject} className="flex flex-col gap-3">
              <Input
                placeholder="Project title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Describe what you built and why it's impressive..."
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
                required
                rows={4}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Input
                placeholder="GitHub URL (optional)"
                value={draft.repoUrl}
                onChange={(e) =>
                  setDraft({ ...draft, repoUrl: e.target.value })
                }
              />
              <Input
                placeholder="Demo URL (optional)"
                value={draft.demoUrl}
                onChange={(e) =>
                  setDraft({ ...draft, demoUrl: e.target.value })
                }
              />
              <Input
                placeholder="Tags (comma-separated, e.g. Rust, Kafka, Docker)"
                value={draft.tags}
                onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit">Submit</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmit(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {sorted.map((project) => (
          <Card key={project.id} className="transition-shadow hover:shadow-md">
            <CardContent className="flex gap-4 pt-6">
              <VoteControls
                score={project.upvotes}
                userVote={votes[project.id] ?? null}
                onVote={(dir) => handleVote(project.id, dir)}
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">{project.title}</CardTitle>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">
                  by {project.author} ·{" "}
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <CardDescription className="line-clamp-3">
                  {project.description}
                </CardDescription>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <StarRating
                    value={averageRating(project)}
                    userRating={ratings[project.id]}
                    onRate={(stars) => handleRate(project.id, stars)}
                  />
                  <div className="flex gap-2">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        <Github className="h-3.5 w-3.5" />
                        Repo
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
