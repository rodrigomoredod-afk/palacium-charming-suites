import type { RowDataPacket } from 'mysql2/promise';
import { INITIAL_SITE_CONTENT } from '../../data/siteContent.js';
import { SUITES } from '../../data/suites.js';
import { getMysqlPool } from './db.js';
import {
  mergeReviewsWithDb,
  mergeSiteContentFromDb,
  mergeSuitesWithDb,
  type ReviewRow,
  type SuiteRow,
} from './siteDataMerge.js';
import type { Review, SiteContent, Suite } from '../../types.js';

const BOOKING_SCORE_KEY = 'booking_display_score';

export async function loadMergedSiteData(): Promise<{
  suites: Suite[];
  reviews: Review[];
  siteContent: SiteContent;
  bookingDisplayScore: number;
}> {
  const pool = getMysqlPool();

  const [suiteResult] = await pool.query(
    'SELECT id, name, image, description, area, adults, price FROM suites',
  );
  const suites = mergeSuitesWithDb(suiteResult as SuiteRow[]);

  const [reviewResult] = await pool.query(
    'SELECT id, author, nationality, rating, comment, review_date FROM reviews ORDER BY created_at DESC',
  );
  const reviews = mergeReviewsWithDb(reviewResult as ReviewRow[]);

  const [contentRows] = await pool.query<RowDataPacket[]>(
    'SELECT hero_pt, hero_en, hero_slideshow_override FROM site_content WHERE id = 1 LIMIT 1',
  );
  let siteContent: SiteContent;
  if (!contentRows.length) {
    siteContent = INITIAL_SITE_CONTENT;
  } else {
    const row = contentRows[0] as Record<string, unknown>;
    const heroPt = parseJsonColumn(row.hero_pt);
    const heroEn = parseJsonColumn(row.hero_en);
    const slideshow = row.hero_slideshow_override;
    const raw: Partial<SiteContent> = {
      hero: {
        pt: (heroPt && typeof heroPt === 'object' ? heroPt : {}) as SiteContent['hero']['pt'],
        en: (heroEn && typeof heroEn === 'object' ? heroEn : {}) as SiteContent['hero']['en'],
      },
      heroSlideshowOverride:
        slideshow == null
          ? null
          : typeof slideshow === 'string'
            ? (JSON.parse(slideshow) as string[])
            : (slideshow as string[]),
    };
    siteContent = mergeSiteContentFromDb(raw);
  }

  const [settingRows] = await pool.query<RowDataPacket[]>(
    'SELECT setting_value FROM site_settings WHERE setting_key = ? LIMIT 1',
    [BOOKING_SCORE_KEY],
  );
  let bookingDisplayScore = 9.6;
  if (settingRows.length) {
    const v = Number.parseFloat(String((settingRows[0] as { setting_value: string }).setting_value));
    if (!Number.isNaN(v) && v >= 0 && v <= 10) bookingDisplayScore = v;
  }

  return { suites, reviews, siteContent, bookingDisplayScore };
}

function parseJsonColumn(v: unknown): unknown {
  if (v == null) return undefined;
  if (typeof v === 'object') return v;
  if (typeof v === 'string') {
    try {
      return JSON.parse(v) as unknown;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export async function upsertSuiteRow(patch: Suite): Promise<void> {
  const pool = getMysqlPool();
  await pool.query(
    `INSERT INTO suites (id, name, image, description, area, adults, price)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       image = VALUES(image),
       description = VALUES(description),
       area = VALUES(area),
       adults = VALUES(adults),
       price = VALUES(price)`,
    [
      patch.id,
      patch.name,
      patch.image,
      patch.description,
      patch.area,
      patch.adults,
      patch.price,
    ],
  );
}

export async function insertReviewRow(r: Review): Promise<void> {
  const pool = getMysqlPool();
  await pool.query(
    `INSERT INTO reviews (id, author, nationality, rating, comment, review_date)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       author = VALUES(author),
       nationality = VALUES(nationality),
       rating = VALUES(rating),
       comment = VALUES(comment),
       review_date = VALUES(review_date)`,
    [r.id, r.author, r.nationality ?? null, r.rating, r.comment, r.date],
  );
}

export async function deleteReviewRow(id: string): Promise<void> {
  const pool = getMysqlPool();
  await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
}

export async function ensureSiteContentRow(): Promise<void> {
  const pool = getMysqlPool();
  await pool.query(
    `INSERT INTO site_content (id, hero_pt, hero_en, hero_slideshow_override)
     VALUES (1, ?, ?, NULL)
     ON DUPLICATE KEY UPDATE id = id`,
    [JSON.stringify(INITIAL_SITE_CONTENT.hero.pt), JSON.stringify(INITIAL_SITE_CONTENT.hero.en)],
  );
}

export async function saveSiteContentRow(content: SiteContent): Promise<void> {
  const pool = getMysqlPool();
  await ensureSiteContentRow();
  await pool.query(
    `UPDATE site_content SET hero_pt = ?, hero_en = ?, hero_slideshow_override = ? WHERE id = 1`,
    [
      JSON.stringify(content.hero.pt),
      JSON.stringify(content.hero.en),
      content.heroSlideshowOverride == null
        ? null
        : JSON.stringify(content.heroSlideshowOverride),
    ],
  );
}

export async function saveBookingDisplayScore(score: number): Promise<void> {
  const pool = getMysqlPool();
  await pool.query(
    `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP`,
    [BOOKING_SCORE_KEY, String(score)],
  );
}

export function getSuiteDefaultOrThrow(id: string): Suite {
  const d = SUITES.find((s) => s.id === id);
  if (!d) throw new Error('unknown_suite');
  return d;
}
