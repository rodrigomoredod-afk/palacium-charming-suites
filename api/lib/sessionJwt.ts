import { SignJWT, jwtVerify } from 'jose';
import type { AdminRole } from './adminDbAuth.js';

function getSecretKey(): Uint8Array | null {
  const s = process.env.SESSION_SECRET?.trim();
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

/** Returns a JWT when SESSION_SECRET is set (≥16 chars); otherwise null (client keeps username/role in localStorage only). */
export async function signAdminSessionToken(user: {
  username: string;
  role: AdminRole;
}): Promise<string | null> {
  const key = getSecretKey();
  if (!key) return null;
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.username)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(key);
}

export async function verifyAdminSessionToken(
  token: string,
): Promise<{ username: string; role: AdminRole } | null> {
  const key = getSecretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    const sub = payload.sub;
    const role = payload.role;
    if (typeof sub !== 'string' || typeof role !== 'string') return null;
    if (role !== 'superadmin' && role !== 'admin' && role !== 'viewer') return null;
    return { username: sub, role: role as AdminRole };
  } catch {
    return null;
  }
}
