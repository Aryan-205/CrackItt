import { BookOpen, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

export function QuickActionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Link
        href="#"
        className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-yellow-100 p-2">
            <Star className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-medium">Purchase Premium</p>
            <p className="text-xs text-muted">Coming soon</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted" />
      </Link>

      <Link
        href="/practice"
        className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Browse Interview Questions</p>
            <p className="text-xs text-muted">Frontend, backend & full stack</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted" />
      </Link>
    </div>
  );
}
