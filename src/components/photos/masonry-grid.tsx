// Uses <img> instead of next/image intentionally — photos are on an external CDN
// (cdn.deweyou.me / 七牛云 Kodo) with no Next.js image optimization configured.
import type { PhotoItem } from '##/content/photos';
import styles from './masonry-grid.module.css';

interface MasonryGridProps {
  photos: PhotoItem[];
}

export function MasonryGrid({ photos }: MasonryGridProps) {
  return (
    <div className={styles.grid}>
      {photos.map((photo) => (
        <div key={photo.src} className={styles.item}>
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            className={styles.photo}
          />
        </div>
      ))}
    </div>
  );
}
