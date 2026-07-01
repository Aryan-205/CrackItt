import type { CategorySlug } from "@repo/types";
import { db } from "../db/db";

export async function findQuestions(category?: string) {
  let query = db
    .selectFrom("questions")
    .innerJoin("categories", "categories.id", "questions.category_id")
    .select([
      "questions.id",
      "questions.title",
      "questions.slug",
      "questions.category_id as categoryId",
      "categories.slug as categorySlug",
      "categories.label as categoryLabel",
      "questions.difficulty",
      "questions.prompt",
      "questions.solution",
      "questions.is_premium as isPremium",
    ]);

  if (category) {
    query = query.where("categories.slug", "=", category);
  }

  return query.orderBy("questions.title").execute();
}

export async function findQuestionBySlug(slug: string) {
  return db
    .selectFrom("questions")
    .innerJoin("categories", "categories.id", "questions.category_id")
    .select([
      "questions.id",
      "questions.title",
      "questions.slug",
      "questions.category_id as categoryId",
      "categories.slug as categorySlug",
      "categories.label as categoryLabel",
      "questions.difficulty",
      "questions.prompt",
      "questions.solution",
      "questions.is_premium as isPremium",
    ])
    .where("questions.slug", "=", slug)
    .executeTakeFirst();
}

export async function findCategories() {
  return db
    .selectFrom("categories")
    .selectAll()
    .orderBy("label")
    .execute();
}

export async function findCategoryBySlug(slug: CategorySlug) {
  return db
    .selectFrom("categories")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirst();
}
