# MeritFirst Take-Home API Reference

Base URL: `https://mockapi.meritfirst.us`

All endpoints return JSON. CORS is enabled for all origins.

---

## Dataset Overview

The API serves **50,000 mock candidate responses** with:

- **~46,000 active** / **~4,000 archived** candidates
- **~40,000 completed** / **~5,000 in_progress** / **~5,000 pending** states
- **10 different assessment types**
- **6 review status stages**
- Seeded random data (consistent across requests)

---

## Responses

### `GET /take-home/responses`

List candidate responses with filtering, sorting, and pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number (1-indexed) |
| `pageSize` | number | `25` | Results per page (1-100) |
| `sort` | string | `"startedAt"` | Sort field: `startedAt`, `aiScore`, `testName`, `name` |
| `direction` | string | `"desc"` | Sort direction: `asc`, `desc` |
| `search` | string | — | Search by name, email, or test name (min 2 chars) |
| `archived` | string | `"active"` | Filter: `active`, `archived`, `all` |
| `testNames` | string | — | Comma-separated test names to filter |
| `states` | string | — | Comma-separated states: `pending`, `in_progress`, `completed` |
| `reviewStatusNames` | string | — | Comma-separated status names (use `None` for null) |

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
GET /take-home/responses

# Search for candidates named "smith"
GET /take-home/responses?search=smith

# Get completed candidates sorted by AI score (highest first)
GET /take-home/responses?states=completed&sort=aiScore&direction=desc

# Filter by multiple test names
GET /take-home/responses?testNames=Senior%20Frontend%20Engineer%20Assessment,Backend%20Developer%20Technical

# Get archived candidates with "New" review status
GET /take-home/responses?archived=archived&reviewStatusNames=New

# Get candidates with no review status assigned
GET /take-home/responses?reviewStatusNames=None

# Pagination with custom page size
GET /take-home/responses?page=5&pageSize=50
```

---

### `GET /take-home/responses/:id`

Get a single candidate response by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Response ID (e.g., `response-123`) |

**Response:** `CandidateResponse` object

**Error Response (404):**

```json
{
  "error": "Response not found"
}
```

**Example:**

```bash
GET /take-home/responses/response-42
```

---

### `PATCH /take-home/responses/:id`

Update a single candidate response.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Response ID (e.g., `response-123`) |

**Request Body:**

```json
{
  "reviewStatusId": "rs-3",
  "archivedAt": "2024-01-15T10:30:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `reviewStatusId` | string \| null | Review status ID (`rs-1` through `rs-6`) or `null` to clear |
| `archivedAt` | string \| null | ISO 8601 timestamp or `null` to unarchive |

**Response:** Updated `CandidateResponse` object

**Error Responses:**

- `404`: Response not found
- `400`: Invalid review status ID

**Examples:**

```bash
# Set review status to "Technical Interview"
PATCH /take-home/responses/response-42
Content-Type: application/json

{
  "reviewStatusId": "rs-3"
}

# Archive a candidate
PATCH /take-home/responses/response-42
Content-Type: application/json

{
  "archivedAt": "2024-01-15T10:30:00.000Z"
}

# Clear review status
PATCH /take-home/responses/response-42
Content-Type: application/json

{
  "reviewStatusId": null
}
```

---

### `POST /take-home/responses/bulk-update`

Update multiple candidate responses at once.

**Request Body:**

```json
{
  "ids": ["response-1", "response-2", "response-3"],
  "updates": {
    "reviewStatusId": "rs-2"
  },
  "useTransaction": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ids` | string[] | Yes | Array of response IDs to update |
| `updates` | object | Yes | Fields to update (same as PATCH) |
| `updates.reviewStatusId` | string \| null | No | Review status ID or null |
| `updates.archivedAt` | string \| null | No | Archive timestamp or null |
| `useTransaction` | boolean | No | Wrap in transaction for atomicity (default: `false`) |

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
# Bulk archive candidates
POST /take-home/responses/bulk-update
Content-Type: application/json

{
  "ids": ["response-1", "response-2", "response-3"],
  "updates": {
    "archivedAt": "2024-01-15T10:30:00.000Z"
  }
}

# Bulk update with transaction (atomic - all or nothing)
POST /take-home/responses/bulk-update
Content-Type: application/json

{
  "ids": ["response-10", "response-20", "response-30"],
  "updates": {
    "reviewStatusId": "rs-5"
  },
  "useTransaction": true
}
```

---

## Review Statuses

### `GET /take-home/review-statuses`

List all available review statuses.

**Response:**

```json
[
  { "id": "rs-1", "name": "New", "position": 1, "type": "screening" },
  { "id": "rs-2", "name": "Phone Screen", "position": 2, "type": "screening" },
  { "id": "rs-3", "name": "Technical Interview", "position": 3, "type": "interviewing" },
  { "id": "rs-4", "name": "Final Round", "position": 4, "type": "interviewing" },
  { "id": "rs-5", "name": "Offer Extended", "position": 5, "type": "offer" },
  { "id": "rs-6", "name": "Not a Fit", "position": 6, "type": "rejection" }
]
```

---

### `GET /take-home/review-statuses/:id`

Get a single review status by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Review status ID (e.g., `rs-1`) |

**Response:** `ReviewStatus` object

---

## Test Names

### `GET /take-home/test-names`

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

### `GET /take-home/stats`

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

## Type Definitions

### CandidateResponse

```typescript
type CandidateResponse = {
  id: string;                    // "response-123"
  candidateTest: {
    id: string;                  // "ct-123"
    state: CandidateTestState;   // "pending" | "in_progress" | "completed"
    archivedAt: string | null;   // ISO 8601 timestamp or null
    startedAt: string | null;    // ISO 8601 timestamp or null
    completedAt: string | null;  // ISO 8601 timestamp or null
    timeTakenSeconds: number | null;
  };
  user: {
    id: string;                  // "user-123"
    preferredName: string | null;
    name: string;                // "Emma Smith"
    email: string;               // "emma.smith@example.com"
    city: string | null;         // "San Francisco"
    state: string | null;        // "CA"
    country: string | null;      // "United States"
  };
  test: {
    id: string;                  // "test-1"
    name: string;                // "Senior Frontend Engineer Assessment"
  };
  reviewStatus: {
    id: string;                  // "rs-1"
    name: string;                // "New"
    position: number;            // 1
  } | null;
  aiScore: number | null;        // 0-100 or null
  notesPreview: string | null;   // Preview text or null
  notesCount: number;            // Number of notes
};
```

### ReviewStatus

```typescript
type ReviewStatus = {
  id: string;       // "rs-1"
  name: string;     // "New"
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
  total: number;      // Total matching records
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

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `400` | Bad request (invalid input, validation error) |
| `404` | Resource not found |

