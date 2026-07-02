import { PracticeSection } from "@/components/PracticeSection";
import { codingQuestions } from "@/lib/coding-questions";

export default function CodingPracticePage() {
  return (
    <PracticeSection
      questions={codingQuestions}
      basePath="/practice/coding"
      title="Coding Practice"
      description="Algorithm, data structure, and frontend coding problems with code solutions."
      searchPlaceholder="Search coding problems..."
    />
  );
}
