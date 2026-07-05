import { getDashboardFeed, getStreak, getUser } from "../lib/api";
import { DEMO_USER_ID } from "../lib/demo-user";
import { StreakCheckIn } from "./StreakCheckIn";
import { AppShellClient } from "./AppShellClient";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [user, streak, feed] = await Promise.all([
    getUser(DEMO_USER_ID),
    getStreak(DEMO_USER_ID),
    getDashboardFeed(),
  ]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <StreakCheckIn userId={DEMO_USER_ID} />
      <AppShellClient user={user} streak={streak} feed={feed}>
        {children}
      </AppShellClient>
    </div>
  );
}
