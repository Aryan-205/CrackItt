import { db } from "../db/db";

export async function findCodingQuestions() {
  return db
    .selectFrom("coding_questions")
    .select([
      "id",
      "title",
      "slug",
      "category_label as categoryLabel",
      "difficulty",
      "prompt",
      "solution_explanation as solutionExplanation",
      "solution_code as solutionCode",
      "language",
    ])
    .orderBy("title")
    .execute();
}

export async function findCodingQuestionBySlug(slug: string) {
  return db
    .selectFrom("coding_questions")
    .select([
      "id",
      "title",
      "slug",
      "category_label as categoryLabel",
      "difficulty",
      "prompt",
      "solution_explanation as solutionExplanation",
      "solution_code as solutionCode",
      "language",
    ])
    .where("slug", "=", slug)
    .executeTakeFirst();
}
