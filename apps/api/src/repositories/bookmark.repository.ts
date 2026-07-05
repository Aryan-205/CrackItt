import { db } from "../db/db";

export async function findUserBookmarks(userId: string) {
  const list = await db
    .selectFrom("blog_bookmarks")
    .select("blog_id as blogId")
    .where("user_id", "=", userId)
    .execute();
  return list.map((b) => b.blogId);
}

export async function toggleBookmark(userId: string, blogId: string) {
  const existing = await db
    .selectFrom("blog_bookmarks")
    .selectAll()
    .where("user_id", "=", userId)
    .where("blog_id", "=", blogId)
    .executeTakeFirst();

  if (existing) {
    await db
      .deleteFrom("blog_bookmarks")
      .where("user_id", "=", userId)
      .where("blog_id", "=", blogId)
      .execute();
    return { bookmarked: false };
  } else {
    await db
      .insertInto("blog_bookmarks")
      .values({
        user_id: userId,
        blog_id: blogId,
      })
      .execute();
    return { bookmarked: true };
  }
}
