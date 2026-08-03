/**
 * Third-party marketing analytics is intentionally disabled site-wide for the
 * strict-YMYL release. Keeping the boundary explicit makes an accidental
 * partial re-enable fail the accompanying tests.
 */
export function isMarketingAnalyticsPath(pathname: string): boolean {
  void pathname;
  return false;
}
