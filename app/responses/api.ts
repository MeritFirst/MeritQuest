import type { CandidateResponse, BulkUpdateResult } from "@/lib/types";

export async function updateCandidate(
  id: string,
  updates: { reviewStatusId?: string | null; archivedAt?: string | null }
): Promise<CandidateResponse> {
  const res = await fetch(`/api/take-home/responses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Update failed");
  }
  return res.json();
}

export async function archiveCandidate(id: string): Promise<CandidateResponse> {
  return updateCandidate(id, { archivedAt: new Date().toISOString() });
}

export async function unarchiveCandidate(id: string): Promise<CandidateResponse> {
  return updateCandidate(id, { archivedAt: null });
}

export async function setReviewStatus(
  id: string,
  reviewStatusId: string | null
): Promise<CandidateResponse> {
  return updateCandidate(id, { reviewStatusId });
}

export async function bulkUpdateCandidates(
  ids: string[],
  updates: { reviewStatusId?: string | null; archivedAt?: string | null }
): Promise<BulkUpdateResult> {
  const res = await fetch("/api/take-home/responses", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, updates }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Bulk update failed");
  }
  return res.json();
}

export async function bulkArchive(ids: string[]): Promise<BulkUpdateResult> {
  return bulkUpdateCandidates(ids, { archivedAt: new Date().toISOString() });
}

export async function bulkUnarchive(ids: string[]): Promise<BulkUpdateResult> {
  return bulkUpdateCandidates(ids, { archivedAt: null });
}

export async function bulkSetReviewStatus(
  ids: string[],
  reviewStatusId: string | null
): Promise<BulkUpdateResult> {
  return bulkUpdateCandidates(ids, { reviewStatusId });
}


