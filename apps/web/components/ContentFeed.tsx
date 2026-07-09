import type { DashboardFeedItem } from "@repo/types";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ContentFeed({
  items,
  scrollable = false,
}: {
  items: DashboardFeedItem[];
  scrollable?: boolean;
}) {
  return (
    <Card
      className={cn(
        scrollable && "flex min-h-0 flex-1 flex-col overflow-hidden",
      )}
    >
      <CardHeader className={cn(scrollable && "shrink-0")}>
        <CardTitle className="text-sm">Newly Released</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "flex flex-col gap-3",
          scrollable && "min-h-0 flex-1 overflow-y-auto",
        )}
      >
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground">Nothing new right now.</p>
        )}
        {items.map((item) => (
          <Link
            key={item.id}
            href={
              item.type === "blog"
                ? `/community/blog/${item.slug}`
                : `/tutorials`
            }
            className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Card
              size="sm"
              className="transition-[box-shadow,border-color] duration-200 ease-out-strong hover:border-primary/30 hover:shadow-md"
            >
              <CardContent>
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {item.tag}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(item.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <CardTitle className="text-sm leading-snug">
                  {item.title}
                </CardTitle>
                <CardDescription className="mt-1 line-clamp-2 text-xs">
                  {item.description}
                </CardDescription>
                {item.author && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {item.author}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
