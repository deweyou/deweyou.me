'use client';

import { useEffect, useRef, useState } from 'react';

import {
  BLOG_ANCHOR_OFFSET,
  BLOG_NAV_HEIGHT,
  getRelativeTocTier,
} from '../../lib/toc';

export interface TocItem {
  id: string;
  label: string;
  depth: number;
}

interface TocTooltip {
  id: string;
  label: string;
  top: number;
}

const PROXIMITY_RADIUS_IN_ROWS = 5;

function getMarkerBaseWidthPercent(visualTier: number) {
  if (visualTier === 2) return 68;
  if (visualTier === 1) return 46;
  return 28;
}

function getMarkerExpandedWidthPercent(visualTier: number) {
  if (visualTier === 2) return 100;
  if (visualTier === 1) return 82;
  return 64;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - BLOG_ANCHOR_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}

export function TocSidebar({ items }: { items: TocItem[] }) {
  const observedDepths = items.map(({ depth }) => depth);
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [tooltip, setTooltip] = useState<TocTooltip | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const updateMarkerWidths = (pointerY: number) => {
    const panel = panelRef.current;
    if (!panel) return;

    panel.querySelectorAll<HTMLElement>('.toc-item').forEach((tocItem) => {
      const marker = tocItem.querySelector<HTMLElement>('.toc-marker');
      const link = tocItem.querySelector<HTMLElement>('.toc-link');
      if (!marker || !link) return;

      const linkRect = link.getBoundingClientRect();
      const distance = Math.abs(pointerY - (linkRect.top + linkRect.height / 2));
      const radius = linkRect.height * PROXIMITY_RADIUS_IN_ROWS;
      const proximity = Math.max(0, 1 - distance / radius);
      const easedProximity = proximity * (2 - proximity);
      const visualTier = Number(tocItem.dataset.tier);
      const baseWidth = getMarkerBaseWidthPercent(visualTier);
      const expandedWidth = getMarkerExpandedWidthPercent(visualTier);
      const width = baseWidth + (expandedWidth - baseWidth) * easedProximity;

      marker.style.setProperty('--toc-marker-width', `${width}%`);
    });
  };

  const resetMarkerWidths = () => {
    panelRef.current
      ?.querySelectorAll<HTMLElement>('.toc-marker')
      .forEach((marker) => marker.style.removeProperty('--toc-marker-width'));
  };

  const showTooltip = (item: TocItem, target: HTMLElement) => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const targetRect = target.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    setTooltip({
      id: item.id,
      label: item.label,
      top: targetRect.top - sidebarRect.top + targetRect.height / 2,
    });
  };

  // On mount: if URL has a hash, scroll to it
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Wait for layout before scrolling
      requestAnimationFrame(() => scrollToId(hash));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const headings = items
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      // Active = last heading that has crossed the nav threshold
      let current = headings[0]?.id ?? '';
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= BLOG_NAV_HEIGHT + 16) current = h.id;
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="toc-fixed" aria-label="文章目录" ref={sidebarRef}>
      <nav
        className="toc-panel"
        ref={panelRef}
        onPointerMove={(event) => updateMarkerWidths(event.clientY)}
        onPointerLeave={() => {
          resetMarkerWidths();
          setTooltip(null);
        }}
        onScroll={() => {
          resetMarkerWidths();
          setTooltip(null);
        }}
      >
        <ol className="toc-list">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const visualTier = getRelativeTocTier(item.depth, observedDepths);

            return (
              <li
                className="toc-item"
                data-depth={item.depth}
                data-tier={visualTier}
                key={item.id}
              >
                <a
                  className="toc-link"
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  aria-describedby={tooltip?.id === item.id ? 'toc-tooltip' : undefined}
                  aria-label={item.label}
                  onMouseEnter={(event) => showTooltip(item, event.currentTarget)}
                  onFocus={(event) => showTooltip(item, event.currentTarget)}
                  onMouseLeave={() => setTooltip(null)}
                  onBlur={() => setTooltip(null)}
                  onClick={(event) => {
                    event.preventDefault();
                    history.pushState(null, '', `#${item.id}`);
                    scrollToId(item.id);
                  }}
                >
                  <span className="toc-marker" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
      {tooltip && (
        <div
          className="toc-tooltip"
          id="toc-tooltip"
          role="tooltip"
          style={{ top: tooltip.top }}
        >
          {tooltip.label}
        </div>
      )}
    </aside>
  );
}
