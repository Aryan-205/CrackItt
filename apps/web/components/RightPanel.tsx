import type { User } from "@repo/types";
import { StreakWidget } from "./StreakWidget";
import { ContentFeed } from "./ContentFeed";
import type { DashboardFeedItem, Streak } from "@repo/types";

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
      <div className="rounded-xl border border-border bg-card-muted p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-muted">Community Member</p>
          </div>
        </div>
      </div>

      <StreakWidget streak={streak} />
      <ContentFeed items={feed} />
    </aside>
  );
}
