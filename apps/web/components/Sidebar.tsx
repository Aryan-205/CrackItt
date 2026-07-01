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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const learnItems = [
  { href: "/learn/system-design", label: "System Design" },
  { href: "/learn/frontend", label: "Frontend" },
  { href: "/learn/backend", label: "Backend" },
  { href: "/learn/fullstack", label: "Full Stack" },
  { href: "/learn/behavioral", label: "Behavioral" },
];

const navItems = [
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
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3",
        active && "bg-primary/10 text-primary hover:bg-primary/15",
      )}
      render={<Link href={href} />}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [learnOpen, setLearnOpen] = useState(pathname.startsWith("/learn"));

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-3 py-4">
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
          <Button
            variant={pathname.startsWith("/learn") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              pathname.startsWith("/learn") &&
                "bg-primary/10 text-primary hover:bg-primary/15",
            )}
            onClick={() => setLearnOpen(!learnOpen)}
          >
            <BookOpen className="h-4 w-4" />
            <span className="flex-1 text-left">Learn</span>
            {learnOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          {learnOpen && (
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
              {learnItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "justify-start px-2",
                    pathname === item.href &&
                      "font-medium text-primary hover:text-primary",
                  )}
                  render={<Link href={item.href} />}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      <Separator className="mt-auto" />
      <div className="flex items-center gap-2 px-3 pt-4 text-xs text-muted-foreground">
        <MessageSquare className="h-3.5 w-3.5" />
        <span>Community Member</span>
      </div>
    </aside>
  );
}
