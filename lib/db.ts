/**
 * In-memory database for the take-home assessment
 * Data persists during the dev session and resets on restart
 */

import type {
  CandidateResponse,
  CandidateTestState,
  DatasetStats,
  ListResponsesParams,
  ListResponsesResult,
  ResponseUpdateFields,
  ReviewStatus,
} from "./types";

// ============================================================================
// Seeded Random Generator (consistent data across restarts)
// ============================================================================

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
}

// ============================================================================
// Static Data
// ============================================================================

export const reviewStatuses: ReviewStatus[] = [
  { id: "rs-1", name: "New", position: 1, type: "screening" },
  { id: "rs-2", name: "Phone Screen", position: 2, type: "screening" },
  {
    id: "rs-3",
    name: "Technical Interview",
    position: 3,
    type: "interviewing",
  },
  { id: "rs-4", name: "Final Round", position: 4, type: "interviewing" },
  { id: "rs-5", name: "Offer Extended", position: 5, type: "offer" },
  { id: "rs-6", name: "Not a Fit", position: 6, type: "rejection" },
];

export const testNamesList = [
  "Senior Frontend Engineer Assessment",
  "Backend Developer Technical",
  "Full Stack Take-Home",
  "System Design Interview",
  "React Specialist Assessment",
  "Node.js Backend Challenge",
  "Data Engineering Assessment",
  "DevOps Engineer Evaluation",
  "Mobile Developer Technical",
  "Machine Learning Engineer Test",
];

// ============================================================================
// Mock Data Generation
// ============================================================================

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
  "Mia",
  "Lucas",
  "Charlotte",
  "James",
  "Amelia",
  "Benjamin",
  "Harper",
  "Elijah",
  "Evelyn",
  "Alexander",
  "Luna",
  "William",
  "Chloe",
  "Daniel",
  "Ella",
  "Henry",
  "Grace",
  "Sebastian",
  "Victoria",
  "Jack",
  "Aria",
  "Aiden",
  "Scarlett",
  "Owen",
  "Riley",
  "Samuel",
  "Zoey",
  "Ryan",
  "Nora",
  "Nathan",
  "Lily",
  "Carter",
  "Eleanor",
  "Luke",
  "Hannah",
  "Dylan",
  "Lillian",
  "Wyatt",
  "Addison",
  "Julian",
  "Aubrey",
  "Grayson",
  "Ellie",
  "Levi",
  "Stella",
  "Isaac",
  "Natalie",
  "Gabriel",
  "Zoe",
  "Caleb",
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
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Chen",
  "Kim",
  "Patel",
  "Singh",
  "Kumar",
  "Shah",
  "Wang",
  "Zhang",
  "Li",
  "Liu",
  "Yang",
  "Huang",
  "Wu",
  "Zhou",
  "Xu",
  "Sun",
  "Ma",
];

const cities = [
  { city: "San Francisco", state: "CA" },
  { city: "New York", state: "NY" },
  { city: "Austin", state: "TX" },
  { city: "Seattle", state: "WA" },
  { city: "Denver", state: "CO" },
  { city: "Boston", state: "MA" },
  { city: "Portland", state: "OR" },
  { city: "Chicago", state: "IL" },
  { city: "Los Angeles", state: "CA" },
  { city: "San Diego", state: "CA" },
  { city: "Phoenix", state: "AZ" },
  { city: "Dallas", state: "TX" },
  { city: "Houston", state: "TX" },
  { city: "Atlanta", state: "GA" },
  { city: "Miami", state: "FL" },
  { city: "Minneapolis", state: "MN" },
  { city: "Detroit", state: "MI" },
  { city: "Philadelphia", state: "PA" },
  { city: "Salt Lake City", state: "UT" },
  { city: "Nashville", state: "TN" },
  { city: "Raleigh", state: "NC" },
  { city: "Charlotte", state: "NC" },
  { city: "Remote", state: null },
];

const notesPreviews = [
  "Strong technical skills, needs culture fit interview",
  "Excellent problem solving, move to next round",
  "Good candidate, but timeline doesn't match",
  "Great communication, solid technical foundation",
  "Very impressive system design skills",
  "Needs more experience with distributed systems",
  "Outstanding code quality and testing practices",
  "Good potential, junior level currently",
  "Senior-level expertise, salary expectations high",
  "Perfect fit for the team, prioritize",
  "Strong algorithms knowledge, weaker on frontend",
  "Great React skills, consider for frontend team",
  "Solid backend experience, good debugging skills",
  "Impressive portfolio projects",
  "Quick learner, shows great initiative",
];

