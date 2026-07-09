import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Imports an Obsidian vault into the `learn_articles` table.
 *
 * The vault is the source of truth for Learn content. Notes are grouped into
 * curriculum sections by the manifest below — Obsidian has no notion of
 * ordering, so the reading order has to live here.
 */

export const VAULT_PATH =
  process.env.VAULT_PATH ?? path.join(os.homedir(), "Documents", "Obsidian Vault");

/** Walk up to the workspace root so paths hold regardless of the caller's cwd. */
function findRepoRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Could not locate workspace root from ${process.cwd()}`);
}

const REPO_ROOT = findRepoRoot();

/** Where image embeds are copied so Next can serve them. */
export const PUBLIC_VAULT_DIR = path.join(REPO_ROOT, "apps/web/public/vault");

export const CURRICULUM_JSON = path.join(
  REPO_ROOT,
  "apps/web/lib/learn-curriculum.generated.json",
);

type NoteSpec = {
  /** Path relative to the vault root, without the .md extension. */
  file: string;
  /** Display title — vault filenames are informal, so they get cleaned up. */
  title: string;
};

type SectionSpec = {
  id: string;
  title: string;
  notes: NoteSpec[];
};

type CategorySpec = {
  slug: string;
  title: string;
  sections: SectionSpec[];
};

export const CURRICULUM: CategorySpec[] = [
  {
    slug: "backend",
    title: "Backend",
    sections: [
      {
        id: "roadmap",
        title: "Roadmap",
        notes: [
          { file: "Backend List/Topics to learn ( Backend )", title: "Backend Roadmap" },
        ],
      },
      {
        id: "foundations",
        title: "Foundations",
        notes: [
          { file: "Backend List/Networking Essentials", title: "Networking Essentials" },
          { file: "Backend List/All about HTTP", title: "All About HTTP" },
          { file: "Backend List/REST Architecture", title: "REST Architecture" },
          { file: "Backend List/OpenAPI spec", title: "OpenAPI Spec" },
        ],
      },
      {
        id: "databases",
        title: "Databases",
        notes: [
          { file: "Backend List/Database with postgres", title: "Databases with Postgres" },
          { file: "Backend List/Indexing and Transactions", title: "Indexing & Transactions" },
          { file: "Backend List/Connection Pooling", title: "Connection Pooling" },
          { file: "Backend List/knex js", title: "Knex.js" },
        ],
      },
      {
        id: "caching-performance",
        title: "Caching & Performance",
        notes: [
          { file: "Backend List/Caching and Redis", title: "Caching & Redis" },
          { file: "Backend List/Rate Limiting", title: "Rate Limiting" },
        ],
      },
      {
        id: "scaling-reliability",
        title: "Scaling & Reliability",
        notes: [
          {
            file: "Backend List/load balancer and reverse proxy",
            title: "Load Balancers & Reverse Proxies",
          },
          {
            file: "Backend List/message queues, async jobs (kafka, rabbitmq)",
            title: "Message Queues & Async Jobs",
          },
          {
            file: "additional Backend/Dead letter queue + retry strategy",
            title: "Dead Letter Queues & Retries",
          },
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        notes: [
          { file: "How to make a proper clean backend", title: "Clean Backend Architecture" },
          { file: "Backend List/Architecture patterns", title: "Architecture Patterns" },
          { file: "Backend List/Microservices", title: "Microservices" },
          {
            file: "Backend List/DDIA + implement what you read and like (maybe raft, wal, kv store)",
            title: "DDIA & Implementation Projects",
          },
        ],
      },
      {
        id: "auth-security",
        title: "Auth & Security",
        notes: [
          { file: "Backend List/jwt, oauth2, sessions", title: "JWT, OAuth2 & Sessions" },
        ],
      },
      {
        id: "protocols-realtime",
        title: "Protocols & Realtime",
        notes: [{ file: "Backend List/gRPC and SSE", title: "gRPC & SSE" }],
      },
      {
        id: "observability",
        title: "Observability",
        notes: [
          {
            file: "Backend List/logging, metrics, distributed tracing, OTEL",
            title: "Logging, Metrics & Tracing",
          },
        ],
      },
      {
        id: "media-delivery",
        title: "Media & Delivery",
        notes: [{ file: "Backend List/Bunny and DRM", title: "Bunny CDN & DRM" }],
      },
      {
        id: "ai",
        title: "Working with AI",
        notes: [{ file: "Backend List/working with LLM API", title: "Working with LLM APIs" }],
      },
    ],
  },
  {
    slug: "frontend",
    title: "Frontend",
    sections: [
      {
        id: "performance",
        title: "Performance",
        notes: [
          {
            file: "Frontend System Design/Frontend Web Performace",
            title: "Frontend Web Performance",
          },
        ],
      },
    ],
  },
];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\./g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ImportedArticle = {
  id: string;
  slug: string;
  category_slug: string;
  section_title: string;
  title: string;
  content: string;
  author_name: string;
  locked: boolean;
};

/** Maps a vault note's basename (what `[[wikilinks]]` reference) to its route. */
type NoteIndex = Map<string, { category: string; slug: string }>;

const IMAGE_EMBED = /!\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]/g;
const WIKILINK = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

/**
 * Picks up the short caption line Obsidian notes tend to put directly above a
 * screenshot, so the image gets meaningful alt text instead of a filename.
 */
function altTextFor(lines: string[], embedLineIndex: number): string {
  for (let i = embedLineIndex - 1; i >= 0 && i >= embedLineIndex - 2; i--) {
    const line = (lines[i] ?? "").trim();
    if (!line) continue;
    if (line.length > 60) break;
    if (/^[#>\-*|`0-9]/.test(line)) break;
    if (line.includes("![") || line.includes("](")) break;
    return line.replace(/[*_`]/g, "");
  }
  return "Illustration";
}

export function transformMarkdown(
  raw: string,
  noteIndex: NoteIndex,
  usedImages: Set<string>,
): string {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");

  const withImages = lines.map((line, i) =>
    line.replace(IMAGE_EMBED, (_full, file: string) => {
      const name = file.trim();
      usedImages.add(name);
      return `![${altTextFor(lines, i)}](/vault/${encodeURIComponent(name)})`;
    }),
  );

  const withLinks = withImages.map((line) =>
    line.replace(WIKILINK, (_full, target: string, alias?: string) => {
      const label = (alias ?? target).trim();
      const found = noteIndex.get(target.trim());
      return found ? `[${label}](/learn/${found.category}/${found.slug})` : label;
    }),
  );

  return withLinks.join("\n").trim();
}

export function buildVaultArticles(vaultPath: string = VAULT_PATH): {
  articles: ImportedArticle[];
  usedImages: Set<string>;
} {
  if (!fs.existsSync(vaultPath)) {
    throw new Error(
      `Obsidian vault not found at "${vaultPath}". Set VAULT_PATH to override.`,
    );
  }

  // Built first so wikilinks can resolve to notes defined later in the manifest.
  const noteIndex: NoteIndex = new Map();
  for (const category of CURRICULUM) {
    for (const section of category.sections) {
      for (const note of section.notes) {
        const basename = path.basename(note.file);
        noteIndex.set(basename, {
          category: category.slug,
          slug: slugify(note.title),
        });
      }
    }
  }

  const usedImages = new Set<string>();
  const articles: ImportedArticle[] = [];

  for (const category of CURRICULUM) {
    for (const section of category.sections) {
      for (const note of section.notes) {
        const filePath = path.join(vaultPath, `${note.file}.md`);
        if (!fs.existsSync(filePath)) {
          throw new Error(`Vault note missing: ${filePath}`);
        }

        const raw = fs.readFileSync(filePath, "utf8");
        const slug = slugify(note.title);

        articles.push({
          id: `la-${category.slug}-${slug}`,
          slug,
          category_slug: category.slug,
          section_title: section.title,
          title: note.title,
          content: transformMarkdown(raw, noteIndex, usedImages),
          author_name: "Aryan Bola",
          locked: false,
        });
      }
    }
  }

  return { articles, usedImages };
}

/** Copies embedded screenshots into the web app's public directory. */
export function copyVaultImages(usedImages: Set<string>, vaultPath: string = VAULT_PATH) {
  fs.mkdirSync(PUBLIC_VAULT_DIR, { recursive: true });

  let copied = 0;
  for (const name of usedImages) {
    const source = path.join(vaultPath, "screenshots", name);
    if (!fs.existsSync(source)) {
      console.warn(`  ! embedded image not found, skipping: ${name}`);
      continue;
    }
    fs.copyFileSync(source, path.join(PUBLIC_VAULT_DIR, name));
    copied++;
  }
  return copied;
}

/** Emits the sidebar curriculum the web app reads at build time. */
export function writeCurriculumJson() {
  const payload = Object.fromEntries(
    CURRICULUM.map((category) => [
      category.slug,
      {
        categorySlug: category.slug,
        title: category.title,
        sections: category.sections.map((section) => ({
          id: section.id,
          title: section.title,
          lessons: section.notes.map((note) => ({
            id: slugify(note.title),
            title: note.title,
          })),
        })),
      },
    ]),
  );

  fs.mkdirSync(path.dirname(CURRICULUM_JSON), { recursive: true });
  fs.writeFileSync(CURRICULUM_JSON, `${JSON.stringify(payload, null, 2)}\n`);
  return CURRICULUM_JSON;
}
