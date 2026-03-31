import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminWriteAuth } from '../lib/adminApiAuth.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';
import { getSuiteDefaultOrThrow, upsertSuiteRow } from '../lib/siteDataRepository.js';
import type { Suite } from '../../types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') {
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
  const body = raw as Record<string, unknown>;
  const id = body.id;
  if (typeof id !== 'string' || !id.trim()) {
    res.status(400).json({ ok: false, error: 'missing_id' });
    return;
  }
  let base: Suite;
  try {
    base = getSuiteDefaultOrThrow(id);
  } catch {
    res.status(404).json({ ok: false, error: 'unknown_suite' });
    return;
  }
  const patch: Partial<Suite> = {};
  if (typeof body.name === 'string') patch.name = body.name;
  if (typeof body.image === 'string') patch.image = body.image;
  if (typeof body.description === 'string') patch.description = body.description;
  if (typeof body.area === 'string') patch.area = body.area;
  if (typeof body.adults === 'number' && Number.isFinite(body.adults)) patch.adults = body.adults;
  if (typeof body.price === 'number' && Number.isFinite(body.price)) patch.price = body.price;
  const merged: Suite = { ...base, ...patch };
  try {
    await upsertSuiteRow(merged);
  } catch (e) {
    console.error('[admin/suites]', e);
    res.status(500).json({ ok: false, error: 'save_failed' });
    return;
  }
  res.status(200).json({ ok: true });
}
