"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/utils";

export function SolutionReveal({
  explanation,
  code,
  language,
}: {
  explanation: string;
  code: string;
  language: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-border/80">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Solution</CardTitle>
            {!open && (
              <p className="mt-1 text-sm text-muted-foreground">
                Give the problem a real attempt before revealing this.
              </p>
            )}
          </div>
          <CollapsibleTrigger
            render={<Button variant="outline" size="sm" className="shrink-0" />}
          >
            {open ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            {open ? "Hide solution" : "Show solution"}
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent
          className={cn(
            "h-[var(--collapsible-panel-height)] overflow-hidden",
            "transition-[height] duration-[250ms] ease-out-strong",
            "data-[starting-style]:h-0 data-[ending-style]:h-0",
          )}
        >
          <CardContent className="flex flex-col gap-6 pt-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Explanation</h3>
              <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {explanation}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Code</h3>
              <div className="overflow-hidden rounded-lg">
                <CodeBlock code={code} language={language} />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
