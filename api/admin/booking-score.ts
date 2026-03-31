import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminWriteAuth } from '../lib/adminApiAuth.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';
import { saveBookingDisplayScore } from '../lib/siteDataRepository.js';

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
  if (!raw || typeof raw !== 'object') {
    res.status(400).json({ ok: false, error: 'invalid_json' });
    return;
  }
  const score = (raw as { score?: unknown }).score;
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    res.status(400).json({ ok: false, error: 'invalid_score' });
    return;
  }
  const n = Math.min(10, Math.max(0, score));
  const rounded = Math.round(n * 10) / 10;
  try {
    await saveBookingDisplayScore(rounded);
  } catch (e) {
    console.error('[admin/booking-score]', e);
    res.status(500).json({ ok: false, error: 'save_failed' });
    return;
  }
  res.status(200).json({ ok: true });
}
