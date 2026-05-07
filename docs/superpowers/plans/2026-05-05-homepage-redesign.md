# Homepage Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild deweyou.me as a pixel-perfect Next.js personal blog/portfolio based on the Claude Design handoff.

**Architecture:** Fresh Next.js (latest) on the `redesign` branch; `@deweyou-design/styles` for all design tokens; CSS Modules for component-scoped styles; `next-mdx-remote` RSC for MDX blog.

**Tech Stack:** Next.js latest, React 19, TypeScript, `@deweyou-design/react` + `@deweyou-design/styles` + `@deweyou-design/react-icons`, `next-mdx-remote`, `gray-matter`

**Design reference:** `/Users/deweyou/Downloads/deweyou_design_handoff/deweyou-blog-website/project/`

---

## File Map

```
content/posts/
  ai-as-pair.mdx
  song-typeface-on-web.mdx

public/assets/
  logo-black.svg
  logo-white.svg
  logo-animated-black.svg
  logo-animated-white.svg

src/app/
  fonts/
    SourceHanSerifCN-Regular.otf
    SourceHanSerifCN-Medium.otf
    SourceHanSerifCN-SemiBold.otf
    SourceHanSerifCN-Bold.otf
  globals.css
  layout.tsx
  page.tsx
  blog/
    page.tsx
    [slug]/page.tsx
  about/page.tsx
  portfolio/page.tsx

src/components/
  theme-provider.tsx
  logo.tsx + logo.module.css
  nav.tsx + nav.module.css
  footer.tsx + footer.module.css
  social-icon.tsx
  home/
    hero.tsx + hero.module.css

src/lib/
  posts.ts
  data.ts

src/styles/
  site.css
```

---

### Task 1: Fresh project initialization

**Files:**
- Delete: everything except `.git/`, `docs/`
- Create: fresh Next.js project in place

- [ ] **Step 1: Remove old files**

```bash
cd /Users/deweyou/Documents/codes/deweyou.me
rm -rf src/ public/ node_modules/
rm -f package.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs bun.lock pnpm-lock.yaml
```

- [ ] **Step 2: Scaffold fresh Next.js project**

```bash
npx create-next-app@latest . \
  --typescript \
  --eslint \
  --no-tailwind \
  --src-dir \
  --app \
  --import-alias "##/*"
```

Expected: Next.js project scaffolded with `src/app/`, `tsconfig.json`, `next.config.ts`, `package.json`.

- [ ] **Step 3: Verify it starts**

```bash
npm run dev
```

Open http://localhost:3000 — should see default Next.js welcome page.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: reinitialize project with latest Next.js"
```

---

### Task 2: Install dependencies and copy assets

**Files:**
- Modify: `package.json`
- Create: `public/assets/` (logo SVGs), `src/app/fonts/` (OTF files)

- [ ] **Step 1: Install runtime deps**

```bash
npm install @deweyou-design/react @deweyou-design/styles @deweyou-design/react-icons next-mdx-remote gray-matter
```

- [ ] **Step 2: Install dev types**

```bash
npm install -D @types/gray-matter
```

- [ ] **Step 3: Copy logo SVG assets**

```bash
mkdir -p public/assets
cp /Users/deweyou/Downloads/deweyou_design_handoff/deweyou-blog-website/project/assets/logo-black.svg public/assets/
cp /Users/deweyou/Downloads/deweyou_design_handoff/deweyou-blog-website/project/assets/logo-white.svg public/assets/
cp /Users/deweyou/Downloads/deweyou_design_handoff/deweyou-blog-website/project/assets/logo-animated-black.svg public/assets/
cp /Users/deweyou/Downloads/deweyou_design_handoff/deweyou-blog-website/project/assets/logo-animated-white.svg public/assets/
```

- [ ] **Step 4: Copy font files**

```bash
mkdir -p src/app/fonts
cp /Users/deweyou/Downloads/deweyou_design_handoff/deweyou-blog-website/project/fonts/SourceHanSerifCN-Regular.otf src/app/fonts/
cp /Users/deweyou/Downloads/deweyou_design_handoff/deweyou-blog-website/project/fonts/SourceHanSerifCN-Medium.otf src/app/fonts/
cp /Users/deweyou/Downloads/deweyou_design_handoff/deweyou-blog-website/project/fonts/SourceHanSerifCN-SemiBold.otf src/app/fonts/
cp /Users/deweyou/Downloads/deweyou_design_handoff/deweyou-blog-website/project/fonts/SourceHanSerifCN-Bold.otf src/app/fonts/
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: install deps and copy design assets"
```

---

### Task 3: Design system CSS foundations

**Files:**
- Create: `src/styles/site.css`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write `src/styles/site.css`**

Copy the shared CSS classes from the design. Create `src/styles/site.css`:

```css
/* Shared site styles — sourced from design handoff site.css */

/* ── Eyebrow label ─────────────────────────────────────────── */
.eyebrow {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ui-color-text-muted);
}

/* ── Animated underline link ───────────────────────────────── */
.dy-link {
  color: inherit;
  text-decoration: none;
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.dy-link::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 1px;
  background: currentColor;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 260ms ease;
}
.dy-link:hover::after { clip-path: inset(0 0 0 0); }

/* ── Static underline link ─────────────────────────────────── */
.dy-link-static {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid var(--ui-color-border-strong);
  transition: border-color 140ms ease;
}
.dy-link-static:hover { border-bottom-color: var(--ui-color-text); }

/* ── Tag / chip ────────────────────────────────────────────── */
.dy-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border: 1px solid var(--ui-color-border);
  border-radius: var(--ui-radius-pill);
  font-size: 12px;
  line-height: 1.4;
  color: var(--ui-color-text-muted);
  background: transparent;
  transition: color 140ms ease, border-color 140ms ease;
  cursor: pointer;
  white-space: nowrap;
}
.dy-tag:hover { color: var(--ui-color-text); border-color: var(--ui-color-border-strong); }
.dy-tag[data-active="true"] {
  color: var(--ui-color-text-on-brand);
  background: var(--ui-color-brand-bg);
  border-color: var(--ui-color-brand-bg);
}

/* ── Card ──────────────────────────────────────────────────── */
.dy-card {
  border: 1px solid var(--ui-color-border);
  border-radius: var(--ui-radius-auto);
  background: var(--ui-color-surface);
  padding: 24px;
  transition: border-color 140ms ease, box-shadow 140ms ease;
}
.dy-card-link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}
.dy-card-link:hover {
  border-color: var(--ui-color-border-strong);
  box-shadow: var(--ui-shadow-sm);
}

/* ── 44×2px brand rule ─────────────────────────────────────── */
.dy-rule {
  width: 44px;
  height: 2px;
  background: var(--ui-color-text);
  border: 0;
  margin: 0;
}

/* ── Page container ────────────────────────────────────────── */
.page {
  background: var(--ui-color-canvas);
  color: var(--ui-color-text);
  min-height: 100vh;
  font-family: var(--ui-font-body);
}

