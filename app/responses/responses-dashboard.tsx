"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useState,
  useTransition,
  useEffect,
  useRef,
  memo,
} from "react";
import type {
  CandidateResponse,
  CandidateTestState,
  ListResponsesParams,
  ListResponsesResult,
  ReviewStatus,
} from "@/lib/data";

type Props = {
  initialData: ListResponsesResult;
  reviewStatuses: ReviewStatus[];
  testNames: string[];
  currentParams: ListResponsesParams;
};

type UpdateError = {
  message: string;
  retry: () => void;
};

export function ResponsesDashboard({
  initialData,
  reviewStatuses,
  testNames,
  currentParams,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentParams.search || "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkError, setBulkError] = useState<UpdateError | null>(null);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const allSelected =
    initialData.rows.length > 0 &&
    initialData.rows.every((r) => selectedIds.has(r.id));
  const someSelected = selectedIds.size > 0;

  useEffect(() => {
    setSelectedIds(new Set());
  }, [initialData.rows]);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>, resetPage = false) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (resetPage) {
        params.set("page", "1");
      }

      startTransition(() => {
        router.push(`/responses?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSort = (column: ListResponsesParams["sort"]) => {
    const newDirection =
      currentParams.sort === column && currentParams.direction === "desc"
        ? "asc"
        : "desc";
    updateParams({ sort: column, direction: newDirection });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ search: value || undefined }, true);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleFilterChange = (
    filterKey: "testNames" | "states" | "reviewStatuses",
    values: string[]
  ) => {
    updateParams({ [filterKey]: values.length ? values.join(",") : undefined }, true);
  };

  const handleArchivedChange = (value: "active" | "archived" | "all") => {
    updateParams({ archived: value === "active" ? undefined : value }, true);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(initialData.rows.map((r) => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkArchive = async (archive: boolean) => {
    if (selectedIds.size === 0) return;

    const ids = Array.from(selectedIds);
    setIsBulkUpdating(true);
    setBulkError(null);

    const doArchive = async () => {
      try {
        const res = await fetch("/api/bulk-archive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": "demo-employer",
          },
          body: JSON.stringify({
            ids,
            archive,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update");
        }

        setSelectedIds(new Set());
        router.refresh();
      } catch (err) {
        setBulkError({
          message: err instanceof Error ? err.message : "Failed to archive",
          retry: () => handleBulkArchive(archive),
        });
      } finally {
        setIsBulkUpdating(false);
      }
    };

    await doArchive();
  };

  const handleBulkStatusChange = async (statusId: string | null) => {
    if (selectedIds.size === 0) return;

    const ids = Array.from(selectedIds);
    setIsBulkUpdating(true);
    setBulkError(null);

    const doUpdate = async () => {
      try {
        const res = await fetch("/api/bulk-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": "demo-employer",
          },
          body: JSON.stringify({
            ids,
            reviewStatusId: statusId,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update");
        }

        setSelectedIds(new Set());
        router.refresh();
      } catch (err) {
        setBulkError({
          message: err instanceof Error ? err.message : "Failed to update status",
          retry: () => handleBulkStatusChange(statusId),
        });
      } finally {
        setIsBulkUpdating(false);
      }
    };

    await doUpdate();
  };

  const SortHeader = ({
    column,
    children,
    className = "",
  }: {
    column: ListResponsesParams["sort"];
    children: React.ReactNode;
    className?: string;
  }) => {
    const isActive = currentParams.sort === column;
    return (
      <th
        className={`px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors select-none ${className}`}
        onClick={() => handleSort(column)}
      >
        <span className="flex items-center gap-1.5">
          {children}
          <span
            className={`transition-opacity ${isActive ? "opacity-100 text-emerald-400" : "opacity-0"}`}
          >
            {currentParams.direction === "asc" ? "↑" : "↓"}
          </span>
        </span>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex flex-wrap gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-10 pl-10 pr-4 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 w-64 transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <MultiSelect
              label="Test"
              options={testNames}
              selected={currentParams.filters?.testNames || []}
              onChange={(v) => handleFilterChange("testNames", v)}
            />

            <MultiSelect
              label="State"
              options={["pending", "in_progress", "completed"]}
              selected={currentParams.filters?.states || []}
              onChange={(v) => handleFilterChange("states", v)}
              formatOption={(s) => s.replace("_", " ")}
            />

            <MultiSelect
              label="Status"
              options={["None", ...reviewStatuses.map((r) => r.name)]}
              selected={currentParams.filters?.reviewStatusNames || []}
              onChange={(v) => handleFilterChange("reviewStatuses", v)}
            />

            <ArchivedToggle
              value={currentParams.archived || "active"}
              onChange={handleArchivedChange}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            {isPending && (
              <span className="flex items-center gap-2 text-emerald-400">
                <Spinner size="sm" />
                Loading...
              </span>
            )}
            <span>{initialData.total.toLocaleString()} results</span>
          </div>
        </div>
      </div>

      {someSelected && (
        <BulkActions
          count={selectedIds.size}
          onArchive={() => handleBulkArchive(true)}
          onUnarchive={() => handleBulkArchive(false)}
          onStatusChange={handleBulkStatusChange}
          reviewStatuses={reviewStatuses}
          isUpdating={isBulkUpdating}
          showUnarchive={currentParams.archived === "archived"}
        />
      )}

      {bulkError && (
        <ErrorBanner
          message={bulkError.message}
          onRetry={bulkError.retry}
          onDismiss={() => setBulkError(null)}
        />
      )}

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800 bg-slate-900/50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0"
                  />
                </th>
                <SortHeader column="name">Candidate</SortHeader>
                <SortHeader column="testName" className="hidden md:table-cell">
                  Test
                </SortHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                  State
                </th>
                <SortHeader column="aiScore" className="hidden sm:table-cell">
                  Score
                </SortHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <SortHeader column="startedAt" className="hidden lg:table-cell">
                  Date
                </SortHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {initialData.rows.map((response) => (
                <ResponseRow
                  key={response.id}
                  response={response}
                  reviewStatuses={reviewStatuses}
                  isSelected={selectedIds.has(response.id)}
                  onToggleSelect={() => toggleSelect(response.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {initialData.rows.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>No responses found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <Pagination
        page={currentParams.page || 1}
        hasNextPage={initialData.hasNextPage}
        total={initialData.total}
        pageSize={currentParams.pageSize || 20}
        onPageChange={(page) => updateParams({ page: String(page) })}
        isPending={isPending}
      />
    </div>
  );
}

const ResponseRow = memo(function ResponseRow({
  response,
  reviewStatuses,
  isSelected,
  onToggleSelect,
}: {
  response: CandidateResponse;
  reviewStatuses: ReviewStatus[];
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const [status, setStatus] = useState(response.reviewStatus?.id || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(response.reviewStatus?.id || "");
  }, [response.reviewStatus?.id]);

  const handleStatusChange = async (newStatusId: string) => {
    const previousStatus = status;
    setStatus(newStatusId);
    setIsUpdating(true);
    setError(null);

    const attemptUpdate = async (retries = 2): Promise<void> => {
      try {
        const res = await fetch("/api/update-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": "demo-employer",
          },
          body: JSON.stringify({
            responseId: response.id,
            reviewStatusId: newStatusId || null,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to update");
        }
      } catch {
        if (retries > 0) {
          await new Promise((r) => setTimeout(r, 500));
          return attemptUpdate(retries - 1);
        }
        setStatus(previousStatus);
        setError("Update failed");
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsUpdating(false);
      }
    };

    await attemptUpdate();
  };

  const stateConfig: Record<CandidateTestState, { bg: string; text: string }> = {
    pending: { bg: "bg-amber-500/10", text: "text-amber-400" },
    in_progress: { bg: "bg-blue-500/10", text: "text-blue-400" },
    completed: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  };

  const state = response.candidateTest.state;
  const stateStyle = stateConfig[state];

  return (
    <tr
      className={`transition-colors ${isSelected ? "bg-emerald-500/5" : "hover:bg-slate-800/50"}`}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0"
        />
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-white">
          {response.user.preferredName || response.user.name}
        </div>
        <div className="text-sm text-slate-500">{response.user.email}</div>
        <div className="md:hidden text-xs text-slate-600 mt-1">
          {response.test.name}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell max-w-[200px] truncate">
        {response.test.name}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${stateStyle.bg} ${stateStyle.text}`}
        >
          {state.replace("_", " ")}
        </span>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        {response.aiScore !== null ? (
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  response.aiScore >= 80
                    ? "bg-emerald-500"
                    : response.aiScore >= 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${response.aiScore}%` }}
              />
            </div>
            <span
              className={`text-sm font-mono ${
                response.aiScore >= 80
                  ? "text-emerald-400"
                  : response.aiScore >= 60
                    ? "text-amber-400"
                    : "text-red-400"
              }`}
            >
              {response.aiScore}
            </span>
          </div>
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={`appearance-none text-sm bg-slate-800 border rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
              isUpdating
                ? "opacity-50 border-slate-700"
                : error
                  ? "border-red-500"
                  : "border-slate-700 hover:border-slate-600"
            } ${status ? "text-white" : "text-slate-500"}`}
          >
            <option value="">None</option>
            {reviewStatuses.map((rs) => (
              <option key={rs.id} value={rs.id}>
                {rs.name}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {isUpdating && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <Spinner size="sm" />
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500 hidden lg:table-cell">
        {response.candidateTest.startedAt
          ? formatDate(response.candidateTest.startedAt)
          : "—"}
      </td>
    </tr>
  );
});

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  formatOption = (s) => s,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  formatOption?: (s: string) => string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 px-3 bg-slate-800 border rounded-lg text-sm flex items-center gap-2 transition-all ${
          selected.length > 0
            ? "border-emerald-500/50 text-white"
            : "border-slate-700 text-slate-400 hover:border-slate-600"
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {selected.length}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-1 max-h-64 overflow-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700/50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-200 truncate">
                {formatOption(option)}
              </span>
            </label>
          ))}
          {selected.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 border-t border-slate-700 mt-1"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ArchivedToggle({
  value,
  onChange,
}: {
  value: "active" | "archived" | "all";
  onChange: (value: "active" | "archived" | "all") => void;
}) {
  return (
    <div className="flex h-10 bg-slate-800 border border-slate-700 rounded-lg p-1">
      {(["active", "archived", "all"] as const).map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 text-sm rounded-md capitalize transition-all ${
            value === option
              ? "bg-slate-700 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function BulkActions({
  count,
  onArchive,
  onUnarchive,
  onStatusChange,
  reviewStatuses,
  isUpdating,
  showUnarchive,
}: {
  count: number;
  onArchive: () => void;
  onUnarchive: () => void;
  onStatusChange: (statusId: string | null) => void;
  reviewStatuses: ReviewStatus[];
  isUpdating: boolean;
  showUnarchive: boolean;
}) {
  const [statusDropdown, setStatusDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setStatusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-wrap items-center gap-4">
      <span className="text-sm text-emerald-400 font-medium">
        {count} selected
      </span>

      <div className="flex gap-2">
        <div ref={ref} className="relative">
          <button
            onClick={() => setStatusDropdown(!statusDropdown)}
            disabled={isUpdating}
            className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            Set Status
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {statusDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-1">
              <button
                onClick={() => {
                  onStatusChange(null);
                  setStatusDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:bg-slate-700/50"
              >
                Clear Status
              </button>
              {reviewStatuses.map((rs) => (
                <button
                  key={rs.id}
                  onClick={() => {
                    onStatusChange(rs.id);
                    setStatusDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700/50"
                >
                  {rs.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {showUnarchive ? (
          <button
            onClick={onUnarchive}
            disabled={isUpdating}
            className="px-3 py-1.5 text-sm bg-blue-600 rounded-lg text-white hover:bg-blue-500 disabled:opacity-50 transition-all"
          >
            Unarchive
          </button>
        ) : (
          <button
            onClick={onArchive}
            disabled={isUpdating}
            className="px-3 py-1.5 text-sm bg-red-600/80 rounded-lg text-white hover:bg-red-600 disabled:opacity-50 transition-all"
          >
            Archive
          </button>
        )}
      </div>

      {isUpdating && (
        <span className="flex items-center gap-2 text-sm text-slate-400">
          <Spinner size="sm" />
          Updating...
        </span>
      )}
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
  onDismiss,
}: {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg
          className="w-5 h-5 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm text-red-400">{message}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className="px-3 py-1 text-sm text-white bg-red-600/80 rounded hover:bg-red-600 transition-all"
        >
          Retry
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1 text-sm text-slate-400 hover:text-white transition-all"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function Pagination({
  page,
  hasNextPage,
  total,
  pageSize,
  onPageChange,
  isPending,
}: {
  page: number;
  hasNextPage: boolean;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isPending: boolean;
}) {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-slate-400">
        Showing <span className="text-white">{startItem}</span> to{" "}
        <span className="text-white">{endItem}</span> of{" "}
        <span className="text-white">{total.toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isPending}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {pageNumbers.map((num, i) =>
          num === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-600">
              ...
            </span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num as number)}
              disabled={isPending}
              className={`min-w-[36px] h-9 text-sm rounded-lg transition-all ${
                page === num
                  ? "bg-emerald-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {num}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || isPending}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Spinner({ size = "md" }: { size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <svg
      className={`${sizeClass} animate-spin text-emerald-400`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
