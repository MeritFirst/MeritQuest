import Link from "next/link";
import { Nav } from "@/app/components/nav";
import { CopyButton } from "@/components/copy-button";

const API_URL = "https://mockapi.meritfirst.us";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="min-h-[calc(100vh-57px)] bg-background flex items-center justify-center p-4 md:p-8">
        <div className="max-w-2xl w-full">
          <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              MeritQuest
            </h1>
            <p className="text-muted-foreground mb-6">
              This is a take-home assessment for building a candidate review dashboard
              with Next.js 15 and Tailwind CSS.
            </p>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                The Challenge
              </h2>
              <p className="text-muted-foreground mb-4">
                You have access to ~50,000 candidate test responses via an external API.
                Build a dashboard that helps hiring managers review and identify top talent.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">1</span>
                  <div>
                    <p className="font-medium text-foreground">General Response Browsing</p>
                    <p className="text-sm text-muted-foreground">Search, filter, update statuses, archive/unarchive responses</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">2</span>
                  <div>
                    <p className="font-medium text-foreground">Role-Aware Candidate Ranking</p>
                    <p className="text-sm text-muted-foreground">Surface candidates most relevant to a Senior Frontend Engineer role</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/responses"
                className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 text-center font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Open Response Dashboard →
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/docs/brief"
                  className="block bg-secondary hover:bg-secondary/80 text-secondary-foreground text-center font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Product Brief
                </Link>
                <Link
                  href="/docs/api"
                  className="block bg-secondary hover:bg-secondary/80 text-secondary-foreground text-center font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  API Reference
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="font-semibold text-foreground mb-2">Quick Start</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>
                  Read{" "}
                  <Link href="/docs/brief" className="text-primary hover:underline">
                    the product brief
                  </Link>{" "}
                  for full requirements and the job description
                </li>
                <li>
                  Review{" "}
                  <Link href="/docs/api" className="text-primary hover:underline">
                    the API reference
                  </Link>{" "}
                  for endpoint documentation
                </li>
                <li>
                  Build your dashboard in{" "}
                  <code className="bg-muted px-1 rounded text-foreground">app/responses/</code>
                </li>
              </ol>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-foreground">
                  <span className="font-medium">API Base URL:</span>{" "}
                  <code className="bg-background px-2 py-0.5 rounded text-foreground">
                    {API_URL}
                  </code>
                </p>
                <CopyButton text={API_URL} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
