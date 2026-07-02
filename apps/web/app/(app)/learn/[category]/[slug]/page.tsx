import { LearnArticleView } from "@/components/LearnArticleView";
import { getLearnArticle } from "@/lib/learn-articles";
import { notFound } from "next/navigation";

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = getLearnArticle(category, slug);

  if (!article) {
    notFound();
  }

  return <LearnArticleView article={article} />;
}
