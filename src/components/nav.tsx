'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo, LogoAnimated } from './logo';
import { useTheme } from './theme-provider';
import { NAV_LINKS } from '##/content/common';
import styles from './nav.module.css';

interface NavProps {
  compact?: boolean;
}

export function Nav({ compact = false }: NavProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  if (compact) {
    return (
      <nav className={`${styles.nav} ${styles.navMobile}`}>
        <Link href="/" className={styles.brand}>
          <Logo height={16} />
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className="icon-btn-ghost" aria-label="Toggle theme" onClick={toggleTheme}>
            <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} />
          </button>
          <button type="button" className="icon-btn-ghost" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
            <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'}`} />
          </button>
        </div>

        {menuOpen && (
          <div className={styles.overlay} onClick={() => setMenuOpen(false)}>
            <div className={styles.overlayTop}>
              <Logo height={16} />
              <span className={styles.overlayCount}>MENU · {NAV_LINKS.length.toString().padStart(2, '0')}</span>
            </div>
            <ul className={styles.overlayList} onClick={(e) => e.stopPropagation()}>
              {NAV_LINKS.map((l, i) => {
                const isActive = pathname === l.href;
                return (
                  <li key={l.href} className={styles.overlayItem}
                    style={{ animation: `overlayItem ${260 + i * 60}ms cubic-bezier(0.7,0,0.3,1) both` }}>
                    <Link
                      href={l.href}
                      className={`${styles.overlayLink} ${isActive ? styles.overlayLinkActive : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className={styles.overlayLinkLabel}>
                        <span className={styles.overlayIndex}>{String(i + 1).padStart(2, '0')}</span>
                        <span style={{ position: 'relative', paddingBottom: 2,
                          boxShadow: isActive ? 'inset 0 -3px 0 var(--ui-color-brand-bg)' : 'none' }}>
                          {l.label}
                        </span>
                      </span>
                      <i className="ti ti-arrow-up-right" style={{ fontSize: 20, color: 'var(--ui-color-text-muted)' }} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className={styles.overlayBottom}>
              <button className={styles.closeBtn} onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} aria-label="Close menu">
                <i className="ti ti-x" />
              </button>
            </div>
          </div>
        )}

        <style>{`
          @keyframes overlayItem {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </nav>
    );
  }

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.brand}>
        <LogoAnimated height={18} />
      </Link>
      <div className={styles.links}>
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={styles.link}
            data-active={pathname === l.href ? 'true' : 'false'}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className={styles.meta}>
        <button type="button" className="icon-btn-ghost" aria-label="Toggle theme" onClick={toggleTheme}>
          <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} />
        </button>
      </div>
    </nav>
  );
}
