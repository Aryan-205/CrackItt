import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-primary">crackitt</span>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background px-6 py-20 text-center">
        <div className="max-w-3xl">
          <p className="mb-4 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary inline-block">
            Free for a limited time
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Ace your next interview with{" "}
            <span className="text-primary">crackitt</span>
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            One platform for frontend, backend, and full stack interview prep.
            Practice questions with solutions, watch system design tutorials,
            join the community, and build your learning streak.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="w-full rounded-xl bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-dark sm:w-auto"
            >
              Start Practicing
            </Link>
            <Link
              href="/practice"
              className="w-full rounded-xl border border-border bg-card px-8 py-3 text-base font-medium hover:bg-card-muted sm:w-auto"
            >
              Browse Questions
            </Link>
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
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6 text-left"
            >
              <h3 className="font-semibold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