/* ── Nav ───────────────────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 64px;
  border-bottom: 1px solid var(--ui-color-border);
}
.nav-h5 { padding: 18px 24px; }

/* ── Footer ────────────────────────────────────────────────── */
.footer {
  border-top: 1px solid var(--ui-color-border);
  padding: 48px 64px 36px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  font-size: 13px;
  color: var(--ui-color-text-muted);
}

/* ── Icon button ───────────────────────────────────────────── */
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  border: 1px solid var(--ui-color-border);
  border-radius: var(--ui-radius-float);
  background: transparent;
  color: var(--ui-color-text-muted);
  cursor: pointer;
  transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
  font-size: 14px;
}
.icon-btn:hover {
  color: var(--ui-color-text);
  border-color: var(--ui-color-border-strong);
  background: color-mix(in srgb, var(--ui-color-text) 4%, transparent);
}

/* ── Reading progress bar ──────────────────────────────────── */
.read-progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: var(--ui-color-brand-bg);
  z-index: 50;
  transition: width 80ms linear;
}

/* ── Dotted leader ─────────────────────────────────────────── */
.leader {
  flex: 1;
  border-bottom: 1px dotted var(--ui-color-border-strong);
  margin: 0 12px 6px;
  min-width: 24px;
}

/* ── Placeholder block ─────────────────────────────────────── */
.placeholder {
  background:
    repeating-linear-gradient(135deg, transparent, transparent 8px,
      color-mix(in srgb, var(--ui-color-text) 5%, transparent) 8px,
      color-mix(in srgb, var(--ui-color-text) 5%, transparent) 9px),
    var(--ui-color-surface);
  border: 1px solid var(--ui-color-border);
  border-radius: var(--ui-radius-auto);
}

/* ── Code block ────────────────────────────────────────────── */
.dy-code {
  font-family: var(--ui-font-mono);
  font-size: 13px;
  background: var(--ui-color-surface);
  border: 1px solid var(--ui-color-border);
  border-radius: var(--ui-radius-auto);
  padding: 16px 20px;
  overflow-x: auto;
  line-height: 1.65;
  color: var(--ui-color-text);
}

/* ── Scrollbar ─────────────────────────────────────────────── */
*::-webkit-scrollbar { width: 8px; height: 8px; }
*::-webkit-scrollbar-thumb { background: var(--ui-color-border-strong); border-radius: 4px; }
*::-webkit-scrollbar-track { background: transparent; }

/* ── Reduced motion ────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Write `src/app/globals.css`**

Replace the default globals.css:

```css
/* Override @deweyou-design font variables with next/font CSS vars */
:root {
  --ui-font-body: var(--font-source-han-serif), 'Noto Serif SC', 'Songti SC', 'STSong', 'SimSun', serif;
  --ui-font-display: var(--font-source-han-serif), 'Noto Serif SC', 'Songti SC', 'STSong', 'SimSun', serif;
  --ui-font-mono: var(--font-ibm-plex-mono), 'SFMono-Regular', ui-monospace, monospace;
}

/* Prevent FOUC on theme toggle */
html { color-scheme: light dark; }
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/site.css src/app/globals.css
git commit -m "feat: add design system CSS foundations"
```

---

### Task 4: ThemeProvider

**Files:**
- Create: `src/components/theme-provider.tsx`

- [ ] **Step 1: Write `src/components/theme-provider.tsx`**

```tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const initial = stored ?? preferred;
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/theme-provider.tsx
git commit -m "feat: add ThemeProvider with localStorage + system preference"
```

---

### Task 5: Logo components

**Files:**
- Create: `src/components/logo.tsx`, `src/components/logo.module.css`

- [ ] **Step 1: Write `src/components/logo.module.css`**

```css
.wordmark {
  display: inline-block;
  height: 1em;
  aspect-ratio: 7648 / 2451;
  background: currentColor;
  -webkit-mask: url('/assets/logo-black.svg') center / contain no-repeat;
  mask: url('/assets/logo-black.svg') center / contain no-repeat;
}

.wordmarkColor {
  background: linear-gradient(90deg, #63E6BE 0%, #78E8B3 52%, #8CEAAB 100%);
  -webkit-mask: url('/assets/logo-black.svg') center / contain no-repeat;
  mask: url('/assets/logo-black.svg') center / contain no-repeat;
  display: inline-block;
  height: 1em;
  aspect-ratio: 7648 / 2451;
}

.animatedHost {
  display: inline-block;
  vertical-align: middle;
  line-height: 0;
}

.animatedHost svg {
  width: 100%;
  height: 100%;
  display: block;
}

.animatedHost :global(.logo-draw) {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: logoDrawStroke 1.4s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.animatedHost :global(.logo-draw-1) { animation-delay: 0.05s; }
.animatedHost :global(.logo-draw-2) { animation-delay: 0.30s; animation-duration: 0.8s; }
.animatedHost :global(.logo-draw-3) { animation-delay: 0.55s; animation-duration: 1.6s; }
.animatedHost :global(.logo-draw-4) { animation-delay: 1.00s; animation-duration: 1.4s; }

@keyframes logoDrawStroke {
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 0; }
}

:global([data-theme='dark']) .animatedHost {
  filter: invert(1);
}
```

- [ ] **Step 2: Write `src/components/logo.tsx`**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/logo.tsx src/components/logo.module.css
git commit -m "feat: add Logo and LogoAnimated components"
```

---

### Task 6: SocialIcon and Footer

**Files:**
- Create: `src/components/social-icon.tsx`, `src/components/footer.tsx`, `src/components/footer.module.css`

- [ ] **Step 1: Write `src/components/social-icon.tsx`**

```tsx
'use client';

import { useState } from 'react';

interface Social {
  label: string;
  handle: string;
  href: string;
  icon: string; // tabler icon class e.g. 'ti-brand-github'
}

export function SocialIcon({ s }: { s: Social }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={s.href}
      title={`${s.label} · ${s.handle}`}
      aria-label={s.label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32, height: 32,
        color: hover ? 'var(--ui-color-text)' : 'var(--ui-color-text-muted)',
        transition: 'color 140ms ease',
        textDecoration: 'none',
      }}
    >
      <i className={`ti ${s.icon}`} style={{ fontSize: 17 }} />
      {hover && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          right: 0,
          padding: '4px 10px',
          background: 'var(--ui-color-text)',
          color: 'var(--ui-color-canvas)',
          fontSize: 11,
          fontFamily: 'var(--ui-font-mono)',
          letterSpacing: '0.04em',
          borderRadius: 'var(--ui-radius-float)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          {s.handle}
        </span>
      )}
    </a>
  );
}
```

- [ ] **Step 2: Write `src/components/footer.module.css`**

```css
.footer {
  border-top: 1px solid var(--ui-color-border);
  padding: 48px 64px 36px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  font-size: 13px;
  color: var(--ui-color-text-muted);
}

.footerMobile {
  padding: 36px 24px 28px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0.7;
}

.copyright {
  font-size: 11px;
  font-family: var(--ui-font-mono);
  letter-spacing: 0.06em;
  color: var(--ui-color-text-muted);
}

.socials {
  display: flex;
  gap: 4px;
  align-items: center;
}
```

- [ ] **Step 3: Write `src/components/footer.tsx`**

```tsx
import { Logo } from './logo';
import { SocialIcon } from './social-icon';
import { PROFILE } from '##/lib/data';
import styles from './footer.module.css';

interface FooterProps {
  compact?: boolean;
}

export function Footer({ compact = false }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${compact ? styles.footerMobile : ''}`}>
      <div className={styles.brand}>
        <Logo height={14} />
        <span className={styles.copyright}>© 2026 · DEWEY OU</span>
      </div>
      <div className={styles.socials}>
        {PROFILE.socials.map((s) => (
          <SocialIcon key={s.label} s={s} />
        ))}
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/social-icon.tsx src/components/footer.tsx src/components/footer.module.css
git commit -m "feat: add SocialIcon and Footer components"
```

---

### Task 7: Nav component

**Files:**
- Create: `src/components/nav.tsx`, `src/components/nav.module.css`

- [ ] **Step 1: Write `src/components/nav.module.css`**

```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 64px;
  border-bottom: 1px solid var(--ui-color-border);
  position: relative;
}

