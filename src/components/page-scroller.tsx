'use client';

import { ScrollArea } from '@deweyou-design/react';
import type { ReactNode } from 'react';

export function PageScroller({ children }: { children: ReactNode }) {
  const viewportHeight = 'var(--visual-viewport-height, 100dvh)';

  return (
    <ScrollArea.Root style={{ height: viewportHeight }}>
      <ScrollArea.Viewport>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: viewportHeight }}>
          {children}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
