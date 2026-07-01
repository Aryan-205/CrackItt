import { TutorialCard } from "../../../components/TutorialCard";
import { getTutorials } from "../../../lib/api";

export default async function TutorialsPage() {
  const tutorials = await getTutorials();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Tutorials</h1>
        <p className="mt-1 text-muted">
          Video tutorials for system design and interview preparation topics.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>
    </div>
  );
}
