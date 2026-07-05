"use client";

import { type CommunityProject } from "@repo/types";
import { ExternalLink, Filter, Github, Plus, Search, Star, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VoteControls } from "./VoteControls";
import { cn } from "@/lib/utils";
import { getProjects, voteProject, rateProject, createProject } from "@/lib/api";

const DEMO_USER_ID = "demo-user";

function averageRating(project: CommunityProject): number {
  if (project.ratingCount === 0) return 0;
  return project.ratingSum / project.ratingCount;
}

function StarRating({
  value,
  userRating,
  onRate,
}: {
  value: number;
  userRating?: number | null;
  onRate: (stars: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          className="rounded p-0.5 transition-all duration-150 hover:text-primary active:scale-[0.85]"
        >
          <Star
            className={cn(
              "h-4 w-4 transition-colors",
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
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "upvotes-desc" | "upvotes-asc"
  >("upvotes-desc");
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    repoUrl: "",
    demoUrl: "",
    tags: "",
  });

  useEffect(() => {
    getProjects(DEMO_USER_ID)
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading projects: ", err);
        setLoading(false);
      });
  }, []);

  function handleVote(projectId: string, direction: "up" | "down") {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const current = project.userVote;
    const nextVote = current === direction ? null : direction;

    voteProject(projectId, nextVote)
      .then((updated) => {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updated : p))
        );
      })
      .catch((err) => console.error("Error voting: ", err));
  }

  function handleRate(projectId: string, stars: number) {
    rateProject(projectId, stars)
      .then((updated) => {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updated : p))
        );
      })
      .catch((err) => console.error("Error rating: ", err));
  }

  function handleSubmitProject(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.description.trim()) return;

    createProject({
      title: draft.title.trim(),
      description: draft.description.trim(),
      repoUrl: draft.repoUrl.trim() || undefined,
      demoUrl: draft.demoUrl.trim() || undefined,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    })
      .then((created) => {
        setProjects((prev) => [created, ...prev]);
        setDraft({
          title: "",
          description: "",
          repoUrl: "",
          demoUrl: "",
          tags: "",
        });
        setShowSubmit(false);
      })
      .catch((err) => console.error("Error submitting project: ", err));
  }

  const filterTags = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects.flatMap((project) => project.tags))).sort(),
    ],
    [projects],
  );

  const filtered = useMemo(() => {
    let list = projects;

    if (activeTag !== "All") {
      list = list.filter((project) => project.tags.includes(activeTag));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (project) =>
          project.title.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          project.author.toLowerCase().includes(q) ||
          project.tags.some((tag) => tag.toLowerCase().includes(q)),
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
      sorted.sort((a, b) => a.upvotes - b.upvotes);
    } else {
      sorted.sort((a, b) => b.upvotes - a.upvotes);
    }

    return sorted;
  }, [activeTag, projects, search, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Showcase complex builds and rate community projects.
          </p>
        </div>
        <Button
          onClick={() => setShowSubmit(!showSubmit)}
          className="active:scale-[0.97] transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Submit project
        </Button>
      </div>

      {showSubmit && (
        <Card className="transition-all duration-300">
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
                className="focus-visible:ring-primary/20"
              />
              <textarea
                placeholder="Describe what you built and why it's impressive..."
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
                required
                rows={4}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-all focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20"
              />
              <Input
                placeholder="GitHub URL (optional)"
                value={draft.repoUrl}
                onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })}
                className="focus-visible:ring-primary/20"
              />
              <Input
                placeholder="Demo URL (optional)"
                value={draft.demoUrl}
                onChange={(e) => setDraft({ ...draft, demoUrl: e.target.value })}
                className="focus-visible:ring-primary/20"
              />
              <Input
                placeholder="Tags (comma-separated, e.g. Rust, Kafka, Docker)"
                value={draft.tags}
                onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
                className="focus-visible:ring-primary/20"
              />
              <div className="flex gap-2">
                <Button type="submit" className="active:scale-[0.97] transition-all">Submit</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmit(false)}
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
            placeholder="Search projects by title, author, description, or tags..."
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
        <Card className="animate-in fade-in slide-in-from-top-1 duration-200">
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Filter by tag
              </p>
              <div className="flex flex-wrap gap-2">
                {filterTags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    size="sm"
                    variant={activeTag === tag ? "default" : "outline"}
                    onClick={() => setActiveTag(tag)}
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
        <div className="flex flex-col gap-3">
          {filtered.map((project, index) => (
            <Card
              key={project.id}
              className="transition-all duration-300 hover:shadow-md active:scale-[0.99] border-border/80 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
            >
              <CardContent className="flex gap-4">
                <VoteControls
                  score={project.upvotes}
                  userVote={project.userVote ?? null}
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
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {project.description}
                  </CardDescription>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <StarRating
                      value={averageRating(project)}
                      userRating={project.userRating}
                      onRate={(stars) => handleRate(project.id, stars)}
                    />
                    <div className="flex gap-2">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
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
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
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
      )}
      {!loading && filtered.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-muted-foreground">
            No projects match your current search/filter.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
