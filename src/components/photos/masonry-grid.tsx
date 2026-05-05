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
