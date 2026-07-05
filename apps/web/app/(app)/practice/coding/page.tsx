import { PracticeSection } from "@/components/PracticeSection";
import { getCodingQuestions } from "@/lib/api";

export default async function CodingPracticePage() {
  const questions = await getCodingQuestions();

  return (
    <PracticeSection
      questions={questions}
      basePath="/practice/coding"
      title="Coding Practice"
      description="Algorithm, data structure, and frontend coding problems with code solutions."
      searchPlaceholder="Search coding problems..."
    />
  );
}
