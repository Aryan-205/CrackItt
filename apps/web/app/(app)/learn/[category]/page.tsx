import { QuestionCard } from "../../../../components/QuestionCard";
import { getQuestions } from "../../../../lib/api";
import type { CategorySlug } from "@repo/types";
import { notFound } from "next/navigation";

const categoryLabels: Record<CategorySlug, string> = {
  "system-design": "System Design",
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full Stack",
  behavioral: "Behavioral",
};

export default async function LearnCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!(category in categoryLabels)) {
    notFound();
  }

  const label = categoryLabels[category as CategorySlug];
  const questions = await getQuestions(category);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{label}</h1>
        <p className="mt-1 text-muted-foreground">
          Learn and practice {label.toLowerCase()} interview questions.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
      {questions.length === 0 && (
        <p className="text-muted-foreground">No questions in this category yet.</p>
      )}
    </div>
  );
}
