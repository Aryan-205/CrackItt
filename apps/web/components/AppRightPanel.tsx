"use client";

import { usePathname } from "next/navigation";
import type { DashboardFeedItem, Streak, User } from "@repo/types";
import { LearnSidebar } from "./LearnSidebar";
import { RightPanel } from "./RightPanel";

export function AppRightPanel({
  user,
  streak,
  feed,
}: {
  user: User;
  streak: Streak;
  feed: DashboardFeedItem[];
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/learn/")) {
    return <LearnSidebar />;
  }

  if (pathname === "/dashboard") {
    return <RightPanel user={user} streak={streak} feed={feed} />;
  }

  return null;
}
