'use client';

import { useState } from 'react';
import { PORTFOLIO_ITEMS, PORTFOLIO_TAGS } from '##/content/portfolio';

export function PortfolioGrid() {
  const [activeTag, setActiveTag] = useState<string>('全部');
  const filtered = activeTag === '全部' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((i) => i.tag === activeTag);

  return (
    <div>
      {/* Tag filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 48 }}>
        {PORTFOLIO_TAGS.map((t) => (
          <button key={t} className="dy-tag" data-active={activeTag === t ? 'true' : 'false'} onClick={() => setActiveTag(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {filtered.map((item) => (
          <a
            key={item.id}
            href={'href' in (item as Record<string, unknown>) ? (item as Record<string, unknown>).href as string : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="dy-card dy-card-link"
            style={{ display: 'block', textDecoration: 'none', color: 'inherit', position: 'relative', overflow: 'hidden' }}
          >
            {item.accent === 'mint' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, var(--ui-color-brand-bg), var(--ui-color-palette-emerald-500))' }} />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--ui-color-text-muted)' }}>{item.subtitle}</div>
              </div>
              {'year' in (item as Record<string, unknown>) && (
                <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)' }}>
                  {(item as Record<string, unknown>).year as string}
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ui-color-text-muted)', margin: '0 0 16px' }}>
              {item.desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)' }}>
                {item.meta}
              </span>
              {'stars' in (item as Record<string, unknown>) && !!(item as Record<string, unknown>).stars && (
                <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  ★ {String((item as Record<string, unknown>).stars)}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
