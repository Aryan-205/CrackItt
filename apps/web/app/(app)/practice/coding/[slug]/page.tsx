import { SolutionReveal } from "@/components/SolutionReveal";
import { getCodingQuestion, getUserCompletions } from "@/lib/api";
import { DEMO_USER_ID } from "@/lib/demo-user";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompletionButton } from "@/components/CompletionButton";

export default async function CodingQuestionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let question;
  let completions: { itemId: string; itemType: string }[] = [];
  
  try {
    const [qData, compData] = await Promise.all([
      getCodingQuestion(slug),
      getUserCompletions(DEMO_USER_ID),
    ]);
    question = qData;
    completions = compData;
  } catch {
    notFound();
  }

  if (!question) notFound();

  const initialCompleted = completions.some(
    (c) => c.itemId === question.id && c.itemType === "coding_question"
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="link"
          className="w-fit px-0 active:scale-[0.97] transition-all"
          render={<Link href="/practice/coding" />}
        >
          ← Back to Coding Practice
        </Button>
        <CompletionButton
          itemId={question.id}
          itemType="coding_question"
          initialCompleted={initialCompleted}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">{question.categoryLabel}</Badge>
          <Badge variant="outline" className="capitalize">
            {question.difficulty}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold">{question.title}</h1>
      </div>
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle>Problem</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {question.prompt}
          </p>
        </CardContent>
      </Card>
      <SolutionReveal
        explanation={question.solutionExplanation}
        code={question.solutionCode}
        language={question.language}
      />
    </div>
  );
}
