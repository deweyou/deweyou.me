export function isLocalAnalyticsHostname(hostname: string) {
  const normalizedHostname = hostname.replace(/^\[|\]$/g, '').toLowerCase();

  if (
    normalizedHostname === 'localhost' ||
    normalizedHostname === '0.0.0.0' ||
    normalizedHostname === '::1' ||
    normalizedHostname.endsWith('.localhost') ||
    normalizedHostname.endsWith('.local')
  ) {
    return true;
  }

  if (normalizedHostname.startsWith('127.')) return true;
  if (normalizedHostname.startsWith('10.')) return true;
  if (normalizedHostname.startsWith('192.168.')) return true;

  const private172Match = normalizedHostname.match(/^172\.(\d{1,2})\./);
  if (!private172Match) return false;

  const secondOctet = Number(private172Match[1]);
  return secondOctet >= 16 && secondOctet <= 31;
}

export function shouldReportAnalytics(hostname: string) {
  return process.env.NODE_ENV === 'production' && !isLocalAnalyticsHostname(hostname);
}
