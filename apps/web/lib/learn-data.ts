import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Clapperboard,
  Database,
  Gauge,
  LayoutGrid,
  MapPin,
  Network,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import curriculumJson from "./learn-curriculum.generated.json";

/**
 * The Learn curriculum is generated from the Obsidian vault by
 * `pnpm --filter api import-vault`. Edit the vault or that script's manifest —
 * not this file's data.
 */

/** Learn only covers the categories the vault actually has content for. */
export type LearnCategorySlug = keyof typeof curriculumJson;

export type LearnLesson = {
  id: string;
  title: string;
  completed?: boolean;
  locked?: boolean;
};

export type LearnSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  lessons: LearnLesson[];
};

export type LearnCurriculum = {
  categorySlug: LearnCategorySlug;
  title: string;
  sections: LearnSection[];
};

const SECTION_ICONS: Record<string, LucideIcon> = {
  roadmap: MapPin,
  foundations: BookOpen,
  databases: Database,
  "caching-performance": Zap,
  "scaling-reliability": Network,
  architecture: LayoutGrid,
  "auth-security": ShieldCheck,
  "protocols-realtime": Radio,
  observability: Activity,
  "media-delivery": Clapperboard,
  ai: Sparkles,
  performance: Gauge,
};

export const learnCategories = Object.keys(curriculumJson) as LearnCategorySlug[];

export const learnCurricula: Record<LearnCategorySlug, LearnCurriculum> =
  Object.fromEntries(
    Object.entries(curriculumJson).map(([slug, category]) => [
      slug,
      {
        categorySlug: slug as LearnCategorySlug,
        title: category.title,
        sections: category.sections.map((section, index) => ({
          id: section.id,
          title: section.title,
          icon: SECTION_ICONS[section.id] ?? BookOpen,
          defaultOpen: index === 0,
          lessons: section.lessons,
        })),
      },
    ]),
  ) as Record<LearnCategorySlug, LearnCurriculum>;

export function isLearnCategory(category: string): category is LearnCategorySlug {
  return category in curriculumJson;
}

export function getLearnCurriculum(category: string): LearnCurriculum | null {
  return isLearnCategory(category) ? learnCurricula[category] : null;
}

export const learnCategoryLabels: Record<LearnCategorySlug, string> =
  Object.fromEntries(
    Object.entries(curriculumJson).map(([slug, c]) => [slug, c.title]),
  ) as Record<LearnCategorySlug, string>;
