import { redirect } from "next/navigation";

export default async function LegacyQuestionRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/practice/questions/${slug}`);
}
