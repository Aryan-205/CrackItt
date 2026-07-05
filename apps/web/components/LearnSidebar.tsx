"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Check
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getLearnCurriculum } from "@/lib/learn-data";
import { cn } from "@/lib/utils";

export function LearnSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const category = segments[1] ?? "";
  const activeSlug = segments[2] ?? "";
  const curriculum = getLearnCurriculum(category);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!curriculum) return;
    setOpenSections(
      Object.fromEntries(
        curriculum.sections.map((section) => {
          const hasActiveLesson = section.lessons.some(
            (lesson) => lesson.id === activeSlug,
          );
          return [
            section.id,
            hasActiveLesson || (section.defaultOpen ?? false),
          ];
        }),
      ),
    );
  }, [curriculum, activeSlug]);

  if (!curriculum) return null;

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }

  return (
    <aside className={cn("flex h-full w-full flex-col overflow-y-auto bg-card", className)}>
      <div className="border-b border-border px-5 py-4 shrink-0">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground">
          LEARN {curriculum.title.toUpperCase()}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto flex flex-col gap-1 p-3">
        {curriculum.sections.map((section) => {
          const isOpen = openSections[section.id] ?? false;
          const Icon = section.icon;

          return (
            <Collapsible
              key={section.id}
              open={isOpen}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger
                render={
                  <Button
                    variant="ghost"
                    className="h-9 w-full justify-start gap-2.5 px-2 font-medium"
                  />
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-left text-sm truncate">{section.title}</span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="relative ml-5 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-4 pb-1">
                  {section.lessons.map((lesson) => {
                    const href = `/learn/${category}/${lesson.id}`;
                    const isActive = activeSlug === lesson.id;

                    return (
                      <Link
                        key={lesson.id}
                        href={href}
                        className={cn(
                          "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : lesson.locked
                              ? "text-muted-foreground hover:bg-muted/50"
                              : "text-foreground hover:bg-muted",
                        )}
                      >
                        <span className="flex-1 truncate">{lesson.title}</span>
                        {lesson.completed && (
                          <Check className="h-4 w-4 shrink-0 text-primary animate-in zoom-in duration-200" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </aside>
  );
}
