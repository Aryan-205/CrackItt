import { QuestionCard } from "../../../components/QuestionCard";
import { getQuestions } from "../../../lib/api";

export default async function PracticePage() {
  const questions = await getQuestions();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Practice</h1>
        <p className="mt-1 text-muted-foreground">
          Interview questions with solutions across frontend, backend, and full
          stack.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
}
