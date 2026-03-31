import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  authenticateAdminFromDb,
  adminUsernameExistsInDb,
  hasAnyAdminUser,
  type AdminRole,
} from './_lib/adminDbAuth.js';
import { signAdminSessionToken } from './_lib/sessionJwt.js';
import { isDatabaseConfigured } from './_lib/db.js';

function findProjectRoot(startDir: string): string | undefined {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 14; i += 1) {
    if (existsSync(path.join(dir, 'package.json'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return undefined;
}

/**
 * Prefer values from `.env.local` / `.env` on disk **before** `process.env`.
 * `vercel dev` injects preview/production env (and may set a different or empty
 * `ADMIN_USERS_JSON`), which would otherwise override your local password.
 *
 * `process.cwd()` is not always the repo root — walk up to `package.json` and
 * also try the compiled `api/` module directory.
 */
function collectEnvFileSearchRoots(): string[] {
  const roots = new Set<string>();
  const cwd = path.resolve(process.cwd());
  roots.add(cwd);
  const fromCwd = findProjectRoot(cwd);
  if (fromCwd) roots.add(fromCwd);
  if (path.basename(cwd) === 'api') {
    roots.add(path.resolve(cwd, '..'));
  }

  try {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
    roots.add(moduleDir);
    const fromModule = findProjectRoot(moduleDir);
    if (fromModule) roots.add(fromModule);
    roots.add(path.resolve(moduleDir, '..'));
  } catch {
    /* import.meta.url unavailable in some bundles */
  }

  return [...roots];
}

function readAdminUsersJsonRaw(): string | undefined {
  for (const root of collectEnvFileSearchRoots()) {
    for (const name of ['.env.local', '.env']) {
      const filePath = path.join(root, name);
      if (!existsSync(filePath)) continue;
      try {
        const text = readFileSync(filePath, 'utf8');
        for (const line of text.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const match = trimmed.match(/^ADMIN_USERS_JSON=(.*)$/);
          if (!match) continue;
          let value = match[1].trim();
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1).replace(/\\"/g, '"');
          }
          if (value) return value;
        }
      } catch {
        /* ignore */
      }
    }
  }

  const fromEnv = process.env.ADMIN_USERS_JSON?.trim();
  if (fromEnv) return fromEnv;
  return undefined;
}

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
  const cleaned = raw.replace(/^\uFEFF/, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as AdminCredential[];
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

function parseLoginBody(raw: unknown): LoginPayload {
  if (raw == null) return {};
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString('utf8')) as LoginPayload;
    } catch {
      return {};
    }
  }
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as LoginPayload;
    } catch {
      return {};
    }
  }
  if (typeof raw === 'object') {
    return raw as LoginPayload;
  }
  return {};
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

  const body = parseLoginBody(req.body);
  const username = String(body?.username ?? '')
    .trim()
    .toLowerCase();
  const password = String(body?.password ?? '').trim();

  const credentials = parseCredentials(readAdminUsersJsonRaw());
  const hasJson = credentials.length > 0;
  const dbUrl = isDatabaseConfigured();
  let hasDbAdmins = false;
  if (dbUrl) {
    try {
      hasDbAdmins = await hasAnyAdminUser();
    } catch (e) {
      console.error('[admin-login] hasAnyAdminUser', e);
    }
  }

  if (!hasJson && !dbUrl) {
    res.status(503).json({
      ok: false,
      error:
        'Admin login not configured: set DATABASE_URL or ADMIN_USERS_JSON in .env (or Vercel env).',
    });
    return;
  }

  if (dbUrl && !hasDbAdmins && !hasJson) {
    res.status(503).json({
      ok: false,
      error:
        'No admin users: run `npm run db:seed-admin` or set ADMIN_USERS_JSON in .env.',
    });
    return;
  }

  let resolved: { username: string; role: AdminRole } | null = null;
  let wrongPasswordDb = false;

  if (dbUrl) {
    try {
      const inDb = await adminUsernameExistsInDb(username);
      if (inDb) {
        const dbUser = await authenticateAdminFromDb(username, password);
        if (dbUser) resolved = dbUser;
        else wrongPasswordDb = true;
      }
    } catch (e) {
      console.error('[admin-login] DB auth', e);
    }
  }

  if (wrongPasswordDb) {
    const next = rate ?? { attempts: 0, blockedUntil: 0 };
    next.attempts += 1;
    if (next.attempts >= MAX_ATTEMPTS) {
      next.blockedUntil = Date.now() + BLOCK_WINDOW_MS;
      next.attempts = 0;
    }
    rateMap.set(key, next);
    const debug =
      process.env.ADMIN_LOGIN_DEBUG === '1' ||
      process.env.ADMIN_LOGIN_DEBUG === 'true' ||
      process.env.VERCEL_ENV === 'development';
    const payload: Record<string, unknown> = { ok: false, error: 'Invalid credentials' };
    if (debug) payload.hint = 'wrong_password';
    res.status(401).json(payload);
    return;
  }

  if (!resolved && hasJson) {
    const user = credentials.find((entry) =>
      safeEquals(String(entry.username ?? '').toLowerCase(), username),
    );
    const isValid =
      !!user && safeEquals(String(user.password ?? ''), password);
    if (isValid && user) {
      resolved = { username: user.username, role: user.role };
    }
  }

  if (!resolved) {
    const next = rate ?? { attempts: 0, blockedUntil: 0 };
    next.attempts += 1;
    if (next.attempts >= MAX_ATTEMPTS) {
      next.blockedUntil = Date.now() + BLOCK_WINDOW_MS;
      next.attempts = 0;
    }
    rateMap.set(key, next);
    const debug =
      process.env.ADMIN_LOGIN_DEBUG === '1' ||
      process.env.ADMIN_LOGIN_DEBUG === 'true' ||
      process.env.VERCEL_ENV === 'development';
    const payload: Record<string, unknown> = { ok: false, error: 'Invalid credentials' };
    if (debug) {
      const jsonUser = credentials.find((entry) =>
        safeEquals(String(entry.username ?? '').toLowerCase(), username),
      );
      payload.hint = jsonUser ? 'wrong_password' : 'unknown_user';
    }
    res.status(401).json(payload);
    return;
  }

  rateMap.delete(key);
  const token = await signAdminSessionToken(resolved);
  res.status(200).json({
    ok: true,
    user: { username: resolved.username, role: resolved.role },
    ...(token ? { token } : {}),
  });
}
