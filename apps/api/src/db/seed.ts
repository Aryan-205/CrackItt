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

async function seed() {
  await db.deleteFrom("streak_log").execute();
  await db.deleteFrom("streaks").execute();
  await db.deleteFrom("tutorials").execute();
  await db.deleteFrom("blog_posts").execute();
  await db.deleteFrom("questions").execute();
  await db.deleteFrom("categories").execute();
  await db.deleteFrom("users").execute();

  await db
    .insertInto("users")
    .values({
      id: DEMO_USER_ID,
      name: "Aryan",
      email: "demo@crackitt.dev",
      avatar_url: null,
    })
    .execute();

  await db.insertInto("categories").values(categories).execute();
  await db.insertInto("questions").values(questions).execute();
  await db.insertInto("blog_posts").values(blogPosts).execute();
  await db.insertInto("tutorials").values(tutorials).execute();

  await db
    .insertInto("streaks")
    .values({
      user_id: DEMO_USER_ID,
      current_streak: 0,
      best_streak: 0,
      last_active_date: null,
    })
    .execute();

  console.log("Seed complete");
  await db.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
