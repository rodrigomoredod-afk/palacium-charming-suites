import type { Suite, SuitePriceRule } from '../types';
import { computeNights, isValidIsoDateString } from './reservationUtils';

export function toIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Each calendar night between check-in (inclusive) and check-out (exclusive). */
export function* iterateStayNights(checkIn: string, checkOut: string): Generator<string> {
  const [y1, m1, d1] = checkIn.split('-').map(Number);
  const cur = new Date(y1, m1 - 1, d1);
  const [y2, m2, d2] = checkOut.split('-').map(Number);
  const end = new Date(y2, m2 - 1, d2);
  while (cur < end) {
    yield toIsoLocal(cur);
    cur.setDate(cur.getDate() + 1);
  }
}

export function effectiveNightlyRate(
  suiteId: string,
  dateIso: string,
  suites: Suite[],
  rules: SuitePriceRule[],
): number {
  const base = suites.find((s) => s.id === suiteId)?.price ?? 0;
  const hits = rules.filter(
    (r) => r.suiteId === suiteId && dateIso >= r.startDate && dateIso <= r.endDate,
  );
  if (hits.length === 0) return base;
  return hits.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b)).nightlyPrice;
}

export function computeSuggestedStayQuote(
  suiteIds: string[],
  checkIn: string,
  checkOut: string,
  suites: Suite[],
  rules: SuitePriceRule[],
): {
  total: number;
  nights: number;
  lines: { suiteId: string; name: string; subtotal: number }[];
} | null {
  if (!checkIn || !checkOut || suiteIds.length === 0) return null;
  if (!isValidIsoDateString(checkIn) || !isValidIsoDateString(checkOut)) return null;
  const nights = computeNights(checkIn, checkOut);
  if (nights <= 0) return null;
  const lines: { suiteId: string; name: string; subtotal: number }[] = [];
  let total = 0;
  for (const id of suiteIds) {
    const s = suites.find((x) => x.id === id);
    if (!s) continue;
    let subtotal = 0;
    for (const night of iterateStayNights(checkIn, checkOut)) {
      subtotal += effectiveNightlyRate(id, night, suites, rules);
    }
    total += subtotal;
    lines.push({
      suiteId: id,
      name: s.name,
      subtotal: Math.round(subtotal * 100) / 100,
    });
  }
  if (lines.length === 0) return null;
  return {
    total: Math.round(total * 100) / 100,
    nights,
    lines,
  };
}

export function orderIsoRange(a: string, b: string): [string, string] {
  return a <= b ? [a, b] : [b, a];
}

/** Days in month grid (Mon-first), null = empty cell. */
export function buildMonthGrid(
  year: number,
  monthIndex: number,
): (string | null)[][] {
  const first = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const mondayPad = (first.getDay() + 6) % 7;
  const cells: (string | null)[] = [];
  for (let i = 0; i < mondayPad; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) {
    cells.push(toIsoLocal(new Date(year, monthIndex, d)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}
