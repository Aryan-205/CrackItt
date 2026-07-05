import "dotenv/config";
import { db } from "./db";

const DEMO_USER_ID = "demo-user";

const categories = [
  { id: "cat-system-design", slug: "system-design", label: "System Design" },
  { id: "cat-frontend", slug: "frontend", label: "Frontend" },
  { id: "cat-backend", slug: "backend", label: "Backend" },
  { id: "cat-fullstack", slug: "fullstack", label: "Full Stack" },
  { id: "cat-behavioral", slug: "behavioral", label: "Behavioral" },
];

const questions = [
  {
    id: "q-1",
    title: "Implement a Debounced Search Input",
    slug: "debounced-search-input",
    category_id: "cat-frontend",
    difficulty: "medium" as const,
    prompt:
      "Build a search input that debounces API calls by 300ms. Explain your approach and handle edge cases like rapid typing and component unmount.",
    solution:
      "Use useRef for the timeout ID and useEffect cleanup. On each keystroke, clear the previous timeout and set a new one. On unmount, clear pending timeout. Consider using AbortController to cancel in-flight requests.",
    is_premium: false,
  },
  {
    id: "q-2",
    title: "Design a Rate Limiter Middleware",
    slug: "rate-limiter-middleware",
    category_id: "cat-backend",
    difficulty: "hard" as const,
    prompt:
      "Implement a sliding window rate limiter middleware for an Express API. Support configurable limits per IP.",
    solution:
      "Store request timestamps per IP in Redis or in-memory Map. On each request, remove timestamps outside the window, check count against limit, return 429 if exceeded. For production, use Redis with sorted sets.",
    is_premium: false,
  },
  {
    id: "q-3",
    title: "Build a Todo App with Optimistic Updates",
    slug: "todo-optimistic-updates",
    category_id: "cat-fullstack",
    difficulty: "medium" as const,
    prompt:
      "Create a full-stack todo app where toggling completion uses optimistic UI updates with rollback on failure.",
    solution:
      "On toggle, immediately update local state, fire PATCH request. On error, revert state and show toast. Use React Query or SWR for built-in optimistic update patterns.",
    is_premium: false,
  },
  {
    id: "q-4",
    title: "Explain Event Loop and Microtasks",
    slug: "event-loop-microtasks",
    category_id: "cat-frontend",
    difficulty: "easy" as const,
    prompt:
      "What is the JavaScript event loop? Explain the order of execution for setTimeout, Promise.then, and synchronous code.",
    solution:
      "Call stack runs sync code first. Microtask queue (promises) drains after each macrotask. setTimeout goes to macrotask queue. Order: sync → microtasks → macrotask → microtasks → ...",
    is_premium: false,
  },
  {
    id: "q-5",
    title: "Design URL Shortener",
    slug: "url-shortener",
    category_id: "cat-system-design",
    difficulty: "hard" as const,
    prompt:
      "Design a URL shortening service like bit.ly. Cover API design, storage, encoding, and scaling.",
    solution:
      "Base62 encode auto-increment ID or hash. Store mapping in DB with cache layer (Redis). Use read replicas for redirects. Consider custom aliases and analytics.",
    is_premium: false,
  },
  {
    id: "q-6",
    title: "REST vs GraphQL Trade-offs",
    slug: "rest-vs-graphql",
    category_id: "cat-backend",
    difficulty: "medium" as const,
    prompt:
      "When would you choose REST over GraphQL and vice versa? Give concrete examples.",
    solution:
      "REST: simple CRUD, caching via HTTP, public APIs. GraphQL: complex nested data, mobile clients needing flexible queries, reducing over-fetching. GraphQL adds complexity in caching and auth.",
    is_premium: false,
  },
  {
    id: "q-7",
    title: "Tell Me About a Conflict You Resolved",
    slug: "conflict-resolution-behavioral",
    category_id: "cat-behavioral",
    difficulty: "easy" as const,
    prompt:
      "Describe a time you had a disagreement with a teammate. How did you resolve it?",
    solution:
      "Use STAR format. Focus on listening, finding shared goals, proposing compromises, and the positive outcome. Avoid blaming others.",
    is_premium: false,
  },
  {
    id: "q-8",
    title: "Design a Notification System",
    slug: "notification-system",
    category_id: "cat-system-design",
    difficulty: "medium" as const,
    prompt:
      "Design a system to send push, email, and SMS notifications at scale with delivery guarantees.",
    solution:
      "Event-driven architecture with message queue. Separate workers per channel. Template service, user preferences, retry with exponential backoff, idempotency keys, dead letter queue.",
    is_premium: false,
  },
];

