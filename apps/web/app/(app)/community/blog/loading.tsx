import { Card, CardHeader } from "@/components/ui/card";

export default function BlogLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-pulse">
        <div>
          <div className="h-8 w-32 rounded bg-muted/60" />
          <div className="mt-2 h-4 w-64 rounded bg-muted/60" />
        </div>
        <div className="h-10 w-36 rounded bg-muted/60" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center animate-pulse">
        <div className="h-10 flex-1 rounded bg-muted/60" />
        <div className="h-10 w-24 rounded bg-muted/60" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/60 bg-muted/5 animate-pulse">
            <CardHeader className="gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 rounded bg-muted/60" />
                  <div className="h-4 w-24 rounded bg-muted/60" />
                </div>
                <div className="h-8 w-8 rounded bg-muted/60" />
              </div>
              <div className="mt-2 h-6 w-3/4 rounded bg-muted/80" />
              <div className="mt-2 space-y-2">
                <div className="h-4 w-full rounded bg-muted/50" />
                <div className="h-4 w-5/6 rounded bg-muted/50" />
              </div>
              <div className="mt-3 h-3 w-20 rounded bg-muted/40" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
