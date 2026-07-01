import type { BlogPost } from "@repo/types";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/community/${post.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{post.tag}</Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <CardTitle className="text-base">{post.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {post.excerpt}
          </CardDescription>
          <p className="text-xs text-muted-foreground">By {post.author}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}
