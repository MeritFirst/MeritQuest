"use server";

/**
 * Server Actions for data mutations
 *
 * Use these instead of API routes for a more React-native approach.
 * Server Actions integrate seamlessly with React's form handling and
 * provide automatic revalidation.
 *
 * @see https://nextjs.org/docs/app/getting-started/updating-data
 */

import { revalidatePath } from "next/cache";
import { findCandidateById, updateCandidate, updateManyCandidates } from "./db";
import type {
  BulkUpdateResult,
  CandidateResponse,
  ResponseUpdateFields,
} from "./types";

// ============================================================================
// Single Candidate Actions
// ============================================================================

/**
 * Update a single candidate's review status and/or archived state
 */
export async function updateCandidateAction(
  id: string,
  updates: ResponseUpdateFields
): Promise<
  { success: true; data: CandidateResponse } | { success: false; error: string }
> {
  try {
    const result = updateCandidate(id, updates);

    if (!result) {
      return { success: false, error: "Candidate not found" };
    }

    revalidatePath("/responses");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
}

/**
 * Archive a single candidate
 */
export async function archiveCandidateAction(
  id: string
): Promise<
  { success: true; data: CandidateResponse } | { success: false; error: string }
> {
  return updateCandidateAction(id, { archivedAt: new Date().toISOString() });
}

/**
 * Unarchive a single candidate
 */
export async function unarchiveCandidateAction(
  id: string
): Promise<
  { success: true; data: CandidateResponse } | { success: false; error: string }
> {
  return updateCandidateAction(id, { archivedAt: null });
}

/**
 * Set a candidate's review status
 */
export async function setReviewStatusAction(
  id: string,
  reviewStatusId: string | null
): Promise<
  { success: true; data: CandidateResponse } | { success: false; error: string }
> {
  return updateCandidateAction(id, { reviewStatusId });
}

// ============================================================================
// Bulk Actions
// ============================================================================

/**
 * Update multiple candidates at once
 */
export async function bulkUpdateCandidatesAction(
  ids: string[],
  updates: ResponseUpdateFields
): Promise<
  { success: true; data: BulkUpdateResult } | { success: false; error: string }
> {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { success: false, error: "ids must be a non-empty array" };
  }

  try {
    const updatedCount = updateManyCandidates(ids, updates);
    revalidatePath("/responses");
    return { success: true, data: { updatedCount } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bulk update failed",
    };
  }
}

/**
 * Archive multiple candidates
 */
export async function bulkArchiveAction(
  ids: string[]
): Promise<
  { success: true; data: BulkUpdateResult } | { success: false; error: string }
> {
  return bulkUpdateCandidatesAction(ids, {
    archivedAt: new Date().toISOString(),
  });
}

/**
 * Unarchive multiple candidates
 */
export async function bulkUnarchiveAction(
  ids: string[]
): Promise<
  { success: true; data: BulkUpdateResult } | { success: false; error: string }
> {
  return bulkUpdateCandidatesAction(ids, { archivedAt: null });
}

/**
 * Set review status for multiple candidates
 */
export async function bulkSetReviewStatusAction(
  ids: string[],
  reviewStatusId: string | null
): Promise<
  { success: true; data: BulkUpdateResult } | { success: false; error: string }
> {
  return bulkUpdateCandidatesAction(ids, { reviewStatusId });
}

// ============================================================================
// Helper: Get candidate (for optimistic updates)
// ============================================================================

/**
 * Get a candidate by ID (useful for refreshing data after mutations)
 */
export async function getCandidateAction(
  id: string
): Promise<CandidateResponse | null> {
  return findCandidateById(id);
}
