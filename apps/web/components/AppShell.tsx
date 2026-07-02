
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AppRightPanel } from "./AppRightPanel";
import { getDashboardFeed, getStreak, getUser } from "../lib/api";
import { DEMO_USER_ID } from "../lib/demo-user";
import { StreakCheckIn } from "./StreakCheckIn";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [user, streak, feed] = await Promise.all([
    getUser(DEMO_USER_ID),
    getStreak(DEMO_USER_ID),
    getDashboardFeed(),
  ]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <StreakCheckIn userId={DEMO_USER_ID} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
            <AppRightPanel user={user} streak={streak} feed={feed} />
          </div>
        </div>
      </div>
    </div>
  );
}
