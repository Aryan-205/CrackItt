import { getQuestion } from "../../../../lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <Button
        variant="link"
        className="w-fit px-0"
        render={<Link href="/practice" />}
      >
        ← Back to Practice
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
          <CardTitle>Question</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {question.prompt}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {question.solution}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
