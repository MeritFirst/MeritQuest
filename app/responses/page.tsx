import { Nav } from "@/app/components/nav";
import { ResponsesDashboard } from "./responses-dashboard";

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
          <ResponsesDashboard />
        </div>
      </div>
    </>
  );
}
