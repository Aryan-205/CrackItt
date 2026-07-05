"use client";

import { useState } from "react";
import { Check, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleUserCompletion } from "@/lib/api";
import { cn } from "@/lib/utils";

const DEMO_USER_ID = "demo-user";

export function CompletionButton({
  itemId,
  itemType,
  initialCompleted,
  className,
}: {
  itemId: string;
  itemType: string;
  initialCompleted: boolean;
  className?: string;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  function handleToggle() {
    setLoading(true);
    toggleUserCompletion(DEMO_USER_ID, itemId, itemType)
      .then((res) => {
        setCompleted(res.completed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error toggling completion: ", err);
        setLoading(false);
      });
  }

  return (
    <Button
      variant={completed ? "default" : "outline"}
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "h-auto gap-2 py-2 px-4 transition-all duration-200 active:scale-[0.96]",
        completed
          ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
          : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-400 dark:hover:border-emerald-900/50",
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : completed ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <Circle className="h-4 w-4 shrink-0" />
      )}
      {completed ? "Completed" : "Mark as complete"}
    </Button>
  );
}
