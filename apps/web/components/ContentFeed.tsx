import type { DashboardFeedItem } from "@repo/types";
import Link from "next/link";

const tagColors: Record<string, string> = {
  "System Design": "bg-orange-100 text-orange-700",
  "Deep Dive": "bg-red-100 text-red-700",
  "Video Added": "bg-red-100 text-red-700",
  Backend: "bg-blue-100 text-blue-700",
  Community: "bg-green-100 text-green-700",
};

export function ContentFeed({ items }: { items: DashboardFeedItem[] }) {
  return (
    <div className="rounded-xl border border-border bg-card-muted p-4">
      <h3 className="mb-3 text-sm font-semibold">Newly Released</h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={
              item.type === "blog"
                ? `/community/${item.slug}`
                : `/tutorials`
            }
            className="rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-sm"
          >
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                  tagColors[item.tag] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {item.tag}
              </span>
              <span className="text-[10px] text-muted">
                {new Date(item.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-sm font-medium leading-snug">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted">
              {item.description}
            </p>
            {item.author && (
              <p className="mt-1 text-[10px] text-muted">{item.author}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
