/** Return the local ISO date (YYYY-MM-DD) for the given date. */
export function isoDay(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Return the ISO day N days before the given reference. */
export function daysAgo(n: number, reference: Date = new Date()): string {
  const d = new Date(reference);
  d.setDate(d.getDate() - n);
  return isoDay(d);
}

/** Number of whole days between two ISO day strings (from \u2192 to). */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(fromIso + 'T00:00:00');
  const to = new Date(toIso + 'T00:00:00');
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
