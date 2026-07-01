import { GraduationCap, Moon, Search } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-card px-6 py-3">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search questions, tutorials, blogs..."
          className="w-full rounded-lg border border-border bg-card-muted py-2 pl-10 pr-16 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          readOnly
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-xs text-muted">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-3">
        <Link href="#" className="text-sm text-muted hover:text-foreground">
          Pricing
        </Link>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted"
        >
          <GraduationCap className="h-4 w-4" />
          Tutor
        </button>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Get Premium
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-muted hover:bg-card-muted"
          aria-label="Toggle dark mode"
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
