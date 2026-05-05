'use client';

import { Tooltip } from '@deweyou-design/react';

interface Social {
  label: string;
  handle: string;
  href: string;
  icon?: string;
  iconSrc?: string;
}

export function SocialIcon({ s }: { s: Social }) {
  return (
    <Tooltip.Root openDelay={200}>
      <Tooltip.Trigger>
        <a
          href={s.href}
          aria-label={s.label}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32, height: 32,
            color: 'var(--ui-color-text-muted)',
            textDecoration: 'none',
            transition: 'color 140ms ease',
          }}
        >
          {s.iconSrc ? (
            <span style={{
              display: 'inline-block',
              width: 17, height: 17,
              background: 'currentColor',
              WebkitMaskImage: `url(${s.iconSrc})`,
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskImage: `url(${s.iconSrc})`,
              maskRepeat: 'no-repeat',
              maskSize: 'contain',
              maskPosition: 'center',
            }} />
          ) : (
            <i className={`ti ${s.icon}`} style={{ fontSize: 17 }} />
          )}
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content>{s.handle}</Tooltip.Content>
    </Tooltip.Root>
  );
}
