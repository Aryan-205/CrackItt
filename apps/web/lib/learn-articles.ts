import type { CategorySlug } from "@repo/types";
import {
  getLearnCurriculum,
  type LearnCurriculum,
  type LearnLesson,
  type LearnSection,
} from "./learn-data";

export type LearnArticle = {
  slug: string;
  title: string;
  categorySlug: CategorySlug;
  categoryTitle: string;
  sectionTitle: string;
  content: string;
  locked?: boolean;
  readTimeMinutes: number;
};

const customArticles: Record<string, string> = {
  "system-design/introduction": `System design interviews test your ability to architect large-scale distributed systems under real-world constraints. Unlike coding rounds, there is rarely a single correct answer — interviewers care about how you think, communicate trade-offs, and iterate on a design.

## What interviewers evaluate

- **Requirements gathering** — Can you clarify functional and non-functional requirements before jumping into boxes and arrows?
- **High-level design** — Can you propose a reasonable architecture that meets the stated goals?
- **Deep dives** — Can you zoom into bottlenecks (database, caching, consistency) when prompted?
- **Trade-offs** — Do you explain why you chose one approach over another?

## How this track is organized

Work through **In a Hurry** first if your interview is soon. **Core Concepts** builds the vocabulary you'll use in every answer. **Question Breakdowns** walks through full designs for common prompts. **Patterns** covers reusable techniques you'll apply across problems.

Take notes as you read. The best preparation is active — sketch each design on paper after reading the breakdown.`,

  "system-design/how-to-prepare": `Two weeks is enough to get interview-ready if you focus on depth over breadth. The goal is not to memorize every system ever built — it is to build a repeatable framework you can apply to any prompt.

## Week 1: Foundations

Days 1–2: Read Core Concepts (networking, APIs, caching, databases, load balancing). Draw each concept as a simple diagram.

Days 3–4: Complete two Question Breakdowns end-to-end. Time yourself — 45 minutes per design, then compare with the solution.

Days 5–7: Redo one breakdown from scratch without notes. Record yourself explaining it out loud.

## Week 2: Patterns and polish

Days 8–10: Study the Patterns section. For each pattern, name one system where it applies.

Days 11–12: Mock interviews with a peer. Alternate interviewer and candidate roles.

Days 13–14: Review weak areas only. Sleep well before the interview.

## Daily habits

- **One design per day** — even 30 minutes counts
- **Speak out loud** — interviews are verbal; reading silently is not enough
- **Time-box deep dives** — spend 5 minutes per component, then move on`,

  "system-design/delivery-framework": `Use this 45-minute framework in every system design interview. Interviewers at top companies expect a structured approach — not a stream of consciousness.

## Minutes 0–5: Clarify requirements

Ask about scale (users, QPS, data size), latency expectations, consistency requirements, and which features are in scope vs. out of scope. Write requirements on the board.

**Example questions:**
- How many daily active users?
- Read-heavy or write-heavy?
- Is strong consistency required?

## Minutes 5–15: High-level design

Draw the main components: clients, load balancer, API servers, databases, caches, queues. Walk through the happy-path request flow. Do not over-detail yet.

## Minutes 15–35: Deep dives

The interviewer will steer you here. Common topics: database schema, sharding, caching strategy, handling hot keys, fan-out for feeds, idempotency.

## Minutes 35–45: Wrap up

Summarize bottlenecks and how you'd scale further. Mention monitoring, alerting, and what you'd prototype first.

## Pro tips

- **Think out loud** — silence makes interviewers nervous
- **Start simple** — add complexity only when asked
- **Name trade-offs** — "I'd use Redis here for speed, but we'd need a cache invalidation strategy"`,

  "system-design/real-time-updates": `Real-time updates are a premium pattern covering WebSockets, Server-Sent Events, and polling fallbacks. This lesson is part of Crackitt Premium.

## What you'll learn

- When to use WebSockets vs. SSE vs. long polling
- Connection management at scale (sticky sessions, pub/sub backplanes)
- Handling reconnects, missed messages, and ordering guarantees
- Designing a notification or live-feed system end-to-end

Upgrade to Premium to unlock this lesson and the full Patterns library.`,
};

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}

function buildTemplateContent(
  lesson: LearnLesson,
  section: LearnSection,
  curriculum: LearnCurriculum,
): string {
  return `This lesson covers **${lesson.title}** as part of the ${section.title} module in the ${curriculum.title} interview prep track.

## Why this matters

${lesson.title} comes up frequently in ${curriculum.title.toLowerCase()} interviews — either as a direct question or as a building block in a larger design. Understanding it deeply helps you speak confidently about trade-offs and edge cases.

## Key ideas

- Start with the problem this concept solves before describing the solution
- Connect it to related topics in ${section.title}
- Practice explaining it in under two minutes out loud

## What to do next

After reading, try explaining ${lesson.title} without looking at your notes. Then move to the next lesson in ${section.title}, or jump to a related Question Breakdown to see it applied in a full system design.`;
}

export function findLesson(
  category: string,
  slug: string,
): {
  lesson: LearnLesson;
  section: LearnSection;
  curriculum: LearnCurriculum;
} | null {
  const curriculum = getLearnCurriculum(category);
  if (!curriculum) return null;

  for (const section of curriculum.sections) {
    const lesson = section.lessons.find((l) => l.id === slug);
    if (lesson) return { lesson, section, curriculum };
  }
  return null;
}

export function getFirstLessonSlug(category: string): string | null {
  const curriculum = getLearnCurriculum(category);
  if (!curriculum) return null;

  for (const section of curriculum.sections) {
    const unlocked = section.lessons.find((l) => !l.locked);
    if (unlocked) return unlocked.id;
  }

  return curriculum.sections[0]?.lessons[0]?.id ?? null;
}

export function getLearnArticle(
  category: string,
  slug: string,
): LearnArticle | null {
  const found = findLesson(category, slug);
  if (!found) return null;

  const { lesson, section, curriculum } = found;
  const key = `${curriculum.categorySlug}/${lesson.id}`;
  const content =
    customArticles[key] ?? buildTemplateContent(lesson, section, curriculum);

  return {
    slug: lesson.id,
    title: lesson.title,
    categorySlug: curriculum.categorySlug,
    categoryTitle: curriculum.title,
    sectionTitle: section.title,
    content,
    locked: lesson.locked,
    readTimeMinutes: estimateReadTime(content),
  };
}
