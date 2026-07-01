"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type VoteDirection = "up" | "down" | null;

export function VoteControls({
  score,
  userVote,
  onVote,
  size = "default",
}: {
  score: number;
  userVote: VoteDirection;
  onVote: (direction: "up" | "down") => void;
  size?: "default" | "sm";
}) {
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon-xs"
        className={cn(
          "text-muted-foreground hover:text-primary",
          userVote === "up" && "text-primary bg-primary/10",
        )}
        onClick={(e) => {
          e.stopPropagation();
          onVote("up");
        }}
      >
        <ChevronUp className={iconClass} />
      </Button>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          score > 0 && "text-primary",
          score < 0 && "text-destructive",
        )}
      >
        {score}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        className={cn(
          "text-muted-foreground hover:text-destructive",
          userVote === "down" && "text-destructive bg-destructive/10",
        )}
        onClick={(e) => {
          e.stopPropagation();
          onVote("down");
        }}
      >
        <ChevronDown className={iconClass} />
      </Button>
    </div>
  );
}
