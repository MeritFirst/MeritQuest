import { describe, it, expect, vi, beforeEach } from "vitest";
import { db } from "@/lib/db";

vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) => ({
      json: async () => data,
      status: init?.status ?? 200,
    }),
  },
}));

describe("API Routes Logic", () => {
  describe("update-status", () => {
    it("updates single response status", async () => {
      const listResult = await db.responses.list({ pageSize: 1 });
      const response = listResult.rows[0];
      const originalStatus = response.reviewStatus?.id;

      const count = await db.responses.update(response.id, {
        reviewStatusId: "rs-2",
      });

      expect(count).toBe(1);

      const updated = await db.responses.findById(response.id);
      expect(updated?.reviewStatus?.id).toBe("rs-2");

      await db.responses.update(response.id, {
        reviewStatusId: originalStatus ?? null,
      });
    });

    it("returns 0 for invalid response id", async () => {
      const count = await db.responses.update("invalid-id", {
        reviewStatusId: "rs-1",
      });
      expect(count).toBe(0);
    });
  });

  describe("bulk-archive", () => {
    it("archives multiple responses in transaction", async () => {
      const listResult = await db.responses.list({
        archived: "active",
        pageSize: 3,
      });
      const ids = listResult.rows.map((r) => r.id);

      let count = 0;
      await db.transaction(async () => {
        count = await db.responses.updateMany(ids, {
          archivedAt: new Date().toISOString(),
        });
      });

      expect(count).toBe(3);

      for (const id of ids) {
        const response = await db.responses.findById(id);
        expect(response?.candidateTest.archivedAt).not.toBeNull();
      }

      await db.transaction(async () => {
        await db.responses.updateMany(ids, { archivedAt: null });
      });
    });

    it("unarchives multiple responses", async () => {
      const listResult = await db.responses.list({
        archived: "active",
        pageSize: 2,
      });
      const ids = listResult.rows.map((r) => r.id);

      await db.transaction(async () => {
        await db.responses.updateMany(ids, {
          archivedAt: new Date().toISOString(),
        });
      });

      await db.transaction(async () => {
        await db.responses.updateMany(ids, { archivedAt: null });
      });

      for (const id of ids) {
        const response = await db.responses.findById(id);
        expect(response?.candidateTest.archivedAt).toBeNull();
      }
    });
  });

  describe("bulk-status", () => {
    it("updates status for multiple responses", async () => {
      const listResult = await db.responses.list({ pageSize: 3 });
      const ids = listResult.rows.map((r) => r.id);
      const originalStatuses = listResult.rows.map((r) => r.reviewStatus?.id);

      let count = 0;
      await db.transaction(async () => {
        count = await db.responses.updateMany(ids, { reviewStatusId: "rs-5" });
      });

      expect(count).toBe(3);

      for (const id of ids) {
        const response = await db.responses.findById(id);
        expect(response?.reviewStatus?.id).toBe("rs-5");
      }

      for (let i = 0; i < ids.length; i++) {
        await db.responses.update(ids[i], {
          reviewStatusId: originalStatuses[i] ?? null,
        });
      }
    });

    it("clears status for multiple responses", async () => {
      const listResult = await db.responses.list({ pageSize: 2 });
      const ids = listResult.rows.map((r) => r.id);
      const originalStatuses = listResult.rows.map((r) => r.reviewStatus?.id);

      await db.transaction(async () => {
        await db.responses.updateMany(ids, { reviewStatusId: "rs-1" });
      });

      await db.transaction(async () => {
        await db.responses.updateMany(ids, { reviewStatusId: null });
      });

      for (const id of ids) {
        const response = await db.responses.findById(id);
        expect(response?.reviewStatus).toBeNull();
      }

      for (let i = 0; i < ids.length; i++) {
        await db.responses.update(ids[i], {
          reviewStatusId: originalStatuses[i] ?? null,
        });
      }
    });

    it("throws error for invalid status id in updateMany", async () => {
      const listResult = await db.responses.list({ pageSize: 2 });
      const ids = listResult.rows.map((r) => r.id);

      await expect(
        db.transaction(async () => {
          await db.responses.updateMany(ids, {
            reviewStatusId: "invalid-status-id",
          });
        })
      ).rejects.toThrow();
    });
  });
});