const blogPosts = [
  {
    id: "blog-1",
    title: "How to Ace the Frontend System Design Round",
    slug: "ace-frontend-system-design",
    excerpt:
      "Frontend system design interviews are growing. Here's how to approach component architecture, state management, and performance.",
    content:
      "Frontend system design interviews test your ability to architect large-scale web applications. Start by clarifying requirements: users, scale, and key features. Draw component hierarchy, define state ownership, discuss data fetching patterns, caching, and error boundaries. Cover accessibility and performance metrics like LCP and CLS.",
    author: "Sarah Chen",
    tag: "System Design",
    published_at: "2026-06-15",
  },
  {
    id: "blog-2",
    title: "Backend Interview Patterns You Should Know",
    slug: "backend-interview-patterns",
    excerpt:
      "From caching strategies to database indexing — the patterns that come up again and again in backend interviews.",
    content:
      "Common backend interview topics include API design, authentication, caching (Redis), database design and indexing, message queues, and microservices communication. Practice explaining trade-offs for each pattern with real-world examples.",
    author: "Marcus Lee",
    tag: "Backend",
    published_at: "2026-06-20",
  },
  {
    id: "blog-3",
    title: "Building Your Interview Streak Habit",
    slug: "building-interview-streak",
    excerpt:
      "Consistency beats cramming. How daily practice compounds into interview confidence.",
    content:
      "Set a daily goal — even 30 minutes counts. Mix question types: coding, system design, and behavioral. Review mistakes in a journal. Track your streak to build accountability. The community here is a great place to share progress.",
    author: "Aryan",
    tag: "Community",
    published_at: "2026-06-25",
  },
];

const tutorials = [
  {
    id: "tut-1",
    title: "Introduction to System Design Interviews",
    slug: "intro-system-design",
    description:
      "Learn what interviewers look for and the framework to structure your answers.",
    video_url: "https://www.youtube.com/embed/placeholder1",
    category_id: "cat-system-design",
    tag: "System Design",
    published_at: "2026-06-10",
  },
  {
    id: "tut-2",
    title: "Designing a Chat Application",
    slug: "design-chat-app",
    description:
      "Walk through requirements, API design, WebSockets, and message storage for a real-time chat system.",
    video_url: "https://www.youtube.com/embed/placeholder2",
    category_id: "cat-system-design",
    tag: "Deep Dive",
    published_at: "2026-06-18",
  },
  {
    id: "tut-3",
    title: "Scaling Reads with Caching",
    slug: "scaling-reads-caching",
    description:
      "Cache-aside, write-through, and CDN strategies for high-traffic read-heavy systems.",
    video_url: "https://www.youtube.com/embed/placeholder3",
    category_id: "cat-system-design",
    tag: "Video Added",
    published_at: "2026-06-28",
  },
];

