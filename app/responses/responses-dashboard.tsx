"use client";

/**
 * TODO: Build the dashboard UI here
 *
 * This client component is where you'll implement the main dashboard.
 * The parent page.tsx handles the layout and nav.
 *
 * Requirements:
 * - Browse all responses
 * - Search and filter
 * - Update review statuses
 * - Archive/unarchive (single and bulk)
 * - Role-aware features for the Senior Frontend Engineer role
 *
 * Data Access:
 * - REST API: /api/take-home/... (see docs/api-reference.md)
 * - Server Actions: lib/actions.ts
 * - Types: lib/types.ts
 */

export function ResponsesDashboard() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p>Your dashboard goes here.</p>
      <p className="text-sm mt-2">
        Edit{" "}
        <code className="bg-muted px-1 rounded">
          app/responses/responses-dashboard.tsx
        </code>
      </p>
    </div>
  );
}
