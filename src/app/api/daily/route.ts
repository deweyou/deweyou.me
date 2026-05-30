import { NextResponse } from 'next/server';
import { getDailyFeedBatch } from '##/lib/daily';
import { serializeDailyFeedBatch } from '##/lib/daily-feed';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const tag = url.searchParams.get('tag');
    const limitValue = url.searchParams.get('limit');
    const limit = limitValue == null ? undefined : Number(limitValue);
    const batch = getDailyFeedBatch({
      cursor,
      limit: Number.isFinite(limit) ? limit : undefined,
      tag,
    });

    return NextResponse.json(await serializeDailyFeedBatch(batch));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load daily entries';
    const status = message.includes('cursor') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