const codingQuestions = [
  {
    id: "cq-1",
    title: "Two Sum",
    slug: "two-sum",
    category_label: "Arrays",
    difficulty: "easy" as const,
    prompt:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. You may assume each input has exactly one solution.",
    solution_explanation:
      "Use a hash map to store each number and its index as you iterate. For each element, check if `target - nums[i]` exists in the map. This gives O(n) time and O(n) space.",
    language: "javascript",
    solution_code: `function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }

  return [];
}`,
  },
  {
    id: "cq-2",
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    category_label: "Stacks",
    difficulty: "easy" as const,
    prompt:
      "Given a string containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if open brackets are closed in the correct order.",
    solution_explanation:
      "Push opening brackets onto a stack. On closing brackets, pop and verify the pair matches. If the stack is empty at the end, the string is valid.",
    language: "javascript",
    solution_code: `function isValid(s) {
  const pairs = { ")": "(", "}": "{", "]": "[" };
  const stack = [];

  for (const char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}`,
  },
  {
    id: "cq-3",
    title: "Reverse a Linked List",
    slug: "reverse-linked-list",
    category_label: "Linked Lists",
    difficulty: "medium" as const,
    prompt:
      "Given the head of a singly linked list, reverse the list and return the reversed list.",
    solution_explanation:
      "Iterate with three pointers: `prev`, `curr`, and `next`. Point each node's `next` to the previous node. Move forward until `curr` is null, then return `prev`.",
    language: "javascript",
    solution_code: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}`,
  },
  {
    id: "cq-4",
    title: "Binary Search",
    slug: "binary-search",
    category_label: "Search",
    difficulty: "easy" as const,
    prompt:
      "Given a sorted array of integers `nums` and a `target` value, return the index of `target` if found. If not found, return `-1`. You must write an algorithm with O(log n) runtime.",
    solution_explanation:
      "Maintain `left` and `right` pointers. Compare the midpoint to the target and narrow the search range. Stop when found or when pointers cross.",
    language: "javascript",
    solution_code: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
  },
  {
    id: "cq-5",
    title: "Debounced Search Input",
    slug: "debounced-search-input",
    category_label: "React",
    difficulty: "medium" as const,
    prompt:
      "Build a React search input that debounces API calls by 300ms. Handle rapid typing and cleanup on unmount.",
    solution_explanation:
      "Store the timeout ID in a ref. On each keystroke, clear the previous timeout and schedule a new one. Use `useEffect` cleanup to clear pending timeouts when the component unmounts.",
    language: "tsx",
    solution_code: `import { useEffect, useRef, useState } from "react";

export function DebouncedSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timeoutRef.current);
  }, [query, onSearch]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
  },
  {
    id: "cq-6",
    title: "Merge Intervals",
    slug: "merge-intervals",
    category_label: "Arrays",
    difficulty: "medium" as const,
    prompt:
      "Given an array of intervals where `intervals[i] = [start, end]`, merge all overlapping intervals and return the result.",
    solution_explanation:
      "Sort intervals by start time. Iterate and merge into the result if the current interval overlaps the last merged one; otherwise push a new interval.",
    language: "javascript",
    solution_code: `function merge(intervals) {
  if (!intervals.length) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const [start, end] = intervals[i];

    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push(intervals[i]);
    }
  }

  return merged;
}`,
  },
  {
    id: "cq-7",
    title: "Implement Promise.all",
    slug: "implement-promise-all",
    category_label: "JavaScript",
    difficulty: "medium" as const,
    prompt:
      "Implement your own version of `Promise.all` that resolves when all promises resolve, or rejects immediately when any promise rejects.",
    solution_explanation:
      "Track resolved count in an array. Reject on first failure. Resolve with the collected results once every promise has settled successfully.",
    language: "javascript",
    solution_code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);

    const results = new Array(promises.length);
    let settled = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          settled += 1;
          if (settled === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}`,
  },
  {
    id: "cq-8",
    title: "LRU Cache",
    slug: "lru-cache",
    category_label: "Design",
    difficulty: "hard" as const,
    prompt:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement `get` and `put` in O(1) average time.",
    solution_explanation:
      "Combine a Map for O(1) lookups with a doubly linked list for O(1) eviction of the least recently used entry. Move accessed nodes to the front on every `get` or `put`.",
    language: "javascript",
    solution_code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
  }
}`,
  },
];

const projects = [
  {
    id: "cp-1",
    title: "Distributed Task Scheduler",
    description:
      "A fault-tolerant job scheduler with leader election, retry policies, and a web dashboard. Handles 10k jobs/min across 5 worker nodes.",
    author: "Alex M.",
    repo_url: "https://github.com",
    demo_url: "https://example.com",
    tags: ["Go", "Redis", "PostgreSQL", "Docker"],
  },
  {
    id: "cp-2",
    title: "Real-time Collaborative Whiteboard",
    description:
      "Multiplayer drawing canvas with CRDT-based conflict resolution, cursor presence, and export to SVG. Built for 50+ concurrent users per room.",
    author: "Priya K.",
    repo_url: "https://github.com",
    demo_url: null,
    tags: ["TypeScript", "WebSockets", "CRDT", "Canvas API"],
  },
  {
    id: "cp-3",
    title: "ML-Powered Code Review Bot",
    description:
      "GitHub Action that analyzes PRs for security vulnerabilities, performance anti-patterns, and style violations using fine-tuned LLM prompts.",
    author: "Jordan L.",
    repo_url: "https://github.com",
    demo_url: "https://example.com",
    tags: ["Python", "GitHub Actions", "OpenAI", "AST Parsing"],
  },
  {
    id: "cp-4",
    title: "Event-Sourced E-commerce Platform",
    description:
      "Full CQRS/ES architecture with saga orchestration for order fulfillment, inventory management, and payment processing across microservices.",
    author: "Morgan T.",
    repo_url: null,
    demo_url: null,
    tags: ["Java", "Kafka", "EventStore", "Kubernetes"],
  },
  {
    id: "cp-5",
    title: "Low-Latency Order Matching Engine",
    description:
      "Financial order book with price-time priority matching, sub-millisecond latency using lock-free data structures and memory-mapped I/O.",
    author: "Riley P.",
    repo_url: "https://github.com",
    demo_url: null,
    tags: ["Rust", "Lock-free", "Finance", "Benchmarking"],
  },
];

