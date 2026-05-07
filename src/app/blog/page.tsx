// src/app/blog/page.tsx — Server Component
import { getAllPosts } from '##/lib/posts';
import { BlogList } from '##/components/blog/blog-list';

export default async function BlogPage() {
  const posts = getAllPosts();
  return (
    <>
      <BlogList posts={posts} />
    </>
  );
}
