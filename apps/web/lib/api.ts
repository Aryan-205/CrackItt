import type {
  BlogPost,
  DashboardFeedItem,
  Question,
  Streak,
  Tutorial,
  User,
  CodingQuestion,
  LearnArticle,
  CommunityProject,
  CommunityQuestion,
} from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    next: { revalidate: 0 }, // set to 0 for instant updates / no Next.js cache during testing
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export function getQuestions(category?: string) {
  const query = category ? `?category=${category}` : "";
  return fetchApi<Question[]>(`/questions${query}`);
}

export function getQuestion(slug: string) {
  return fetchApi<Question>(`/questions/${slug}`);
}

export function getBlogs() {
  return fetchApi<BlogPost[]>("/blogs");
}

export function getBlog(slug: string) {
  return fetchApi<BlogPost>(`/blogs/${slug}`);
}

export function createBlog(blog: {
  title: string;
  content: string;
  tag: string;
  excerpt: string;
  author: string;
}) {
  return fetch(`${API_URL}/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to create blog");
    return res.json() as Promise<BlogPost>;
  });
}

export function getTutorials() {
  return fetchApi<Tutorial[]>("/tutorials");
}

export function getStreak(userId: string) {
  return fetchApi<Streak>(`/streaks/${userId}`);
}

export function checkInStreak(userId: string) {
  return fetch(`${API_URL}/streaks/${userId}/check-in`, {
    method: "POST",
  }).then((res) => res.json() as Promise<Streak>);
}

export function getDashboardFeed() {
  return fetchApi<DashboardFeedItem[]>("/dashboard/feed");
}

export function getUser(userId: string) {
  return fetchApi<User>(`/dashboard/users/${userId}`);
}

// New API functions

export function getCodingQuestions() {
  return fetchApi<CodingQuestion[]>("/coding-questions");
}

export function getCodingQuestion(slug: string) {
  return fetchApi<CodingQuestion>(`/coding-questions/${slug}`);
}

export function getLearnArticle(category: string, slug: string) {
  return fetchApi<LearnArticle>(`/learn/${category}/${slug}`);
}

export function getUserCompletions(userId: string) {
  return fetchApi<{ itemId: string; itemType: string }[]>(`/completions/${userId}`);
}

export function toggleUserCompletion(userId: string, itemId: string, itemType: string) {
  return fetch(`${API_URL}/completions/${userId}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, itemType }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to toggle completion");
    return res.json() as Promise<{ completed: boolean }>;
  });
}

export function getProjects(userId: string) {
  return fetchApi<CommunityProject[]>(`/projects?userId=${userId}`);
}

export function createProject(project: {
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  tags: string[];
}) {
  return fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to create project");
    return res.json() as Promise<CommunityProject>;
  });
}

export function voteProject(projectId: string, direction: "up" | "down" | null) {
  return fetch(`${API_URL}/projects/${projectId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to vote project");
    return res.json() as Promise<CommunityProject>;
  });
}

export function rateProject(projectId: string, rating: number) {
  return fetch(`${API_URL}/projects/${projectId}/rate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to rate project");
    return res.json() as Promise<CommunityProject>;
  });
}

export function getBookmarkedBlogs(userId: string) {
  return fetchApi<string[]>(`/blogs/bookmarks/${userId}`);
}

export function toggleBlogBookmark(blogId: string, userId: string) {
  return fetch(`${API_URL}/blogs/${blogId}/bookmark/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to toggle bookmark");
    return res.json() as Promise<{ bookmarked: boolean }>;
  });
}

export function getCommunityQuestions(userId: string) {
  return fetchApi<CommunityQuestion[]>(`/community/forum?userId=${userId}`);
}

export function createCommunityQuestion(question: {
  title: string;
  body: string;
  tags: string[];
  author: string;
}) {
  return fetch(`${API_URL}/community/forum`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to create question");
    return res.json() as Promise<CommunityQuestion>;
  });
}

export function voteCommunityQuestion(questionId: string, direction: "up" | "down" | null, userId: string) {
  return fetch(`${API_URL}/community/forum/${questionId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction, userId }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to vote question");
    return res.json() as Promise<CommunityQuestion>;
  });
}

export function submitCommunityAnswer(questionId: string, content: string, author: string) {
  return fetch(`${API_URL}/community/forum/${questionId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, author }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to submit answer");
    return res.json() as Promise<CommunityQuestion>;
  });
}
