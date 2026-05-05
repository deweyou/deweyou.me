'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from '##/components/logo';
import { SocialIcon } from '##/components/social-icon';
import { PROFILE } from '##/lib/data';
import { useTheme } from '##/components/theme-provider';
import styles from './hero.module.css';

function useNowString() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai',
  }).format(now);
}

export function Hero() {
  const time = useNowString();
  const { theme } = useTheme();

  return (
    <div className="page" style={{ position: 'relative', minHeight: '100%', overflow: 'hidden' }}>
      {/* Topo background */}
      <svg aria-hidden="true" style={{
        position: 'absolute', top: -100, left: -100,
        width: 1500, height: 900,
        pointerEvents: 'none', opacity: 0.5,
      }} viewBox="0 0 1500 900" preserveAspectRatio="none">
        <defs>
          <radialGradient id="topo-fade" cx="16%" cy="20%" r="85%">
            <stop offset="0%" stopColor="var(--ui-color-text)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--ui-color-text)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 14 }, (_, i) => {
          const y = 80 + i * 60;
          return (
            <path key={i}
              d={`M -100 ${y} Q 250 ${y - 50} 620 ${y + 10} T 1600 ${y - 30}`}
              fill="none" stroke="url(#topo-fade)" strokeWidth="0.8" />
          );
        })}
      </svg>

      {/* Faded wordmark */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: -40, left: '50%',
        transform: 'translateX(-50%)',
        opacity: theme === 'dark' ? 0.04 : 0.05,
        pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none',
      }}>
        <Logo height={420} />
      </div>

      <section className={styles.hero}>
        {/* LEFT */}
        <div className={styles.left}>
          <div>
            <div className={styles.timeRow}>
              <span className={styles.timeDot} />
              <span className={styles.timeText}>SHENZHEN — {time} CST</span>
            </div>

            <div className={styles.avatarWrap}>
              <div aria-hidden="true" className={styles.avatarOffset} />
              <div className={styles.avatarFrame}>
                {/* SVG silhouette — visible until real photo is added */}
                <svg aria-hidden="true" viewBox="0 0 200 250" preserveAspectRatio="xMidYMax meet"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  <path d="M 0 250 L 0 215 Q 30 180 70 175 L 130 175 Q 170 180 200 215 L 200 250 Z"
                    fill="var(--ui-color-text)" opacity="0.92" />
                  <path d="M 82 195 L 82 165 Q 82 158 100 158 Q 118 158 118 165 L 118 195 Z"
                    fill="var(--ui-color-text)" opacity="0.92" />
                  <ellipse cx="100" cy="115" rx="42" ry="50" fill="var(--ui-color-text)" opacity="0.92" />
                  <path d="M 60 90 Q 65 65 100 60 Q 138 65 142 95 Q 130 75 100 75 Q 72 75 60 90 Z"
                    fill="var(--ui-color-text)" />
                  <path d="M 0 220 Q 30 188 70 183 L 130 183"
                    fill="none" stroke="var(--ui-color-brand-bg)" strokeWidth="2" opacity="0.9" />
                </svg>
                <Image
                  src="/avatar.jpg"
                  alt="Dewey Ou"
                  fill
                  className={styles.avatarImage}
                  priority
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className={`${styles.cornerBracket} ${styles.tl}`} />
                <span className={`${styles.cornerBracket} ${styles.tr}`} />
                <span className={`${styles.cornerBracket} ${styles.bl}`} />
                <span className={`${styles.cornerBracket} ${styles.br}`} />
                <div className={styles.figLabel}>
                  <span>FIG. 01</span>
                  <span style={{ width: 16, height: 1, background: 'var(--ui-color-canvas)', opacity: 0.5 }} />
                  <span>SELF</span>
                </div>
              </div>
              <span className={styles.avatarAnnotation}>ŌU · /oʊ/</span>
            </div>

            <div className={styles.nameRow}>
              <span className={styles.nameEn}>Dewey Ou</span>
              <span className={styles.nameSep}>·</span>
              欧怼怼
            </div>
          </div>

          <div className={styles.estRow}>
            <hr className="dy-rule" />
            <span className={styles.estText}>EST · 2018</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.headline}>
            做
            <span className={styles.highlight}>
              <span className={styles.highlightText}>有意思</span>
              <span className={styles.highlightBg} aria-hidden="true" />
            </span>
            的产品<br />
            <span style={{ color: 'var(--ui-color-text-muted)' }}>—— 也，过有意思的生活。</span>
          </div>

          <p className={styles.bio}>
            字节跳动的<span className={styles.bioUnderline}>前端工程师</span>，住在深圳。
            喜欢有设计感、人性化、新颖的东西，也想成为做这类产品的人。
            最近在和{' '}
            <span className={styles.aiChip}>AI</span>
            {' '}交朋友，让它陪我学习、做有意思的产品。
            工作之余，看书、玩魔方、变魔术、拍照。
          </p>

          <div className={styles.ctaRow}>
            <Link href="/blog" className={styles.cta}>
              <span>读我写的文章</span>
              <i className={`ti ti-arrow-up-right ${styles.ctaArrow}`} />
            </Link>
            <span className={styles.divider} />
            <div className={styles.socials}>
              {PROFILE.socials.map((s) => (
                <SocialIcon key={s.label} s={s} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
