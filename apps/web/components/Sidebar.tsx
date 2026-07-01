"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Home,
  MessageSquare,
  PlayCircle,
  Users,
} from "lucide-react";
import { useState } from "react";

const learnItems = [
  { href: "/learn/system-design", label: "System Design" },
  { href: "/learn/frontend", label: "Frontend" },
  { href: "/learn/backend", label: "Backend" },
  { href: "/learn/fullstack", label: "Full Stack" },
  { href: "/learn/behavioral", label: "Behavioral" },
];

const navItems = [
  { href: "/dashboard", label: "Your Dashboard", icon: Home },
  { href: "/practice", label: "Practice", icon: GraduationCap },
  { href: "/community", label: "Community", icon: Users },
  { href: "/tutorials", label: "Tutorials", icon: PlayCircle },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-foreground/70 hover:bg-card-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [learnOpen, setLearnOpen] = useState(
    pathname.startsWith("/learn"),
  );

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card px-3 py-4">
      <Link href="/dashboard" className="mb-6 px-3">
        <span className="text-lg font-bold text-primary">crackitt</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        <NavLink
          href="/dashboard"
          label="Your Dashboard"
          icon={Home}
          active={pathname === "/dashboard"}
        />

        <div>
          <button
            type="button"
            onClick={() => setLearnOpen(!learnOpen)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/learn")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-card-muted hover:text-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span className="flex-1 text-left">Learn</span>
            {learnOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {learnOpen && (
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
              {learnItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-2 py-1.5 text-sm ${
                    pathname === item.href
                      ? "font-medium text-primary"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {navItems.slice(1).map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-center gap-2 px-3 text-xs text-muted">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Community Member</span>
        </div>
      </div>
    </aside>
  );
}
