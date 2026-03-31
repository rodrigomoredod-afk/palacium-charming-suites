import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminWriteAuth } from '../lib/adminApiAuth.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';
import { deleteReviewRow, insertReviewRow } from '../lib/siteDataRepository.js';
import type { Review } from '../../types.js';

function isReviewBody(b: unknown): b is Review {
  if (!b || typeof b !== 'object') return false;
  const o = b as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.author === 'string' &&
    typeof o.rating === 'number' &&
    typeof o.comment === 'string' &&
    typeof o.date === 'string' &&
    (o.nationality === undefined || typeof o.nationality === 'string')
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await requireAdminWriteAuth(req);
  if (!auth.ok) {
    res.status(auth.status).json(auth.body);
    return;
  }

  if (req.method === 'POST') {
    const raw = parseJsonBody(req);
    if (!isReviewBody(raw)) {
      res.status(400).json({ ok: false, error: 'invalid_payload' });
      return;
    }
    try {
      await insertReviewRow(raw);
    } catch (e) {
      console.error('[admin/reviews] insert', e);
      res.status(500).json({ ok: false, error: 'save_failed' });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === 'DELETE') {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    if (!id) {
      res.status(400).json({ ok: false, error: 'missing_id' });
      return;
    }
    try {
      await deleteReviewRow(id);
    } catch (e) {
      console.error('[admin/reviews] delete', e);
      res.status(500).json({ ok: false, error: 'delete_failed' });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ ok: false, error: 'method_not_allowed' });
}
