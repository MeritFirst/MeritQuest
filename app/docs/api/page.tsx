import { Nav } from "@/app/components/nav";

export default function ApiReferencePage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm p-8 border border-border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              API Reference
            </h1>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                The API runs locally as part of the Next.js dev server. See{" "}
                <code>docs/api-reference.md</code> for full documentation.
              </p>

              <div className="mb-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Base URL:</span>{" "}
                  <code className="bg-background px-2 py-0.5 rounded text-foreground">
                    /api/take-home
                  </code>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Data is stored in-memory and resets when you restart the dev
                  server.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Two Ways to Access Data
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">
                      REST API
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Use <code>fetch()</code> with the endpoints below. Good
                      for caching and traditional patterns.
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">
                      Server Actions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Import from <code>lib/actions.ts</code>. Good for forms
                      and React integration.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Endpoints
                </h2>

                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded">
                        GET
                      </span>
                      <code className="text-sm text-foreground font-medium">
                        /api/take-home/responses
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      List responses with filtering and pagination
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded">
                        GET
                      </span>
                      <code className="text-sm text-foreground font-medium">
                        /api/take-home/responses/:id
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get a single response by ID
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium px-2 py-1 rounded">
                        PATCH
                      </span>
                      <code className="text-sm text-foreground font-medium">
                        /api/take-home/responses/:id
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Update a response (review status, archive)
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium px-2 py-1 rounded">
                        PATCH
                      </span>
                      <code className="text-sm text-foreground font-medium">
                        /api/take-home/responses
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bulk update multiple responses (with ids array in body)
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded">
                        GET
                      </span>
                      <code className="text-sm text-foreground font-medium">
                        /api/take-home/review-statuses
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      List available review statuses
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded">
                        GET
                      </span>
                      <code className="text-sm text-foreground font-medium">
                        /api/take-home/test-names
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      List unique test names
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded">
                        GET
                      </span>
                      <code className="text-sm text-foreground font-medium">
                        /api/take-home/stats
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get dataset statistics (totals, counts by state)
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Query Parameters
                </h2>
                <p className="text-muted-foreground mb-4">
                  The <code>/api/take-home/responses</code> endpoint supports:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-medium text-foreground">
                          Parameter
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-foreground">
                          Default
                        </th>
                        <th className="text-left py-2 font-medium text-foreground">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">
                          <code>page</code>
                        </td>
                        <td className="py-2 pr-4">1</td>
                        <td className="py-2">Page number</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">
                          <code>pageSize</code>
                        </td>
                        <td className="py-2 pr-4">25</td>
                        <td className="py-2">Results per page (max 100)</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">
                          <code>sort</code>
                        </td>
                        <td className="py-2 pr-4">startedAt</td>
                        <td className="py-2">
                          Sort field: startedAt, aiScore, testName, name
                        </td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">
                          <code>direction</code>
                        </td>
                        <td className="py-2 pr-4">desc</td>
                        <td className="py-2">Sort direction: asc, desc</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">
                          <code>search</code>
                        </td>
                        <td className="py-2 pr-4">-</td>
                        <td className="py-2">
                          Search by name, email, or test name
                        </td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">
                          <code>archived</code>
                        </td>
                        <td className="py-2 pr-4">active</td>
                        <td className="py-2">Filter: active, archived, all</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">
                          <code>testNames</code>
                        </td>
                        <td className="py-2 pr-4">-</td>
                        <td className="py-2">Comma-separated test names</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">
                          <code>states</code>
                        </td>
                        <td className="py-2 pr-4">-</td>
                        <td className="py-2">
                          Comma-separated: pending, in_progress, completed
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">
                          <code>reviewStatusNames</code>
                        </td>
                        <td className="py-2 pr-4">-</td>
                        <td className="py-2">
                          Comma-separated status names (use &quot;None&quot; for
                          null)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="bg-muted rounded-lg p-6">
                <p className="text-sm text-muted-foreground">
                  See <code>docs/api-reference.md</code> for complete
                  documentation including request/response examples, Server
                  Actions, and TypeScript types. Types are also available in{" "}
                  <code>lib/types.ts</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
