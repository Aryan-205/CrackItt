import type { CategorySlug } from "@repo/types";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Clock,
  LayoutGrid,
  MapPin,
} from "lucide-react";

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
  categorySlug: CategorySlug;
  title: string;
  sections: LearnSection[];
};

const systemDesignCurriculum: LearnCurriculum = {
  categorySlug: "system-design",
  title: "System Design",
  sections: [
    {
      id: "in-a-hurry",
      title: "In a Hurry",
      icon: Clock,
      defaultOpen: true,
      lessons: [
        { id: "introduction", title: "Introduction", completed: true },
        { id: "how-to-prepare", title: "How to Prepare", completed: true },
        { id: "delivery-framework", title: "Delivery Framework", completed: true },
      ],
    },
    {
      id: "core-concepts",
      title: "Core Concepts",
      icon: BookOpen,
      lessons: [
        { id: "networking-basics", title: "Networking Basics", completed: true },
        { id: "api-design", title: "API Design", completed: true },
        { id: "caching", title: "Caching", completed: true },
        { id: "databases", title: "Databases", completed: true },
        { id: "load-balancing", title: "Load Balancing", completed: true },
      ],
    },
    {
      id: "question-breakdowns",
      title: "Question Breakdowns",
      icon: MapPin,
      lessons: [
        { id: "url-shortener", title: "URL Shortener", completed: true },
        { id: "chat-system", title: "Chat System", completed: true },
        { id: "news-feed", title: "News Feed", completed: true },
        { id: "rate-limiter", title: "Rate Limiter", completed: true },
      ],
    },
    {
      id: "patterns",
      title: "Patterns",
      icon: LayoutGrid,
      defaultOpen: true,
      lessons: [
        { id: "real-time-updates", title: "Real-time Updates", completed: true, locked: true },
        { id: "contention", title: "Contention", completed: true, locked: true },
        { id: "multi-step-processes", title: "Multi-step Processes", completed: true, locked: true },
        { id: "scalability", title: "Scalability", completed: true, locked: true },
        { id: "handling-large-blobs", title: "Handling Large Blobs", completed: true, locked: true },
      ],
    },
  ],
};

function makeCurriculum(
  categorySlug: CategorySlug,
  title: string,
  sections: Array<Omit<LearnSection, "icon"> & { icon?: LucideIcon }>,
): LearnCurriculum {
  return {
    categorySlug,
    title,
    sections: sections.map((section, index) => ({
      ...section,
      icon: section.icon ?? (index === 0 ? Clock : BookOpen),
      defaultOpen: section.defaultOpen ?? index === 0,
    })),
  };
}

