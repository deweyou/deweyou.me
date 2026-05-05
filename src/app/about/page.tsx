import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { PROFILE } from '##/content/common';
import { ABOUT, ABOUT_SECTIONS } from '##/content/about';
import { SocialIcon } from '##/components/social-icon';

export default function AboutPage() {
  return (
    <div className="page">
      <Nav />

      <header className="container" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 1, background: 'currentColor' }} />
            {ABOUT.eyebrow}
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--ui-font-display)', fontSize: '3rem', fontWeight: 600,
          lineHeight: 1.15, margin: 0, letterSpacing: '-0.01em' }}>
          {ABOUT.headingLine1}<br />
          <em style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--ui-color-text-muted)' }}>{ABOUT.headingLine2}</em>。
        </h1>
      </header>

      <div className="container" style={{ paddingBottom: 100,
        display: 'grid', gridTemplateColumns: '160px 1fr', gap: 56 }}>
        {/* Sticky TOC */}
        <aside style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{ABOUT.tocLabel}</div>
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

              {s.kind === 'prose' && (s as { kind: 'prose'; body: readonly string[] }).body.map((p, j) => (
                <p key={j} style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16, color: 'var(--ui-color-text)' }}>{p}</p>
              ))}

              {s.kind === 'list' && (s as { kind: 'list'; items: readonly { k: string; v: string }[] }).items.map((item) => (
                <div key={item.k} style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 15 }}>
                  <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 12, color: 'var(--ui-color-text-muted)', flexShrink: 0, width: 60 }}>{item.k}</span>
                  <span className="leader" />
                  <span>{item.v}</span>
                </div>
              ))}

              {s.kind === 'timeline' && (s as { kind: 'timeline'; items: readonly { from: string; to: string; org: string; role: string; detail: string }[] }).items.map((item) => (
                <div key={item.org} style={{ marginBottom: 28, paddingLeft: 16, borderLeft: '2px solid var(--ui-color-border)' }}>
                  <div style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', marginBottom: 6 }}>
                    {item.from} – {item.to}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.org}</div>
                  <div style={{ fontSize: 14, color: 'var(--ui-color-text-muted)', marginBottom: 8 }}>{item.role}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ui-color-text)', margin: 0 }}>{item.detail}</p>
                </div>
              ))}

              {s.kind === 'tags' && (s as { kind: 'tags'; groups: readonly { name: string; items: readonly string[] }[] }).groups.map((g) => (
                <div key={g.name} style={{ marginBottom: 20 }}>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>{g.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {g.items.map((item) => <span key={item} className="dy-tag" style={{ cursor: 'default' }}>{item}</span>)}
                  </div>
                </div>
              ))}

              {s.kind === 'quotes' && (s as { kind: 'quotes'; items: readonly string[] }).items.map((q, j) => (
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
