'use client';

import { useEffect } from 'react';

const ACTIVE_TOP_OFFSET = 120;

export function DailyHashSync({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (ids.length === 0) return;

    let frame = 0;
    let restoreTimer = 0;
    let aligningInitialHash = ids.includes(decodeURIComponent(window.location.hash.slice(1)));

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
      if (aligningInitialHash) return;
      const activeId = getActiveId();
      const nextHash = activeId ? `#${activeId}` : '';
      if (window.location.hash === nextHash) return;
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
    }

    function scheduleSync() {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(syncHash);
    }

    function scrollToInitialHash() {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      if (!ids.includes(targetId)) {
        aligningInitialHash = false;
        scheduleSync();
        return;
      }

      const target = document.getElementById(targetId);
      if (!target) {
        aligningInitialHash = false;
        scheduleSync();
        return;
      }

      target.scrollIntoView({ block: 'start' });
      restoreTimer = window.setTimeout(() => {
        aligningInitialHash = false;
        scheduleSync();
      }, 120);
    }

    if (aligningInitialHash) {
      void document.fonts.ready.then(() => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(scrollToInitialHash);
        });
      });
    }

    scheduleSync();
    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      if (restoreTimer !== 0) window.clearTimeout(restoreTimer);
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
    };
  }, [ids]);

  return null;
}
