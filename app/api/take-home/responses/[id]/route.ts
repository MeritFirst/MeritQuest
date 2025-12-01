import { findCandidateById, updateCandidate } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/take-home/responses/:id
 * Get a single candidate by ID
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const candidate = findCandidateById(id);

  if (!candidate) {
    return NextResponse.json({ error: "Response not found" }, { status: 404 });
  }

  return NextResponse.json(candidate);
}

/**
 * PATCH /api/take-home/responses/:id
 * Update a single candidate
 *
 * Body: { reviewStatusId?: string | null, archivedAt?: string | null }
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();
    const candidate = updateCandidate(id, body);

    if (!candidate) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(candidate);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 }
    );
  }
}
