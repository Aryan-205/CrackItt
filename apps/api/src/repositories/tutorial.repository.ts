import { db } from "../db/db";

export async function findTutorials() {
  return db
    .selectFrom("tutorials")
    .innerJoin("categories", "categories.id", "tutorials.category_id")
    .select([
      "tutorials.id",
      "tutorials.title",
      "tutorials.slug",
      "tutorials.description",
      "tutorials.video_url as videoUrl",
      "tutorials.category_id as categoryId",
      "categories.slug as categorySlug",
      "categories.label as categoryLabel",
      "tutorials.tag",
      "tutorials.published_at as publishedAt",
    ])
    .orderBy("tutorials.published_at", "desc")
    .execute();
}

export async function findTutorialBySlug(slug: string) {
  return db
    .selectFrom("tutorials")
    .innerJoin("categories", "categories.id", "tutorials.category_id")
    .select([
      "tutorials.id",
      "tutorials.title",
      "tutorials.slug",
      "tutorials.description",
      "tutorials.video_url as videoUrl",
      "tutorials.category_id as categoryId",
      "categories.slug as categorySlug",
      "categories.label as categoryLabel",
      "tutorials.tag",
      "tutorials.published_at as publishedAt",
    ])
    .where("tutorials.slug", "=", slug)
    .executeTakeFirst();
}
