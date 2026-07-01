import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-primary">crackitt</span>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
            Dashboard
          </Button>
          <Button size="sm" render={<Link href="/dashboard" />}>
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-primary/10 via-accent/30 to-background px-6 py-20 text-center">
        <div className="max-w-3xl">
          <Badge className="mb-4">Free for a limited time</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Ace your next interview with{" "}
            <span className="text-primary">crackitt</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            One platform for frontend, backend, and full stack interview prep.
            Practice questions with solutions, watch system design tutorials,
            join the community, and build your learning streak.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="w-full sm:w-auto" render={<Link href="/dashboard" />}>
              Start Practicing
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              render={<Link href="/practice" />}
            >
              Browse Questions
            </Button>
          </div>
        </div>

        <div className="mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              title: "Practice",
              desc: "Questions with detailed solutions across all tracks",
            },
            {
              title: "Learn",
              desc: "System design videos and structured roadmaps",
            },
            {
              title: "Community",
              desc: "Blogs, guides, and peer support",
            },
          ].map((item) => (
            <Card key={item.title} className="text-left">
              <CardHeader>
                <CardTitle className="text-primary">{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
