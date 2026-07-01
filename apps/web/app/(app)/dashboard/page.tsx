import { GreetingCard } from "../../../components/GreetingCard";
import { QuickActionCards } from "../../../components/QuickActionCards";
import { ProgressSection } from "../../../components/ProgressSection";
import { getUser } from "../../../lib/api";
import { DEMO_USER_ID } from "../../../lib/demo-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getUser(DEMO_USER_ID);

  return (
    <div className="flex flex-col gap-6">
      <GreetingCard name={user.name} />
      <QuickActionCards />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personalize your checklists</CardTitle>
          <Button variant="outline" size="sm">
            + Add Target Company
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Tailor your preparation roadmap to your target companies.
          </CardDescription>
        </CardContent>
      </Card>
      <ProgressSection />
    </div>
  );
}
