import { CodeBlock } from "@/components/CodeBlock";
import { getCodingQuestion } from "@/lib/coding-questions";
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

export default async function CodingQuestionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = getCodingQuestion(slug);

  if (!question) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="link"
        className="w-fit px-0"
        render={<Link href="/practice/coding" />}
      >
        ← Back to Coding Practice
      </Button>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">{question.categoryLabel}</Badge>
          <Badge variant="outline" className="capitalize">
            {question.difficulty}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold">{question.title}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Problem</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {question.prompt}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {question.solutionExplanation}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Solution</CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden p-0">
          <CodeBlock code={question.solutionCode} language={question.language} />
        </CardContent>
      </Card>
    </div>
  );
}
