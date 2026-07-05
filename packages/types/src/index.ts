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

export interface CommunityAnswer {
  id: string;
  questionId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  body: string;
  author: string;
  tags: string[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
  answers: CommunityAnswer[];
  userVote?: "up" | "down" | null;
}

export interface CommunityProject {
  id: string;
  title: string;
  description: string;
  author: string;
  repoUrl?: string;
  demoUrl?: string;
  tags: string[];
  createdAt: string;
  upvotes: number;
  ratingSum: number;
  ratingCount: number;
  userVote?: "up" | "down" | null;
  userRating?: number | null;
}

export interface CodingQuestion {
  id: string;
  title: string;
  slug: string;
  categoryLabel: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  solutionExplanation: string;
  solutionCode: string;
  language: string;
}

export interface LearnArticle {
  slug: string;
  title: string;
  authorName: string;
  categorySlug: CategorySlug;
  categoryTitle: string;
  sectionTitle: string;
  content: string;
  locked?: boolean;
  readTimeMinutes: number;
}
