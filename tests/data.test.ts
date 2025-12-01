import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import type { ListResponsesParams } from "@/lib/data";

describe("db.responses.list", () => {
  describe("pagination", () => {
    it("returns correct page size", async () => {
      const result = await db.responses.list({ pageSize: 10 });
      expect(result.rows.length).toBeLessThanOrEqual(10);
    });

    it("returns different results for different pages", async () => {
      const page1 = await db.responses.list({ page: 1, pageSize: 5 });
      const page2 = await db.responses.list({ page: 2, pageSize: 5 });

      expect(page1.rows[0].id).not.toBe(page2.rows[0].id);
    });

    it("returns hasNextPage correctly", async () => {
      const result = await db.responses.list({ page: 1, pageSize: 10 });
      expect(result.hasNextPage).toBe(true);
      expect(result.total).toBeGreaterThan(10);
    });

    it("returns total count", async () => {
      const result = await db.responses.list({});
      expect(result.total).toBeGreaterThan(0);
    });
  });

  describe("sorting", () => {
    it("sorts by aiScore descending", async () => {
      const result = await db.responses.list({
        sort: "aiScore",
        direction: "desc",
        pageSize: 20,
      });

      const scores = result.rows
        .map((r) => r.aiScore)
        .filter((s): s is number => s !== null);

      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
      }
    });

    it("sorts by aiScore ascending", async () => {
      const result = await db.responses.list({
        sort: "aiScore",
        direction: "asc",
        pageSize: 20,
      });

      const scores = result.rows
        .map((r) => r.aiScore)
        .filter((s): s is number => s !== null);

      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
      }
    });

    it("sorts by name ascending", async () => {
      const result = await db.responses.list({
        sort: "name",
        direction: "asc",
        pageSize: 20,
      });

      const names = result.rows.map(
        (r) => r.user.preferredName ?? r.user.name
      );

      for (let i = 1; i < names.length; i++) {
        expect(names[i].localeCompare(names[i - 1])).toBeGreaterThanOrEqual(0);
      }
    });

    it("sorts by testName", async () => {
      const result = await db.responses.list({
        sort: "testName",
        direction: "asc",
        pageSize: 20,
      });

      const testNames = result.rows.map((r) => r.test.name);

      for (let i = 1; i < testNames.length; i++) {
        expect(testNames[i].localeCompare(testNames[i - 1])).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("filtering", () => {
    it("filters by search term (name)", async () => {
      const result = await db.responses.list({
        search: "emma",
        pageSize: 50,
      });

      result.rows.forEach((r) => {
        const matchesName = r.user.name.toLowerCase().includes("emma");
        const matchesEmail = r.user.email.toLowerCase().includes("emma");
        expect(matchesName || matchesEmail).toBe(true);
      });
    });

    it("filters by search term (email)", async () => {
      const result = await db.responses.list({
        search: "@example.com",
        pageSize: 50,
      });

      result.rows.forEach((r) => {
        expect(r.user.email).toContain("@example.com");
      });
    });

    it("filters by test names", async () => {
      const testName = "Senior Frontend Engineer Assessment";
      const result = await db.responses.list({
        filters: { testNames: [testName] },
        pageSize: 50,
      });

      result.rows.forEach((r) => {
        expect(r.test.name).toBe(testName);
      });
    });

    it("filters by multiple test names", async () => {
      const testNames = [
        "Senior Frontend Engineer Assessment",
        "Backend Developer Technical",
      ];
      const result = await db.responses.list({
        filters: { testNames },
        pageSize: 50,
      });

      result.rows.forEach((r) => {
        expect(testNames).toContain(r.test.name);
      });
    });

    it("filters by state", async () => {
      const result = await db.responses.list({
        filters: { states: ["completed"] },
        pageSize: 50,
      });

      result.rows.forEach((r) => {
        expect(r.candidateTest.state).toBe("completed");
      });
    });

    it("filters by multiple states", async () => {
      const states = ["pending", "in_progress"] as const;
      const result = await db.responses.list({
        filters: { states: [...states] },
        pageSize: 50,
      });

      result.rows.forEach((r) => {
        expect(states).toContain(r.candidateTest.state);
      });
    });

    it("filters by review status", async () => {
      const result = await db.responses.list({
        filters: { reviewStatusNames: ["Phone Screen"] },
        pageSize: 50,
      });

      result.rows.forEach((r) => {
        expect(r.reviewStatus?.name).toBe("Phone Screen");
      });
    });

    it("filters by None review status", async () => {
      const result = await db.responses.list({
        filters: { reviewStatusNames: ["None"] },
        pageSize: 50,
      });

      result.rows.forEach((r) => {
        expect(r.reviewStatus).toBeNull();
      });
    });

    it("filters active (non-archived) by default", async () => {
      const result = await db.responses.list({
        archived: "active",
        pageSize: 100,
      });

      result.rows.forEach((r) => {
        expect(r.candidateTest.archivedAt).toBeNull();
      });
    });

    it("filters archived only", async () => {
      const result = await db.responses.list({
        archived: "archived",
        pageSize: 100,
      });

      result.rows.forEach((r) => {
        expect(r.candidateTest.archivedAt).not.toBeNull();
      });
    });

    it("shows all when archived=all", async () => {
      const activeResult = await db.responses.list({ archived: "active" });
      const archivedResult = await db.responses.list({ archived: "archived" });
      const allResult = await db.responses.list({ archived: "all" });

      expect(allResult.total).toBe(activeResult.total + archivedResult.total);
    });
  });

  describe("combined filters", () => {
    it("combines search with state filter", async () => {
      const result = await db.responses.list({
        search: "emma",
        filters: { states: ["completed"] },
        pageSize: 50,
      });

      result.rows.forEach((r) => {
        const matchesSearch =
          r.user.name.toLowerCase().includes("emma") ||
          r.user.email.toLowerCase().includes("emma");
        expect(matchesSearch).toBe(true);
        expect(r.candidateTest.state).toBe("completed");
      });
    });

    it("combines multiple filters with sorting", async () => {
      const result = await db.responses.list({
        filters: {
          states: ["completed"],
          testNames: ["Senior Frontend Engineer Assessment"],
        },
        sort: "aiScore",
        direction: "desc",
        pageSize: 20,
      });

      result.rows.forEach((r) => {
        expect(r.candidateTest.state).toBe("completed");
        expect(r.test.name).toBe("Senior Frontend Engineer Assessment");
      });

      const scores = result.rows
        .map((r) => r.aiScore)
        .filter((s): s is number => s !== null);

      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
      }
    });
  });
});

describe("db.responses.update", () => {
  it("updates review status", async () => {
    const listResult = await db.responses.list({ pageSize: 1 });
    const response = listResult.rows[0];
    const originalStatus = response.reviewStatus?.id;

    const newStatusId = originalStatus === "rs-1" ? "rs-2" : "rs-1";
    const count = await db.responses.update(response.id, {
      reviewStatusId: newStatusId,
    });

    expect(count).toBe(1);

    const updated = await db.responses.findById(response.id);
    expect(updated?.reviewStatus?.id).toBe(newStatusId);

    await db.responses.update(response.id, {
      reviewStatusId: originalStatus ?? null,
    });
  });

  it("clears review status when set to null", async () => {
    const listResult = await db.responses.list({ pageSize: 1 });
    const response = listResult.rows[0];
    const originalStatus = response.reviewStatus?.id;

    await db.responses.update(response.id, { reviewStatusId: "rs-1" });
    await db.responses.update(response.id, { reviewStatusId: null });

    const updated = await db.responses.findById(response.id);
    expect(updated?.reviewStatus).toBeNull();

    if (originalStatus) {
      await db.responses.update(response.id, {
        reviewStatusId: originalStatus,
      });
    }
  });

  it("returns 0 for non-existent response", async () => {
    const count = await db.responses.update("non-existent-id", {
      reviewStatusId: "rs-1",
    });
    expect(count).toBe(0);
  });

  it("updates archivedAt", async () => {
    const listResult = await db.responses.list({
      archived: "active",
      pageSize: 1,
    });
    const response = listResult.rows[0];

    const archiveDate = new Date().toISOString();
    await db.responses.update(response.id, { archivedAt: archiveDate });

    const updated = await db.responses.findById(response.id);
    expect(updated?.candidateTest.archivedAt).toBe(archiveDate);

    await db.responses.update(response.id, { archivedAt: null });
  });
});

describe("db.transaction", () => {
  it("rolls back on error", async () => {
    const listResult = await db.responses.list({ pageSize: 3 });
    const ids = listResult.rows.map((r) => r.id);
    const originalStatuses = listResult.rows.map((r) => r.reviewStatus?.id);

    try {
      await db.transaction(async () => {
        await db.responses.update(ids[0], { reviewStatusId: "rs-3" });
        await db.responses.update(ids[1], { reviewStatusId: "rs-3" });
        throw new Error("Intentional error");
      });
    } catch {
      // expected
    }

    const response0 = await db.responses.findById(ids[0]);
    const response1 = await db.responses.findById(ids[1]);

    expect(response0?.reviewStatus?.id ?? null).toBe(originalStatuses[0] ?? null);
    expect(response1?.reviewStatus?.id ?? null).toBe(originalStatuses[1] ?? null);
  });

  it("commits on success", async () => {
    const listResult = await db.responses.list({ pageSize: 2 });
    const ids = listResult.rows.map((r) => r.id);
    const originalStatuses = listResult.rows.map((r) => r.reviewStatus?.id);

    await db.transaction(async () => {
      await db.responses.update(ids[0], { reviewStatusId: "rs-4" });
      await db.responses.update(ids[1], { reviewStatusId: "rs-4" });
    });

    const response0 = await db.responses.findById(ids[0]);
    const response1 = await db.responses.findById(ids[1]);

    expect(response0?.reviewStatus?.id).toBe("rs-4");
    expect(response1?.reviewStatus?.id).toBe("rs-4");

    await db.responses.update(ids[0], {
      reviewStatusId: originalStatuses[0] ?? null,
    });
    await db.responses.update(ids[1], {
      reviewStatusId: originalStatuses[1] ?? null,
    });
  });
});

describe("db.reviewStatuses", () => {
  it("lists all review statuses", async () => {
    const statuses = await db.reviewStatuses.list();
    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses[0]).toHaveProperty("id");
    expect(statuses[0]).toHaveProperty("name");
    expect(statuses[0]).toHaveProperty("position");
    expect(statuses[0]).toHaveProperty("type");
  });

  it("finds review status by id", async () => {
    const status = await db.reviewStatuses.findById("rs-1");
    expect(status).not.toBeNull();
    expect(status?.name).toBe("New");
  });

  it("returns null for non-existent status", async () => {
    const status = await db.reviewStatuses.findById("non-existent");
    expect(status).toBeNull();
  });
});

