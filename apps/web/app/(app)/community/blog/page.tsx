import { BlogSection } from "../../../../components/community/BlogSection";
import { getBlogs } from "../../../../lib/api";

export default async function BlogPage() {
  const posts = await getBlogs();

  return <BlogSection initialPosts={posts} />;
}
