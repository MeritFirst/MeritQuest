/**
 * DO NOT MODIFY THIS FILE
 *
 * Database Interface - Use this for all data operations
 *
 * This file provides a database-like API for querying and mutating candidate responses.
 * Import and use the `db` object in your server actions.
 *
 * Key methods:
 * - db.responses.list() - Query with filters/sort/pagination
 * - db.responses.update() - Update single response
 * - db.responses.updateMany() - Bulk update (requires transaction)
 * - db.transaction() - Wrap operations for atomicity
 *
 * See docs/api-reference.md for full documentation and examples.
 */

import type {
  CandidateResponse,
  ReviewStatus,
  ListResponsesParams,
  ListResponsesResult,
  ResponseUpdateFields,
} from "./data";
import { listResponses as dataListResponses, getInternalStores } from "./data";

// Transaction state management
let transactionDepth = 0;
let transactionSnapshot: CandidateResponse[] | null = null;

/**
 * Database interface
 */
export const db = {
  /**
   * Query responses with filters, sorting, and pagination
   */
  responses: {
    /**
     * List responses with optional filters
     */
    list: async (params: ListResponsesParams = {}): Promise<ListResponsesResult> => {
      return dataListResponses(params);
    },

    /**
     * Find a single response by ID
     */
    findById: async (id: string): Promise<CandidateResponse | null> => {
      const { responsesStore } = getInternalStores();
      const response = responsesStore.find((r) => r.id === id);
      return response ?? null;
    },

    /**
     * Update a single response
     * Returns the number of rows updated (0 or 1)
     */
    update: async (id: string, updates: ResponseUpdateFields): Promise<number> => {
      const { responsesStore, reviewStatusesStore } = getInternalStores();
      const response = responsesStore.find((r) => r.id === id);
      if (!response) {
        return 0;
      }

      if (updates.reviewStatusId !== undefined) {
        if (updates.reviewStatusId === null) {
          response.reviewStatus = null;
        } else {
          const status = reviewStatusesStore.find((s) => s.id === updates.reviewStatusId);
          if (!status) {
            throw new Error(`Review status ${updates.reviewStatusId} not found`);
          }
          response.reviewStatus = {
            id: status.id,
            name: status.name,
            position: status.position,
          };
        }
      }

      if (updates.archivedAt !== undefined) {
        response.candidateTest.archivedAt = updates.archivedAt;
      }

      return 1;
    },

    /**
     * Update multiple responses (requires transaction for atomicity)
     * Returns the number of rows updated
     * This is intentionally designed to throw an error partway through
     * if not wrapped in a transaction, to test candidate understanding.
     */
    updateMany: async (ids: string[], updates: ResponseUpdateFields): Promise<number> => {
      const { responsesStore, reviewStatusesStore } = getInternalStores();
      let updatedCount = 0;

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const response = responsesStore.find((r) => r.id === id);

        if (!response) {
          throw new Error(`Response ${id} not found (at index ${i})`);
        }

        // Simulate a validation that could fail mid-update
        if (updates.reviewStatusId && !reviewStatusesStore.find((s) => s.id === updates.reviewStatusId)) {
          throw new Error(`Invalid review status ${updates.reviewStatusId} (at index ${i})`);
        }

        const rowsUpdated = await db.responses.update(id, updates);
        updatedCount += rowsUpdated;
      }

      return updatedCount;
    },
  },

  reviewStatuses: {
    list: async (): Promise<ReviewStatus[]> => {
      const { reviewStatusesStore } = getInternalStores();
      return [...reviewStatusesStore];
    },

    findById: async (id: string): Promise<ReviewStatus | null> => {
      const { reviewStatusesStore } = getInternalStores();
      return reviewStatusesStore.find((s) => s.id === id) ?? null;
    },
  },

  /**
   * Transaction support for atomic operations
   *
   * Usage:
   * await db.transaction(async () => {
   *   await db.responses.updateMany(ids, { reviewStatusId: 'rs-1' });
   *   await db.responses.updateMany(otherIds, { archivedAt: new Date().toISOString() });
   * });
   *
   * If any operation throws, all changes are rolled back.
   */
  transaction: async <T>(fn: () => Promise<T>): Promise<T> => {
    const { responsesStore, setResponsesStore } = getInternalStores();
    transactionDepth++;

    // Only create snapshot at outermost transaction
    if (transactionDepth === 1) {
      transactionSnapshot = JSON.parse(JSON.stringify(responsesStore));
    }

    try {
      const result = await fn();
      transactionDepth--;

      // Clear snapshot on successful completion of outermost transaction
      if (transactionDepth === 0) {
        transactionSnapshot = null;
      }

      return result;
    } catch (error) {
      transactionDepth--;

      // Rollback on error at outermost transaction
      if (transactionDepth === 0 && transactionSnapshot !== null) {
        setResponsesStore(transactionSnapshot);
        transactionSnapshot = null;
      }

      throw error;
    }
  },
};
