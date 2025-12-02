"use client";

import { useState, useCallback, useMemo } from "react";
import {
  useResponses,
  useReviewStatuses,
  useTestNames,
  defaultFilters,
  type ResponseFilters,
} from "./use-responses";
import {
  archiveCandidate,
  unarchiveCandidate,
  setReviewStatus,
  bulkArchive,
  bulkUnarchive,
  bulkSetReviewStatus,
} from "./api";
import type { CandidateResponse, ReviewStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Archive,
  ArchiveRestore,
  Check,
  Loader2,
} from "lucide-react";

export function ResponsesDashboard() {
  const [filters, setFilters] = useState<ResponseFilters>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const { data, isLoading, error, mutate } = useResponses(filters);
  const { statuses } = useReviewStatuses();
  const { testNames } = useTestNames();

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const hasNextPage = data?.hasNextPage ?? false;
  const totalPages = Math.ceil(total / filters.pageSize);

  const updateFilter = useCallback(
    <K extends keyof ResponseFilters>(key: K, value: ResponseFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? (value as number) : 1 }));
      if (key !== "page") setSelectedIds(new Set());
    },
    []
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === rows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)));
    }
  }, [rows, selectedIds.size]);

  const handleArchive = useCallback(
    async (id: string) => {
      setPendingAction(id);
      try {
        await archiveCandidate(id);
        await mutate();
      } catch (e) {
        console.error("Archive failed:", e);
      }
      setPendingAction(null);
    },
    [mutate]
  );

  const handleUnarchive = useCallback(
    async (id: string) => {
      setPendingAction(id);
      try {
        await unarchiveCandidate(id);
        await mutate();
      } catch (e) {
        console.error("Unarchive failed:", e);
      }
      setPendingAction(null);
    },
    [mutate]
  );

  const handleStatusChange = useCallback(
    async (id: string, statusId: string | null) => {
      setPendingAction(id);
      try {
        await setReviewStatus(id, statusId);
        await mutate();
      } catch (e) {
        console.error("Status change failed:", e);
      }
      setPendingAction(null);
    },
    [mutate]
  );

  const handleBulkArchive = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setPendingAction("bulk");
    try {
      await bulkArchive(Array.from(selectedIds));
      await mutate();
      setSelectedIds(new Set());
    } catch (e) {
      console.error("Bulk archive failed:", e);
    }
    setPendingAction(null);
  }, [selectedIds, mutate]);

  const handleBulkUnarchive = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setPendingAction("bulk");
    try {
      await bulkUnarchive(Array.from(selectedIds));
      await mutate();
      setSelectedIds(new Set());
    } catch (e) {
      console.error("Bulk unarchive failed:", e);
    }
    setPendingAction(null);
  }, [selectedIds, mutate]);

  const handleBulkStatusChange = useCallback(
    async (statusId: string | null) => {
      if (selectedIds.size === 0) return;
      setPendingAction("bulk");
      try {
        await bulkSetReviewStatus(Array.from(selectedIds), statusId);
        await mutate();
        setSelectedIds(new Set());
      } catch (e) {
        console.error("Bulk status change failed:", e);
      }
      setPendingAction(null);
    },
    [selectedIds, mutate]
  );

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        Failed to load responses. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        updateFilter={updateFilter}
        setFilters={setFilters}
        testNames={testNames}
        statuses={statuses}
      />

      {selectedIds.size > 0 && (
        <BulkActions
          selectedCount={selectedIds.size}
          statuses={statuses}
          onArchive={handleBulkArchive}
          onUnarchive={handleBulkUnarchive}
          onStatusChange={handleBulkStatusChange}
          onClear={() => setSelectedIds(new Set())}
          isPending={pendingAction === "bulk"}
          showArchived={filters.archived}
        />
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={rows.length > 0 && selectedIds.size === rows.length}
                    onChange={toggleSelectAll}
                    className="rounded border-input"
                  />
                </th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                  Candidate
                </th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                  Test
                </th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                  State
                </th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                  Score
                </th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-12 text-center text-muted-foreground">
                    <Loader2 className="inline-block animate-spin mr-2" size={16} />
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-12 text-center text-muted-foreground">
                    No responses found
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <ResponseRow
                    key={row.id}
                    response={row}
                    statuses={statuses}
                    isSelected={selectedIds.has(row.id)}
                    onToggleSelect={() => toggleSelection(row.id)}
                    onArchive={() => handleArchive(row.id)}
                    onUnarchive={() => handleUnarchive(row.id)}
                    onStatusChange={(statusId) => handleStatusChange(row.id, statusId)}
                    isPending={pendingAction === row.id}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={filters.page}
        totalPages={totalPages}
        total={total}
        pageSize={filters.pageSize}
        hasNextPage={hasNextPage}
        onPageChange={(page) => updateFilter("page", page)}
        onPageSizeChange={(size) => updateFilter("pageSize", size)}
        isLoading={isLoading}
      />
    </div>
  );
}

