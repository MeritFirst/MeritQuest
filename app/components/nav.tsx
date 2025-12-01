import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export function Nav() {
  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-foreground hover:text-foreground/80">
          MeritQuest
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/responses"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/docs/brief"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Brief
          </Link>
          <Link
            href="/docs/api"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            API Reference
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
