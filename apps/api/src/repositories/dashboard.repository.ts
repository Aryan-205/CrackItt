import { db } from "../db/db";

export async function findUserById(id: string) {
  return db
    .selectFrom("users")
    .select([
      "id",
      "name",
      "email",
      "avatar_url as avatarUrl",
      "created_at as createdAt",
    ])
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function getDashboardFeed() {
  const blogs = await db
    .selectFrom("blog_posts")
    .select([
      "id",
      "title",
      "slug",
      "excerpt as description",
      "tag",
      "author",
      "published_at as publishedAt",
    ])
    .orderBy("published_at", "desc")
    .limit(3)
    .execute();

  const tutorials = await db
    .selectFrom("tutorials")
    .select([
      "id",
      "title",
      "slug",
      "description",
      "tag",
      "published_at as publishedAt",
    ])
    .orderBy("published_at", "desc")
    .limit(3)
    .execute();

  const feed = [
    ...blogs.map((b) => ({
      id: b.id,
      type: "blog" as const,
      title: b.title,
      slug: b.slug,
      description: b.description,
      tag: b.tag,
      author: b.author,
      publishedAt: b.publishedAt,
    })),
    ...tutorials.map((t) => ({
      id: t.id,
      type: "tutorial" as const,
      title: t.title,
      slug: t.slug,
      description: t.description,
      tag: t.tag,
      publishedAt: t.publishedAt,
    })),
  ];

  feed.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return feed.slice(0, 5);
}
