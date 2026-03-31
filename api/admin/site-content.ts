import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminWriteAuth } from '../_lib/adminApiAuth.js';
import { parseJsonBody } from '../_lib/parseJsonBody.js';
import { loadMergedSiteData, saveSiteContentRow } from '../_lib/siteDataRepository.js';
import type { HeroContent, SiteContent } from '../../types.js';

type HeroPatch = {
  hero?: {
    pt?: Partial<HeroContent>;
    en?: Partial<HeroContent>;
  };
  heroSlideshowOverride?: string[] | null;
};

function isHeroPatch(b: unknown): b is HeroPatch {
  if (!b || typeof b !== 'object') return false;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  const auth = await requireAdminWriteAuth(req);
  if (!auth.ok) {
    res.status(auth.status).json(auth.body);
    return;
  }
  const raw = parseJsonBody(req);
  if (!isHeroPatch(raw)) {
    res.status(400).json({ ok: false, error: 'invalid_json' });
    return;
  }
  let next: SiteContent;
  try {
    const { siteContent: current } = await loadMergedSiteData();
    next = { ...current };
    if (raw.hero?.pt) {
      next = {
        ...next,
        hero: { ...next.hero, pt: { ...next.hero.pt, ...raw.hero.pt } },
      };
    }
    if (raw.hero?.en) {
      next = {
        ...next,
        hero: { ...next.hero, en: { ...next.hero.en, ...raw.hero.en } },
      };
    }
    if ('heroSlideshowOverride' in raw) {
      next = { ...next, heroSlideshowOverride: raw.heroSlideshowOverride ?? null };
    }
  } catch (e) {
    console.error('[admin/site-content] load', e);
    res.status(500).json({ ok: false, error: 'load_failed' });
    return;
  }
  try {
    await saveSiteContentRow(next);
  } catch (e) {
    console.error('[admin/site-content] save', e);
    res.status(500).json({ ok: false, error: 'save_failed' });
    return;
  }
  res.status(200).json({ ok: true });
}
