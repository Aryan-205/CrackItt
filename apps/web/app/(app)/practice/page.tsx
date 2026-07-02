import { PracticeSection } from "../../../components/PracticeSection";
import { getQuestions } from "../../../lib/api";

export default async function PracticePage() {
  const questions = await getQuestions();

  return <PracticeSection questions={questions} />;
}
