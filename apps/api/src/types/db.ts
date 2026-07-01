import type { ColumnType } from "kysely";

export interface Database {
  users: UsersTable;
  categories: CategoriesTable;
  questions: QuestionsTable;
  blog_posts: BlogPostsTable;
  tutorials: TutorialsTable;
  streaks: StreaksTable;
  streak_log: StreakLogTable;
}

export interface UsersTable {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface CategoriesTable {
  id: string;
  slug: string;
  label: string;
}

export interface QuestionsTable {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  solution: string;
  is_premium: boolean;
}

export interface BlogPostsTable {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tag: string;
  published_at: ColumnType<Date, string | undefined, never>;
}

export interface TutorialsTable {
  id: string;
  title: string;
  slug: string;
  description: string;
  video_url: string;
  category_id: string;
  tag: string;
  published_at: ColumnType<Date, string | undefined, never>;
}

export interface StreaksTable {
  user_id: string;
  current_streak: number;
  best_streak: number;
  last_active_date: string | null;
}

export interface StreakLogTable {
  user_id: string;
  date: string;
}
