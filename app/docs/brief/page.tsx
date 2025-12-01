import Link from "next/link";
import { Nav } from "@/app/components/nav";
import { CopyButton } from "@/components/copy-button";

const API_URL = "https://mockapi.meritfirst.us";

export default function BriefPage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm p-8 border border-border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Product Brief
            </h1>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>Note:</strong> This is a summary. See{" "}
                <code className="bg-amber-500/20 px-1 rounded">docs/brief.md</code>{" "}
                for the full requirements, job description, and data schema.
              </p>
            </div>

            <div className="flex gap-2 mb-6">
              <span className="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground">
                Next.js 15
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground">
                TypeScript
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground">
                Tailwind CSS
              </span>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Goal
                </h2>
                <p className="text-muted-foreground">
                  Build a candidate review dashboard that helps hiring managers
                  efficiently identify and manage top talent from ~50,000 test
                  responses. You&apos;ll need to create both a general-purpose browsing
                  experience and role-specific features that surface the best
                  candidates for a Senior Frontend Engineer position.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  The Two Tasks
                </h2>
                <p className="text-muted-foreground mb-4">
                  Your dashboard needs to accomplish two distinct things:
                </p>

                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-5 border border-border">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">1</span>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">General Response Browsing</h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          A baseline dashboard for browsing all candidate responses.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          <li>View and navigate through all responses</li>
                          <li>Search and filter capabilities</li>
                          <li>Update review statuses</li>
                          <li>Archive/unarchive (single and bulk)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-5 border border-border">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">2</span>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Role-Aware Candidate Ranking</h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          When a role context is selected, surface candidates most relevant to that position.
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                          How you implement this is up to you. Think about what signals in the data
                          indicate a good fit for the role described below.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  The Role
                </h2>
                <div className="bg-muted rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Senior Frontend Engineer - Meridian Financial
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Series B fintech startup looking for a Senior Frontend
                    Engineer to build consumer-facing financial products.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your dashboard should help identify candidates who would be a
                    good fit for this role. See <code>docs/brief.md</code> for the
                    full job description.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  API
                </h2>
                <div className="p-4 bg-muted rounded-lg mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Base URL:</span>{" "}
                      <code className="bg-background px-2 py-0.5 rounded text-foreground">
                        {API_URL}
                      </code>
                    </p>
                    <CopyButton text={API_URL} />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  See the{" "}
                  <Link href="/docs/api" className="text-primary hover:underline">
                    API Reference
                  </Link>{" "}
                  for endpoints and examples.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Evaluation
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Product Thinking:</strong> Does the dashboard
                    actually help find good candidates?
                  </li>
                  <li>
                    <strong className="text-foreground">Technical Quality:</strong> Clean, well-typed,
                    well-architected code
                  </li>
                  <li>
                    <strong className="text-foreground">Performance:</strong> Fast initial load,
                    responsive interactions, efficient data fetching
                  </li>
                  <li>
                    <strong className="text-foreground">Polish:</strong> Loading states, responsive
                    design, attention to detail
                  </li>
                  <li>
                    <strong className="text-foreground">Creativity:</strong> Interesting features beyond
                    the basics
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Where to Build
                </h2>
                <p className="text-muted-foreground mb-3">
                  Your implementation goes in:
                </p>
                <code className="block bg-muted px-4 py-3 rounded text-sm text-foreground">
                  app/responses/
                </code>
                <p className="text-sm text-muted-foreground mt-3">
                  Types are available in <code>lib/types.ts</code>. Create additional files as needed.
                </p>
              </section>

              <div className="bg-muted rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-foreground mb-2">Next Steps</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>
                    Read the full brief at <code>docs/brief.md</code>
                  </li>
                  <li>
                    Review the{" "}
                    <Link href="/docs/api" className="text-primary hover:underline">
                      API Reference
                    </Link>
                  </li>
                  <li>
                    Build your{" "}
                    <Link href="/responses" className="text-primary hover:underline">
                      dashboard
                    </Link>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
