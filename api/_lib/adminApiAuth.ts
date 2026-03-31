import type { VercelRequest } from '@vercel/node';
import type { AdminRole } from './adminDbAuth.js';
import { verifyAdminSessionToken } from './sessionJwt.js';

export type AdminAuthOk = { username: string; role: AdminRole };

export async function requireAdminWriteAuth(
  req: VercelRequest,
): Promise<{ ok: true; user: AdminAuthOk } | { ok: false; status: number; body: Record<string, unknown> }> {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    return {
      ok: false,
      status: 503,
      body: { ok: false, error: 'admin_write_requires_session_secret' },
    };
  }
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return { ok: false, status: 401, body: { ok: false, error: 'missing_token' } };
  }
  const token = auth.slice(7).trim();
  const user = await verifyAdminSessionToken(token);
  if (!user) {
    return { ok: false, status: 401, body: { ok: false, error: 'invalid_token' } };
  }
  if (user.role === 'viewer') {
    return { ok: false, status: 403, body: { ok: false, error: 'forbidden' } };
  }
  return { ok: true, user };
}
