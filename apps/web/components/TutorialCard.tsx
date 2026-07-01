import type { Tutorial } from "@repo/types";
import { PlayCircle } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <iframe
          src={tutorial.videoUrl}
          title={tutorial.title}
          className="h-full w-full"
          allowFullScreen
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <PlayCircle className="h-12 w-12 text-primary-foreground opacity-90" />
        </div>
      </div>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge>{tutorial.tag}</Badge>
          <Badge variant="secondary">{tutorial.categoryLabel}</Badge>
        </div>
        <CardTitle className="text-base">{tutorial.title}</CardTitle>
        <CardDescription>{tutorial.description}</CardDescription>
        <p className="text-xs text-muted-foreground">
          {new Date(tutorial.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </CardHeader>
    </Card>
  );
}
