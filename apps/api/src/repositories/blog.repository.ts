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

export async function createBlogPost(data: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tag: string;
}) {
  return db
    .insertInto("blog_posts")
    .values({
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      tag: data.tag,
    })
    .execute();
}
