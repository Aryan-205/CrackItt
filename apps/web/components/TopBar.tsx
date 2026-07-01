import { GraduationCap, Moon, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-card px-6 py-3">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search questions, tutorials, blogs..."
          className="pr-16 pl-10"
          readOnly
        />
        <Badge
          variant="outline"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[10px]"
        >
          ⌘K
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href="#" />}>
          Pricing
        </Button>
        <Button variant="outline" size="sm">
          <GraduationCap className="h-4 w-4" />
          Tutor
        </Button>
        <Button size="sm">Get Premium</Button>
        <Button variant="ghost" size="icon" aria-label="Toggle dark mode">
          <Moon className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
