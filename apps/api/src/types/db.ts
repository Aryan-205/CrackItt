import type { ColumnType } from "kysely";

export interface Database {
  users: UsersTable;
  categories: CategoriesTable;
  questions: QuestionsTable;
  blog_posts: BlogPostsTable;
  tutorials: TutorialsTable;
  streaks: StreaksTable;
  streak_log: StreakLogTable;
  projects: ProjectsTable;
  project_votes: ProjectVotesTable;
  project_ratings: ProjectRatingsTable;
  coding_questions: CodingQuestionsTable;
  learn_articles: LearnArticlesTable;
  user_completions: UserCompletionsTable;
  blog_bookmarks: BlogBookmarksTable;
  community_questions: CommunityQuestionsTable;
  community_answers: CommunityAnswersTable;
  community_question_votes: CommunityQuestionVotesTable;
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

export interface ProjectsTable {
  id: string;
  title: string;
  description: string;
  author: string;
  repo_url: string | null;
  demo_url: string | null;
  tags: string[];
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface ProjectVotesTable {
  project_id: string;
  user_id: string;
  direction: "up" | "down";
}

export interface ProjectRatingsTable {
  project_id: string;
  user_id: string;
  rating: number;
}

export interface CodingQuestionsTable {
  id: string;
  title: string;
  slug: string;
  category_label: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  solution_explanation: string;
  solution_code: string;
  language: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface LearnArticlesTable {
  id: string;
  slug: string;
  category_slug: string;
  section_title: string;
  title: string;
  content: string;
  author_name: string;
  locked: boolean;
  published_at: ColumnType<Date, string | undefined, never>;
}

export interface UserCompletionsTable {
  user_id: string;
  item_id: string;
  item_type: string;
  completed_at: ColumnType<Date, string | undefined, never>;
}

export interface BlogBookmarksTable {
  user_id: string;
  blog_id: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface CommunityQuestionsTable {
  id: string;
  title: string;
  body: string;
  author: string;
  tags: string[];
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface CommunityAnswersTable {
  id: string;
  question_id: string;
  author: string;
  content: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface CommunityQuestionVotesTable {
  question_id: string;
  user_id: string;
  direction: "up" | "down";
}
