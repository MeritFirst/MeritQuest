"use client";

import useSWR from "swr";
import type {
  CandidateResponse,
  ListResponsesResult,
  ReviewStatus,
} from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export type ResponseFilters = {
  page: number;
  pageSize: number;
  sort: "startedAt" | "aiScore" | "testName" | "name";
  direction: "asc" | "desc";
  search: string;
  archived: "active" | "archived" | "all";
  testNames: string[];
  states: string[];
  reviewStatusNames: string[];
};

export const defaultFilters: ResponseFilters = {
  page: 1,
  pageSize: 25,
  sort: "startedAt",
  direction: "desc",
  search: "",
  archived: "active",
  testNames: [],
  states: [],
  reviewStatusNames: [],
};

function buildQueryString(filters: ResponseFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize));
  params.set("sort", filters.sort);
  params.set("direction", filters.direction);
  params.set("archived", filters.archived);

  if (filters.search.length >= 2) {
    params.set("search", filters.search);
  }
  if (filters.testNames.length > 0) {
    params.set("testNames", filters.testNames.join(","));
  }
  if (filters.states.length > 0) {
    params.set("states", filters.states.join(","));
  }
  if (filters.reviewStatusNames.length > 0) {
    params.set("reviewStatusNames", filters.reviewStatusNames.join(","));
  }

  return params.toString();
}

export function useResponses(filters: ResponseFilters) {
  const queryString = buildQueryString(filters);
  const { data, error, isLoading, mutate } = useSWR<ListResponsesResult>(
    `/api/take-home/responses?${queryString}`,
    fetcher,
    { keepPreviousData: true }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export function useReviewStatuses() {
  const { data, error, isLoading } = useSWR<ReviewStatus[]>(
    "/api/take-home/review-statuses",
    fetcher
  );
  return { statuses: data ?? [], error, isLoading };
}

export function useTestNames() {
  const { data, error, isLoading } = useSWR<string[]>(
    "/api/take-home/test-names",
    fetcher
  );
  return { testNames: data ?? [], error, isLoading };
}


