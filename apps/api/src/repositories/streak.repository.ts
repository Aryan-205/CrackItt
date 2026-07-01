import { db } from "../db/db";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

function getWeekDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export async function findStreak(userId: string) {
  const streak = await db
    .selectFrom("streaks")
    .select([
      "user_id as userId",
      "current_streak as currentStreak",
      "best_streak as bestStreak",
      "last_active_date as lastActiveDate",
    ])
    .where("user_id", "=", userId)
    .executeTakeFirst();

  const weekDates = getWeekDates();
  const weekDateStrings = weekDates.map((d) => formatDate(d));
  const logs = await db
    .selectFrom("streak_log")
    .select("date")
    .where("user_id", "=", userId)
    .where("date", "in", weekDateStrings)
    .execute();

  const activeDates = new Set(logs.map((l) => l.date));

  const weeklyLog = weekDates.map((date) => ({
    date: formatDate(date),
    active: activeDates.has(formatDate(date)),
  }));

  return {
    userId,
    currentStreak: streak?.currentStreak ?? 0,
    bestStreak: streak?.bestStreak ?? 0,
    lastActiveDate: streak?.lastActiveDate ?? null,
    weeklyLog,
  };
}

export async function checkIn(userId: string) {
  const today = formatDate(new Date());

  const existing = await db
    .selectFrom("streak_log")
    .select("date")
    .where("user_id", "=", userId)
    .where("date", "=", today)
    .executeTakeFirst();

  if (existing) {
    return findStreak(userId);
  }

  await db
    .insertInto("streak_log")
    .values({ user_id: userId, date: today })
    .execute();

  let streak = await db
    .selectFrom("streaks")
    .selectAll()
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!streak) {
    await db
      .insertInto("streaks")
      .values({
        user_id: userId,
        current_streak: 1,
        best_streak: 1,
        last_active_date: today,
      })
      .execute();
    return findStreak(userId);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  const lastActive = streak.last_active_date;

  let newStreak = 1;
  if (lastActive === yesterdayStr) {
    newStreak = streak.current_streak + 1;
  } else if (lastActive === today) {
    newStreak = streak.current_streak;
  }

  const newBest = Math.max(streak.best_streak, newStreak);

  await db
    .updateTable("streaks")
    .set({
      current_streak: newStreak,
      best_streak: newBest,
      last_active_date: today,
    })
    .where("user_id", "=", userId)
    .execute();

  return findStreak(userId);
}
