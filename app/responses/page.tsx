import { Nav } from "@/app/components/nav";
import Link from "next/link";

export default function ResponsesPage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Candidate Responses
            </h1>
          </div>

          {/* TODO: Remove this help section once you start building */}
          <div className="bg-card rounded-lg shadow-sm p-6 border border-border mb-6">
            <h2 className="font-semibold text-foreground mb-3">
              Getting Started
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-2">
                  <strong className="text-foreground">Task 1:</strong> General
                  browsing — browse, search, filter, update statuses,
                  archive/unarchive
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Task 2:</strong>{" "}
                  Role-aware ranking — surface candidates relevant to the{" "}
                  <Link
                    href="/docs/brief"
                    className="text-primary hover:underline"
                  >
                    Senior Frontend Engineer role
                  </Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-sm">
              <Link href="/docs/api" className="text-primary hover:underline">
                API Reference
              </Link>
              <Link href="/docs/brief" className="text-primary hover:underline">
                Product Brief
              </Link>
              <span className="text-muted-foreground">
                Types:{" "}
                <code className="bg-muted px-1 rounded">lib/types.ts</code>
              </span>
              <span className="text-muted-foreground">
                Actions:{" "}
                <code className="bg-muted px-1 rounded">lib/actions.ts</code>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
