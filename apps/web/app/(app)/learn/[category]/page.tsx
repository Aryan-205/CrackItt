import { getFirstLessonSlug } from "@/lib/learn-articles";
import type { CategorySlug } from "@repo/types";
import { notFound, redirect } from "next/navigation";

const categoryLabels: Record<CategorySlug, string> = {
  "system-design": "System Design",
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full Stack",
  behavioral: "Behavioral",
};

export default async function LearnCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!(category in categoryLabels)) {
    notFound();
  }

  const firstLesson = getFirstLessonSlug(category);
  if (firstLesson) {
    redirect(`/learn/${category}/${firstLesson}`);
  }

  notFound();
}
