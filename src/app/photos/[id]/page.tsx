import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { MasonryGrid } from '##/components/photos/masonry-grid';
import { PHOTO_SERIES } from '##/content/photos';
import type { PhotoSeries } from '##/content/photos';
import styles from './page.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PHOTO_SERIES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const series = PHOTO_SERIES.find((s) => s.id === id);
  if (!series) return {};
  return {
    title: `${series.title} — Dewey Ou`,
    description: series.desc,
  };
}

export default async function PhotoSeriesPage({ params }: Props) {
  const { id } = await params;
  const series = PHOTO_SERIES.find((s) => s.id === id);
  if (!series) notFound();

  const meta: string[] = [
    String(series.year),
    series.location,
    ...(series.camera ? [series.camera] : []),
    ...(series.lens ? [series.lens] : []),
    ...(series.film ? [series.film] : []),
    `${series.photos.length} 张`,
  ];

  return (
    <div className="page">
      <Nav />
      <section className="container container-lg" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className={styles.hero}>
          <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, height: 1, background: 'currentColor' }} />
            PHOTOGRAPHY
          </div>
          <h1 className={styles.title}>{series.title}</h1>
          {series.subtitle && (
            <p className={styles.subtitle}>{series.subtitle}</p>
          )}
          <div className={styles.metaRow}>
            {meta.map((m, i) => (
              <span key={i} className={styles.metaItem}>{m}</span>
            ))}
          </div>
          <p className={styles.desc}>{series.desc}</p>
        </div>
        <MasonryGrid photos={series.photos} />
      </section>
      <Footer />
    </div>
  );
}
