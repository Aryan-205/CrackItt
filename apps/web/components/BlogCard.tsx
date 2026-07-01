import type { BlogPost } from "@repo/types";
import Link from "next/link";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/community/${post.slug}`}
      className="block rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          {post.tag}
        </span>
        <span className="text-xs text-muted">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <h3 className="font-medium">{post.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
      <p className="mt-2 text-xs text-muted">By {post.author}</p>
    </Link>
  );
}
