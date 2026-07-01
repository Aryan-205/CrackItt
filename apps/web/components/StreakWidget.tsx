import type { Streak } from "@repo/types";
import { Flame } from "lucide-react";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakWidget({ streak }: { streak: Streak }) {
  return (
    <div className="rounded-xl border border-border bg-card-muted p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Learning Streak</h3>
        <Flame className="h-4 w-4 text-orange-500" />
      </div>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{streak.currentStreak}</span>
        <span className="text-sm text-muted">days</span>
        <span className="ml-auto text-xs text-muted">
          Best: {streak.bestStreak}
        </span>
      </div>
      <div className="flex justify-between gap-1">
        {streak.weeklyLog.map((entry, i) => (
          <div key={entry.date} className="flex flex-col items-center gap-1">
            <Flame
              className={`h-5 w-5 ${
                entry.active ? "text-orange-500" : "text-gray-300"
              }`}
            />
            <span className="text-[10px] text-muted">{DAY_LABELS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
