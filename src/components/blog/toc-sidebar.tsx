'use client';

import { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  label: string;
  depth: number;
}

const NAV_HEIGHT = 80;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

export function TocSidebar({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  // On mount: if URL has a hash, scroll to it
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Wait for layout before scrolling
      requestAnimationFrame(() => scrollToId(hash));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const headings = items
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      // Active = last heading that has crossed the nav threshold
      let current = headings[0]?.id ?? '';
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= NAV_HEIGHT + 16) current = h.id;
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="toc-fixed">
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              data-active={activeId === t.id}
              onClick={(e) => {
                e.preventDefault();
                history.pushState(null, '', `#${t.id}`);
                scrollToId(t.id);
              }}
              style={{
                display: 'block',
                paddingBlock: '3px',
                paddingLeft: t.depth === 1 ? 0 : t.depth === 2 ? 10 : 20,
                fontSize: 12,
                fontFamily: 'var(--ui-font-mono)',
                color: 'var(--ui-color-text)',
                opacity: activeId === t.id ? 1 : 0.3,
                textDecoration: 'none',
                lineHeight: 1.6,
                transition: 'opacity 140ms',
              }}
              onMouseEnter={(e) => { if (activeId !== t.id) (e.currentTarget as HTMLElement).style.opacity = '0.65'; }}
              onMouseLeave={(e) => { if (activeId !== t.id) (e.currentTarget as HTMLElement).style.opacity = '0.3'; }}
            >
              {t.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
