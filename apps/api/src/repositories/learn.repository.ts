import { db } from "../db/db";

export async function findLearnArticle(category: string, slug: string) {
  const article = await db
    .selectFrom("learn_articles")
    .selectAll()
    .where("category_slug", "=", category)
    .where("slug", "=", slug)
    .executeTakeFirst();

  if (!article) return null;

  const cat = await db
    .selectFrom("categories")
    .select("label")
    .where("slug", "=", category)
    .executeTakeFirst();

  const words = article.content.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(3, Math.ceil(words / 200));

  return {
    slug: article.slug,
    title: article.title,
    authorName: article.author_name,
    categorySlug: article.category_slug,
    categoryTitle: cat?.label || article.category_slug,
    sectionTitle: article.section_title,
    content: article.content,
    locked: article.locked,
    readTimeMinutes,
  };
}
