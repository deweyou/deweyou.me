'use client';

import { useEffect } from 'react';

const ACTIVE_TOP_OFFSET = 120;

export function DailyHashSync({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (ids.length === 0) return;

    let frame = 0;

    function getActiveId() {
      const entries = ids
        .map((id) => document.getElementById(id))
        .filter((entry): entry is HTMLElement => entry != null);

      if (entries.length === 0) return null;
      if (entries[0].getBoundingClientRect().top > ACTIVE_TOP_OFFSET) return null;

      let activeId = entries[0].id;
      for (const entry of entries) {
        if (entry.getBoundingClientRect().top <= ACTIVE_TOP_OFFSET) {
          activeId = entry.id;
        } else {
          break;
        }
      }
      return activeId;
    }

    function syncHash() {
      frame = 0;
      const activeId = getActiveId();
      const nextHash = activeId ? `#${activeId}` : '';
      if (window.location.hash === nextHash) return;
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
    }

    function scheduleSync() {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(syncHash);
    }

    scheduleSync();
    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
    };
  }, [ids]);

  return null;
}
