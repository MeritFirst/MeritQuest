# MeritQuest - The Quest for Top Talent

This assessment evaluates your ability to work with Next.js 15, modern React patterns, and complex data management at scale.

## Overview

Build a dashboard that allows hiring managers to efficiently review and manage candidate test submissions at scale (5000+ responses). The assessment evaluates:

- Next.js 15 App Router architecture
- Data fetching and mutation strategies
- URL state management
- Optimistic UI updates
- Complex filtering and sorting
- TypeScript type safety
- Testing and accessibility

## Tech Stack Requirements

This assessment requires:
- **Next.js 15** with App Router
- **TypeScript** with strict type safety
- An **in-memory mock data layer** (provided - 5000 generated responses)

### Your Technology Choices

You are encouraged to research and select your own tools for:
- **Styling solution**
- **Testing framework**
- **Client-side data fetching library**
- **Data mutation patterns** (Server Actions, API Routes, or a combination)
- **UI components** (build from scratch, use a component library, or a combination)

**Important:** In your submission README, document your technology choices and explain:
- Why you selected each tool or pattern
- What alternatives you considered
- Trade-offs you evaluated
- How your choices align with modern best practices for Next.js and React development

We value thoughtful decision-making and clear technical communication as much as implementation quality.

## Getting Started

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/MeritFirst/MeritQuest.git
cd MeritQuest
```

### 2. Prerequisites

- Node.js ≥ 18
- pnpm (install via Corepack):
  ```bash
  corepack enable pnpm
  corepack use pnpm@latest-10
  ```

### 3. Installation

```bash
pnpm install
```

### 4. Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the starter application.

### 5. Testing

```bash
pnpm test          # Run tests once
pnpm test:watch    # Run tests in watch mode
```

### 6. Linting

```bash
pnpm lint
```

### 7. Building

```bash
pnpm build
pnpm start
```

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── test-names/             # API route for test names (optional to use)
│   ├── responses/                  # Response dashboard feature
│   │   ├── page.tsx                # TODO: Implement
│   │   └── responses-dashboard.tsx # TODO: Implement
│   ├── docs/
│   │   └── brief/                  # Product brief accessible in-app
│   └── page.tsx                    # Home page with instructions
├── lib/
│   ├── db.ts                       # Database interface (DO NOT MODIFY)
│   └── data.ts                     # Type definitions (DO NOT MODIFY)
├── docs/
│   ├── brief.md                    # Product requirements & acceptance criteria
│   └── api-reference.md            # Database API documentation
├── tests/                          # Add your tests here
└── middleware.ts                   # Tenant enforcement (DO NOT MODIFY)
```

### File Guide

**Files you need to implement:**
- `app/responses/page.tsx` - Response dashboard page
- `app/responses/responses-dashboard.tsx` - Dashboard implementation

**Library files (DO NOT MODIFY):**
- `lib/db.ts` - Database interface with transaction support. Import and use `db` for all data operations
- `lib/data.ts` - Type definitions and helper functions
- `middleware.ts` - Enforces tenant header for API routes

**Optional resources:**
- `app/api/test-names/route.ts` - API route for fetching test names (you can use this, create your own routes, or fetch data differently)

## Where to Start

1. **Read the docs:**
   - `docs/brief.md` for product requirements and acceptance criteria
   - `docs/api-reference.md` for database API and data structures

2. **Explore the codebase:**
   - `lib/db.ts` - Database interface (use this for all queries/mutations)
   - `lib/data.ts` - Type definitions

3. **Build the dashboard:**
   - Implement `app/responses/page.tsx` and `app/responses/responses-dashboard.tsx`
   - Choose your data fetching and mutation strategies
   - Build the UI with your chosen styling solution

4. **Test your work:**
   - Run `pnpm test` to verify functionality
   - Run `pnpm lint` to check code quality
   - Test manually in the browser

## Key Features to Implement

- Server-side pagination with URL state
- Multi-column sorting (name, test, score, date)
- Debounced search (candidate name/email)
- Multi-select filters (test name, state, review status)
- Optimistic UI for review status updates
- Bulk archive functionality
- Loading skeletons and error handling
- Responsive design (mobile + desktop)
- Accessibility (keyboard navigation, ARIA labels)

## Evaluation Criteria

Submissions are evaluated on:
- **Product Understanding**: Does it meet all acceptance criteria?
- **Technical Execution**: Effective use of Next.js 15 and modern patterns
- **Code Quality**: Clean, well-typed, maintainable code
- **Testing**: Meaningful test coverage of key behaviors
- **Polish**: Smooth UX, thoughtful loading states, responsive design
- **Creativity & Optimization**: Creative solutions and performance optimizations beyond the basics are valued

We encourage you to think critically about optimal solutions. Consider techniques like prefetching, intelligent caching, or advanced filtering strategies. Document your architectural decisions and trade-offs in your submission.

## Expected Time

This assessment should take **3-4 hours** to complete. Focus on core functionality first, then add polish.

## Submission

1. Implement the required features
2. Add or extend tests
3. Update this README with:
   - **Technology choices and justification**: Explain why you chose your styling solution, testing framework, data fetching approach, etc.
   - **Architecture decisions**: Document your approach and design patterns
   - **Trade-offs**: Discuss alternatives you considered and why you made your choices
   - **Instructions**: How to run and test your implementation
4. (Optional) Deploy to Vercel for easy review

## Questions?

Refer to:
- `docs/api-reference.md` for data structures and API
- `docs/brief.md` for detailed requirements
- Next.js 15 docs: https://nextjs.org/docs

Good luck!
