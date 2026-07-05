import { db } from "../db/db";

export async function findCommunityQuestions(userId: string) {
  const list = await db
    .selectFrom("community_questions")
    .selectAll()
    .orderBy("created_at", "desc")
    .execute();

  const result = [];
  for (const q of list) {
    const votes = await db
      .selectFrom("community_question_votes")
      .select(["direction", "user_id"])
      .where("question_id", "=", q.id)
      .execute();
    const upvotes = votes.filter((v) => v.direction === "up").length;
    const downvotes = votes.filter((v) => v.direction === "down").length;

    const userVote = votes.find((v) => v.user_id === userId)?.direction || null;

    const dbAnswers = await db
      .selectFrom("community_answers")
      .selectAll()
      .where("question_id", "=", q.id)
      .orderBy("created_at", "asc")
      .execute();

    const answers = dbAnswers.map((a) => ({
      id: a.id,
      questionId: a.question_id,
      author: a.author,
      content: a.content,
      createdAt: a.created_at.toISOString(),
    }));

    result.push({
      id: q.id,
      title: q.title,
      body: q.body,
      author: q.author,
      tags: q.tags,
      createdAt: q.created_at.toISOString(),
      upvotes,
      downvotes,
      answers,
      userVote,
    });
  }

  return result;
}

export async function findCommunityQuestionById(questionId: string, userId: string) {
  const q = await db
    .selectFrom("community_questions")
    .selectAll()
    .where("id", "=", questionId)
    .executeTakeFirst();

  if (!q) return null;

  const votes = await db
    .selectFrom("community_question_votes")
    .select(["direction", "user_id"])
    .where("question_id", "=", q.id)
    .execute();
  const upvotes = votes.filter((v) => v.direction === "up").length;
  const downvotes = votes.filter((v) => v.direction === "down").length;

  const userVote = votes.find((v) => v.user_id === userId)?.direction || null;

  const dbAnswers = await db
    .selectFrom("community_answers")
    .selectAll()
    .where("question_id", "=", q.id)
    .orderBy("created_at", "asc")
    .execute();

  const answers = dbAnswers.map((a) => ({
    id: a.id,
    questionId: a.question_id,
    author: a.author,
    content: a.content,
    createdAt: a.created_at.toISOString(),
  }));

  return {
    id: q.id,
    title: q.title,
    body: q.body,
    author: q.author,
    tags: q.tags,
    createdAt: q.created_at.toISOString(),
    upvotes,
    downvotes,
    answers,
    userVote,
  };
}

export async function createCommunityQuestion(data: {
  id: string;
  title: string;
  body: string;
  author: string;
  tags: string[];
}) {
  return db
    .insertInto("community_questions")
    .values({
      id: data.id,
      title: data.title,
      body: data.body,
      author: data.author,
      tags: data.tags,
    })
    .execute();
}

export async function createCommunityAnswer(data: {
  id: string;
  questionId: string;
  author: string;
  content: string;
}) {
  return db
    .insertInto("community_answers")
    .values({
      id: data.id,
      question_id: data.questionId,
      author: data.author,
      content: data.content,
    })
    .execute();
}

export async function voteCommunityQuestion(
  questionId: string,
  userId: string,
  direction: "up" | "down" | null
) {
  if (!direction) {
    return db
      .deleteFrom("community_question_votes")
      .where("question_id", "=", questionId)
      .where("user_id", "=", userId)
      .execute();
  }

  const existing = await db
    .selectFrom("community_question_votes")
    .selectAll()
    .where("question_id", "=", questionId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (existing) {
    return db
      .updateTable("community_question_votes")
      .set({ direction })
      .where("question_id", "=", questionId)
      .where("user_id", "=", userId)
      .execute();
  }

  return db
    .insertInto("community_question_votes")
    .values({
      question_id: questionId,
      user_id: userId,
      direction,
    })
    .execute();
}
