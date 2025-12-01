import { Suspense } from "react";
import { db } from "@/lib/db";
import { getTestNames } from "@/lib/data";
import type { ListResponsesParams } from "@/lib/data";
import { ResponsesDashboard } from "./responses-dashboard";

type SearchParams = Promise<{
  page?: string;
  pageSize?: string;
  sort?: string;
  direction?: string;
  search?: string;
  testNames?: string;
  states?: string;
  reviewStatuses?: string;
  archived?: string;
}>;

function parseParams(params: Awaited<SearchParams>): ListResponsesParams {
  return {
    page: params.page ? parseInt(params.page) : 1,
    pageSize: params.pageSize ? parseInt(params.pageSize) : 20,
    sort: (params.sort as ListResponsesParams["sort"]) || "startedAt",
    direction: (params.direction as "asc" | "desc") || "desc",
    search: params.search || undefined,
    archived: (params.archived as "active" | "archived" | "all") || "active",
    filters: {
      testNames: params.testNames ? params.testNames.split(",") : undefined,
      states: params.states
        ? (params.states.split(",") as ("pending" | "in_progress" | "completed")[])
        : undefined,
      reviewStatusNames: params.reviewStatuses
        ? params.reviewStatuses.split(",")
        : undefined,
    },
  };
}

export default async function ResponsesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const listParams = parseParams(params);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-white">
            Candidate Responses
          </h1>
          <p className="text-slate-400 mt-1">Review and manage test submissions</p>
        </header>

        <Suspense fallback={<DashboardSkeleton />}>
          <ResponsesLoader params={listParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function ResponsesLoader({ params }: { params: ListResponsesParams }) {
  const [responses, reviewStatuses, testNames] = await Promise.all([
    db.responses.list(params),
    db.reviewStatuses.list(),
    getTestNames(),
  ]);

  return (
    <ResponsesDashboard
      initialData={responses}
      reviewStatuses={reviewStatuses}
      testNames={testNames}
      currentParams={params}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="h-10 bg-slate-800 rounded-lg animate-pulse w-64" />
          <div className="h-10 bg-slate-800 rounded-lg animate-pulse w-40" />
          <div className="h-10 bg-slate-800 rounded-lg animate-pulse w-40" />
          <div className="h-10 bg-slate-800 rounded-lg animate-pulse w-40" />
        </div>
      </div>
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="border-b border-slate-800 p-4">
          <div className="flex gap-4">
            {[200, 160, 100, 80, 140, 100].map((w, i) => (
              <div
                key={i}
                className="h-4 bg-slate-800 rounded animate-pulse"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-slate-800/50 p-4 flex gap-4 items-center"
          >
            <div className="h-4 w-4 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-48" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-40" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-24" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-16" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-32" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
