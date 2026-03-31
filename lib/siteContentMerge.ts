import { INITIAL_SITE_CONTENT } from '../data/siteContent';
import type { SiteContent } from '../types';

export function mergeSiteContent(raw: unknown): SiteContent {
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
