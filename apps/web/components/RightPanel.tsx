import type { DashboardFeedItem, Streak, User } from "@repo/types";
import { Flame } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ContentFeed } from "./ContentFeed";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakWidget({ streak }: { streak: Streak }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">Learning Streak</CardTitle>
        <Flame className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums leading-none">
            {streak.currentStreak}
          </span>
          <span className="text-sm text-muted-foreground">
            {streak.currentStreak === 1 ? "day" : "days"}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            Best: <span className="font-medium tabular-nums">{streak.bestStreak}</span>
          </span>
        </div>
        <div className="flex justify-between gap-1">
          {streak.weeklyLog.map((entry, i) => {
            const isLastActive = entry.date === streak.lastActiveDate;
            return (
              <div key={entry.date} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors",
                    entry.active ? "bg-primary/10" : "bg-muted/40",
                    isLastActive && "ring-2 ring-primary/40",
                  )}
                >
                  <Flame
                    className={cn(
                      "h-4 w-4",
                      entry.active
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30",
                    )}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {DAY_LABELS[i]}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileCard({ user }: { user: User }) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/15">
          <AvatarFallback className="bg-primary/15 text-primary">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground">Community Member</p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * `sidebar` fills the fixed-height desktop column: the profile and streak stay
 * pinned while the feed scrolls. `inline` flows with the mobile page instead.
 */
export function RightPanel({
  user,
  streak,
  feed,
  variant = "sidebar",
  className,
}: {
  user: User;
  streak: Streak;
  feed: DashboardFeedItem[];
  variant?: "sidebar" | "inline";
  className?: string;
}) {
  const isSidebar = variant === "sidebar";

  return (
    <aside
      className={cn(
        "flex flex-col gap-4",
        isSidebar ? "h-full min-h-0 overflow-hidden bg-card p-4" : "w-full",
        className,
      )}
    >
      <div className="shrink-0">
        <ProfileCard user={user} />
      </div>
      <div className="shrink-0">
        <StreakWidget streak={streak} />
      </div>
      <ContentFeed items={feed} scrollable={isSidebar} />
    </aside>
  );
}
