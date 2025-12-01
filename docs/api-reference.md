# MeritFirst Take-Home API Reference

Base URL: `/api/take-home`

All endpoints return JSON. The API runs locally as part of the Next.js dev
server.

---

## Quick Start

```bash
pnpm dev
```

The API is available at `http://localhost:3000/api/take-home/...`

**Note:** Data is stored in-memory and resets when you restart the dev server.
This is expected behavior for the take-home.

---

## Two Ways to Access Data

### Option 1: REST API (fetch-based)

Use standard `fetch()` calls to the API endpoints documented below. Good for:

- Traditional REST patterns
- Caching via HTTP headers
- External API consumption patterns

### Option 2: Server Actions (React-native)

Import and call Server Actions directly from `lib/actions.ts`. Good for:

- Form submissions with progressive enhancement
- Simpler React integration
- Optimistic updates

See [Server Actions](#server-actions) section below.

---

## Dataset Overview

The API serves **50,000 mock candidate responses** with:

- **~46,000 active** / **~4,000 archived** candidates
- **~40,000 completed** / **~5,000 in_progress** / **~5,000 pending** states
- **10 different assessment types**
- **6 review status stages**
- Seeded random data (consistent across restarts)

---

## Responses

### `GET /api/take-home/responses`

List candidate responses with filtering, sorting, and pagination.

**Query Parameters:**

| Parameter           | Type   | Default       | Description                                                   |
| ------------------- | ------ | ------------- | ------------------------------------------------------------- |
| `page`              | number | `1`           | Page number (1-indexed)                                       |
| `pageSize`          | number | `25`          | Results per page (1-100)                                      |
| `sort`              | string | `"startedAt"` | Sort field: `startedAt`, `aiScore`, `testName`, `name`        |
| `direction`         | string | `"desc"`      | Sort direction: `asc`, `desc`                                 |
| `search`            | string | —             | Search by name, email, or test name (min 2 chars)             |
| `archived`          | string | `"active"`    | Filter: `active`, `archived`, `all`                           |
| `testNames`         | string | —             | Comma-separated test names to filter                          |
| `states`            | string | —             | Comma-separated states: `pending`, `in_progress`, `completed` |
| `reviewStatusNames` | string | —             | Comma-separated status names (use `None` for null)            |

**Response:**

```json
{
  "rows": [CandidateResponse],
  "total": 46022,
  "hasNextPage": true
}
```

**Examples:**

```bash
# Get first page of active candidates
GET /api/take-home/responses

# Search for candidates named "smith"
GET /api/take-home/responses?search=smith

# Get completed candidates sorted by AI score (highest first)
GET /api/take-home/responses?states=completed&sort=aiScore&direction=desc

# Filter by multiple test names
GET /api/take-home/responses?testNames=Senior%20Frontend%20Engineer%20Assessment,Backend%20Developer%20Technical

# Get archived candidates with "New" review status
GET /api/take-home/responses?archived=archived&reviewStatusNames=New

# Get candidates with no review status assigned
GET /api/take-home/responses?reviewStatusNames=None

# Pagination with custom page size
GET /api/take-home/responses?page=5&pageSize=50
```

---

### `GET /api/take-home/responses/:id`

Get a single candidate response by ID.

**Path Parameters:**

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `id`      | string | Response ID (e.g., `response-123`) |

**Response:** `CandidateResponse` object

**Error Response (404):**

```json
{
  "error": "Response not found"
}
```

**Example:**

```bash
GET /api/take-home/responses/response-42
```

---

### `PATCH /api/take-home/responses/:id`

Update a single candidate response.

**Path Parameters:**

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `id`      | string | Response ID (e.g., `response-123`) |

**Request Body:**

```json
{
  "reviewStatusId": "rs-3",
  "archivedAt": "2024-01-15T10:30:00.000Z"
}
```

| Field            | Type           | Description                                                 |
| ---------------- | -------------- | ----------------------------------------------------------- |
| `reviewStatusId` | string \| null | Review status ID (`rs-1` through `rs-6`) or `null` to clear |
| `archivedAt`     | string \| null | ISO 8601 timestamp or `null` to unarchive                   |

**Response:** Updated `CandidateResponse` object

**Error Responses:**

- `404`: Response not found
- `400`: Invalid review status ID

**Examples:**

```bash
# Set review status to "Technical Interview"
PATCH /api/take-home/responses/response-42
Content-Type: application/json

{
  "reviewStatusId": "rs-3"
}

# Archive a candidate
PATCH /api/take-home/responses/response-42
Content-Type: application/json

{
  "archivedAt": "2024-01-15T10:30:00.000Z"
}

# Clear review status
PATCH /api/take-home/responses/response-42
Content-Type: application/json

{
  "reviewStatusId": null
}
```

---

### `PATCH /api/take-home/responses`

Bulk update multiple responses. This follows RESTful conventions where `PATCH`
on a collection with an `ids` array performs a bulk partial update.

**Request Body:**

```json
{
  "ids": ["response-1", "response-2", "response-3"],
  "updates": {
    "reviewStatusId": "rs-2"
  }
}
```

| Field                    | Type           | Required | Description                               |
| ------------------------ | -------------- | -------- | ----------------------------------------- |
| `ids`                    | string[]       | Yes      | Array of response IDs to update           |
| `updates`                | object         | Yes      | Fields to update (same as single `PATCH`) |
| `updates.reviewStatusId` | string \| null | No       | Review status ID or null                  |
| `updates.archivedAt`     | string \| null | No       | Archive timestamp or null                 |

**Response:**

```json
{
  "updatedCount": 3
}
```

**Error Responses:**

- `400`: Invalid IDs array, response not found, or invalid review status

**Examples:**

```bash
# Bulk archive responses
PATCH /api/take-home/responses
Content-Type: application/json

{
  "ids": ["response-1", "response-2", "response-3"],
  "updates": {
    "archivedAt": "2024-01-15T10:30:00.000Z"
  }
}

# Bulk update review status
PATCH /api/take-home/responses
Content-Type: application/json

{
  "ids": ["response-10", "response-20", "response-30"],
  "updates": {
    "reviewStatusId": "rs-5"
  }
}
```

---

## Review Statuses

### `GET /api/take-home/review-statuses`

List all available review statuses.

**Response:**

```json
[
  { "id": "rs-1", "name": "New", "position": 1, "type": "screening" },
  { "id": "rs-2", "name": "Phone Screen", "position": 2, "type": "screening" },
  {
    "id": "rs-3",
    "name": "Technical Interview",
    "position": 3,
    "type": "interviewing"
  },
  {
    "id": "rs-4",
    "name": "Final Round",
    "position": 4,
    "type": "interviewing"
  },
  { "id": "rs-5", "name": "Offer Extended", "position": 5, "type": "offer" },
  { "id": "rs-6", "name": "Not a Fit", "position": 6, "type": "rejection" }
]
```

---

### `GET /api/take-home/review-statuses/:id`

Get a single review status by ID.

**Path Parameters:**

| Parameter | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| `id`      | string | Review status ID (e.g., `rs-1`) |

**Response:** `ReviewStatus` object

---

## Test Names

### `GET /api/take-home/test-names`

List all unique test/assessment names for filtering.

**Response:**

```json
[
  "Backend Developer Technical",
  "Data Engineering Assessment",
  "DevOps Engineer Evaluation",
  "Full Stack Take-Home",
  "Machine Learning Engineer Test",
  "Mobile Developer Technical",
  "Node.js Backend Challenge",
  "React Specialist Assessment",
  "Senior Frontend Engineer Assessment",
  "System Design Interview"
]
```

---

## Statistics

### `GET /api/take-home/stats`

Get summary statistics about the dataset.

**Response:**

```json
{
  "total": 50000,
  "active": 46022,
  "archived": 3978,
  "byState": {
    "completed": 40063,
    "in_progress": 4994,
    "pending": 4943
  }
}
```

---

## Server Actions

As an alternative to the REST API, you can use Server Actions for mutations.
Import them from `lib/actions.ts`:

```typescript
import {
  updateCandidateAction,
  archiveCandidateAction,
  unarchiveCandidateAction,
  setReviewStatusAction,
  bulkUpdateCandidatesAction,
  bulkArchiveAction,
  bulkUnarchiveAction,
  bulkSetReviewStatusAction,
} from "@/lib/actions";
```

### Available Actions

| Action                       | Parameters        | Description               |
| ---------------------------- | ----------------- | ------------------------- |
| `updateCandidateAction`      | `(id, updates)`   | Update a single candidate |
| `archiveCandidateAction`     | `(id)`            | Archive a candidate       |
| `unarchiveCandidateAction`   | `(id)`            | Unarchive a candidate     |
| `setReviewStatusAction`      | `(id, statusId)`  | Set review status         |
| `bulkUpdateCandidatesAction` | `(ids, updates)`  | Bulk update candidates    |
| `bulkArchiveAction`          | `(ids)`           | Bulk archive              |
| `bulkUnarchiveAction`        | `(ids)`           | Bulk unarchive            |
| `bulkSetReviewStatusAction`  | `(ids, statusId)` | Bulk set status           |

### Example Usage

```tsx
"use client";

import { archiveCandidateAction } from "@/lib/actions";

function ArchiveButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        const result = await archiveCandidateAction(id);
        if (result.success) {
          // Handle success
        } else {
          // Handle error: result.error
        }
      }}
    >
      Archive
    </button>
  );
}
```

### With Forms

```tsx
"use client";

import { setReviewStatusAction } from "@/lib/actions";
import { useActionState } from "react";

function StatusForm({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const statusId = formData.get("statusId") as string;
      return setReviewStatusAction(id, statusId);
    },
    null
  );

  return (
    <form action={formAction}>
      <select name="statusId" disabled={pending}>
        <option value="rs-1">New</option>
        <option value="rs-2">Phone Screen</option>
        {/* ... */}
      </select>
      <button type="submit" disabled={pending}>
        {pending ? "Updating..." : "Update"}
      </button>
      {state?.success === false && <p>{state.error}</p>}
    </form>
  );
}
```

---

## Type Definitions

All types are available in `lib/types.ts`.

### CandidateResponse

```typescript
type CandidateResponse = {
  id: string; // "response-123"
  candidateTest: {
    id: string; // "ct-123"
    state: CandidateTestState; // "pending" | "in_progress" | "completed"
    archivedAt: string | null; // ISO 8601 timestamp or null
    startedAt: string | null; // ISO 8601 timestamp or null
    completedAt: string | null; // ISO 8601 timestamp or null
    timeTakenSeconds: number | null;
  };
  user: {
    id: string; // "user-123"
    preferredName: string | null;
    name: string; // "Emma Smith"
    email: string; // "emma.smith@example.com"
    city: string | null; // "San Francisco"
    state: string | null; // "CA"
    country: string | null; // "United States"
  };
  test: {
    id: string; // "test-1"
    name: string; // "Senior Frontend Engineer Assessment"
  };
  reviewStatus: {
    id: string; // "rs-1"
    name: string; // "New"
    position: number; // 1
  } | null;
  aiScore: number | null; // 0-100 or null
  notesPreview: string | null; // Preview text or null
  notesCount: number; // Number of notes
};
```

### ReviewStatus

```typescript
type ReviewStatus = {
  id: string; // "rs-1"
  name: string; // "New"
  position: number; // 1 (for ordering)
  type: "screening" | "interviewing" | "offer" | "rejection";
};
```

### CandidateTestState

```typescript
type CandidateTestState = "pending" | "in_progress" | "completed";
```

### ListResponsesResult

```typescript
type ListResponsesResult = {
  rows: CandidateResponse[];
  total: number; // Total matching records
  hasNextPage: boolean;
};
```

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

| Status Code | Description                                   |
| ----------- | --------------------------------------------- |
| `200`       | Success                                       |
| `400`       | Bad request (invalid input, validation error) |
| `404`       | Resource not found                            |
