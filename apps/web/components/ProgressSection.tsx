"use client";

import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { useState } from "react";
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

const steps = [
  {
    title: "Understand what to expect",
    description:
      "Learn the format, timing, and what interviewers look for in each round.",
    tasks: [
      "Read 'What is the system design interview?'",
      "Watch the intro tutorial",
    ],
  },
  {
    title: "Master core concepts",
    description:
      "Study scalability, caching, databases, and API design fundamentals.",
    tasks: [
      "Complete caching deep dive",
      "Practice 3 system design questions",
    ],
  },
  {
    title: "Practice with real questions",
    description:
      "Work through frontend, backend, and full stack interview questions.",
    tasks: ["Solve 5 frontend questions", "Solve 5 backend questions"],
  },
];

export function ProgressSection() {
  const [expanded, setExpanded] = useState(0);
  const completed = 0;
  const total = steps.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Design Interview Readiness</CardTitle>
          <Badge variant="secondary">{percent}% completed</Badge>
        </div>
        <Progress value={percent} className="mt-2" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <Card key={step.title} size="sm">
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-3 p-4"
              onClick={() => setExpanded(expanded === i ? -1 : i)}
            >
              <Badge className="h-6 w-6 shrink-0 justify-center rounded-full p-0">
                {i + 1}
              </Badge>
              <span className="flex-1 text-left font-medium">{step.title}</span>
              {expanded === i ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            {expanded === i && (
              <>
                <Separator />
                <CardContent>
                  <CardDescription className="mb-3">
                    {step.description}
                  </CardDescription>
                  <ul className="flex flex-col gap-2">
                    {step.tasks.map((task) => (
                      <li
                        key={task}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
