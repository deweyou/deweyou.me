import styles from '##/app/daily/page.module.css';

export default function DailyDetailLoading() {
  return (
    <div className="page">
      <section className={`${styles.timelineWide} ${styles.timelineSplitMode}`} aria-label="正在加载笔记">
        <div className={styles.detailLoading}>
          <div className={styles.detailLoadingMeta} />
          <div className={styles.detailLoadingTitle} />
          <div className={styles.detailLoadingLine} />
          <div className={styles.detailLoadingLine} />
          <div className={`${styles.detailLoadingLine} ${styles.detailLoadingLineShort}`} />
        </div>
      </section>
    </div>
  );
}
