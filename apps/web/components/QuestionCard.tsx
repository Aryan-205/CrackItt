import type { PracticeListItem } from "./PracticeSection";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const difficultyVariant = {
  easy: "secondary" as const,
  medium: "outline" as const,
  hard: "destructive" as const,
};

export function QuestionCard({
  question,
  basePath,
}: {
  question: PracticeListItem;
  basePath: string;
}) {
  return (
    <Link href={`${basePath}/${question.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{question.categoryLabel}</Badge>
            <Badge variant={difficultyVariant[question.difficulty]}>
              {question.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-base">{question.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {question.prompt}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