function generateMockResponses(count: number): CandidateResponse[] {
  const rng = new SeededRandom(42);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng.next() * arr.length)];

  const responses: CandidateResponse[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const testName = pick(testNamesList);
    const location = pick(cities);

    // Generate unique email
    let email: string;
    let emailAttempt = 0;
    do {
      const suffix = emailAttempt > 0 ? emailAttempt.toString() : "";
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@example.com`;
      emailAttempt++;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    // Generate dates - spread over the last 90 days
    const completedAt = new Date(
      Date.now() - rng.next() * 90 * 24 * 60 * 60 * 1000
    );
    const startedAt = new Date(
      completedAt.getTime() - rng.next() * 3 * 60 * 60 * 1000
    );

    // Weighted state distribution
    const stateRoll = rng.next();
    let state: CandidateTestState;
    if (stateRoll < 0.1) {
      state = "pending";
    } else if (stateRoll < 0.2) {
      state = "in_progress";
    } else {
      state = "completed";
    }

    // Review status - 70% have one
    const hasReviewStatus = rng.next() > 0.3;
    const reviewStatus = hasReviewStatus ? pick(reviewStatuses) : null;

    // AI score - only for completed tests, 80% have scores
    const hasScore = state === "completed" && rng.next() > 0.2;
    const aiScore = hasScore
      ? Math.min(100, Math.max(0, Math.floor(rng.next() * 50 + 50)))
      : null;

    // Notes - 30% have notes
    const hasNotes = rng.next() > 0.7;
    const notesPreview = hasNotes ? pick(notesPreviews) : null;

    // Archive - 8% are archived
    const isArchived = rng.next() > 0.92;

    responses.push({
      id: `response-${i + 1}`,
      candidateTest: {
        id: `ct-${i + 1}`,
        state,
        archivedAt: isArchived ? completedAt.toISOString() : null,
        startedAt: state !== "pending" ? startedAt.toISOString() : null,
        completedAt: state === "completed" ? completedAt.toISOString() : null,
        timeTakenSeconds:
          state === "completed"
            ? Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000)
            : null,
      },
      user: {
        id: `user-${i + 1}`,
        preferredName: rng.next() > 0.7 ? firstName : null,
        name: `${firstName} ${lastName}`,
        email,
        city: location.city,
        state: location.state,
        country: location.state ? "United States" : null,
      },
      test: {
        id: `test-${(i % testNamesList.length) + 1}`,
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
      notesPreview,
      notesCount: hasNotes ? Math.floor(rng.next() * 5) + 1 : 0,
    });
  }

  return responses;
}

// ============================================================================
// In-Memory Store (Singleton)
// ============================================================================

const CANDIDATE_COUNT = 50_000;

// Lazy initialization - data is generated on first access
let candidatesStore: CandidateResponse[] | null = null;

function getCandidates(): CandidateResponse[] {
  if (!candidatesStore) {
    console.log(
      `[db] Generating ${CANDIDATE_COUNT.toLocaleString()} mock candidates...`
    );
    const start = Date.now();
    candidatesStore = generateMockResponses(CANDIDATE_COUNT);
    console.log(`[db] Generated in ${Date.now() - start}ms`);
  }
  return candidatesStore;
}

// ============================================================================
// Database Operations
// ============================================================================

/**
 * List candidates with filtering, sorting, and pagination
 */
export function listCandidates(
  params: ListResponsesParams = {}
): ListResponsesResult {
  const {
    page = 1,
    pageSize = 25,
    sort = "startedAt",
    direction = "desc",
    search,
    archived = "active",
    testNames,
    states,
    reviewStatusNames,
  } = params;

  let results = getCandidates();

  // Filter: archived status
  if (archived === "active") {
    results = results.filter((r) => r.candidateTest.archivedAt === null);
  } else if (archived === "archived") {
    results = results.filter((r) => r.candidateTest.archivedAt !== null);
  }

  // Filter: search
  if (search && search.trim().length >= 2) {
    const searchLower = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.user.name.toLowerCase().includes(searchLower) ||
        r.user.email.toLowerCase().includes(searchLower) ||
        r.test.name.toLowerCase().includes(searchLower)
    );
  }

  // Filter: test names
  if (testNames && testNames.length > 0) {
    results = results.filter((r) => testNames.includes(r.test.name));
  }

  // Filter: states
  if (states && states.length > 0) {
    results = results.filter((r) => states.includes(r.candidateTest.state));
  }

  // Filter: review status names
  if (reviewStatusNames && reviewStatusNames.length > 0) {
    const includeNone = reviewStatusNames.includes("None");
    const namesOnly = reviewStatusNames.filter((n) => n !== "None");

    results = results.filter((r) => {
      if (r.reviewStatus === null) {
        return includeNone;
      }
      return namesOnly.includes(r.reviewStatus.name);
    });
  }

  const total = results.length;

  // Sort
  results = [...results].sort((a, b) => {
    let aVal: string | number | null;
    let bVal: string | number | null;

    switch (sort) {
      case "startedAt":
        aVal = a.candidateTest.startedAt;
        bVal = b.candidateTest.startedAt;
        break;
      case "aiScore":
        aVal = a.aiScore;
        bVal = b.aiScore;
        break;
      case "testName":
        aVal = a.test.name;
        bVal = b.test.name;
        break;
      case "name":
        aVal = a.user.preferredName || a.user.name;
        bVal = b.user.preferredName || b.user.name;
        break;
      default:
        aVal = a.candidateTest.startedAt;
        bVal = b.candidateTest.startedAt;
    }

    // Handle nulls
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return direction === "asc" ? 1 : -1;
    if (bVal === null) return direction === "asc" ? -1 : 1;

    // Compare
    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return direction === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  // Paginate
  const offset = (page - 1) * pageSize;
  const rows = results.slice(offset, offset + pageSize);
  const hasNextPage = offset + pageSize < total;

  return { rows, total, hasNextPage };
}

/**
 * Find a single candidate by ID
 */
export function findCandidateById(id: string): CandidateResponse | null {
  return getCandidates().find((r) => r.id === id) || null;
}

/**
 * Update a single candidate
 */
export function updateCandidate(
  id: string,
  updates: ResponseUpdateFields
): CandidateResponse | null {
  const candidates = getCandidates();
  const index = candidates.findIndex((r) => r.id === id);

  if (index === -1) return null;

  const candidate = candidates[index];

  // Apply updates
  if (updates.reviewStatusId !== undefined) {
    if (updates.reviewStatusId === null) {
      candidate.reviewStatus = null;
    } else {
      const status = reviewStatuses.find(
        (s) => s.id === updates.reviewStatusId
      );
      if (!status) {
        throw new Error(`Review status ${updates.reviewStatusId} not found`);
      }
      candidate.reviewStatus = {
        id: status.id,
        name: status.name,
        position: status.position,
      };
    }
  }

  if (updates.archivedAt !== undefined) {
    candidate.candidateTest.archivedAt = updates.archivedAt;
  }

  return candidate;
}

/**
 * Update multiple candidates
 */
export function updateManyCandidates(
  ids: string[],
  updates: ResponseUpdateFields
): number {
  let count = 0;
  for (const id of ids) {
    const result = updateCandidate(id, updates);
    if (result) count++;
  }
  return count;
}

/**
 * Get a review status by ID
 */
export function findReviewStatusById(id: string): ReviewStatus | null {
  return reviewStatuses.find((s) => s.id === id) || null;
}

/**
 * Get all unique test names
 */
export function getTestNames(): string[] {
  return [...testNamesList].sort();
}

/**
 * Get dataset statistics
 */
export function getStats(): DatasetStats {
  const candidates = getCandidates();

  let active = 0;
  let archived = 0;
  let completed = 0;
  let in_progress = 0;
  let pending = 0;

  for (const c of candidates) {
    if (c.candidateTest.archivedAt === null) {
      active++;
    } else {
      archived++;
    }

    switch (c.candidateTest.state) {
      case "completed":
        completed++;
        break;
      case "in_progress":
        in_progress++;
        break;
      case "pending":
        pending++;
        break;
    }
  }

  return {
    total: candidates.length,
    active,
    archived,
    byState: {
      completed,
      in_progress,
      pending,
    },
  };
}

/**
 * Reset the database (for testing)
 */
export function resetDatabase(): void {
  candidatesStore = null;
}
