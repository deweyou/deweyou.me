import { notFound } from 'next/navigation';
import { ContentHeader } from '##/components/content/content-header';
import { MarkdownContent } from '##/components/markdown-content';
import { ReadingProgress } from '##/components/blog/reading-progress';
import { TocSidebar } from '##/components/blog/toc-sidebar';
import { getPost, getAllSlugs, extractToc } from '##/lib/posts';

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

  const toc = extractToc(post.content);

  return (
    <>
      <ReadingProgress contentType="article" contentId={slug} />
      <TocSidebar items={toc} />
      <div className="container" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <article style={{ maxWidth: 720, margin: '0 auto' }}>
          <ContentHeader
            backHref="/blog"
            backLabel="文章"
            metadata={[
              { key: 'tag', label: post.tag },
              { key: 'date', label: post.date, dateTime: post.date },
              { key: 'readTime', label: post.readTime },
            ]}
            title={post.title}
          />

          <MarkdownContent content={post.content} />
        </article>
      </div>
    </>
  );
}