function FilterBar({
  filters,
  updateFilter,
  setFilters,
  testNames,
  statuses,
}: {
  filters: ResponseFilters;
  updateFilter: <K extends keyof ResponseFilters>(key: K, value: ResponseFilters[K]) => void;
  setFilters: React.Dispatch<React.SetStateAction<ResponseFilters>>;
  testNames: string[];
  statuses: ReviewStatus[];
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search name, email, or test..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter("search", "")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <select
        value={filters.archived}
        onChange={(e) => updateFilter("archived", e.target.value as ResponseFilters["archived"])}
        className="px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="active">Active</option>
        <option value="archived">Archived</option>
        <option value="all">All</option>
      </select>

      <select
        value={filters.states.join(",")}
        onChange={(e) =>
          updateFilter("states", e.target.value ? e.target.value.split(",") : [])
        }
        className="px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All States</option>
        <option value="completed">Completed</option>
        <option value="in_progress">In Progress</option>
        <option value="pending">Pending</option>
      </select>

      <select
        value={filters.testNames.join(",")}
        onChange={(e) =>
          updateFilter("testNames", e.target.value ? e.target.value.split(",") : [])
        }
        className="px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring max-w-[200px]"
      >
        <option value="">All Tests</option>
        {testNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <select
        value={filters.reviewStatusNames.join(",")}
        onChange={(e) =>
          updateFilter("reviewStatusNames", e.target.value ? e.target.value.split(",") : [])
        }
        className="px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All Statuses</option>
        <option value="None">No Status</option>
        {statuses.map((s) => (
          <option key={s.id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={`${filters.sort}-${filters.direction}`}
        onChange={(e) => {
          const [sort, direction] = e.target.value.split("-") as [
            ResponseFilters["sort"],
            ResponseFilters["direction"]
          ];
          setFilters((prev) => ({ ...prev, sort, direction, page: 1 }));
        }}
        className="px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="startedAt-desc">Newest First</option>
        <option value="startedAt-asc">Oldest First</option>
        <option value="aiScore-desc">Highest Score</option>
        <option value="aiScore-asc">Lowest Score</option>
        <option value="name-asc">Name A-Z</option>
        <option value="name-desc">Name Z-A</option>
      </select>
    </div>
  );
}

function BulkActions({
  selectedCount,
  statuses,
  onArchive,
  onUnarchive,
  onStatusChange,
  onClear,
  isPending,
  showArchived,
}: {
  selectedCount: number;
  statuses: ReviewStatus[];
  onArchive: () => void;
  onUnarchive: () => void;
  onStatusChange: (statusId: string | null) => void;
  onClear: () => void;
  isPending: boolean;
  showArchived: "active" | "archived" | "all";
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
      <span className="text-sm font-medium">{selectedCount} selected</span>
      <div className="flex-1" />

      <select
        onChange={(e) => {
          if (e.target.value) {
            onStatusChange(e.target.value === "clear" ? null : e.target.value);
            e.target.value = "";
          }
        }}
        disabled={isPending}
        className="px-3 py-1.5 text-sm bg-background border border-input rounded-md"
        defaultValue=""
      >
        <option value="" disabled>
          Set Status...
        </option>
        <option value="clear">Clear Status</option>
        {statuses.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {showArchived !== "archived" && (
        <Button size="sm" variant="outline" onClick={onArchive} disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={14} /> : <Archive size={14} />}
          Archive
        </Button>
      )}

      {showArchived !== "active" && (
        <Button size="sm" variant="outline" onClick={onUnarchive} disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={14} /> : <ArchiveRestore size={14} />}
          Unarchive
        </Button>
      )}

      <Button size="sm" variant="ghost" onClick={onClear} disabled={isPending}>
        <X size={14} />
        Clear
      </Button>
    </div>
  );
}

function ResponseRow({
  response,
  statuses,
  isSelected,
  onToggleSelect,
  onArchive,
  onUnarchive,
  onStatusChange,
  isPending,
}: {
  response: CandidateResponse;
  statuses: ReviewStatus[];
  isSelected: boolean;
  onToggleSelect: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onStatusChange: (statusId: string | null) => void;
  isPending: boolean;
}) {
  const isArchived = !!response.candidateTest.archivedAt;
  const stateColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <tr className={`hover:bg-muted/50 ${isArchived ? "opacity-60" : ""} ${isPending ? "pointer-events-none" : ""}`}>
      <td className="px-3 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="rounded border-input"
        />
      </td>
      <td className="px-3 py-3">
        <div className="font-medium text-foreground">{response.user.name}</div>
        <div className="text-xs text-muted-foreground">{response.user.email}</div>
        {response.user.city && (
          <div className="text-xs text-muted-foreground">
            {[response.user.city, response.user.state, response.user.country]
              .filter(Boolean)
              .join(", ")}
          </div>
        )}
      </td>
      <td className="px-3 py-3 text-muted-foreground max-w-[200px] truncate">
        {response.test.name}
      </td>
      <td className="px-3 py-3">
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${stateColors[response.candidateTest.state]}`}>
          {response.candidateTest.state.replace("_", " ")}
        </span>
      </td>
      <td className="px-3 py-3">
        {response.aiScore !== null ? (
          <ScoreBadge score={response.aiScore} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-3 py-3">
        <select
          value={response.reviewStatus?.id ?? ""}
          onChange={(e) => onStatusChange(e.target.value || null)}
          disabled={isPending}
          className="px-2 py-1 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">No Status</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3">
        {isArchived ? (
          <Button size="sm" variant="ghost" onClick={onUnarchive} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" size={14} /> : <ArchiveRestore size={14} />}
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={onArchive} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" size={14} /> : <Archive size={14} />}
          </Button>
        )}
      </td>
    </tr>
  );
}

function ScoreBadge({ score }: { score: number }) {
  let color = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  if (score >= 80) color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  else if (score >= 60) color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  else if (score >= 40) color = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
  else color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums ${color}`}>
      {score}
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading: boolean;
}) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>
          {total > 0 ? `${start.toLocaleString()}-${end.toLocaleString()} of ${total.toLocaleString()}` : "No results"}
        </span>
        {isLoading && <Loader2 className="animate-spin" size={14} />}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 text-sm bg-background border border-input rounded-md"
        >
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>

        <div className="flex items-center gap-1">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="px-3 py-1 text-sm tabular-nums">
            {page} / {totalPages || 1}
          </span>
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