.navMobile {
  padding: 18px 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  letter-spacing: 0.04em;
  color: var(--ui-color-text);
  text-decoration: none;
}

.links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.link {
  font-size: 14px;
  color: var(--ui-color-text-muted);
  text-decoration: none;
  transition: color 140ms ease;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--ui-font-body);
  padding: 0;
}

.link[data-active='true'],
.link:hover {
  color: var(--ui-color-text);
}

.meta {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* ── Mobile overlay ──────────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--ui-color-canvas) 92%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  animation: overlayFade 220ms cubic-bezier(0.7, 0, 0.3, 1);
}

@keyframes overlayFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.overlayTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--ui-color-border);
}

.overlayCount {
  font-family: var(--ui-font-mono);
  font-size: 10px;
  color: var(--ui-color-text-muted);
  letter-spacing: 0.16em;
}

.overlayList {
  list-style: none;
  padding: 0 32px;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.overlayItem {
  border-bottom: 1px solid var(--ui-color-border);
}

.overlayLink {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 22px 4px;
  font-family: var(--ui-font-display);
  font-size: 32px;
  font-weight: 500;
  color: var(--ui-color-text);
  text-decoration: none;
  line-height: 1.1;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
}

.overlayLinkActive {
  font-weight: 600;
}

.overlayLinkLabel {
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
}

.overlayIndex {
  font-family: var(--ui-font-mono);
  font-size: 11px;
  color: var(--ui-color-text-muted);
  letter-spacing: 0.1em;
}

.overlayBottom {
  padding: 24px 24px 36px;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--ui-color-border);
}

.closeBtn {
  width: 56px; height: 56px;
  border-radius: 50%;
  border: 1px solid var(--ui-color-border-strong);
  background: var(--ui-color-surface);
  color: var(--ui-color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease;
  font-size: 22px;
}

.closeBtn:hover {
  transform: rotate(90deg);
  border-color: var(--ui-color-text);
}
```

- [ ] **Step 2: Write `src/components/nav.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo, LogoAnimated } from './logo';
import { useTheme } from './theme-provider';
import styles from './nav.module.css';