const communityQuestions = [
  {
    id: "cq-1",
    title: "How do you prepare for system design interviews in 2 weeks?",
    body: "I have a Google onsite coming up and only two weeks left. What's the most efficient way to cover the essentials — caching, load balancing, databases — without getting overwhelmed?",
    author: "Priya K.",
    tags: ["System Design"],
    answers: [
      {
        id: "ca-1",
        author: "Alex M.",
        content:
          "Focus on 5 core patterns: URL shortener, chat, news feed, rate limiter, and file storage. Draw each one end-to-end twice — once with a tutor, once solo. That covers 80% of what you'll see.",
      },
      {
        id: "ca-2",
        author: "Jordan L.",
        content:
          "Don't skip the trade-off discussion. Interviewers care more about why you chose Redis over Memcached than whether you drew every box perfectly.",
      },
    ],
  },
  {
    id: "cq-2",
    title: "Best way to explain React reconciliation to an interviewer?",
    body: "I understand the concept but struggle to explain it clearly under pressure. Any frameworks or analogies that have worked for you?",
    author: "Sam R.",
    tags: ["Frontend"],
    answers: [
      {
        id: "ca-3",
        author: "Morgan T.",
        content:
          "Use the 'diffing a shopping list' analogy: React compares the old list to the new one and only updates the items that changed, not the whole page.",
      },
    ],
  },
  {
    id: "cq-3",
    title: "Should I mention my side projects in behavioral rounds?",
    body: "I built a real-time collaboration tool with 200 users. Is that worth bringing up for 'tell me about a challenging project' questions, or does it seem too small?",
    author: "Chris W.",
    tags: ["Behavioral"],
    answers: [],
  },
  {
    id: "cq-4",
    title: "How to handle 'design a payment system' with no fintech background?",
    body: "Got this question in a mock interview and froze. What are the minimum concepts I need to know about idempotency, double-charging, and PCI compliance?",
    author: "Taylor N.",
    tags: ["System Design"],
    answers: [
      {
        id: "ca-4",
        author: "Riley P.",
        content:
          "Start with idempotency keys — that's the single most important concept. Explain that every payment request gets a unique key so retries never double-charge. PCI compliance you can hand-wave to 'we tokenize card data and never store raw PANs.'",
      },
    ],
  },
  {
    id: "cq-5",
    title: "GraphQL vs REST — what do backend interviewers actually want to hear?",
    body: "Every guide says 'it depends' but I need a concrete answer structure. How do you frame the trade-offs without sounding like you're reading a blog post?",
    author: "Jamie H.",
    tags: ["Backend"],
    answers: [],
  },
];

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

