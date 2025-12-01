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
  testNames?: string[];
  states?: CandidateTestState[];
  reviewStatusNames?: string[];
};

export type ListResponsesResult = {
  rows: CandidateResponse[];
  total: number;
  hasNextPage: boolean;
};

export type ResponseUpdateFields = {
  reviewStatusId?: string | null;
  archivedAt?: string | null;
};

export type BulkUpdateRequest = {
  ids: string[];
  updates: ResponseUpdateFields;
  useTransaction?: boolean;
};

export type BulkUpdateResult = {
  updatedCount: number;
};

export type DatasetStats = {
  total: number;
  active: number;
  archived: number;
  byState: {
    completed: number;
    in_progress: number;
    pending: number;
  };
};

// API base URL - use relative path for local API routes
export const API_BASE_URL = "/api";
