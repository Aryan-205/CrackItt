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

export function ContentFeed({ items }: { items: DashboardFeedItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Newly Released</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={
              item.type === "blog" ? `/community/${item.slug}` : `/tutorials`
            }
          >
            <Card size="sm" className="transition-shadow hover:shadow-md">
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
