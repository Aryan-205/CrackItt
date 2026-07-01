import { db } from "../db/db";

export async function findBlogPosts() {
  return db
    .selectFrom("blog_posts")
    .select([
      "id",
      "title",
      "slug",
      "excerpt",
      "content",
      "author",
      "tag",
      "published_at as publishedAt",
    ])
    .orderBy("published_at", "desc")
    .execute();
}

export async function findBlogBySlug(slug: string) {
  return db
    .selectFrom("blog_posts")
    .select([
      "id",
      "title",
      "slug",
      "excerpt",
      "content",
      "author",
      "tag",
      "published_at as publishedAt",
    ])
    .where("slug", "=", slug)
    .executeTakeFirst();
}
