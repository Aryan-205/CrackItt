import { getBlog } from "../../../../lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlog(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link href="/community" className="text-sm text-primary hover:underline">
        ← Back to Community
      </Link>
      <div>
        <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          {post.tag}
        </span>
        <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-muted">
          By {post.author} ·{" "}
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <article className="prose prose-sm max-w-none leading-relaxed text-muted">
        {post.content}
      </article>
    </div>
  );
}
