import { getAuthHeaders } from './auth';
import type { HeroContent, Review, SiteContent, Suite } from '../types';

function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  return base ? `${base}${path}` : path;
}

export interface SiteDataPayload {
  ok: true;
  suites: Suite[];
  reviews: Review[];
  siteContent: SiteContent;
  bookingDisplayScore: number;
}

export async function fetchSiteData(): Promise<SiteDataPayload | null> {
  const r = await fetch(apiUrl('/api/site-data'));
  if (r.status === 503) return null;
  if (!r.ok) return null;
  const j = (await r.json()) as Partial<SiteDataPayload> & { ok?: boolean };
  if (!j.ok) return null;
  if (
    !Array.isArray(j.suites) ||
    !Array.isArray(j.reviews) ||
    j.siteContent == null ||
    typeof j.bookingDisplayScore !== 'number'
  ) {
    return null;
  }
  return j as SiteDataPayload;
}

export async function patchAdminSuite(id: string, patch: Partial<Suite>): Promise<void> {
  const r = await fetch(apiUrl('/api/admin/suites'), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ id, ...patch }),
  });
  if (!r.ok) throw new Error(`patch_suite_${r.status}`);
}

export async function postAdminReview(review: Review): Promise<void> {
  const r = await fetch(apiUrl('/api/admin/reviews'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(review),
  });
  if (!r.ok) throw new Error(`post_review_${r.status}`);
}

export async function deleteAdminReview(id: string): Promise<void> {
  const r = await fetch(apiUrl(`/api/admin/reviews?id=${encodeURIComponent(id)}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!r.ok) throw new Error(`delete_review_${r.status}`);
}

export async function putAdminSiteContent(patch: {
  hero?: { pt?: Partial<HeroContent>; en?: Partial<HeroContent> };
  heroSlideshowOverride?: string[] | null;
}): Promise<void> {
  const r = await fetch(apiUrl('/api/admin/site-content'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`put_site_content_${r.status}`);
}

export async function putAdminBookingScore(score: number): Promise<void> {
  const r = await fetch(apiUrl('/api/admin/booking-score'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ score }),
  });
  if (!r.ok) throw new Error(`put_booking_score_${r.status}`);
}
