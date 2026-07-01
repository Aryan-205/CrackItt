"use client";

import { useEffect } from "react";
import { checkInStreak } from "../lib/api";

export function StreakCheckIn({ userId }: { userId: string }) {
  useEffect(() => {
    checkInStreak(userId).catch(() => {
      // API may be unavailable during dev startup
    });
  }, [userId]);

  return null;
}
