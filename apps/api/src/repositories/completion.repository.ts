import { db } from "../db/db";

export async function findUserCompletions(userId: string) {
  const list = await db
    .selectFrom("user_completions")
    .select(["item_id as itemId", "item_type as itemType"])
    .where("user_id", "=", userId)
    .execute();
  return list;
}

export async function toggleCompletion(userId: string, itemId: string, itemType: string) {
  const existing = await db
    .selectFrom("user_completions")
    .selectAll()
    .where("user_id", "=", userId)
    .where("item_id", "=", itemId)
    .where("item_type", "=", itemType)
    .executeTakeFirst();

  if (existing) {
    await db
      .deleteFrom("user_completions")
      .where("user_id", "=", userId)
      .where("item_id", "=", itemId)
      .where("item_type", "=", itemType)
      .execute();
    return { completed: false };
  } else {
    await db
      .insertInto("user_completions")
      .values({
        user_id: userId,
        item_id: itemId,
        item_type: itemType,
      })
      .execute();
    return { completed: true };
  }
}
