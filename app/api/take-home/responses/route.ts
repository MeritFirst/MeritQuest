import { listCandidates, updateManyCandidates } from "@/lib/db";
import type { CandidateTestState, ListResponsesParams } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/take-home/responses
 * List responses with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params: ListResponsesParams = {
    page: searchParams.get("page")
      ? Math.max(1, parseInt(searchParams.get("page")!, 10))
      : 1,
    pageSize: searchParams.get("pageSize")
      ? Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize")!, 10)))
      : 25,
    sort:
      (searchParams.get("sort") as ListResponsesParams["sort"]) || "startedAt",
    direction: (searchParams.get("direction") as "asc" | "desc") || "desc",
    search: searchParams.get("search") || undefined,
    archived:
      (searchParams.get("archived") as "active" | "archived" | "all") ||
      "active",
  };

  // Parse array filters
  const testNames = searchParams.get("testNames");
  if (testNames) {
    params.testNames = testNames.split(",").map((s) => s.trim());
  }

  const states = searchParams.get("states");
  if (states) {
    params.states = states
      .split(",")
      .map((s) => s.trim()) as CandidateTestState[];
  }

  const reviewStatusNames = searchParams.get("reviewStatusNames");
  if (reviewStatusNames) {
    params.reviewStatusNames = reviewStatusNames
      .split(",")
      .map((s) => s.trim());
  }

  const result = listCandidates(params);
  return NextResponse.json(result);
}

/**
 * PATCH /api/take-home/responses
 * Bulk update multiple responses
 *
 * Body: { ids: string[], updates: { reviewStatusId?: string | null, archivedAt?: string | null } }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, updates } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "updates must be an object" },
        { status: 400 }
      );
    }

    const updatedCount = updateManyCandidates(ids, updates);
    return NextResponse.json({ updatedCount });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bulk update failed" },
      { status: 400 }
    );
  }
}
