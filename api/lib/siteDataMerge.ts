import { INITIAL_SITE_CONTENT } from '../../data/siteContent.js';
import { REVIEWS } from '../../data/reviews.js';
import { SUITES } from '../../data/suites.js';
import type { Review, SiteContent, Suite } from '../../types.js';

export function mergeSiteContentFromDb(raw: unknown): SiteContent {
  if (!raw || typeof raw !== 'object') return INITIAL_SITE_CONTENT;
  const p = raw as Partial<SiteContent>;
  return {
    ...INITIAL_SITE_CONTENT,
    ...p,
    hero: {
      pt: { ...INITIAL_SITE_CONTENT.hero.pt, ...p.hero?.pt },
      en: { ...INITIAL_SITE_CONTENT.hero.en, ...p.hero?.en },
    },
    heroSlideshowOverride:
      p.heroSlideshowOverride === undefined
        ? INITIAL_SITE_CONTENT.heroSlideshowOverride
        : p.heroSlideshowOverride,
  };
}

export function mergeSuitesWithDb(rows: SuiteRow[]): Suite[] {
  const byId = new Map(rows.map((r) => [r.id, r]));
  return SUITES.map((d) => {
    const o = byId.get(d.id);
    if (!o) return d;
    const price =
      typeof o.price === 'string' ? Number.parseFloat(o.price) : Number(o.price);
    return {
      ...d,
      name: o.name,
      image: o.image,
      description: o.description,
      area: o.area,
      adults: Number(o.adults),
      price: Number.isFinite(price) ? price : d.price,
    };
  });
}

export function mergeReviewsWithDb(rows: ReviewRow[]): Review[] {
  const dbIds = new Set(rows.map((r) => r.id));
  const fromDb = rows.map(reviewRowToReview);
  const rest = REVIEWS.filter((d) => !dbIds.has(d.id));
  return [...fromDb, ...rest];
}

export interface SuiteRow {
  id: string;
  name: string;
  image: string;
  description: string;
  area: string;
  adults: number;
  price: string | number;
}

export interface ReviewRow {
  id: string;
  author: string;
  nationality: string | null;
  rating: number;
  comment: string;
  review_date: string;
}

function reviewRowToReview(r: ReviewRow): Review {
  return {
    id: r.id,
    author: r.author,
    nationality: r.nationality ?? undefined,
    rating: r.rating,
    comment: r.comment,
    date: r.review_date,
  };
}
