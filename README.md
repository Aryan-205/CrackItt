# Crackitt Platform

Interview prep platform for frontend, backend, and full stack — practice questions, tutorials, community blogs, and learning streaks.

## Stack

- **apps/web** — Next.js 16, React 19, Tailwind 4
- **apps/api** — Express 5, Kysely, PostgreSQL
- **packages/types** — Shared TypeScript types

## Getting Started

```bash
# Start PostgreSQL
docker compose up -d

# Install dependencies
pnpm install

# Run migrations and seed data
pnpm db:setup

# Start dev servers (web :3000, api :3001)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the main app.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing hero |
| `/dashboard` | Main dashboard with streak, progress, feed |
| `/practice` | Interview questions with solutions |
| `/learn/[category]` | Questions by track |
| `/community` | Blog feed |
| `/tutorials` | System design video tutorials |

## API Endpoints

- `GET /health`
- `GET /questions?category=frontend`
- `GET /questions/:slug`
- `GET /blogs`, `GET /blogs/:slug`
- `GET /tutorials`
- `GET /streaks/:userId`, `POST /streaks/:userId/check-in`
- `GET /dashboard/feed`
# CrackItt
