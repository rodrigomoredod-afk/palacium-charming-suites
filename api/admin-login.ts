import type { VercelRequest, VercelResponse } from '@vercel/node';

type AdminRole = 'superadmin' | 'admin' | 'viewer';

interface LoginPayload {
  username?: string;
  password?: string;
}

interface AdminCredential {
  username: string;
  password: string;
  role: AdminRole;
}

const rateMap = new Map<string, { attempts: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_WINDOW_MS = 1000 * 60 * 5;

function getClientKey(req: VercelRequest): string {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string') return xff.split(',')[0]?.trim() || 'unknown';
  return req.socket.remoteAddress || 'unknown';
}

function parseCredentials(raw: string | undefined): AdminCredential[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AdminCredential[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const key = getClientKey(req);
  const rate = rateMap.get(key);
  if (rate && rate.blockedUntil > Date.now()) {
    res.status(429).json({ ok: false, error: 'Too many attempts. Try again later.' });
    return;
  }

  let body: LoginPayload = {};
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body) as LoginPayload;
    } catch {
      res.status(400).json({ ok: false, error: 'Invalid JSON' });
      return;
    }
  } else {
    body = (req.body || {}) as LoginPayload;
  }
  const username = body?.username?.trim().toLowerCase() || '';
  const password = body?.password || '';

  const credentials = parseCredentials(process.env.ADMIN_USERS_JSON);
  const user = credentials.find((entry) => safeEquals(entry.username.toLowerCase(), username));
  const isValid = !!user && safeEquals(user.password, password);

  if (!isValid) {
    const next = rate ?? { attempts: 0, blockedUntil: 0 };
    next.attempts += 1;
    if (next.attempts >= MAX_ATTEMPTS) {
      next.blockedUntil = Date.now() + BLOCK_WINDOW_MS;
      next.attempts = 0;
    }
    rateMap.set(key, next);
    res.status(401).json({ ok: false, error: 'Invalid credentials' });
    return;
  }

  rateMap.delete(key);
  res.status(200).json({
    ok: true,
    user: { username: user.username, role: user.role },
  });
}
