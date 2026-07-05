import { LearnArticleView } from "@/components/LearnArticleView";
import { getLearnArticle, getUserCompletions } from "@/lib/api";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { notFound } from "next/navigation";

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  
  let article;
  let completions: { itemId: string; itemType: string }[] = [];
  try {
    const [articleData, compData] = await Promise.all([
      getLearnArticle(category, slug),
      getUserCompletions(DEMO_USER_ID),
    ]);
    article = articleData;
    completions = compData;
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  const initialCompleted = completions.some(
    (c) => c.itemId === `la-${category}-${slug}` && c.itemType === "learn_article"
  );

  return <LearnArticleView article={article} initialCompleted={initialCompleted} />;
}
