# Response Review Dashboard - Product Brief

## Goal
Build a production-ready candidate response review dashboard that allows employers to efficiently manage and evaluate test submissions from candidates at scale (5000+ responses).

## User Story
> As a hiring manager, I want to quickly filter and sort through candidate test responses so I can identify top performers, update review statuses, and manage my pipeline effectively - even when dealing with hundreds of submissions.

## Acceptance Criteria
- Display candidate responses in a paginated table with server-side data fetching
- Support multi-column sorting (candidate name, test name, AI score, completion date)
- Provide real-time search across candidate names and emails (with debouncing)
- Allow filtering by test name, completion state, and review status
- Enable updating review statuses with optimistic UI updates
- Support bulk archiving/unarchiving of selected responses
- Show appropriate loading states (skeletons) during data fetching
- Handle error states gracefully with user-friendly messaging
- Work responsively across mobile and desktop viewports

## Technical Expectations
- Use Next.js 15 App Router with React Server Components for initial data loading
- Manage pagination, sorting, and filter state via URL search parameters
- Implement optimistic updates with proper rollback on failure
- Error handling with retry mechanisms
- Provide TypeScript types for all data structures and component props
- Write tests covering filtering, pagination, and mutation logic
- **Performance optimization**: When updating an individual row's review status, only that row should re-render, not the entire table

### Implementation Decisions for You to Make

Research and decide on best practices for:
- **Data fetching patterns**: How to fetch and cache data on the client vs. server
- **Data mutation patterns**: Server Actions, API Routes, or a combination
- **Cache invalidation strategies**: How to keep your UI in sync after mutations
- **Styling approach**: Choose and justify your styling solution
- **Testing strategy**: Select appropriate testing tools and approaches

**Document your choices**: In your README, explain your technology selections, the alternatives you considered, and the trade-offs you evaluated. We want to understand your decision-making process and how you research modern best practices.

## Creative Solutions Encouraged

While the acceptance criteria define the minimum requirements, we value candidates who think critically about optimal solutions:

- **Performance at scale**: Consider techniques like prefetching, intelligent caching strategies, or query optimization for handling 5000+ records
- **User experience**: Think beyond basic loading states - what makes filtering and navigation feel instant?
- **Architecture**: Design patterns that are maintainable and extensible as the product grows
- **Innovation**: If you have ideas for better approaches to filtering, pagination, or data management, implement them!

Document your architectural decisions and trade-offs in the README. We want to see your thought process and problem-solving approach.

## Reference Materials
- `docs/api-reference.md` - Database API and data structures
- `lib/db.ts` - Database interface for queries and mutations
- `lib/data.ts` - Type definitions and mock data layer

## Success Metrics
Your submission will be evaluated on:
1. **Functionality**: Does it meet all acceptance criteria?
2. **Code Quality**: Is the code clean, well-typed, and maintainable?
3. **Performance**: Does it handle large datasets smoothly?
4. **UX Polish**: Are transitions smooth? Are loading states clear?
5. **Testing**: Do tests meaningfully cover key behaviors?
