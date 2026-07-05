"use client";

import { ChevronDown, ChevronRight, Circle, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUserCompletions } from "@/lib/api";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { cn } from "@/lib/utils";

export function ProgressSection() {
  const [expanded, setExpanded] = useState(0);
  const [completions, setCompletions] = useState<{ itemId: string; itemType: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserCompletions(DEMO_USER_ID)
      .then((data) => {
        setCompletions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading completions: ", err);
        setLoading(false);
      });
  }, []);

  // Define tasks and their completion conditions
  const steps = [
    {
      title: "Understand what to expect",
      description: "Learn the format, timing, and what interviewers look for in each round.",
      tasks: [
        {
          label: "Read 'What is the system design interview?' (Introduction)",
          isCompleted: completions.some((c) => c.itemId === "la-system-design-introduction"),
        },
        {
          label: "Read 'How to Prepare'",
          isCompleted: completions.some((c) => c.itemId === "la-system-design-how-to-prepare"),
        },
      ],
    },
    {
      title: "Master core concepts",
      description: "Study scalability, caching, databases, and API design fundamentals.",
      tasks: [
        {
          label: "Complete caching deep dive lesson",
          isCompleted: completions.some((c) => c.itemId === "la-system-design-caching"),
        },
        {
          label: "Practice at least 2 coding/interview questions in total",
          isCompleted: completions.filter((c) => c.itemType === "question" || c.itemType === "coding_question").length >= 2,
        },
      ],
    },
    {
      title: "Practice with real questions",
      description: "Work through frontend, backend, and full stack interview questions.",
      tasks: [
        {
          label: "Solve a frontend question (e.g. Debounced Search or Event Loop)",
          isCompleted: completions.some((c) => c.itemId === "q-1" || c.itemId === "q-4" || c.itemId === "cq-5"),
        },
        {
          label: "Solve a backend question (e.g. Rate Limiter or REST vs GraphQL)",
          isCompleted: completions.some((c) => c.itemId === "q-2" || c.itemId === "q-6" || c.itemId === "cq-2"),
        },
      ],
    },
  ];

  const totalTasks = steps.flatMap((s) => s.tasks).length;
  const completedTasks = steps.flatMap((s) => s.tasks).filter((t) => t.isCompleted).length;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card className="border-border/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Design Interview Readiness</CardTitle>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Badge variant="secondary" className="transition-all duration-300 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {percent}% completed
            </Badge>
          )}
        </div>
        <Progress value={percent} className="mt-2 h-2 transition-all duration-500" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {steps.map((step, i) => {
          const stepCompletedCount = step.tasks.filter((t) => t.isCompleted).length;
          const stepTotalCount = step.tasks.length;
          const isStepDone = stepCompletedCount === stepTotalCount;

          return (
            <Card key={step.title} size="sm" className="border-border/60 transition-all duration-300 hover:border-border">
              <Button
                variant="ghost"
                className="h-auto w-full justify-start gap-3 p-4 active:scale-[0.99] transition-transform duration-100"
                onClick={() => setExpanded(expanded === i ? -1 : i)}
              >
                <Badge
                  className={cn(
                    "h-6 w-6 shrink-0 justify-center rounded-full p-0 transition-colors duration-300",
                    isStepDone
                      ? "bg-emerald-600 text-white"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {i + 1}
                </Badge>
                <span className="flex-1 text-left font-medium">{step.title}</span>
                <span className="text-xs text-muted-foreground mr-2">
                  {stepCompletedCount}/{stepTotalCount}
                </span>
                {expanded === i ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              {expanded === i && (
                <>
                  <Separator />
                  <CardContent className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <CardDescription className="mb-3 leading-relaxed">
                      {step.description}
                    </CardDescription>
                    <ul className="flex flex-col gap-2">
                      {step.tasks.map((task) => (
                        <li
                          key={task.label}
                          className="flex items-center gap-2 text-sm transition-all"
                        >
                          {task.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 animate-in zoom-in duration-200" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                          )}
                          <span className={cn(task.isCompleted && "text-muted-foreground line-through")}>
                            {task.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </>
              )}
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
