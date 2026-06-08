'use client';

import { useEffect } from 'react';

const VIEWPORT_HEIGHT_VAR = '--visual-viewport-height';

function setViewportHeight() {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty(VIEWPORT_HEIGHT_VAR, `${viewportHeight}px`);
}

export function ViewportHeightSync() {
  useEffect(() => {
    setViewportHeight();

    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', setViewportHeight);
    viewport?.addEventListener('scroll', setViewportHeight);
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      viewport?.removeEventListener('resize', setViewportHeight);
      viewport?.removeEventListener('scroll', setViewportHeight);
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
      document.documentElement.style.removeProperty(VIEWPORT_HEIGHT_VAR);
    };
  }, []);

  return null;
}
