import { getQuestion } from "../../../../lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let question;
  try {
    question = await getQuestion(slug);
  } catch {
    notFound();
  }

  if (!question) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/practice" className="text-sm text-primary hover:underline">
        ← Back to Practice
      </Link>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {question.categoryLabel}
          </span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700">
            {question.difficulty}
          </span>
        </div>
        <h1 className="text-2xl font-bold">{question.title}</h1>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-2 font-semibold">Question</h2>
        <p className="text-muted leading-relaxed">{question.prompt}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-2 font-semibold">Solution</h2>
        <p className="text-muted leading-relaxed">{question.solution}</p>
      </div>
    </div>
  );
}
