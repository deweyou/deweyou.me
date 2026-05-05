import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { ReadingProgress } from '##/components/blog/reading-progress';
import { mdxComponents } from '##/components/blog/mdx-components';
import { getPost, getAllSlugs } from '##/lib/posts';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <Nav />
      <article className="container container-sm" style={{ paddingTop: 80, paddingBottom: 120 }}>
        {/* Header */}
        <header style={{ marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>
              ← 文章
            </Link>
            <span>·</span>
            <span>{post.tag}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--ui-font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: 20, fontFamily: 'var(--ui-font-mono)', fontSize: 12,
            color: 'var(--ui-color-text-muted)', letterSpacing: '0.05em' }}>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Body */}
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>
      <Footer />
    </>
  );
}
