import Link from "next/link";

export default function BriefPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
          >
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Response Review Dashboard - Product Brief
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              For detailed requirements, see <code>docs/brief.md</code> in the
              project root. This page provides a quick overview.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Goal
              </h2>
              <p className="text-gray-700">
                Build a production-ready candidate response review dashboard that
                allows employers to efficiently manage and evaluate test
                submissions from candidates at scale.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                User Story
              </h2>
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 text-gray-700 italic">
                As a hiring manager, I want to quickly filter and sort through
                candidate test responses so I can identify top performers,
                update review statuses, and manage my pipeline effectively.
              </blockquote>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Key Features
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <strong>Server-side pagination:</strong> Handle 5000+ responses
                  with performant server-side pagination
                </li>
                <li>
                  <strong>Multi-column filtering:</strong> Filter by test name,
                  review status, completion state
                </li>
                <li>
                  <strong>Search:</strong> Find candidates by name or email with
                  debounced input
                </li>
                <li>
                  <strong>Sorting:</strong> Sort by candidate name, test name, AI
                  score, or completion date
                </li>
                <li>
                  <strong>Optimistic updates:</strong> Update review statuses with
                  immediate UI feedback
                </li>
                <li>
                  <strong>Bulk actions:</strong> Archive multiple responses at
                  once
                </li>
                <li>
                  <strong>Loading states:</strong> Skeleton loaders for smooth UX
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Technical Requirements
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>Use Next.js 15 App Router with Server Components</li>
                <li>Manage filter/sort state via URL search params</li>
                <li>
                  Use server actions for mutations with proper revalidation
                </li>
                <li>Implement responsive design (mobile + desktop)</li>
                <li>Add proper TypeScript types throughout</li>
                <li>Include loading and error states</li>
                <li>Write tests for key functionality</li>
              </ul>
            </section>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-2">
                Next Steps
              </h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>
                  Review acceptance criteria above for implementation requirements
                </li>
                <li>
                  Study <code>docs/api-reference.md</code> for the database API
                </li>
                <li>
                  Start building in{" "}
                  <code>app/responses/responses-dashboard.tsx</code>
                </li>
                <li>
                  Implement server actions in <code>app/responses/actions.ts</code>
                </li>
                <li>
                  Run <code>pnpm test</code> to verify your implementation
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
