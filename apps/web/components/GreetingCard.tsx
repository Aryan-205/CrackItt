export function GreetingCard({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="rounded-xl bg-gradient-to-r from-primary to-teal-400 p-6 text-white">
      <h1 className="text-2xl font-bold">
        {greeting}, {name}!
      </h1>
      <p className="mt-2 text-white/90">
        We know preparation is hard, but you&apos;re doing great.
      </p>
    </div>
  );
}
