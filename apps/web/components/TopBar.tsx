import { GraduationCap, PhoneCall, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-border w-full px-6 py-3">
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
        <Button variant="outline" size="sm" render={<Link href="https://cal.com/aryan-bola/15min" />}>
          <PhoneCall className="h-4 w-4" />
          Book a one-on-one call
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
