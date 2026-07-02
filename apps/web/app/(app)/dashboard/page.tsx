import { GreetingCard } from "../../../components/GreetingCard";
import { QuickActionCards } from "../../../components/QuickActionCards";
import { ProgressSection } from "../../../components/ProgressSection";
import { getUser } from "../../../lib/api";
import { DEMO_USER_ID } from "../../../lib/demo-user";
import { TodoListSection } from "../../../components/TodoListSection";

export default async function DashboardPage() {
  const user = await getUser(DEMO_USER_ID);

  return (
    <div className="flex flex-col gap-6">
      <GreetingCard name={user.name} />
      <QuickActionCards />
      <TodoListSection />
      <ProgressSection />
    </div>
  );
}
