# MeritQuest

A take-home assessment for building a candidate review dashboard.

## Quick Start

```bash
# Clone and install
git clone https://github.com/MeritFirst/MeritQuest.git
cd MeritQuest
corepack enable pnpm
corepack use pnpm@latest-10
pnpm install

# Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to get started.

**Note:** The API runs locally — no external services needed. Data is stored
in-memory and resets when you restart the dev server.

## What to Build

See `docs/brief.md` for full requirements. In short:

1. **General Browsing** — browse, search, filter, and manage ~50k candidate
   responses
2. **Role-Aware Ranking** — surface the best candidates for a Senior Frontend
   Engineer role

## Project Structure

```
app/
├── responses/              # TODO: your implementation goes here
├── api/take-home/          # Local API routes (don't modify)
├── docs/                   # In-app documentation pages
│   ├── brief/
│   └── api/
└── page.tsx                # Home page
docs/
├── brief.md                # Product requirements
└── api-reference.md        # API documentation
lib/
├── types.ts                # TypeScript types for API responses
├── actions.ts              # Server Actions for mutations
└── db.ts                   # In-memory database (don't modify)
```

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS (pre-configured)

Everything else is your choice.

## Data Access

You have two options for accessing and mutating data:

### Option 1: REST API

```typescript
// Fetch candidates
const res = await fetch("/api/take-home/responses");
const data = await res.json();

// Update a candidate
await fetch(`/api/take-home/responses/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ reviewStatusId: "rs-2" }),
});
```

See `docs/api-reference.md` for all endpoints.

### Option 2: Server Actions

```typescript
import { archiveCandidateAction } from "@/lib/actions";

// In a client component
const result = await archiveCandidateAction(id);
```

See `lib/actions.ts` for available actions.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm lint         # Run linter
pnpm test         # Run tests
```

## Submission

Push to a branch named `take-home-<your-name>`. We'll review it together.

## Time

3-4 hours. Focus on building something useful.
