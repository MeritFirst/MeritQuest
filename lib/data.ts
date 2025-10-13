/**
 * DO NOT MODIFY THIS FILE
 *
 * This file contains type definitions and helper functions for querying data.
 * Use the database interface in `lib/db.ts` for all data operations.
 *
 * Import types from here, but use `db` from `lib/db.ts` for queries and mutations.
 */

import { unstable_cache } from "next/cache";

export const REQUIRED_TENANT = "demo-employer";
export const ORG_ID = "org-demo-001";

export type ReviewStatus = {
  id: string;
  name: string;
  position: number;
  type: "screening" | "interviewing" | "offer" | "rejection";
};

export type CandidateTestState = "pending" | "in_progress" | "completed";

export type CandidateResponse = {
  id: string;
  candidateTest: {
    id: string;
    state: CandidateTestState;
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
  reviewStatus: Pick<ReviewStatus, "id" | "name" | "position"> | null;
  aiScore: number | null;
  notesPreview: string | null;
  notesCount: number;
};

export type ListResponsesParams = {
  page?: number;
  pageSize?: number;
  sort?: "startedAt" | "aiScore" | "testName" | "name";
  direction?: "asc" | "desc";
  search?: string;
  archived?: "active" | "archived" | "all";
  filters?: {
    testNames?: string[];
    states?: CandidateTestState[];
    reviewStatusNames?: string[];
  };
};

export type ListResponsesResult = {
  rows: CandidateResponse[];
  total: number;
  hasNextPage: boolean;
};

/**
 * Fields that can be updated on a CandidateResponse
 */
export type ResponseUpdateFields = {
  reviewStatusId?: string | null;
  archivedAt?: string | null;
};

// In-memory data stores
const reviewStatusesStore: ReviewStatus[] = [
  { id: "rs-1", name: "New", position: 1, type: "screening" },
  { id: "rs-2", name: "Phone Screen", position: 2, type: "screening" },
  { id: "rs-3", name: "Technical Interview", position: 3, type: "interviewing" },
  { id: "rs-4", name: "Final Round", position: 4, type: "interviewing" },
  { id: "rs-5", name: "Offer Extended", position: 5, type: "offer" },
  { id: "rs-6", name: "Not a Fit", position: 6, type: "rejection" },
];

let responsesStore: CandidateResponse[] = [];

// Cache tags
export const responsesListTag = "responses:list";
export const responseTag = (responseId: string) => `response:${responseId}`;

// Generate mock data
function generateMockResponses(count: number): CandidateResponse[] {
  const testNames = [
    "Senior Frontend Engineer Assessment",
    "Backend Developer Technical",
    "Full Stack Take-Home",
    "System Design Interview",
    "React Specialist Assessment",
  ];

  const firstNames = [
    "Emma",
    "Liam",
    "Olivia",
    "Noah",
    "Ava",
    "Ethan",
    "Sophia",
    "Mason",
    "Isabella",
    "Logan",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ];
  const cities = [
    "San Francisco",
    "New York",
    "Austin",
    "Seattle",
    "Denver",
    "Boston",
    "Portland",
    "Chicago",
  ];
  const states = ["CA", "NY", "TX", "WA", "CO", "MA", "OR", "IL"];

  const responses: CandidateResponse[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const testName = testNames[Math.floor(Math.random() * testNames.length)];
    const cityIndex = Math.floor(Math.random() * cities.length);

    const completedAt = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    );
    const startedAt = new Date(
      completedAt.getTime() - Math.random() * 2 * 60 * 60 * 1000,
    );

    const stateOptions: CandidateTestState[] = [
      "pending",
      "in_progress",
      "completed",
      "completed",
      "completed",
    ];
    const state = stateOptions[Math.floor(Math.random() * stateOptions.length)];

    const hasReviewStatus = Math.random() > 0.3;
    const reviewStatus = hasReviewStatus
      ? reviewStatusesStore[
          Math.floor(Math.random() * reviewStatusesStore.length)
        ]
      : null;

    const hasScore = state === "completed" && Math.random() > 0.2;
    const aiScore = hasScore ? Math.floor(Math.random() * 40) + 60 : null;

    const hasNotes = Math.random() > 0.7;
    const notesPreviews = [
      "Strong technical skills, needs culture fit interview",
      "Excellent problem solving, move to next round",
      "Good candidate, but timeline doesn't match",
      "Great communication, solid technical foundation",
    ];

    responses.push({
      id: `response-${i + 1}`,
      candidateTest: {
        id: `ct-${i + 1}`,
        state,
        archivedAt: Math.random() > 0.9 ? completedAt.toISOString() : null,
        startedAt: state !== "pending" ? startedAt.toISOString() : null,
        completedAt: state === "completed" ? completedAt.toISOString() : null,
        timeTakenSeconds:
          state === "completed"
            ? Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000)
            : null,
      },
      user: {
        id: `user-${i + 1}`,
        preferredName: Math.random() > 0.7 ? firstName : null,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        city: cities[cityIndex],
        state: states[cityIndex],
        country: "United States",
      },
      test: {
        id: `test-${Math.floor(Math.random() * 5) + 1}`,
        name: testName,
      },
      reviewStatus: reviewStatus
        ? {
            id: reviewStatus.id,
            name: reviewStatus.name,
            position: reviewStatus.position,
          }
        : null,
      aiScore,
      notesPreview: hasNotes
        ? notesPreviews[Math.floor(Math.random() * notesPreviews.length)]
        : null,
      notesCount: hasNotes ? Math.floor(Math.random() * 3) + 1 : 0,
    });
  }

  return responses;
}