export const learnCurricula: Record<CategorySlug, LearnCurriculum> = {
  "system-design": systemDesignCurriculum,
  frontend: makeCurriculum("frontend", "Frontend", [
    {
      id: "in-a-hurry",
      title: "In a Hurry",
      icon: Clock,
      defaultOpen: true,
      lessons: [
        { id: "introduction", title: "Introduction", completed: true },
        { id: "interview-format", title: "Interview Format", completed: true },
        { id: "study-plan", title: "Study Plan", completed: true },
      ],
    },
    {
      id: "core-concepts",
      title: "Core Concepts",
      icon: BookOpen,
      lessons: [
        { id: "react-fundamentals", title: "React Fundamentals", completed: true },
        { id: "state-management", title: "State Management", completed: true },
        { id: "performance", title: "Performance", completed: true },
        { id: "accessibility", title: "Accessibility", completed: true },
      ],
    },
    {
      id: "question-breakdowns",
      title: "Question Breakdowns",
      icon: MapPin,
      lessons: [
        { id: "debounced-search", title: "Debounced Search", completed: true },
        { id: "infinite-scroll", title: "Infinite Scroll", completed: true },
        { id: "component-library", title: "Build a Component Library", completed: true },
      ],
    },
    {
      id: "patterns",
      title: "Patterns",
      icon: LayoutGrid,
      defaultOpen: true,
      lessons: [
        { id: "compound-components", title: "Compound Components", completed: true, locked: true },
        { id: "render-props", title: "Render Props", completed: true, locked: true },
        { id: "custom-hooks", title: "Custom Hooks", completed: true, locked: true },
      ],
    },
  ]),
  backend: makeCurriculum("backend", "Backend", [
    {
      id: "in-a-hurry",
      title: "In a Hurry",
      icon: Clock,
      defaultOpen: true,
      lessons: [
        { id: "introduction", title: "Introduction", completed: true },
        { id: "how-to-prepare", title: "How to Prepare", completed: true },
        { id: "api-patterns", title: "Common API Patterns", completed: true },
      ],
    },
    {
      id: "core-concepts",
      title: "Core Concepts",
      icon: BookOpen,
      lessons: [
        { id: "rest-apis", title: "REST APIs", completed: true },
        { id: "authentication", title: "Authentication", completed: true },
        { id: "caching", title: "Caching", completed: true },
        { id: "message-queues", title: "Message Queues", completed: true },
      ],
    },
    {
      id: "question-breakdowns",
      title: "Question Breakdowns",
      icon: MapPin,
      lessons: [
        { id: "rate-limiter", title: "Rate Limiter", completed: true },
        { id: "notification-system", title: "Notification System", completed: true },
      ],
    },
    {
      id: "patterns",
      title: "Patterns",
      icon: LayoutGrid,
      defaultOpen: true,
      lessons: [
        { id: "idempotency", title: "Idempotency", completed: true, locked: true },
        { id: "event-sourcing", title: "Event Sourcing", completed: true, locked: true },
        { id: "cqrs", title: "CQRS", completed: true, locked: true },
      ],
    },
  ]),
  fullstack: makeCurriculum("fullstack", "Full Stack", [
    {
      id: "in-a-hurry",
      title: "In a Hurry",
      icon: Clock,
      defaultOpen: true,
      lessons: [
        { id: "introduction", title: "Introduction", completed: true },
        { id: "fullstack-roadmap", title: "Full Stack Roadmap", completed: true },
      ],
    },
    {
      id: "core-concepts",
      title: "Core Concepts",
      icon: BookOpen,
      lessons: [
        { id: "client-server", title: "Client-Server Architecture", completed: true },
        { id: "data-modeling", title: "Data Modeling", completed: true },
        { id: "deployment", title: "Deployment", completed: true },
      ],
    },
    {
      id: "question-breakdowns",
      title: "Question Breakdowns",
      icon: MapPin,
      lessons: [
        { id: "todo-app", title: "Todo App with Auth", completed: true },
        { id: "e-commerce", title: "E-commerce Checkout", completed: true },
      ],
    },
    {
      id: "patterns",
      title: "Patterns",
      icon: LayoutGrid,
      defaultOpen: true,
      lessons: [
        { id: "optimistic-updates", title: "Optimistic Updates", completed: true, locked: true },
        { id: "real-time-sync", title: "Real-time Sync", completed: true, locked: true },
      ],
    },
  ]),
  behavioral: makeCurriculum("behavioral", "Behavioral", [
    {
      id: "in-a-hurry",
      title: "In a Hurry",
      icon: Clock,
      defaultOpen: true,
      lessons: [
        { id: "introduction", title: "Introduction", completed: true },
        { id: "star-method", title: "STAR Method", completed: true },
        { id: "common-questions", title: "Common Questions", completed: true },
      ],
    },
    {
      id: "core-concepts",
      title: "Core Concepts",
      icon: BookOpen,
      lessons: [
        { id: "leadership", title: "Leadership", completed: true },
        { id: "conflict-resolution", title: "Conflict Resolution", completed: true },
        { id: "failure-stories", title: "Failure Stories", completed: true },
      ],
    },
    {
      id: "question-breakdowns",
      title: "Question Breakdowns",
      icon: MapPin,
      lessons: [
        { id: "tell-me-about-yourself", title: "Tell Me About Yourself", completed: true },
        { id: "why-this-company", title: "Why This Company?", completed: true },
      ],
    },
    {
      id: "patterns",
      title: "Patterns",
      icon: LayoutGrid,
      defaultOpen: true,
      lessons: [
        { id: "influence-without-authority", title: "Influence Without Authority", completed: true, locked: true },
        { id: "cross-team-collab", title: "Cross-team Collaboration", completed: true, locked: true },
      ],
    },
  ]),
};

export function getLearnCurriculum(category: string): LearnCurriculum | null {
  if (category in learnCurricula) {
    return learnCurricula[category as CategorySlug];
  }
  return null;
}
