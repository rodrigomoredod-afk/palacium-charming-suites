import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isDatabaseConfigured } from './lib/db.js';
import { loadMergedSiteData } from './lib/siteDataRepository.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  if (!isDatabaseConfigured()) {
    res.status(503).json({ ok: false, error: 'not_configured' });
    return;
  }
  try {
    const data = await loadMergedSiteData();
    res.status(200).json({ ok: true, ...data });
  } catch (e) {
    console.error('[site-data]', e);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
}
