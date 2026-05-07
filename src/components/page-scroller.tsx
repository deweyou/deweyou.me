'use client';

import { ScrollArea } from '@deweyou-design/react';
import type { ReactNode } from 'react';

export function PageScroller({ children }: { children: ReactNode }) {
  return (
    <ScrollArea.Root style={{ height: '100vh' }}>
      <ScrollArea.Viewport>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {children}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
