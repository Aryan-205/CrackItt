import { getFirstLessonSlug } from "@/lib/learn-articles";
import { isLearnCategory } from "@/lib/learn-data";
import { notFound, redirect } from "next/navigation";

export default async function LearnCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!isLearnCategory(category)) {
    notFound();
  }

  const firstLesson = getFirstLessonSlug(category);
  if (firstLesson) {
    redirect(`/learn/${category}/${firstLesson}`);
  }

  notFound();
}
