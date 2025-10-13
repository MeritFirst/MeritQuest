import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              MeritQuest
            </h1>
            <p className="text-xl text-gray-600">The Quest for Top Talent</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Welcome, Candidate!
            </h2>
            <p className="text-gray-700 mb-4">
              Your goal is to build a production-ready response review dashboard
              that helps employers manage candidate test submissions efficiently.
            </p>
            <p className="text-sm text-gray-600">
              This assessment evaluates your ability to work with Next.js 15,
              modern React patterns, and complex data management at scale.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/responses"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Open Response Dashboard →
            </Link>

            <Link
              href="/docs/brief"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center font-medium py-3 px-4 rounded-lg transition-colors"
            >
              View Product Brief
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Quick Start Guide
            </h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>
                Read <code className="bg-gray-100 px-1 rounded">docs/brief.md</code>{" "}
                for the product requirements
              </li>
              <li>
                Review <code className="bg-gray-100 px-1 rounded">docs/api-reference.md</code>{" "}
                for the database API
              </li>
              <li>
                Explore{" "}
                <code className="bg-gray-100 px-1 rounded">lib/db.ts</code>{" "}
                to understand the database interface
              </li>
              <li>
                Implement{" "}
                <code className="bg-gray-100 px-1 rounded">
                  app/responses/
                </code>{" "}
                with your chosen approach
              </li>
              <li>
                Run <code className="bg-gray-100 px-1 rounded">pnpm test</code>{" "}
                to verify your implementation
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
