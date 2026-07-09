import { GreetingCard } from "../../../components/GreetingCard";
import { QuickActionCards } from "../../../components/QuickActionCards";
import { ProgressSection } from "../../../components/ProgressSection";
import { RightPanel } from "../../../components/RightPanel";
import { getUser, getStreak, getDashboardFeed } from "../../../lib/api";
import { DEMO_USER_ID } from "../../../lib/demo-user";
import { TodoListSection } from "../../../components/TodoListSection";

export default async function DashboardPage() {
  const [user, streak, feed] = await Promise.all([
    getUser(DEMO_USER_ID),
    getStreak(DEMO_USER_ID),
    getDashboardFeed(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <GreetingCard name={user.name} />
      <QuickActionCards />
      <TodoListSection />
      <ProgressSection />
      
      {/* Mobile-only right panel widgets (avatar, streak logs, feed) */}
      <div className="xl:hidden mt-4">
        <RightPanel user={user} streak={streak} feed={feed} variant="inline" />
      </div>
    </div>
  );
}
