import type { Question } from "@repo/types";
import Link from "next/link";

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export function QuestionCard({ question }: { question: Question }) {
  return (
    <Link
      href={`/practice/${question.slug}`}
      className="block rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {question.categoryLabel}
        </span>
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${
            difficultyColors[question.difficulty]
          }`}
        >
          {question.difficulty}
        </span>
      </div>
      <h3 className="font-medium">{question.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{question.prompt}</p>
    </Link>
  );
}
