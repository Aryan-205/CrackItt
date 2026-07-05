import { db } from "../db/db";

export async function findProjects(userId: string) {
  const list = await db
    .selectFrom("projects")
    .selectAll()
    .orderBy("created_at", "desc")
    .execute();

  const result = [];
  for (const proj of list) {
    const votes = await db
      .selectFrom("project_votes")
      .select("direction")
      .where("project_id", "=", proj.id)
      .execute();
    const upvotes = votes.filter((v) => v.direction === "up").length;

    const ratings = await db
      .selectFrom("project_ratings")
      .select("rating")
      .where("project_id", "=", proj.id)
      .execute();
    const ratingSum = ratings.reduce((sum, r) => sum + r.rating, 0);
    const ratingCount = ratings.length;

    const userVote = await db
      .selectFrom("project_votes")
      .select("direction")
      .where("project_id", "=", proj.id)
      .where("user_id", "=", userId)
      .executeTakeFirst();

    const userRating = await db
      .selectFrom("project_ratings")
      .select("rating")
      .where("project_id", "=", proj.id)
      .where("user_id", "=", userId)
      .executeTakeFirst();

    result.push({
      id: proj.id,
      title: proj.title,
      description: proj.description,
      author: proj.author,
      repoUrl: proj.repo_url ?? undefined,
      demoUrl: proj.demo_url ?? undefined,
      tags: proj.tags,
      createdAt: proj.created_at.toISOString(),
      upvotes,
      ratingSum,
      ratingCount,
      userVote: userVote?.direction ?? null,
      userRating: userRating?.rating ?? null,
    });
  }

  return result;
}

export async function findProjectById(projectId: string, userId: string) {
  const proj = await db
    .selectFrom("projects")
    .selectAll()
    .where("id", "=", projectId)
    .executeTakeFirst();

  if (!proj) return null;

  const votes = await db
    .selectFrom("project_votes")
    .select("direction")
    .where("project_id", "=", proj.id)
    .execute();
  const upvotes = votes.filter((v) => v.direction === "up").length;

  const ratings = await db
    .selectFrom("project_ratings")
    .select("rating")
    .where("project_id", "=", proj.id)
    .execute();
  const ratingSum = ratings.reduce((sum, r) => sum + r.rating, 0);
  const ratingCount = ratings.length;

  const userVote = await db
    .selectFrom("project_votes")
    .select("direction")
    .where("project_id", "=", proj.id)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  const userRating = await db
    .selectFrom("project_ratings")
    .select("rating")
    .where("project_id", "=", proj.id)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  return {
    id: proj.id,
    title: proj.title,
    description: proj.description,
    author: proj.author,
    repoUrl: proj.repo_url ?? undefined,
    demoUrl: proj.demo_url ?? undefined,
    tags: proj.tags,
    createdAt: proj.created_at.toISOString(),
    upvotes,
    ratingSum,
    ratingCount,
    userVote: userVote?.direction ?? null,
    userRating: userRating?.rating ?? null,
  };
}

export async function createProject(data: {
  id: string;
  title: string;
  description: string;
  author: string;
  repoUrl?: string;
  demoUrl?: string;
  tags: string[];
}) {
  return db
    .insertInto("projects")
    .values({
      id: data.id,
      title: data.title,
      description: data.description,
      author: data.author,
      repo_url: data.repoUrl ?? null,
      demo_url: data.demoUrl ?? null,
      tags: data.tags,
    })
    .execute();
}

export async function voteProject(projectId: string, userId: string, direction: "up" | "down" | null) {
  if (!direction) {
    return db
      .deleteFrom("project_votes")
      .where("project_id", "=", projectId)
      .where("user_id", "=", userId)
      .execute();
  }

  const existing = await db
    .selectFrom("project_votes")
    .selectAll()
    .where("project_id", "=", projectId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (existing) {
    return db
      .updateTable("project_votes")
      .set({ direction })
      .where("project_id", "=", projectId)
      .where("user_id", "=", userId)
      .execute();
  }

  return db
    .insertInto("project_votes")
    .values({
      project_id: projectId,
      user_id: userId,
      direction,
    })
    .execute();
}

export async function rateProject(projectId: string, userId: string, rating: number) {
  const existing = await db
    .selectFrom("project_ratings")
    .selectAll()
    .where("project_id", "=", projectId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (existing) {
    return db
      .updateTable("project_ratings")
      .set({ rating })
      .where("project_id", "=", projectId)
      .where("user_id", "=", userId)
      .execute();
  }

  return db
    .insertInto("project_ratings")
    .values({
      project_id: projectId,
      user_id: userId,
      rating,
    })
    .execute();
}

export async function findUniqueProjectTags() {
  const allProjects = await db.selectFrom("projects").select("tags").execute();
  const allTags = new Set<string>();
  for (const p of allProjects) {
    for (const t of p.tags) {
      allTags.add(t);
    }
  }
  return Array.from(allTags).sort();
}
