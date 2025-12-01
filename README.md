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

## What to Build

See `docs/brief.md` for full requirements. In short:

1. **General Browsing** — browse, search, filter, and manage ~50k candidate responses
2. **Role-Aware Ranking** — surface the best candidates for a Senior Frontend Engineer role

## Project Structure

```
app/
├── responses/          # TODO: your implementation goes here
├── docs/               # In-app documentation pages
└── page.tsx            # Home page
docs/
├── brief.md            # Product requirements
└── api-reference.md    # API documentation
lib/
└── types.ts            # TypeScript types for API responses
```

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS (pre-configured)

Everything else is your choice.

## API

External API at `https://mockapi.meritfirst.us/`. See `docs/api-reference.md` for endpoints.

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
