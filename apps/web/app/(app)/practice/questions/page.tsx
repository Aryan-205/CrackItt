import { PracticeSection } from "@/components/PracticeSection";
import { getQuestions } from "@/lib/api";

export default async function InterviewQuestionsPage() {
  const questions = await getQuestions();

  return (
    <PracticeSection
      questions={questions}
      basePath="/practice/questions"
      title="Interview Questions"
      description="Conceptual interview questions across frontend, backend, system design, and behavioral topics."
      searchPlaceholder="Search interview questions..."
    />
  );
}
