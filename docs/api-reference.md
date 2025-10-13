# API Reference

This document describes the database interface (`lib/db.ts`) and data structures (`lib/data.ts`) available for this assessment.

## Data Types

### `CandidateResponse`
Represents a candidate's test submission with associated metadata.

```typescript
type CandidateResponse = {
  id: string;
  candidateTest: {
    id: string;
    state: "pending" | "in_progress" | "completed";
    archivedAt: string | null;
    startedAt: string | null;
    completedAt: string | null;
    timeTakenSeconds: number | null;
  };
  user: {
    id: string;
    preferredName: string | null;
    name: string;
    email: string;
    city: string | null;
    state: string | null;
    country: string | null;
  };
  test: {
    id: string;
    name: string;
  };
  reviewStatus: {
    id: string;
    name: string;
    position: number;
  } | null;
  aiScore: number | null; // 0-100
  notesPreview: string | null;
  notesCount: number;
};
```

### `ReviewStatus`
Represents a review status that can be assigned to responses.

```typescript
type ReviewStatus = {
  id: string;
  name: string;
  position: number;
  type: "screening" | "interviewing" | "offer" | "rejection";
};
```

### `ListResponsesParams`
Parameters for querying and filtering responses.

```typescript
type ListResponsesParams = {
  page?: number; // 1-based, default 1
  pageSize?: number; // default 10
  sort?: "startedAt" | "aiScore" | "testName" | "name"; // default "startedAt"
  direction?: "asc" | "desc"; // default "desc"
  search?: string; // searches name and email
  archived?: "active" | "archived" | "all"; // default "active"
  filters?: {
    testNames?: string[];
    states?: ("pending" | "in_progress" | "completed")[];
    reviewStatusNames?: string[]; // use "None" for null statuses
  };
};
```

### `ListResponsesResult`
Result from listing responses.

```typescript
type ListResponsesResult = {
  rows: CandidateResponse[];
  total: number;
  hasNextPage: boolean;
};
```

### `ResponseUpdateFields`
Fields that can be updated on a response.

```typescript
type ResponseUpdateFields = {
  reviewStatusId?: string | null;
  archivedAt?: string | null;
};
```

## Database Interface (`lib/db.ts`)

The `db` object provides a structured API for querying and mutating data. **Use this instead of directly manipulating data stores.**

### `db.responses.list(params?: ListResponsesParams): Promise<ListResponsesResult>`
Fetches paginated, filtered, and sorted candidate responses.

**Example:**
```typescript
import { db } from "@/lib/db";

const result = await db.responses.list({
  page: 2,
  pageSize: 20,
  sort: "aiScore",
  direction: "desc",
  search: "john",
  filters: {
    testNames: ["Frontend Assessment"],
    states: ["completed"],
    reviewStatusNames: ["Phone Screen", "None"]
  }
});

console.log(result.rows); // Array of 20 responses
console.log(result.total); // Total matching responses
console.log(result.hasNextPage); // true if more pages exist
```

### `db.responses.findById(id: string): Promise<CandidateResponse | null>`
Finds a single response by ID.

**Example:**
```typescript
const response = await db.responses.findById("response-123");
```

### `db.responses.update(id: string, updates: ResponseUpdateFields): Promise<number>`
Updates a single response. Returns the number of rows updated (0 if not found, 1 if updated).

**Example:**
```typescript
const count = await db.responses.update("response-123", {
  reviewStatusId: "rs-2"
});
// count is 1 if updated, 0 if response not found

// Archive a response
await db.responses.update("response-123", {
  archivedAt: new Date().toISOString()
});

// Clear review status
await db.responses.update("response-123", {
  reviewStatusId: null
});
```

### `db.responses.updateMany(ids: string[], updates: ResponseUpdateFields): Promise<number>`
Updates multiple responses. Returns the number of rows updated. **Must be wrapped in a transaction** for atomicity.

**Example:**
```typescript
// BAD: No transaction - partial updates if error occurs
const count = await db.responses.updateMany(["response-1", "response-2"], {
  reviewStatusId: "rs-3"
});

// GOOD: Transaction ensures all-or-nothing
let count = 0;
await db.transaction(async () => {
  count = await db.responses.updateMany(["response-1", "response-2"], {
    reviewStatusId: "rs-3"
  });
});
console.log(`Updated ${count} responses`);
```

### `db.reviewStatuses.list(): Promise<ReviewStatus[]>`
Fetches all available review statuses.

**Example:**
```typescript
const statuses = await db.reviewStatuses.list();
// Returns: [{ id: "rs-1", name: "New", position: 1, type: "screening" }, ...]
```

### `db.reviewStatuses.findById(id: string): Promise<ReviewStatus | null>`
Finds a single review status by ID.

### `db.transaction<T>(fn: () => Promise<T>): Promise<T>`
Wraps operations in a transaction. If any operation throws, all changes are rolled back.

**Why Use Transactions:**
- Ensures atomicity: all operations succeed or none do
- Prevents partial updates when bulk operations fail mid-way
- Critical for bulk status updates or bulk archive operations

**Example:**
```typescript
await db.transaction(async () => {
  // Update multiple responses
  await db.responses.updateMany(selectedIds, {
    reviewStatusId: "rs-5"
  });

  // Archive them all
  await db.responses.updateMany(selectedIds, {
    archivedAt: new Date().toISOString()
  });
});

// If any operation fails, ALL changes are rolled back
```

## Implementing Mutations

You'll need to implement mutations to handle:

- Updating a single response's review status
- Archiving a single response
- Bulk archiving multiple responses
- Bulk updating multiple responses' review status

**Your decision**: Choose whether to use Server Actions, API Routes, or a combination. Consider how to handle errors, cache revalidation, and data consistency for bulk operations. Document your choice and reasoning in your README.

## Data Fetching Options

You have multiple ways to fetch data for your dashboard. Choose the patterns that best fit your architecture and justify your decisions.

### Review Statuses

**Available methods:**
1. **Server-side (provided)**: Already fetched in `app/responses/page.tsx` and passed as a prop
2. **Database method**: `db.reviewStatuses.list()` - can be called from server components or API routes
3. **API route**: Create your own endpoint if you prefer client-side fetching

### Test Names

**Available methods:**
1. **API route (provided)**: `/api/test-names` endpoint is available (requires `x-tenant: demo-employer` header)
2. **Derive from responses**: Test names can be extracted from the responses data
3. **Database method**: Call the database from server components

### Your Decision

Choose how you want to fetch each piece of data based on:
- When the data is needed (initial load vs. dynamic)
- How often it changes
- Caching requirements
- User experience considerations

Document your data fetching strategy and reasoning in your README.

## Notes
- All data is stored in-memory for this assessment
- The data layer includes 5000 mock responses generated on initialization
- Pagination uses offset-based pagination for simplicity
- Filters are applied in-memory after initial data fetch
- Search is case-insensitive and matches partial strings
- **Network delays are simulated** to demonstrate data fetching patterns:
  - `listResponses()`: 1-2s delay
  - `getReviewStatuses()`: 2-4s delay (cached)
  - `getTestNames()`: 3-5s delay
