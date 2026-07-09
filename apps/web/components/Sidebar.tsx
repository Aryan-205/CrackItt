"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  Code2,
  Flame,
  FolderKanban,
  Github,
  GraduationCap,
  HelpCircle,
  Home,
  Mail,
  MessageSquare,
  Newspaper,
  PlayCircle,
  Twitter,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { learnCategories, learnCategoryLabels } from "@/lib/learn-data";
import { cn } from "@/lib/utils";
import { BlurryImage } from "@/components/ui/BlurryImage";

const learnItems = learnCategories.map((slug) => ({
  href: `/learn/${slug}`,
  label: learnCategoryLabels[slug],
}));

const communityItems = [
  { href: "/community/blog", label: "Blog", icon: Newspaper },
  { href: "/community/questions", label: "Questions", icon: HelpCircle },
  { href: "/community/projects", label: "Projects", icon: FolderKanban },
];

const practiceItems = [
  { href: "/practice/coding", label: "Coding Practice", icon: Code2 },
  { href: "/practice/questions", label: "Interview Questions", icon: MessageSquare },
];

const navItems = [
  { href: "/tutorials", label: "Tutorials", icon: PlayCircle },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3",
        active && "bg-primary/10 text-primary hover:bg-primary/15",
      )}
      render={<Link href={href} onClick={onClick} />}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}

type NavGroupItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

function NavGroup({
  label,
  icon: Icon,
  items,
  basePath,
  pathname,
  onNavClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavGroupItem[];
  basePath: string;
  pathname: string;
  onNavClick?: () => void;
}) {
  const sectionActive = pathname.startsWith(basePath);
  const [open, setOpen] = useState(sectionActive);

  // Reveal a group when you navigate into it. Only ever forces open, so a
  // deliberate collapse isn't undone on the next render.
  useEffect(() => {
    if (sectionActive) setOpen(true);
  }, [sectionActive]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        render={
          <Button
            variant={sectionActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              sectionActive && "bg-primary/10 text-primary hover:bg-primary/15",
            )}
          />
        }
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200 ease-out-strong",
            !open && "-rotate-90",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "h-[var(--collapsible-panel-height)] overflow-hidden",
          "transition-[height] duration-200 ease-out-strong",
          "data-[starting-style]:h-0 data-[ending-style]:h-0",
        )}
      >
        <div className="ml-4 flex flex-col gap-0.5 border-l border-border pt-1 pl-3">
          {items.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              className={cn(
                "justify-start gap-2 px-2",
                (item.icon ? pathname.startsWith(item.href) : pathname === item.href) &&
                  "font-medium text-primary hover:text-primary",
              )}
              render={<Link href={item.href} onClick={onNavClick} />}
              onClick={onNavClick}
            >
              {item.icon && <item.icon className="h-3.5 w-3.5" />}
              {item.label}
            </Button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-sidebar px-3 py-4">
      <Link
        href="/dashboard"
        className="mb-6 px-3 flex items-center gap-2"
        onClick={onNavClick}
      >
        <Flame className="h-4 w-4 text-primary" />
        <span className="text-lg font-bold text-primary">CrackItt</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        <NavLink
          href="/dashboard"
          label="Your Dashboard"
          icon={Home}
          active={pathname === "/dashboard"}
          onClick={onNavClick}
        />

        <NavGroup
          label="Learn"
          icon={BookOpen}
          items={learnItems}
          basePath="/learn"
          pathname={pathname}
          onNavClick={onNavClick}
        />

        <NavGroup
          label="Community"
          icon={Users}
          items={communityItems}
          basePath="/community"
          pathname={pathname}
          onNavClick={onNavClick}
        />

        <NavGroup
          label="Practice"
          icon={GraduationCap}
          items={practiceItems}
          basePath="/practice"
          pathname={pathname}
          onNavClick={onNavClick}
        />

        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname.startsWith(item.href)}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <Separator className="mt-auto" />
      <div className="px-3 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <BlurryImage
            src="/images/aryan-bola.jpg"
            alt="Aryan Bola"
            className="size-8 rounded-full border"
            width={32}
            height={32}
          />
          <span className="text-sm font-medium"> By Aryan Bola</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <a
            href="mailto:aryan@example.com"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            aria-label="Email Aryan"
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
          <a
            href="https://x.com/aryan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            aria-label="Aryan on X"
          >
            <Twitter className="h-3.5 w-3.5" />
            X
          </a>
          <a
            href="https://github.com/aryan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            aria-label="Aryan on GitHub"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </aside>
  );
}
