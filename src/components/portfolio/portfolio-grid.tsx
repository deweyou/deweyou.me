'use client';

import { useState } from 'react';
import { Card } from '@deweyou-design/react/card';
import { PORTFOLIO_ITEMS, type PortfolioItem } from '##/content/portfolio';

const ALL_TAGS = ['全部', ...Array.from(new Set(PORTFOLIO_ITEMS.map((i) => i.tag)))];

export function PortfolioGrid() {
  const [activeTag, setActiveTag] = useState<string>('全部');
  const filtered = activeTag === '全部' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((i) => i.tag === activeTag);

  return (
    <div>
      {/* Tag filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 48 }}>
        {ALL_TAGS.map((t) => (
          <button key={t} className="dy-tag" data-active={activeTag === t ? 'true' : 'false'} onClick={() => setActiveTag(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {filtered.map((item: PortfolioItem) => {
          const href = item.href === '#' ? undefined : item.href;
          const isExternal = !!href && href.startsWith('http');
          const cover = item.cover ?? null;
          return (
            <Card
              key={item.id}
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              style={{ position: 'relative', overflow: 'hidden', color: 'inherit', textDecoration: 'none' }}
            >
              {cover && (
                <div style={{ margin: '-24px -24px 20px', height: 160, overflow: 'hidden' }}>
                  <img
                    src={cover}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
              {!cover && item.accent === 'mint' && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: 'linear-gradient(90deg, var(--ui-color-brand-bg), var(--ui-color-palette-emerald-500))' }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ui-color-text-muted)' }}>{item.subtitle}</div>
                </div>
                {item.year && (
                  <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)' }}>
                    {item.year}
                  </span>
                )}
              </div>
              {item.desc && (
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ui-color-text-muted)', margin: '0 0 16px' }}>
                  {item.desc}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)' }}>
                  {item.meta}
                </span>
                {item.stars && (
                  <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    ★ {String(item.stars)}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