const LINKS = [
  { href: '/',           label: '主页' },
  { href: '/blog',       label: '文章' },
  { href: '/portfolio',  label: '作品集' },
  { href: '/about',      label: '关于' },
];

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
          <button className="icon-btn" aria-label="Toggle theme" onClick={toggleTheme}>
            <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} />
          </button>
          <button className="icon-btn" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
            <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'}`} />
          </button>
        </div>

        {menuOpen && (
          <div className={styles.overlay} onClick={() => setMenuOpen(false)}>
            <div className={styles.overlayTop}>
              <Logo height={16} />
              <span className={styles.overlayCount}>MENU · {LINKS.length.toString().padStart(2, '0')}</span>
            </div>
            <ul className={styles.overlayList} onClick={(e) => e.stopPropagation()}>
              {LINKS.map((l, i) => {
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
        {LINKS.map((l) => (
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
        <button className="icon-btn" aria-label="Toggle theme" onClick={toggleTheme}>
          <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} />
        </button>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/nav.tsx src/components/nav.module.css
git commit -m "feat: add Nav component with mobile overlay"
```

---

### Task 8: Static data and root layout

**Files:**
- Create: `src/lib/data.ts`, `src/app/layout.tsx`

- [ ] **Step 1: Write `src/lib/data.ts`**

```ts
export const PROFILE = {
  name: '欧怼怼',
  nameEn: 'Dewey Ou',
  title: '前端工程师 · 字节跳动',
  location: '深圳',
  socials: [
    { label: 'GitHub',  handle: '@deweyou',       href: 'https://github.com/deweyou',  icon: 'ti-brand-github' },
    { label: '小红书',  handle: '欧怼怼',          href: '#',                           icon: 'ti-message-circle-2' },
    { label: 'Email',   handle: 'hi@deweyou.me',  href: 'mailto:hi@deweyou.me',        icon: 'ti-mail' },
  ],
} as const;

export const ABOUT_SECTIONS = [
  {
    id: 'intro', label: '简介', kind: 'prose' as const,
    body: [
      '我是欧怼怼，英文名 Dewey Ou，目前在深圳，是字节跳动的一名前端工程师。',
      '工作之外，我把自己当成产品的"作者"——喜欢有设计感、人性化、新颖、有意思的东西，也希望成为做这类产品的人。最近一段时间，我在和 AI 交朋友，让它陪我学习、陪我做有意思的小工具。',
      '这个网站记录我写的文章、做的项目，以及生活里那些不那么严肃的瞬间。',
    ],
  },
  {
    id: 'now', label: '近况', kind: 'list' as const,
    items: [
      { k: '正在做', v: '把工作中的设计沉淀整理成 Deweyou Design 系统' },
      { k: '正在写', v: '一篇关于 AI Coding 协作方式的长文' },
      { k: '正在读', v: '原研哉《设计中的设计》' },
      { k: '正在练', v: '三阶魔方平均 28 秒' },
      { k: '想去',   v: '京都 · 直岛 · 冰岛' },
    ],
  },
  {
    id: 'work', label: '工作经历', kind: 'timeline' as const,
    items: [
      { from: '2022', to: '至今', org: '字节跳动 ByteDance', role: '前端工程师', detail: 'B 端业务前端，负责设计系统沉淀、复杂表单引擎、AI 辅助开发工具链。' },
      { from: '2020', to: '2022', org: '某初创公司', role: '高级前端', detail: '参与 0→1 移动端业务，搭建组件库与设计协作流程。' },
      { from: '2018', to: '2020', org: '广州某互联网公司', role: '前端工程师', detail: '电商业务前端，负责 H5 营销活动、性能优化。' },
    ],
  },
  {
    id: 'skills', label: '能力', kind: 'tags' as const,
    groups: [
      { name: '前端', items: ['React', 'TypeScript', 'CSS / Less', '动画 / 交互', '设计系统'] },
      { name: '设计', items: ['Figma', '排版与字体', '色彩系统', '产品 sense'] },
      { name: 'AI',   items: ['Prompt 工程', 'Claude / GPT', 'Agent 开发', 'AI Coding'] },
      { name: '兴趣', items: ['摄影', '魔方', '近景魔术', '阅读'] },
    ],
  },
  {
    id: 'philosophy', label: '一些想法', kind: 'quotes' as const,
    items: [
      '做有意思的产品，过有意思的生活。',
      '所谓 sense，不是直觉，而是被无数次验证过的判断。',
      '人最值钱的部分，是品味。',
      '对自己温柔一点，对作品狠一点。',
    ],
  },
  {
    id: 'contact', label: '联系', kind: 'prose' as const,
    body: [
      '想聊聊产品、设计、AI 协作或者只是说一声 hi——任何渠道都欢迎，我会回复每一封像样的来信。',
    ],
  },
];

export const PORTFOLIO_TAGS = ['全部', 'GitHub', '设计', '摄影'] as const;

export const PORTFOLIO_ITEMS = [
  { id: 'gh-deweyou-design', tag: 'GitHub',  title: 'Deweyou Design',    subtitle: '我的个人设计系统',      year: '2026', desc: '一套写给自己的 React 组件库 + 设计 token。强调宋体、留白与 mint 高亮三件套。',         meta: 'TypeScript · React · CSS', stars: 128, accent: 'mint',  href: 'https://github.com/deweyou/design' },
  { id: 'gh-claude-coder',   tag: 'GitHub',  title: 'claude-coder',      subtitle: 'AI 协作的命令行工具',   year: '2025', desc: '一个把 Claude 接入本地代码库的 CLI——支持上下文索引、任务拆分、增量 diff review。',    meta: 'TypeScript · Node',        stars: 412, accent: 'plain', href: '#' },
  { id: 'gh-cube-timer',     tag: 'GitHub',  title: 'cube-timer',        subtitle: '魔方计时器（PWA）',     year: '2024', desc: '为速拧爱好者写的极简计时器，支持 Stackmat 协议、平均值统计、CSV 导出。',              meta: 'TypeScript · PWA',         stars: 56,  accent: 'plain', href: '#' },
  { id: 'de-personal-site',  tag: '设计',    title: '个人主页 v3',       subtitle: '从模板到有审美',        year: '2026', desc: '为自己写的网站。用宋体做主字体，用一抹 mint 做高亮，用等高线做背景纹理。',              meta: 'Figma · React',            accent: 'mint' },
  { id: 'de-bytedance-form', tag: '设计',    title: 'B 端表单引擎',      subtitle: '设计稿 + 组件落地',    year: '2025', desc: '抽象 30+ 个内部表单的共性，重新设计了一套从 schema 到组件的渲染流水线。',              meta: 'Internal · ByteDance',     accent: 'plain' },
  { id: 'de-poster-2024',    tag: '设计',    title: '2024 海报合集',     subtitle: '一年一张周回',          year: '2024', desc: '52 张周报海报。从极简版式到实验排版，记录我那一年对字体的执着。',                        meta: 'Figma · 印刷',             accent: 'plain' },
  { id: 'ph-shenzhen-night', tag: '摄影',    title: '深圳夜',            subtitle: '城市与人',              year: '2026', desc: '富士 X-T5 + XF23 F2，加班晚归路上的杂记。',                                         meta: 'Fujifilm · 28 张',         accent: 'plain' },
  { id: 'ph-kyoto',          tag: '摄影',    title: '京都八日',          subtitle: '游记 · 银盐',           year: '2025', desc: '一台胶片机 + 八卷柯达 Gold 200，关于光、阴影与寺庙的午后。',                          meta: 'Canonet · 36 张',          accent: 'mint' },
  { id: 'ph-cube-moments',   tag: '摄影',    title: '魔方时刻',          subtitle: '微距系列',              year: '2024', desc: '90mm 微距镜头下的 26 个色块，关于秩序与混乱的小宇宙。',                              meta: 'Fujifilm · 12 张',         accent: 'plain' },
];

export const TAGS = ['全部', 'AI', '前端设计', '产品思考', '生活随笔', '读书笔记'] as const;
```

- [ ] **Step 2: Write `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider } from '##/components/theme-provider';
import '@deweyou-design/styles/theme.css';
import './globals.css';
import '##/styles/site.css';

const sourceHanSerif = localFont({
  src: [
    { path: './fonts/SourceHanSerifCN-Regular.otf',  weight: '400', style: 'normal' },
    { path: './fonts/SourceHanSerifCN-Medium.otf',   weight: '500', style: 'normal' },
    { path: './fonts/SourceHanSerifCN-SemiBold.otf', weight: '600', style: 'normal' },
    { path: './fonts/SourceHanSerifCN-Bold.otf',     weight: '700', style: 'normal' },
  ],
  variable: '--font-source-han-serif',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dewey Ou',
  description: '前端工程师，住在深圳。做有意思的产品，过有意思的生活。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${sourceHanSerif.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/data.ts src/app/layout.tsx
git commit -m "feat: add static data and root layout"
```

---

### Task 9: MDX infrastructure

**Files:**
- Create: `src/lib/posts.ts`, `content/posts/ai-as-pair.mdx`, `content/posts/song-typeface-on-web.mdx`

- [ ] **Step 1: Write `src/lib/posts.ts`**

```ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tag: string;
  readTime: string;
  excerpt: string;
  pinned?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data } = matter(raw);
      return { slug, ...data } as PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { slug, ...data, content } as Post;
}

export function getAllSlugs(): string[] {
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
```

- [ ] **Step 2: Create `content/posts/ai-as-pair.mdx`**

```bash
mkdir -p content/posts
```

```mdx
---
title: 把 AI 当成最稳定的搭档
date: 2026-04-22
tag: AI
readTime: 12 min
excerpt: 当 Claude 已经能稳定写出一千行可用代码，编程的难点从"写"变成"拆"。我把过去半年和 AI 协作的方法整理成一份可复用的 checklist。
pinned: true
---

## 一、上下文是一切

过去半年我换了三种和 AI 协作的方式，每一次的进步都不来自更聪明的模型，而来自更精确的上下文。给 AI 看完整的项目结构、看现有的设计系统、看一个相邻模块的实现——它产出的代码质量会有本质区别。

一句话原则：你愿意花多少时间把上下文整理清楚，AI 就值得相信多少。

> 不要把模型当成一个聪明但失忆的同事——它就是。

## 二、任务的颗粒度

一次让 AI 写完整个页面，几乎从来不会成功。但如果你把任务拆成「先写组件骨架」「再写交互状态」「最后做 polish」，每一步都是可验证的，整体就会顺很多。

## 三、不要省 Review

AI 写得快，于是人会懒。但越是快，越要保持 review 的纪律——不是一行一行读，而是把它产出的代码当作一次别人发来的 PR：跑一遍、点一下、看一眼边界情况。

## 四、品味的不可替代

AI 现在能写出 80 分的代码、80 分的文案、80 分的设计。剩下的 20 分——哪里多了一个像素、哪里语气不对——只能由人来判断。这是品味的领域，也是人最值钱的部分。
```

- [ ] **Step 3: Create `content/posts/song-typeface-on-web.mdx`**

```mdx
---
title: 在 Web 上让宋体真正好看起来
date: 2026-04-08
tag: 前端设计
readTime: 8 min
excerpt: 宋体在屏幕上长期被当作"老气"的代名词，但只要给到合适的字号、行高与对比，它能让一个产品瞬间有了质感。
---

## 为什么宋体

黑体是工业的，宋体是文学的。在信息密度高的产品里，黑体让人感到安全；在需要传递温度的场合，宋体更接近"手写"的质感。

这个网站用的是思源宋体（Source Han Serif CN），它有完整的中文字重体系，从 Regular 到 Bold，覆盖正文到标题的所有层次。

## 让宋体好看的三个关键

**字号要够大。** 正文 16px 起步，17px 更好。宋体的笔画细节在小字号下会糊掉。

**行高要宽松。** `line-height: 1.7` 到 `1.85` 之间。中文字符本身就宽，太紧的行高会让段落喘不过气。

**对比要到位。** 正文用深色，辅助信息用 stone-500，禁用态用 stone-400。层次清晰，宋体才能"立"起来。
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/posts.ts content/
git commit -m "feat: add MDX infrastructure and sample posts"
```

---

### Task 10: Home page (Hero B)

**Files:**
- Create: `src/components/home/hero.tsx`, `src/components/home/hero.module.css`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write `src/components/home/hero.module.css`**

```css
/* ── Desktop two-column hero ───────────────────────────────── */
.hero {
  padding: 40px 0 0;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 0;
  min-height: calc(100vh - 92px);
}

/* ── Left column ───────────────────────────────────────────── */
.left {
  padding: 220px 32px 80px 64px;
  border-right: 1px solid var(--ui-color-border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 600px;
}

.timeRow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}

.timeDot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--ui-color-brand-bg);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ui-color-brand-bg) 18%, transparent);
  flex-shrink: 0;
}

.timeText {
  font-family: var(--ui-font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--ui-color-text-muted);
}

/* Avatar */
.avatarWrap {
  position: relative;
  margin-bottom: 32px;
  width: min(360px, 100%);
}

.avatarOffset {
  position: absolute;
  inset: 12px -16px -16px 16px;
  background: color-mix(in srgb, var(--ui-color-brand-bg) 80%, transparent);
  z-index: 0;
}

.avatarFrame {
  position: relative;
  aspect-ratio: 4 / 5;
  background: var(--ui-color-surface);
  overflow: hidden;
  z-index: 1;
}

.avatarImage {
  object-fit: cover;
  object-position: center top;
}

.cornerBracket {
  position: absolute;
  width: 14px; height: 14px;
}
.cornerBracket.tl { top: 8px; left: 8px; border-top: 1px solid var(--ui-color-text); border-left: 1px solid var(--ui-color-text); }
.cornerBracket.tr { top: 8px; right: 8px; border-top: 1px solid var(--ui-color-text); border-right: 1px solid var(--ui-color-text); }
.cornerBracket.bl { bottom: 8px; left: 8px; border-bottom: 1px solid var(--ui-color-text); border-left: 1px solid var(--ui-color-text); }
.cornerBracket.br { bottom: 8px; right: 8px; border-bottom: 1px solid var(--ui-color-text); border-right: 1px solid var(--ui-color-text); }

.figLabel {
  position: absolute;
  bottom: 20px; left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--ui-font-mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  color: var(--ui-color-canvas);
  mix-blend-mode: difference;
}

.avatarAnnotation {
  position: absolute;
  top: 40%;
  right: -28px;
  transform: translateY(-50%);
  font-family: var(--ui-font-mono);
  font-size: 10px;
  color: var(--ui-color-text-muted);
  letter-spacing: 0.2em;
  writing-mode: vertical-rl;
  z-index: 2;
}

.nameRow {
  font-family: var(--ui-font-mono);
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ui-color-text-muted);
  margin-left: 8px;
}

.nameEn { color: var(--ui-color-text); }
.nameSep { margin: 0 10px; opacity: 0.4; }

.estRow {
  margin-top: 60px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.estText {
  font-family: var(--ui-font-mono);
  font-size: 10px;
  color: var(--ui-color-text-muted);
  letter-spacing: 0.18em;
}

/* ── Right column ──────────────────────────────────────────── */
.right {
  padding: 120px 64px 80px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.headline {
  font-family: var(--ui-font-display);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  line-height: 1.18;
  letter-spacing: -0.005em;
  color: var(--ui-color-text);
  margin-bottom: 40px;
  max-width: 580px;
  text-wrap: balance;
}

.highlight {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}

.highlightText { position: relative; z-index: 1; }

.highlightBg {
  position: absolute;
  left: -4px; right: -4px; bottom: 12%;
  height: 38%;
  background: linear-gradient(90deg,
    color-mix(in srgb, var(--ui-color-brand-bg) 35%, transparent),
    color-mix(in srgb, var(--ui-color-brand-bg) 18%, transparent));
  z-index: 0;
  transform: skewX(-6deg);
}

.bio {
  font-family: var(--ui-font-body);
  font-size: 17px;
  line-height: 1.85;
  color: var(--ui-color-text);
  max-width: 540px;
  margin-bottom: 40px;
  text-wrap: pretty;
}

.bioUnderline { border-bottom: 1px solid var(--ui-color-border-strong); }

.aiChip {
  font-family: var(--ui-font-mono);
  font-size: 0.92em;
  padding: 1px 8px;
  background: color-mix(in srgb, var(--ui-color-brand-bg) 14%, transparent);
  color: var(--ui-color-brand-text);
  border-radius: 3px;
}

.ctaRow {
  display: flex;
  align-items: center;
  gap: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--ui-color-border);
  max-width: 540px;
}

.cta {
  font-family: var(--ui-font-body);
  font-size: 15px;
  color: var(--ui-color-text);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding: 4px 0;
}

.cta::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 1px;
  background: currentColor;
  transform-origin: right center;
  transform: scaleX(1);
  transition: transform 320ms cubic-bezier(0.7, 0, 0.3, 1);
}

.cta:hover::after {
  animation: ctaLine 420ms cubic-bezier(0.7, 0, 0.3, 1);
}

@keyframes ctaLine {
  0%    { transform-origin: right; transform: scaleX(1); }
  50%   { transform-origin: right; transform: scaleX(0); }
  50.01%{ transform-origin: left;  transform: scaleX(0); }
  100%  { transform-origin: left;  transform: scaleX(1); }
}

.ctaArrow { transition: transform 220ms ease; }
.cta:hover .ctaArrow { transform: translate(2px, -2px); }

.divider { width: 1px; height: 24px; background: var(--ui-color-border); flex-shrink: 0; }

.socials { display: flex; gap: 4px; align-items: center; }

/* ── Mobile ────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: unset;
    padding: 24px 24px 40px;
  }
  .left {
    padding: 0;
    border-right: none;
    min-height: unset;
  }
  .right {
    padding: 0;
    margin-top: 32px;
  }
  .headline {
    font-size: clamp(1.6rem, 7vw, 2rem);
    margin-bottom: 28px;
  }
  .bio { font-size: 15px; }
  .avatarWrap { max-width: 320px; }
  .avatarOffset { inset: 10px -12px -12px 12px; }
  .cornerBracket { width: 12px; height: 12px; }
  .avatarAnnotation { right: -22px; font-size: 9px; }
  .nameRow { font-size: 12px; margin-top: 16px; margin-left: 0; }
}
```

- [ ] **Step 2: Write `src/components/home/hero.tsx`**

```tsx
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
                <Image
                  src="/avatar.jpg"
                  alt="Dewey Ou"
                  fill
                  className={styles.avatarImage}
                  priority
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
```

- [ ] **Step 3: Write `src/app/page.tsx`**

```tsx
import { Nav } from '##/components/nav';
import { Hero } from '##/components/home/hero';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
    </>
  );
}
```

Note: `Nav` uses `usePathname` so it must be a Client Component (already marked with `'use client'`). The page itself is a Server Component.

- [ ] **Step 4: Add placeholder avatar**

```bash
# Add a 1x1 placeholder so next/image doesn't error on missing file
# User replaces this with their real photo later
cp public/assets/logo-black.svg public/avatar.jpg  # temp placeholder
```

Actually create a proper placeholder. In `src/components/home/hero.tsx`, handle the missing image gracefully by showing the SVG silhouette if `/avatar.jpg` doesn't exist. The simplest approach: keep `<Image>` but add a fallback via `onError`:

Update the `<Image>` block in `hero.tsx` — replace the Image with a conditional:

```tsx
{/* Avatar slot — replace /avatar.jpg with your photo */}
<Image
  src="/avatar.jpg"
  alt="Dewey Ou"
  fill
  className={styles.avatarImage}
  priority
  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
/>
```

And add an SVG silhouette behind the image (shown when no photo):

```tsx
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
```

- [ ] **Step 5: Verify home page**

```bash
npm run dev
```

Open http://localhost:3000 — check: two-column layout, topo background, name row, headline with mint highlight, CTA link, social icons.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/ src/app/page.tsx
git commit -m "feat: implement home page (Hero B design)"
```

---

### Task 11: Blog list page

**Files:**
- Create: `src/app/blog/page.tsx`

- [ ] **Step 1: Write `src/app/blog/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { getAllPosts } from '##/lib/posts';
import { TAGS } from '##/lib/data';

// Note: this page uses client state for tag filtering.
// getAllPosts() is called at build time via a separate Server Component wrapper if needed,
// but for simplicity we inline the data fetch here via a client boundary.
// For static generation, split into a server wrapper that passes posts as props.

export default function BlogPage() {
  const posts = getAllPosts(); // runs server-side on initial render
  const [activeTag, setActiveTag] = useState<string>('全部');

  const filtered = activeTag === '全部'
    ? posts
    : posts.filter((p) => p.tag === activeTag);

  const byYear: Record<string, typeof filtered> = {};
  filtered.forEach((p) => {
    const y = p.date.slice(0, 4);
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(p);
  });
  const years = Object.keys(byYear).sort().reverse();

  return (
    <div className="page" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background vertical lines */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(to right, color-mix(in srgb, var(--ui-color-text) 4%, transparent) 1px, transparent 1px)',
        backgroundSize: '25% 100%',
        pointerEvents: 'none',
      }} />

      <Nav />

      <section style={{ padding: '120px 64px 48px', maxWidth: 920, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: 'currentColor' }} />
          INDEX · {posts.length} ENTRIES
        </div>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.015em' }}>
          文章
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ui-color-text-muted)', maxWidth: 540, lineHeight: 1.7 }}>
          关于前端、设计、AI、产品和生活的一些思考。慢慢写。
        </p>

        {/* Tag filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 44 }}>
          {TAGS.map((t) => {
            const count = t === '全部' ? posts.length : posts.filter((p) => p.tag === t).length;
            return (
              <button
                key={t}
                className="dy-tag"
                data-active={activeTag === t ? 'true' : 'false'}
                onClick={() => setActiveTag(t)}
              >
                {t}
                <span style={{ opacity: 0.5, fontSize: 11 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Posts by year */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 64px 100px', position: 'relative', zIndex: 2 }}>
        {years.map((year) => (
          <div key={year} style={{ marginBottom: 60 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              marginBottom: 24,
              paddingBottom: 12,
              borderBottom: '1px solid var(--ui-color-border)',
            }}>
              <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 12, color: 'var(--ui-color-text-muted)', letterSpacing: '0.1em' }}>
                {year}
              </span>
              <span style={{ fontSize: 12, color: 'var(--ui-color-text-muted)' }}>
                {byYear[year].length} 篇
              </span>
            </div>
            {byYear[year].map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

function PostRow({ post }: { post: ReturnType<typeof getAllPosts>[0] }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 16,
        padding: '14px 0',
        borderBottom: '1px solid var(--ui-color-border)',
        transition: 'background 140ms ease',
        paddingLeft: hover ? 8 : 0,
      }}>
        {/* Left indicator */}
        <span style={{
          fontFamily: 'var(--ui-font-mono)',
          fontSize: 11,
          color: 'var(--ui-color-brand-text)',
          opacity: hover ? 1 : 0,
          transition: 'opacity 140ms ease',
          width: 12,
          flexShrink: 0,
        }}>→</span>

        {/* Date */}
        <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 12, color: 'var(--ui-color-text-muted)', flexShrink: 0 }}>
          {post.date.slice(5)}
        </span>

        {/* Title */}
        <span style={{
          fontSize: 16,
          fontWeight: hover ? 500 : 400,
          transition: 'font-weight 140ms ease',
          flex: 1,
        }}>
          {post.pinned && (
            <span style={{ marginRight: 8, fontSize: 11, fontFamily: 'var(--ui-font-mono)', color: 'var(--ui-color-brand-text)' }}>
              ★
            </span>
          )}
          {post.title}
        </span>

        {/* Tag */}
        <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', letterSpacing: '0.05em', flexShrink: 0 }}>
          {post.tag}
        </span>
      </div>
    </Link>
  );
}
```

Note: `getAllPosts()` uses `fs` — this page needs to be a Server Component for that call. The tag filtering state forces it to be a Client Component. Solution: make the page a Server Component that passes `posts` down to a `'use client'` `BlogList` sub-component. Refactor:

Split into:
- `src/app/blog/page.tsx` — Server Component, calls `getAllPosts()`, passes to `BlogList`
- `src/components/blog/blog-list.tsx` — Client Component, handles filtering state

```tsx
// src/app/blog/page.tsx (Server Component)
import { getAllPosts } from '##/lib/posts';
import { BlogList } from '##/components/blog/blog-list';
import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';

export default async function BlogPage() {
  const posts = getAllPosts();
  return (
    <>
      <Nav />
      <BlogList posts={posts} />
      <Footer />
    </>
  );
}
```

```tsx
// src/components/blog/blog-list.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { PostMeta } from '##/lib/posts';
import { TAGS } from '##/lib/data';

export function BlogList({ posts }: { posts: PostMeta[] }) {
  const [activeTag, setActiveTag] = useState<string>('全部');

  const filtered = activeTag === '全部' ? posts : posts.filter((p) => p.tag === activeTag);

  const byYear: Record<string, PostMeta[]> = {};
  filtered.forEach((p) => {
    const y = p.date.slice(0, 4);
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(p);
  });
  const years = Object.keys(byYear).sort().reverse();

  return (
    <div className="page" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(to right, color-mix(in srgb, var(--ui-color-text) 4%, transparent) 1px, transparent 1px)',
        backgroundSize: '25% 100%',
        pointerEvents: 'none',
      }} />

      <section style={{ padding: '120px 64px 48px', maxWidth: 920, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: 'currentColor' }} />
          INDEX · {posts.length} ENTRIES
        </div>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.015em' }}>
          文章
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ui-color-text-muted)', maxWidth: 540, lineHeight: 1.7 }}>
          关于前端、设计、AI、产品和生活的一些思考。慢慢写。
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 44 }}>
          {TAGS.map((t) => {
            const count = t === '全部' ? posts.length : posts.filter((p) => p.tag === t).length;
            return (
              <button key={t} className="dy-tag" data-active={activeTag === t ? 'true' : 'false'} onClick={() => setActiveTag(t)}>
                {t} <span style={{ opacity: 0.5, fontSize: 11 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 64px 100px', position: 'relative', zIndex: 2 }}>
        {years.map((year) => (
          <div key={year} style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--ui-color-border)' }}>
              <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 12, color: 'var(--ui-color-text-muted)', letterSpacing: '0.1em' }}>{year}</span>
              <span style={{ fontSize: 12, color: 'var(--ui-color-text-muted)' }}>{byYear[year].length} 篇</span>
            </div>
            {byYear[year].map((post) => <PostRow key={post.slug} post={post} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function PostRow({ post }: { post: PostMeta }) {
  const [hover, setHover] = useState(false);
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '14px 0',
        borderBottom: '1px solid var(--ui-color-border)', paddingLeft: hover ? 8 : 0, transition: 'padding-left 140ms ease' }}>
        <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-brand-text)', opacity: hover ? 1 : 0, transition: 'opacity 140ms ease', width: 12, flexShrink: 0 }}>→</span>
        <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 12, color: 'var(--ui-color-text-muted)', flexShrink: 0 }}>{post.date.slice(5)}</span>
        <span style={{ fontSize: 16, flex: 1 }}>
          {post.pinned && <span style={{ marginRight: 8, fontSize: 11, fontFamily: 'var(--ui-font-mono)', color: 'var(--ui-color-brand-text)' }}>★</span>}
          {post.title}
        </span>
        <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', letterSpacing: '0.05em', flexShrink: 0 }}>{post.tag}</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/blog/ src/components/blog/
git commit -m "feat: implement blog list page with tag filtering"
```

---

### Task 12: Blog detail page

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`, `src/components/blog/mdx-components.tsx`, `src/components/blog/reading-progress.tsx`

- [ ] **Step 1: Write `src/components/blog/reading-progress.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setWidth(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div className="read-progress" style={{ width: `${width}%` }} />;
}
```

- [ ] **Step 2: Write `src/components/blog/mdx-components.tsx`**

```tsx
import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 style={{ fontFamily: 'var(--ui-font-display)', fontSize: '1.85rem', fontWeight: 600,
      lineHeight: 1.14, margin: '2.5rem 0 1rem', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontFamily: 'var(--ui-font-display)', fontSize: '1.45rem', fontWeight: 600,
      lineHeight: 1.22, margin: '2rem 0 0.75rem' }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: 17, lineHeight: 1.85, margin: '0 0 1.4rem', textWrap: 'pretty' } as React.CSSProperties}>
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '3px solid var(--ui-color-brand-bg)', paddingLeft: '1.25rem',
      margin: '2rem 0', color: 'var(--ui-color-text-muted)', fontStyle: 'italic' }}>
      {children}
    </blockquote>
  ),
  pre: ({ children }) => <pre className="dy-code" style={{ margin: '1.5rem 0' }}>{children}</pre>,
  code: ({ children }) => (
    <code style={{ fontFamily: 'var(--ui-font-mono)', fontSize: '0.875em',
      padding: '1px 6px', background: 'var(--ui-color-surface)',
      border: '1px solid var(--ui-color-border)', borderRadius: 3 }}>
      {children}
    </code>
  ),
};
```

- [ ] **Step 3: Write `src/app/blog/[slug]/page.tsx`**

```tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { ReadingProgress } from '##/components/blog/reading-progress';
import { mdxComponents } from '##/components/blog/mdx-components';
import { getPost, getAllSlugs } from '##/lib/posts';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <Nav />
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '80px 64px 120px' }}>
        {/* Header */}
        <header style={{ marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ui-color-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '')}>
              ← 文章
            </Link>
            <span>·</span>
            <span>{post.tag}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--ui-font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: 20, fontFamily: 'var(--ui-font-mono)', fontSize: 12,
            color: 'var(--ui-color-text-muted)', letterSpacing: '0.05em' }}>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Body */}
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/[slug]/ src/components/blog/
git commit -m "feat: implement blog detail page with MDX rendering"
```

---

### Task 13: About page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Write `src/app/about/page.tsx`**

```tsx
import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { ABOUT_SECTIONS, PROFILE } from '##/lib/data';
import { SocialIcon } from '##/components/social-icon';

