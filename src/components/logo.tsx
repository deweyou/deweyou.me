'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './logo.module.css';

interface LogoProps {
  height?: number;
  color?: boolean;
}

export function Logo({ height = 18, color = false }: LogoProps) {
  return (
    <span
      className={color ? styles.wordmarkColor : styles.wordmark}
      style={{ height: `${height}px` }}
      aria-label="Dewey Ou"
      role="img"
    />
  );
}

interface LogoAnimatedProps {
  height?: number;
  replayKey?: string;
}

export function LogoAnimated({ height = 18, replayKey = 'home' }: LogoAnimatedProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sessionKey = `logo-anim-played-${replayKey}`;
    if (sessionStorage.getItem(sessionKey)) {
      setPlayed(true);
      return;
    }
    fetch('/assets/logo-animated-black.svg')
      .then((r) => r.text())
      .then((svg) => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        setTimeout(() => {
          sessionStorage.setItem(sessionKey, '1');
          if (!cancelled) setPlayed(true);
        }, 2400);
      })
      .catch(() => setPlayed(true));
    return () => { cancelled = true; };
  }, [replayKey]);

  if (played) return <Logo height={height} />;

  return (
    <span
      ref={ref}
      className={styles.animatedHost}
      style={{ height: `${height}px`, display: 'inline-block', aspectRatio: '7648 / 2451' }}
      aria-label="Dewey Ou"
      role="img"
    />
  );
}
