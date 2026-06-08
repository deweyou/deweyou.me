'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@deweyou-design/react/button';
import { LogoAnimated, LogoAutoCrisp, LogoStaticGreenCrisp } from './logo';
import { useTheme } from './theme-provider';
import { NAV_LINKS } from '##/content/common';
import { SearchModal } from './search/search-modal';
import styles from './nav.module.css';

export function Nav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.body.toggleAttribute('data-menu-open', menuOpen);

    return () => {
      document.body.removeAttribute('data-menu-open');
    };
  }, [menuOpen]);

  return (
    <nav className={styles.nav}>
      {/* Brand */}
      <Link href="/" className={styles.brand}>
        <span className={styles.logoDesktop}><LogoAnimated height={18} /></span>
        <span className={styles.logoMobile}><LogoStaticGreenCrisp height={24} /></span>
      </Link>

      {/* Desktop links */}
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

      {/* Right controls */}
      <div className={styles.meta}>
        <Button.Icon variant="ghost" className={styles.iconBtn} aria-label="Search" icon={<i className="ti ti-search" style={{ fontSize: 18 }} />} onClick={() => setSearchOpen(true)} />
        <Button.Icon variant="ghost" className={styles.iconBtn} aria-label="Toggle theme" icon={<i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} style={{ fontSize: 18 }} />} onClick={toggleTheme} />
        <Button.Icon variant="ghost" className={`${styles.iconBtn} ${styles.menuBtn}`} aria-label="Menu" icon={<i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'}`} style={{ fontSize: 18 }} />} onClick={() => setMenuOpen((o) => !o)} />
      </div>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Mobile overlay */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.overlayTop}>
            <LogoAutoCrisp height={20} className={styles.overlayLogo} />
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
