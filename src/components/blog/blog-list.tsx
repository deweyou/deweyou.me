'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PostMeta } from '##/lib/posts';
import { BLOG } from '##/content/blog';

function normalizeDate(date: string | Date): string {
  if (typeof date === 'string') return date;
  return date.toISOString().slice(0, 10);
}

export function BlogList({ posts }: { posts: PostMeta[] }) {
  const tags = ['全部', ...Array.from(new Set(posts.map((p) => p.tag).filter(Boolean)))];
  const [activeTag, setActiveTag] = useState<string>('全部');

  const normalizedPosts = posts.map((p) => ({ ...p, date: normalizeDate(p.date as string | Date) }));

  const filtered = activeTag === '全部' ? normalizedPosts : normalizedPosts.filter((p) => p.tag === activeTag);

  const byYear: Record<string, PostMeta[]> = {};
  filtered.forEach((p) => {
    const y = p.date.slice(0, 4);
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(p);
  });
  const years = Object.keys(byYear).sort().reverse();

  return (
    <div className="page" style={{ position: 'relative' }}>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(to right, color-mix(in srgb, var(--ui-color-text) 4%, transparent) 1px, transparent 1px)',
        backgroundSize: '25% 100%',
        pointerEvents: 'none',
      }} />

      <section className="container" style={{ paddingTop: 'clamp(72px, 12vw, 120px)', paddingBottom: 48, position: 'relative', zIndex: 2 }}>
        <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: 'currentColor' }} />
          {BLOG.eyebrow} · {posts.length} {BLOG.entriesLabel}
        </div>
        <h1 style={{ fontSize: 'clamp(2.35rem, 6vw, 4rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: 24, letterSpacing: 0 }}>
          {BLOG.heading}
        </h1>
        <p style={{ fontSize: 'clamp(16px, 1.7vw, 17px)', color: 'var(--ui-color-text-muted)', maxWidth: 540, lineHeight: 1.7 }}>
          {BLOG.description}
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 44 }}>
          {tags.map((t) => {
            const count = t === '全部' ? posts.length : posts.filter((p) => p.tag === t).length;
            return (
              <button key={t} className="dy-tag" data-active={activeTag === t ? 'true' : 'false'} onClick={() => setActiveTag(t)}>
                {t} <span style={{ opacity: 0.5, fontSize: 11 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="container" style={{ paddingBottom: 100, position: 'relative', zIndex: 2 }}>
        {years.map((year) => (
          <div key={year} style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--ui-color-border)' }}>
              <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 12, color: 'var(--ui-color-text-muted)', letterSpacing: '0.1em' }}>{year}</span>
              <span style={{ fontSize: 12, color: 'var(--ui-color-text-muted)' }}>{byYear[year].length} {BLOG.postsPerYearSuffix}</span>
            </div>
            {byYear[year].map((post) => <PostRow key={post.slug} post={post} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function PostRow({ post }: { post: PostMeta }) {
  const [hover, setHover] = useState(false);
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '14px 0',
        borderBottom: '1px solid var(--ui-color-border)', paddingLeft: hover ? 8 : 0, transition: 'padding-left 140ms ease' }}>
        <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-brand-text)', opacity: hover ? 1 : 0, transition: 'opacity 140ms ease', width: 12, flexShrink: 0 }}>→</span>
        <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 12, color: 'var(--ui-color-text-muted)', flexShrink: 0 }}>{post.date.slice(5)}</span>
        <span style={{ fontSize: 16, flex: 1 }}>
          {post.pinned && <span style={{ marginRight: 8, fontSize: 11, fontFamily: 'var(--ui-font-mono)', color: 'var(--ui-color-brand-text)' }}>★</span>}
          {post.title}
        </span>
        <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', letterSpacing: '0.05em', flexShrink: 0 }}>{post.tag}</span>
      </div>
    </Link>
  );
}
