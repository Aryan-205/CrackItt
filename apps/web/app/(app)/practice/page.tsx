import { Code2, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { codingQuestions } from "@/lib/coding-questions";
import { getQuestions } from "@/lib/api";

export default async function PracticePage() {
  const interviewQuestions = await getQuestions();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Practice</h1>
        <p className="mt-1 text-muted-foreground">
          Sharpen your skills with coding challenges and interview questions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/practice/coding">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-3 pt-6">
              <div className="w-fit rounded-lg bg-primary/10 p-2">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Coding Practice</CardTitle>
                <CardDescription className="mt-1">
                  Solve algorithm and frontend coding problems with syntax-highlighted
                  solutions.
                </CardDescription>
              </div>
              <p className="text-sm font-medium text-primary">
                {codingQuestions.length} questions →
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/practice/questions">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-3 pt-6">
              <div className="w-fit rounded-lg bg-accent p-2">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Interview Questions</CardTitle>
                <CardDescription className="mt-1">
                  Frontend, backend, system design, and behavioral questions with
                  detailed answers.
                </CardDescription>
              </div>
              <p className="text-sm font-medium text-primary">
                {interviewQuestions.length} questions →
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