const learnCurricula = [
  {
    category: "system-design",
    title: "System Design",
    sections: [
      {
        title: "In a Hurry",
        lessons: [
          { id: "introduction", title: "Introduction" },
          { id: "how-to-prepare", title: "How to Prepare" },
          { id: "delivery-framework", title: "Delivery Framework" },
        ],
      },
      {
        title: "Core Concepts",
        lessons: [
          { id: "networking-basics", title: "Networking Basics" },
          { id: "api-design", title: "API Design" },
          { id: "caching", title: "Caching" },
          { id: "databases", title: "Databases" },
          { id: "load-balancing", title: "Load Balancing" },
        ],
      },
      {
        title: "Question Breakdowns",
        lessons: [
          { id: "url-shortener", title: "URL Shortener" },
          { id: "chat-system", title: "Chat System" },
          { id: "news-feed", title: "News Feed" },
          { id: "rate-limiter", title: "Rate Limiter" },
        ],
      },
      {
        title: "Patterns",
        lessons: [
          { id: "real-time-updates", title: "Real-time Updates", locked: true },
          { id: "contention", title: "Contention", locked: true },
          { id: "multi-step-processes", title: "Multi-step Processes", locked: true },
          { id: "scalability", title: "Scalability", locked: true },
          { id: "handling-large-blobs", title: "Handling Large Blobs", locked: true },
        ],
      },
    ],
  },
  {
    category: "frontend",
    title: "Frontend",
    sections: [
      {
        title: "In a Hurry",
        lessons: [
          { id: "introduction", title: "Introduction" },
          { id: "interview-format", title: "Interview Format" },
          { id: "study-plan", title: "Study Plan" },
        ],
      },
      {
        title: "Core Concepts",
        lessons: [
          { id: "react-fundamentals", title: "React Fundamentals" },
          { id: "state-management", title: "State Management" },
          { id: "performance", title: "Performance" },
          { id: "accessibility", title: "Accessibility" },
        ],
      },
      {
        title: "Question Breakdowns",
        lessons: [
          { id: "debounced-search", title: "Debounced Search" },
          { id: "infinite-scroll", title: "Infinite Scroll" },
          { id: "component-library", title: "Build a Component Library" },
        ],
      },
      {
        title: "Patterns",
        lessons: [
          { id: "compound-components", title: "Compound Components", locked: true },
          { id: "render-props", title: "Render Props", locked: true },
          { id: "custom-hooks", title: "Custom Hooks", locked: true },
        ],
      },
    ],
  },
  {
    category: "backend",
    title: "Backend",
    sections: [
      {
        title: "In a Hurry",
        lessons: [
          { id: "introduction", title: "Introduction" },
          { id: "how-to-prepare", title: "How to Prepare" },
          { id: "api-patterns", title: "Common API Patterns" },
        ],
      },
      {
        title: "Core Concepts",
        lessons: [
          { id: "rest-apis", title: "REST APIs" },
          { id: "authentication", title: "Authentication" },
          { id: "caching", title: "Caching" },
          { id: "message-queues", title: "Message Queues" },
        ],
      },
      {
        title: "Question Breakdowns",
        lessons: [
          { id: "rate-limiter", title: "Rate Limiter" },
          { id: "notification-system", title: "Notification System" },
        ],
      },
      {
        title: "Patterns",
        lessons: [
          { id: "idempotency", title: "Idempotency", locked: true },
          { id: "event-sourcing", title: "Event Sourcing", locked: true },
          { id: "cqrs", title: "CQRS", locked: true },
        ],
      },
    ],
  },
  {
    category: "fullstack",
    title: "Full Stack",
    sections: [
      {
        title: "In a Hurry",
        lessons: [
          { id: "introduction", title: "Introduction" },
          { id: "fullstack-roadmap", title: "Full Stack Roadmap" },
        ],
      },
      {
        title: "Core Concepts",
        lessons: [
          { id: "client-server", title: "Client-Server Architecture" },
          { id: "data-modeling", title: "Data Modeling" },
          { id: "deployment", title: "Deployment" },
        ],
      },
      {
        title: "Question Breakdowns",
        lessons: [
          { id: "todo-app", title: "Todo App with Auth" },
          { id: "e-commerce", title: "E-commerce Checkout" },
        ],
      },
      {
        title: "Patterns",
        lessons: [
          { id: "optimistic-updates", title: "Optimistic Updates", locked: true },
          { id: "real-time-sync", title: "Real-time Sync", locked: true },
        ],
      },
    ],
  },
  {
    category: "behavioral",
    title: "Behavioral",
    sections: [
      {
        title: "In a Hurry",
        lessons: [
          { id: "introduction", title: "Introduction" },
          { id: "star-method", title: "STAR Method" },
          { id: "common-questions", title: "Common Questions" },
        ],
      },
      {
        title: "Core Concepts",
        lessons: [
          { id: "leadership", title: "Leadership" },
          { id: "conflict-resolution", title: "Conflict Resolution" },
          { id: "failure-stories", title: "Failure Stories" },
        ],
      },
      {
        title: "Question Breakdowns",
        lessons: [
          { id: "tell-me-about-yourself", title: "Tell Me About Yourself" },
          { id: "why-this-company", title: "Why This Company?" },
        ],
      },
      {
        title: "Patterns",
        lessons: [
          { id: "influence-without-authority", title: "Influence Without Authority", locked: true },
          { id: "cross-team-collab", title: "Cross-team Collaboration", locked: true },
        ],
      },
    ],
  },
];

