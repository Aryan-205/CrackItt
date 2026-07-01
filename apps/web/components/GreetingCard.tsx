import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function GreetingCard({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <Card className="border-0 bg-gradient-to-r from-primary to-orange-400 text-primary-foreground ring-0">
      <CardHeader>
        <CardTitle className="text-2xl text-primary-foreground">
          {greeting}, {name}!
        </CardTitle>
        <CardDescription className="text-primary-foreground/90">
          We know preparation is hard, but you&apos;re doing great.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
