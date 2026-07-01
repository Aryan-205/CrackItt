export type CategorySlug =
  | "system-design"
  | "frontend"
  | "backend"
  | "fullstack"
  | "behavioral";

export interface Category {
  id: string;
  slug: CategorySlug;
  label: string;
}

export interface Question {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categorySlug: CategorySlug;
  categoryLabel: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  solution: string;
  isPremium: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tag: string;
  publishedAt: string;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  categoryId: string;
  categorySlug: CategorySlug;
  categoryLabel: string;
  tag: string;
  publishedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface StreakLogEntry {
  date: string;
  active: boolean;
}

export interface Streak {
  userId: string;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  weeklyLog: StreakLogEntry[];
}

export interface DashboardFeedItem {
  id: string;
  type: "blog" | "tutorial";
  title: string;
  slug: string;
  description: string;
  tag: string;
  author?: string;
  publishedAt: string;
}
