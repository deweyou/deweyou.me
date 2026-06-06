import { getSearchPayload, getSearchPayloadStats } from '##/lib/search';

export const dynamic = 'force-static';

export async function GET() {
  const payload = getSearchPayload();
  const stats = getSearchPayloadStats(payload);

  if (stats.warn) {
    console.warn(
      `Search payload is ${stats.bytes} bytes (${stats.gzipBytes} gzip bytes), above the configured warning budget.`,
    );
  }

  return Response.json(payload, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=31536000, immutable',
    },
  });
}
