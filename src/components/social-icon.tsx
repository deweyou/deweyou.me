'use client';

import { useState } from 'react';

interface Social {
  label: string;
  handle: string;
  href: string;
  icon: string; // tabler icon class e.g. 'ti-brand-github'
}

export function SocialIcon({ s }: { s: Social }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={s.href}
      title={`${s.label} · ${s.handle}`}
      aria-label={s.label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32, height: 32,
        color: hover ? 'var(--ui-color-text)' : 'var(--ui-color-text-muted)',
        transition: 'color 140ms ease',
        textDecoration: 'none',
      }}
    >
      <i className={`ti ${s.icon}`} style={{ fontSize: 17 }} />
      {hover && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          right: 0,
          padding: '4px 10px',
          background: 'var(--ui-color-text)',
          color: 'var(--ui-color-canvas)',
          fontSize: 11,
          fontFamily: 'var(--ui-font-mono)',
          letterSpacing: '0.04em',
          borderRadius: 'var(--ui-radius-float)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          {s.handle}
        </span>
      )}
    </a>
  );
}
