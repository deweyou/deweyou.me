'use client';

import { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  label: string;
  depth: number;
}

export function TocSidebar({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? Math.min(100, Math.round((scrollY / docH) * 100)) : 0);

      const headings = items
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      let current = headings[0]?.id ?? '';
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= 100) current = h.id;
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      position: 'sticky',
      top: 80,
      alignSelf: 'flex-start',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
    }}>
      <div className="eyebrow" style={{ marginBottom: 16 }}>目录 · CONTENTS</div>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{
                display: 'block',
                padding: `3px 0 3px ${t.depth === 3 ? 20 : 12}px`,
                borderLeft: `2px solid ${activeId === t.id ? 'var(--ui-color-brand-bg)' : 'var(--ui-color-border)'}`,
                fontSize: 13,
                color: activeId === t.id ? 'var(--ui-color-text)' : 'var(--ui-color-text-muted)',
                textDecoration: 'none',
                transition: 'color 140ms, border-color 140ms',
                lineHeight: 1.5,
              }}
            >
              {t.label}
            </a>
          </li>
        ))}
      </ol>

      <div style={{
        marginTop: 24,
        paddingTop: 16,
        borderTop: '1px solid var(--ui-color-border)',
        fontSize: 11,
        color: 'var(--ui-color-text-muted)',
        fontFamily: 'var(--ui-font-mono)',
        letterSpacing: '0.05em',
      }}>
        进度 {progress}%
      </div>
    </aside>
  );
}
