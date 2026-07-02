"use client";

import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface PracticeListItem {
  id: string;
  title: string;
  slug: string;
  categoryLabel: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
}

export function PracticeSection({
  questions,
  basePath,
  title,
  description,
  searchPlaceholder = "Search questions...",
}: {
  questions: PracticeListItem[];
  basePath: string;
  title: string;
  description: string;
  searchPlaceholder?: string;
}) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");

  const categoryFilters = useMemo(
    () =>
      ["All", ...Array.from(new Set(questions.map((q) => q.categoryLabel))).sort()],
    [questions],
  );

  const filtered = useMemo(() => {
    let list = questions;

    if (activeCategory !== "All") {
      list = list.filter((q) => q.categoryLabel === activeCategory);
    }

    if (activeDifficulty !== "All") {
      list = list.filter((q) => q.difficulty === activeDifficulty);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.prompt.toLowerCase().includes(query) ||
          q.categoryLabel.toLowerCase().includes(query) ||
          q.difficulty.toLowerCase().includes(query),
      );
    }

    return list;
  }, [activeCategory, activeDifficulty, questions, search]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
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
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    size="sm"
                    variant={activeCategory === category ? "default" : "outline"}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Difficulty
              </p>
              <div className="flex flex-wrap gap-2">
                {["All", "easy", "medium", "hard"].map((difficulty) => (
                  <Button
                    key={difficulty}
                    type="button"
                    size="sm"
                    variant={activeDifficulty === difficulty ? "default" : "outline"}
                    onClick={() => setActiveDifficulty(difficulty)}
                    className="capitalize"
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No questions match your current search/filter.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((q) => (
            <QuestionCard key={q.id} question={q} basePath={basePath} />
          ))}
        </div>
      )}
    </div>
  );
}
