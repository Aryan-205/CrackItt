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

export function StreakWidget({ streak }: { streak: Streak }) {
  const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Card>
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
                className={`h-5 w-5 ${
                  entry.active ? "text-primary" : "text-muted-foreground/30"
                }`}
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
}: {
  user: User;
  streak: Streak;
  feed: DashboardFeedItem[];
}) {
  return (
    <aside className="flex w-72 shrink-0 flex-col gap-4 border-l border-border bg-card p-4">
      <Card>
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
