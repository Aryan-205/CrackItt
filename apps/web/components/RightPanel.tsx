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

export function StreakWidget({ streak }: { streak: Streak }) {
  const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">Learning Streak</CardTitle>
        <Flame className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold">{streak.currentStreak}</span>
          <span className="text-sm text-muted-foreground">days</span>
          <span className="ml-auto text-xs text-muted-foreground">
            Best: {streak.bestStreak}
          </span>
        </div>
        <div className="flex justify-between gap-1">
          {streak.weeklyLog.map((entry, i) => (
            <div key={entry.date} className="flex flex-col items-center gap-1">
              <Flame
                className={cn(
                  "h-5 w-5 transition-colors",
                  entry.active ? "text-primary fill-primary" : "text-muted-foreground/30",
                )}
              />
              <span className="text-[10px] text-muted-foreground">
                {DAY_LABELS[i]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RightPanel({
  user,
  streak,
  feed,
  className,
}: {
  user: User;
  streak: Streak;
  feed: DashboardFeedItem[];
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 p-4 transition-all duration-300",
        // Desktop layout
        "xl:sticky xl:top-0 xl:h-screen xl:w-84 xl:shrink-0 xl:overflow-y-auto xl:border-l xl:border-border xl:bg-card",
        // Mobile layout
        "w-full h-auto border border-border bg-card/20 xl:border-y-0 xl:border-r-0 xl:bg-card rounded-xl xl:rounded-none",
        className
      )}
    >
      <Card className="border-border/60">
        <CardContent className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/15 text-primary">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">Community Member</p>
          </div>
        </CardContent>
      </Card>

      <StreakWidget streak={streak} />
      <ContentFeed items={feed} />
    </aside>
  );
}
