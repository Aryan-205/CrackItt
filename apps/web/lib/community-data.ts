export interface CommunityAnswer {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  body: string;
  author: string;
  tag: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  answers: CommunityAnswer[];
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
}

export interface UserBlogDraft {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tag: string;
  slug: string;
  publishedAt: string;
}

export const INITIAL_COMMUNITY_QUESTIONS: CommunityQuestion[] = [
  {
    id: "cq-1",
    title: "How do you prepare for system design interviews in 2 weeks?",
    body: "I have a Google onsite coming up and only two weeks left. What's the most efficient way to cover the essentials — caching, load balancing, databases — without getting overwhelmed?",
    author: "Priya K.",
    tag: "System Design",
    createdAt: "2026-06-28T10:00:00Z",
    upvotes: 42,
    downvotes: 3,
    answers: [
      {
        id: "ca-1",
        author: "Alex M.",
        content:
          "Focus on 5 core patterns: URL shortener, chat, news feed, rate limiter, and file storage. Draw each one end-to-end twice — once with a tutor, once solo. That covers 80% of what you'll see.",
        createdAt: "2026-06-28T14:30:00Z",
        upvotes: 18,
      },
      {
        id: "ca-2",
        author: "Jordan L.",
        content:
          "Don't skip the trade-off discussion. Interviewers care more about why you chose Redis over Memcached than whether you drew every box perfectly.",
        createdAt: "2026-06-29T09:15:00Z",
        upvotes: 11,
      },
    ],
  },
  {
    id: "cq-2",
    title: "Best way to explain React reconciliation to an interviewer?",
    body: "I understand the concept but struggle to explain it clearly under pressure. Any frameworks or analogies that have worked for you?",
    author: "Sam R.",
    tag: "Frontend",
    createdAt: "2026-06-27T08:00:00Z",
    upvotes: 28,
    downvotes: 1,
    answers: [
      {
        id: "ca-3",
        author: "Morgan T.",
        content:
          "Use the 'diffing a shopping list' analogy: React compares the old list to the new one and only updates the items that changed, not the whole page.",
        createdAt: "2026-06-27T12:00:00Z",
        upvotes: 22,
      },
    ],
  },
  {
    id: "cq-3",
    title: "Should I mention my side projects in behavioral rounds?",
    body: "I built a real-time collaboration tool with 200 users. Is that worth bringing up for 'tell me about a challenging project' questions, or does it seem too small?",
    author: "Chris W.",
    tag: "Behavioral",
    createdAt: "2026-06-26T16:45:00Z",
    upvotes: 15,
    downvotes: 0,
    answers: [],
  },
  {
    id: "cq-4",
    title: "How to handle 'design a payment system' with no fintech background?",
    body: "Got this question in a mock interview and froze. What are the minimum concepts I need to know about idempotency, double-charging, and PCI compliance?",
    author: "Taylor N.",
    tag: "System Design",
    createdAt: "2026-06-25T11:20:00Z",
    upvotes: 37,
    downvotes: 2,
    answers: [
      {
        id: "ca-4",
        author: "Riley P.",
        content:
          "Start with idempotency keys — that's the single most important concept. Explain that every payment request gets a unique key so retries never double-charge. PCI compliance you can hand-wave to 'we tokenize card data and never store raw PANs.'",
        createdAt: "2026-06-25T15:00:00Z",
        upvotes: 29,
      },
    ],
  },
  {
    id: "cq-5",
    title: "GraphQL vs REST — what do backend interviewers actually want to hear?",
    body: "Every guide says 'it depends' but I need a concrete answer structure. How do you frame the trade-offs without sounding like you're reading a blog post?",
    author: "Jamie H.",
    tag: "Backend",
    createdAt: "2026-06-24T09:30:00Z",
    upvotes: 21,
    downvotes: 4,
    answers: [],
  },
];

export const INITIAL_COMMUNITY_PROJECTS: CommunityProject[] = [
  {
    id: "cp-1",
    title: "Distributed Task Scheduler",
    description:
      "A fault-tolerant job scheduler with leader election, retry policies, and a web dashboard. Handles 10k jobs/min across 5 worker nodes.",
    author: "Alex M.",
    repoUrl: "https://github.com",
    demoUrl: "https://example.com",
    tags: ["Go", "Redis", "PostgreSQL", "Docker"],
    createdAt: "2026-06-20T10:00:00Z",
    upvotes: 89,
    ratingSum: 42,
    ratingCount: 10,
  },
  {
    id: "cp-2",
    title: "Real-time Collaborative Whiteboard",
    description:
      "Multiplayer drawing canvas with CRDT-based conflict resolution, cursor presence, and export to SVG. Built for 50+ concurrent users per room.",
    author: "Priya K.",
    repoUrl: "https://github.com",
    tags: ["TypeScript", "WebSockets", "CRDT", "Canvas API"],
    createdAt: "2026-06-18T14:00:00Z",
    upvotes: 67,
    ratingSum: 38,
    ratingCount: 9,
  },
  {
    id: "cp-3",
    title: "ML-Powered Code Review Bot",
    description:
      "GitHub Action that analyzes PRs for security vulnerabilities, performance anti-patterns, and style violations using fine-tuned LLM prompts.",
    author: "Jordan L.",
    repoUrl: "https://github.com",
    demoUrl: "https://example.com",
    tags: ["Python", "GitHub Actions", "OpenAI", "AST Parsing"],
    createdAt: "2026-06-15T09:00:00Z",
    upvotes: 54,
    ratingSum: 31,
    ratingCount: 8,
  },
  {
    id: "cp-4",
    title: "Event-Sourced E-commerce Platform",
    description:
      "Full CQRS/ES architecture with saga orchestration for order fulfillment, inventory management, and payment processing across microservices.",
    author: "Morgan T.",
    tags: ["Java", "Kafka", "EventStore", "Kubernetes"],
    createdAt: "2026-06-12T11:00:00Z",
    upvotes: 43,
    ratingSum: 27,
    ratingCount: 7,
  },
  {
    id: "cp-5",
    title: "Low-Latency Order Matching Engine",
    description:
      "Financial order book with price-time priority matching, sub-millisecond latency using lock-free data structures and memory-mapped I/O.",
    author: "Riley P.",
    repoUrl: "https://github.com",
    tags: ["Rust", "Lock-free", "Finance", "Benchmarking"],
    createdAt: "2026-06-10T16:00:00Z",
    upvotes: 76,
    ratingSum: 35,
    ratingCount: 9,
  },
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function averageRating(project: CommunityProject): number {
  if (project.ratingCount === 0) return 0;
  return project.ratingSum / project.ratingCount;
}
