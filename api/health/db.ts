import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isDatabaseConfigured, pingMysql } from '../lib/db.js';

/**
 * GET /api/health/db — verifies MySQL connectivity (SELECT 1).
 * Optional: set DATABASE_HEALTH_SECRET; then send Authorization: Bearer <secret> or X-Health-Secret.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const secret = process.env.DATABASE_HEALTH_SECRET;
  if (secret) {
    const auth = req.headers.authorization;
    const bearer = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
    const headerSecret =
      (typeof req.headers['x-health-secret'] === 'string' && req.headers['x-health-secret']) ||
      '';
    if (bearer !== secret && headerSecret !== secret) {
      res.status(403).json({ ok: false, error: 'forbidden' });
      return;
    }
  }

  if (!isDatabaseConfigured()) {
    res.status(503).json({ ok: false, error: 'not_configured' });
    return;
  }

  try {
    await pingMysql();
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[health/db]', e);
    res.status(503).json({ ok: false, error: 'db_unreachable' });
  }
}