export default function AboutPage() {
  return (
    <div className="page" style={{ minHeight: '100vh' }}>
      <Nav />

      <header style={{ padding: '80px 64px 40px', maxWidth: 920, margin: '0 auto' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 1, background: 'currentColor' }} />
            ABOUT · 关于
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--ui-font-display)', fontSize: '3rem', fontWeight: 600,
          lineHeight: 1.15, margin: 0, letterSpacing: '-0.01em' }}>
          一份不那么严肃的<br />
          <em style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--ui-color-text-muted)' }}>「自我说明」</em>。
        </h1>
      </header>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 64px 100px',
        display: 'grid', gridTemplateColumns: '160px 1fr', gap: 56 }}>
        {/* Sticky TOC */}
        <aside style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>目录</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ABOUT_SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} style={{ display: 'flex', alignItems: 'baseline', gap: 8,
                  fontSize: 13, color: 'var(--ui-color-text-muted)', textDecoration: 'none' }}>
                  <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 10, opacity: 0.6 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        {/* Content */}
        <main>
          {ABOUT_SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} style={{
              paddingTop: i === 0 ? 0 : 56,
              paddingBottom: 24,
              borderTop: i === 0 ? 'none' : '1px solid var(--ui-color-border)',
              marginTop: i === 0 ? 0 : 56,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', letterSpacing: '0.1em' }}>
                  § {String(i + 1).padStart(2, '0')}
                </span>
                <h2 style={{ fontFamily: 'var(--ui-font-display)', fontSize: '1.45rem', fontWeight: 600, margin: 0 }}>
                  {s.label}
                </h2>
              </div>

              {s.kind === 'prose' && (s as { kind: 'prose'; body: string[] }).body.map((p, j) => (
                <p key={j} style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16, color: 'var(--ui-color-text)' }}>{p}</p>
              ))}

              {s.kind === 'list' && (s as { kind: 'list'; items: { k: string; v: string }[] }).items.map((item) => (
                <div key={item.k} style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 15 }}>
                  <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 12, color: 'var(--ui-color-text-muted)', flexShrink: 0, width: 60 }}>{item.k}</span>
                  <span className="leader" />
                  <span>{item.v}</span>
                </div>
              ))}

              {s.kind === 'timeline' && (s as { kind: 'timeline'; items: { from: string; to: string; org: string; role: string; detail: string }[] }).items.map((item) => (
                <div key={item.org} style={{ marginBottom: 28, paddingLeft: 16, borderLeft: '2px solid var(--ui-color-border)' }}>
                  <div style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', marginBottom: 6 }}>
                    {item.from} – {item.to}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.org}</div>
                  <div style={{ fontSize: 14, color: 'var(--ui-color-text-muted)', marginBottom: 8 }}>{item.role}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ui-color-text)', margin: 0 }}>{item.detail}</p>
                </div>
              ))}

              {s.kind === 'tags' && (s as { kind: 'tags'; groups: { name: string; items: string[] }[] }).groups.map((g) => (
                <div key={g.name} style={{ marginBottom: 20 }}>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>{g.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {g.items.map((item) => <span key={item} className="dy-tag" style={{ cursor: 'default' }}>{item}</span>)}
                  </div>
                </div>
              ))}

              {s.kind === 'quotes' && (s as { kind: 'quotes'; items: string[] }).items.map((q, j) => (
                <blockquote key={j} style={{ borderLeft: '3px solid var(--ui-color-brand-bg)',
                  paddingLeft: '1.25rem', margin: '0 0 1.2rem', fontStyle: 'italic',
                  fontSize: 16, lineHeight: 1.7, color: 'var(--ui-color-text)' }}>
                  {q}
                </blockquote>
              ))}

              {s.id === 'contact' && (
                <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
                  {PROFILE.socials.map((social) => <SocialIcon key={social.label} s={social} />)}
                </div>
              )}
            </section>
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: implement about page"
```

---

### Task 14: Portfolio page

**Files:**
- Create: `src/app/portfolio/page.tsx`, `src/components/portfolio/portfolio-grid.tsx`

- [ ] **Step 1: Write `src/components/portfolio/portfolio-grid.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { PORTFOLIO_ITEMS, PORTFOLIO_TAGS } from '##/lib/data';

export function PortfolioGrid() {
  const [activeTag, setActiveTag] = useState<string>('全部');
  const filtered = activeTag === '全部' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((i) => i.tag === activeTag);

  return (
    <div>
      {/* Tag filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 48 }}>
        {PORTFOLIO_TAGS.map((t) => (
          <button key={t} className="dy-tag" data-active={activeTag === t ? 'true' : 'false'} onClick={() => setActiveTag(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {filtered.map((item) => (
          <a
            key={item.id}
            href={'href' in item ? item.href as string : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="dy-card dy-card-link"
            style={{ display: 'block', textDecoration: 'none', color: 'inherit', position: 'relative', overflow: 'hidden' }}
          >
            {item.accent === 'mint' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, var(--ui-color-brand-bg), var(--ui-color-palette-emerald-500))' }} />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--ui-color-text-muted)' }}>{item.subtitle}</div>
              </div>
              <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)' }}>
                {item.year}
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ui-color-text-muted)', marginBottom: 16, margin: '0 0 16px' }}>
              {item.desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)' }}>
                {item.meta}
              </span>
              {'stars' in item && item.stars && (
                <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  ★ {item.stars}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/app/portfolio/page.tsx`**

```tsx
import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { PortfolioGrid } from '##/components/portfolio/portfolio-grid';

export default function PortfolioPage() {
  return (
    <div className="page" style={{ minHeight: '100vh' }}>
      <Nav />
      <section style={{ padding: '80px 64px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: 'currentColor' }} />
          PORTFOLIO
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.05, marginBottom: 16, letterSpacing: '-0.015em' }}>
          作品集
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ui-color-text-muted)', maxWidth: 540, lineHeight: 1.7, marginBottom: 56 }}>
          GitHub 项目、设计稿、摄影作品。
        </p>
        <PortfolioGrid />
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/portfolio/ src/components/portfolio/
git commit -m "feat: implement portfolio page"
```

---

### Task 15: Final verification and build check

- [ ] **Step 1: Run dev server and verify all pages**

```bash
npm run dev
```

Check each route:
- http://localhost:3000 — home page, two-column layout
- http://localhost:3000/blog — post list with year groups
- http://localhost:3000/blog/ai-as-pair — MDX article renders
- http://localhost:3000/about — two-column with sticky TOC
- http://localhost:3000/portfolio — card grid with tag filter

Check both light and dark themes (click theme toggle button).
Check mobile viewport (≤768px) — nav should show hamburger.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: build completes with no errors. Static pages generated for all blog slugs.

- [ ] **Step 3: Fix any TypeScript or build errors**

Common issues:
- `@types/gray-matter` may not exist — `gray-matter` includes its own types
- `mdx/types` import may need `@types/mdx`: `npm install -D @types/mdx`
- `next-mdx-remote/rsc` requires `next-mdx-remote` v5+

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete homepage redesign — all 5 pages + MDX blog"
```
