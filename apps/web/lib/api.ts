import type {
  BlogPost,
  DashboardFeedItem,
  Question,
  Streak,
  Tutorial,
  User,
} from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    next: { revalidate: 30 },
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
