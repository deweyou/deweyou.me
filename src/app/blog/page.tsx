// src/app/blog/page.tsx — Server Component
import { getAllPosts } from '##/lib/posts';
import { BlogList } from '##/components/blog/blog-list';
import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';

export default async function BlogPage() {
  const posts = getAllPosts();
  return (
    <>
      <Nav />
      <BlogList posts={posts} />
      <Footer />
    </>
  );
}
