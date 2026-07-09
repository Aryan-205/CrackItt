import { getLearnCurriculum } from "./learn-data";

/**
 * Article bodies come from the API (`learn_articles`, populated from the
 * Obsidian vault). Only the navigation shape lives client-side.
 */
export function getFirstLessonSlug(category: string): string | null {
  const curriculum = getLearnCurriculum(category);
  if (!curriculum) return null;

  for (const section of curriculum.sections) {
    const unlocked = section.lessons.find((lesson) => !lesson.locked);
    if (unlocked) return unlocked.id;
  }

  return curriculum.sections[0]?.lessons[0]?.id ?? null;
}