function buildTemplateContent(
  lessonTitle: string,
  sectionTitle: string,
  curriculumTitle: string
): string {
  return `This lesson covers **${lessonTitle}** as part of the ${sectionTitle} module in the ${curriculumTitle} interview prep track.

## Why this matters

${lessonTitle} comes up frequently in ${curriculumTitle.toLowerCase()} interviews — either as a direct question or as a building block in a larger design. Understanding it deeply helps you speak confidently about trade-offs and edge cases.

## Key ideas

- Start with the problem this concept solves before describing the solution
- Connect it to related topics in ${sectionTitle}
- Practice explaining it in under two minutes out loud

## What to do next

After reading, try explaining ${lessonTitle} without looking at your notes. Then move to the next lesson in ${sectionTitle}, or jump to a related Question Breakdown to see it applied in a full system design.`;
}

async function seed() {
  console.log("Cleaning old tables...");
  await db.deleteFrom("community_question_votes").execute();
  await db.deleteFrom("community_answers").execute();
  await db.deleteFrom("community_questions").execute();
  await db.deleteFrom("project_ratings").execute();
  await db.deleteFrom("project_votes").execute();
  await db.deleteFrom("projects").execute();
  await db.deleteFrom("coding_questions").execute();
  await db.deleteFrom("learn_articles").execute();
  await db.deleteFrom("user_completions").execute();
  await db.deleteFrom("blog_bookmarks").execute();

  await db.deleteFrom("streak_log").execute();
  await db.deleteFrom("streaks").execute();
  await db.deleteFrom("tutorials").execute();
  await db.deleteFrom("blog_posts").execute();
  await db.deleteFrom("questions").execute();
  await db.deleteFrom("categories").execute();
  await db.deleteFrom("users").execute();

  console.log("Seeding users...");
  await db
    .insertInto("users")
    .values({
      id: DEMO_USER_ID,
      name: "Aryan",
      email: "demo@crackitt.dev",
      avatar_url: null,
    })
    .execute();

  console.log("Seeding categories...");
  await db.insertInto("categories").values(categories).execute();

  console.log("Seeding conceptual questions...");
  await db.insertInto("questions").values(questions).execute();

  console.log("Seeding blogs...");
  await db.insertInto("blog_posts").values(blogPosts).execute();

  console.log("Seeding tutorials...");
  await db.insertInto("tutorials").values(tutorials).execute();

  console.log("Seeding streaks...");
  await db
    .insertInto("streaks")
    .values({
      user_id: DEMO_USER_ID,
      current_streak: 0,
      best_streak: 0,
      last_active_date: null,
    })
    .execute();

  console.log("Seeding projects...");
  await db.insertInto("projects").values(projects).execute();

  console.log("Seeding coding questions...");
  await db.insertInto("coding_questions").values(codingQuestions).execute();

  console.log("Seeding learn articles...");
  const articlesToInsert = [];
  for (const curr of learnCurricula) {
    for (const section of curr.sections) {
      for (const lesson of section.lessons) {
        const key = `${curr.category}/${lesson.id}`;
        const content =
          customArticles[key] ??
          buildTemplateContent(lesson.title, section.title, curr.title);
        articlesToInsert.push({
          id: `la-${curr.category}-${lesson.id}`,
          slug: lesson.id,
          category_slug: curr.category,
          section_title: section.title,
          title: lesson.title,
          content,
          author_name: "Crackitt Editorial Team",
          locked: !!(lesson as any).locked,
        });
      }
    }
  }
  await db.insertInto("learn_articles").values(articlesToInsert).execute();

  console.log("Seeding community forum questions and answers...");
  for (const q of communityQuestions) {
    await db
      .insertInto("community_questions")
      .values({
        id: q.id,
        title: q.title,
        body: q.body,
        author: q.author,
        tags: q.tags,
      })
      .execute();

    if (q.answers.length > 0) {
      await db
        .insertInto("community_answers")
        .values(
          q.answers.map((a) => ({
            id: a.id,
            question_id: q.id,
            author: a.author,
            content: a.content,
          }))
        )
        .execute();
    }
  }

  console.log("Seed complete");
  await db.destroy();
}

seed().catch((err) => {
  console.error("Seeding failed: ", err);
  process.exit(1);
});
