import { getBlog } from "../../../../lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="flex max-w-3xl flex-col gap-6">
      <Button
        variant="link"
        className="w-fit px-0"
        render={<Link href="/community" />}
      >
        ← Back to Community
      </Button>
      <div>
        <Badge variant="secondary">{post.tag}</Badge>
        <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          By {post.author} ·{" "}
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <article className="leading-relaxed text-muted-foreground">
            {post.content}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
