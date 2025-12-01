/**
 * TODO: Build your dashboard here
 *
 * The entire responses directory is yours to build out as you see fit.
 * - Create components, subdirectories, whatever structure you think makes sense
 * - Server components, client components, server actions are all fair game.
 * - The code below is just a starting point. Feel free to delete it and start from scratch.
 *
 *
 */

import Link from "next/link";
import { Nav } from "@/app/components/nav";
import { CopyButton } from "@/components/copy-button";

const API_URL = "https://mockapi.meritfirst.us";

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
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                {API_URL}
              </code>
              <CopyButton text={API_URL} />
            </div>
          </div>

          {/* TODO: Replace this with your dashboard */}
          <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
            <h2 className="font-semibold text-foreground mb-3">Getting Started</h2>
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Task 1:</strong> General browsing — browse, search, filter, update statuses, archive/unarchive
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Task 2:</strong> Role-aware ranking — surface candidates relevant to the{" "}
                <Link href="/docs/brief" className="text-primary hover:underline">
                  Senior Frontend Engineer role
                </Link>
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex gap-4 text-sm">
              <Link href="/docs/api" className="text-primary hover:underline">
                API Reference
              </Link>
              <Link href="/docs/brief" className="text-primary hover:underline">
                Product Brief
              </Link>
              <span className="text-muted-foreground">
                Types: <code className="bg-muted px-1 rounded">lib/types.ts</code>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
