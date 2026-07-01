import { BookOpen, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export function QuickActionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Link href="#">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent p-2">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Purchase Premium</CardTitle>
                <CardDescription>Coming soon</CardDescription>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <Link href="/practice">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">
                  Browse Interview Questions
                </CardTitle>
                <CardDescription>Frontend, backend & full stack</CardDescription>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
