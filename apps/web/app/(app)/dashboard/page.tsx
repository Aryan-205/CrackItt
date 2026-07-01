import { GreetingCard } from "../../../components/GreetingCard";
import { QuickActionCards } from "../../../components/QuickActionCards";
import { ProgressSection } from "../../../components/ProgressSection";
import { getUser } from "../../../lib/api";
import { DEMO_USER_ID } from "../../../lib/demo-user";

export default async function DashboardPage() {
  const user = await getUser(DEMO_USER_ID);

  return (
    <div className="flex flex-col gap-6">
      <GreetingCard name={user.name} />
      <QuickActionCards />
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Personalize your checklists</h2>
          <button
            type="button"
            className="rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
          >
            + Add Target Company
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">
          Tailor your preparation roadmap to your target companies.
        </p>
      </div>
      <ProgressSection />
    </div>
  );
}
