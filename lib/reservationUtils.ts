const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** True for calendar-normalised YYYY-MM-DD (avoids native `<input type="date">` picker bugs on some browsers). */
export function isValidIsoDateString(s: string): boolean {
  if (!ISO_DATE_RE.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

/** Renders a calendar YYYY-MM-DD value for Portugal (dd/mm/yyyy). */
export function formatIsoDatePt(iso: string): string {
  if (!iso || !ISO_DATE_RE.test(iso)) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(y, m - 1, d));
}

export function computeNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const [y1, m1, d1] = checkIn.split('-').map(Number);
  const [y2, m2, d2] = checkOut.split('-').map(Number);
  const start = new Date(y1, m1 - 1, d1);
  const end = new Date(y2, m2 - 1, d2);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  return diff > 0 ? diff : 0;
}

export function getTodayIsoLocal(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().split('T')[0];
}

export function getTomorrowIsoFrom(dateIso: string): string {
  const d = new Date(dateIso);
  d.setDate(d.getDate() + 1);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().split('T')[0];
}
