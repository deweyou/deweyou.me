import { DailyDetailLoading } from '##/components/daily/daily-detail';
import { DailyExperience } from '##/components/daily/daily-experience';
import {
  getAllDailyEntries,
  getAllDailyTags,
  getDailyFeedBatch,
} from '##/lib/daily';

export default function Loading() {
  const entries = getAllDailyEntries();
  const initialBatch = getDailyFeedBatch();

  return (
    <DailyExperience
      availableTags={getAllDailyTags(entries)}
      detailFallback={<DailyDetailLoading closeHref="/daily" />}
      initialBatch={initialBatch}
      visibleEntries={entries}
    />
  );
}
