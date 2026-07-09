import { Menu, PhoneCall, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex items-center border-b border-border w-full px-4 sm:px-6 py-3 gap-3">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMenuClick}
            className="lg:hidden active:scale-95 transition-transform"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <span className="lg:hidden font-bold text-primary text-base">CrackItt</span>
      </div>

      <div className="relative w-full max-w-xs hidden sm:block">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search questions, tutorials, blogs..."
          className="pr-16 pl-10 h-9"
          readOnly
        />
        <Badge
          variant="outline"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[10px]"
        >
          ⌘K
        </Badge>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          render={<Link href="https://cal.com/aryan-bola/15min" />}
          className="active:scale-[0.97] transition-all text-xs sm:text-sm px-2.5 sm:px-3"
        >
          <PhoneCall className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Book a call</span>
          <span className="xs:hidden">Book</span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
