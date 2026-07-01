import { BlogCard } from "../../../components/BlogCard";
import { getBlogs } from "../../../lib/api";

export default async function CommunityPage() {
  const posts = await getBlogs();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="mt-1 text-muted-foreground">
          Blogs, guides, and discussions from the interview prep community.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