// Initialize with mock data
if (responsesStore.length === 0) {
  responsesStore = generateMockResponses(5000);
}

export async function listResponses(
  params: ListResponsesParams = {},
): Promise<ListResponsesResult> {
  // Simulate network delay for main data fetch (1-2s)
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

  const {
    page = 1,
    pageSize = 10,
    sort = "startedAt",
    direction = "desc",
    search,
    archived = "active",
    filters = {},
  } = params;

  let filtered = [...responsesStore];

  // Apply archived filter
  if (archived === "active") {
    filtered = filtered.filter((r) => r.candidateTest.archivedAt === null);
  } else if (archived === "archived") {
    filtered = filtered.filter((r) => r.candidateTest.archivedAt !== null);
  }

  // Apply search
  if (search && search.trim().length >= 2) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.test.name.toLowerCase().includes(query) ||
        r.user.email.toLowerCase().includes(query) ||
        r.user.name.toLowerCase().includes(query),
    );
  }

  // Apply filters
  if (filters.testNames && filters.testNames.length > 0) {
    filtered = filtered.filter((r) => filters.testNames?.includes(r.test.name));
  }

  if (filters.states && filters.states.length > 0) {
    filtered = filtered.filter((r) =>
      filters.states?.includes(r.candidateTest.state),
    );
  }

  if (filters.reviewStatusNames && filters.reviewStatusNames.length > 0) {
    const includeNone = filters.reviewStatusNames.includes("None");
    const namesOnly = filters.reviewStatusNames.filter((n) => n !== "None");

    filtered = filtered.filter((r) => {
      if (includeNone && r.reviewStatus === null) return true;
      if (namesOnly.length > 0 && r.reviewStatus !== null) {
        return namesOnly.includes(r.reviewStatus.name);
      }
      return false;
    });
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aVal: string | number | null;
    let bVal: string | number | null;

    if (sort === "aiScore") {
      aVal = a.aiScore;
      bVal = b.aiScore;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
    } else if (sort === "testName") {
      aVal = a.test.name;
      bVal = b.test.name;
    } else if (sort === "name") {
      aVal = a.user.preferredName ?? a.user.name;
      bVal = b.user.preferredName ?? b.user.name;
    } else {
      aVal = a.candidateTest.startedAt;
      bVal = b.candidateTest.startedAt;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const total = filtered.length;
  const offset = (page - 1) * pageSize;
  const paged = filtered.slice(offset, offset + pageSize + 1);

  const hasNextPage = paged.length > pageSize;
  const rows = hasNextPage ? paged.slice(0, pageSize) : paged;

  return { rows, total, hasNextPage };
}

/**
 * Simulates a slower API call for review statuses
 * Useful for demonstrating streaming/Suspense boundaries
 */
export async function getReviewStatuses(): Promise<ReviewStatus[]> {
  return unstable_cache(
    async () => {
      // Simulate network delay (2-4s)
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000));
      return [...reviewStatusesStore];
    },
    ["review-statuses"],
    { tags: ["review-statuses:list"] },
  )();
}

/**
 * Simulates a slower API call for test names
 * Useful for demonstrating streaming/Suspense boundaries
 */
export async function getTestNames(): Promise<string[]> {
  // Simulate network delay (3-5s)
  await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 2000));
  const uniqueNames = new Set(responsesStore.map((r) => r.test.name));
  return Array.from(uniqueNames).sort();
}

export function requiredTenantHeader() {
  return { header: "x-tenant", value: REQUIRED_TENANT } as const;
}

/**
 * Internal function for db.ts to access data stores
 * DO NOT use this directly - use the db interface instead
 */
export function getInternalStores() {
  return {
    responsesStore,
    reviewStatusesStore,
    setResponsesStore: (newStore: CandidateResponse[]) => {
      responsesStore = newStore;
    },
  };
}
