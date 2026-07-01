import type { Tutorial } from "@repo/types";
import { PlayCircle } from "lucide-react";

export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="relative aspect-video bg-gray-900">
        <iframe
          src={tutorial.videoUrl}
          title={tutorial.title}
          className="h-full w-full"
          allowFullScreen
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <PlayCircle className="h-12 w-12 text-white opacity-80" />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
            {tutorial.tag}
          </span>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {tutorial.categoryLabel}
          </span>
        </div>
        <h3 className="font-medium">{tutorial.title}</h3>
        <p className="mt-1 text-sm text-muted">{tutorial.description}</p>
        <p className="mt-2 text-xs text-muted">
          {new Date(tutorial.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
