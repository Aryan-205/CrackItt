"use client";

import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { useState } from "react";

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
    tasks: [
      "Solve 5 frontend questions",
      "Solve 5 backend questions",
    ],
  },
];

export function ProgressSection() {
  const [expanded, setExpanded] = useState(0);
  const completed = 0;
  const total = steps.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          System Design Interview Readiness
        </h2>
        <span className="text-sm text-muted">{percent}% completed</span>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-card-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setExpanded(expanded === i ? -1 : i)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span className="flex-1 font-medium">{step.title}</span>
              {expanded === i ? (
                <ChevronDown className="h-4 w-4 text-muted" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted" />
              )}
            </button>
            {expanded === i && (
              <div className="border-t border-border px-4 pb-4 pt-2">
                <p className="mb-3 text-sm text-muted">{step.description}</p>
                <ul className="flex flex-col gap-2">
                  {step.tasks.map((task) => (
                    <li
                      key={task}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Circle className="h-4 w-4 text-muted" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
