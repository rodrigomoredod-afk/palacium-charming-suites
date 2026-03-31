export type AdminRole = 'superadmin' | 'admin' | 'viewer';

export interface AuthUser {
  username: string;
  role: AdminRole;
}

export type AuthenticateResult =
  | { ok: true; user: AuthUser; token?: string }
  | {
      ok: false;
      reason:
        | 'invalid_credentials'
        | 'login_service_unavailable'
        | 'login_not_configured';
      /** Present when API returns `hint` (enable ADMIN_LOGIN_DEBUG=1 on server). */
      loginHint?: 'unknown_user' | 'wrong_password';
    };

const AUTH_SESSION_KEY = 'palacium_admin_session_v1';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

interface AuthSession extends AuthUser {
  expiresAt: number;
  /** Present when server sets SESSION_SECRET (HS256 JWT for future admin APIs). */
  token?: string;
}

export async function authenticate(username: string, password: string): Promise<AuthenticateResult> {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const url = base ? `${base}/api/admin-login` : '/api/admin-login';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim().toLowerCase(),
        password: typeof password === 'string' ? password.trim() : password,
      }),
    });
    if (response.status === 404 || response.status === 405) {
      return { ok: false, reason: 'login_service_unavailable' };
    }
    if (response.status === 503) {
      return { ok: false, reason: 'login_not_configured' };
    }
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      user?: AuthUser;
      token?: string;
      error?: string;
      hint?: 'unknown_user' | 'wrong_password';
    };
    if (response.status === 401) {
      const hint = data.hint === 'unknown_user' || data.hint === 'wrong_password' ? data.hint : undefined;
      return { ok: false, reason: 'invalid_credentials', loginHint: hint };
    }
    if (!response.ok || !data.ok || !data.user) {
      return { ok: false, reason: 'invalid_credentials' };
    }
    return { ok: true, user: data.user, ...(data.token ? { token: data.token } : {}) };
  } catch {
    return { ok: false, reason: 'login_service_unavailable' };
  }
}

export function saveAuthSession(user: AuthUser, token?: string): void {
  const session: AuthSession = {
    ...user,
    expiresAt: Date.now() + SESSION_TTL_MS,
    ...(token ? { token } : {}),
  };
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function readAuthSession(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.username || !parsed?.role || typeof parsed.expiresAt !== 'number') return null;
    if (parsed.expiresAt < Date.now()) {
      clearAuthSession();
      return null;
    }
    return { username: parsed.username, role: parsed.role };
  } catch {
    return null;
  }
  return null;
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function canManageContent(role: AdminRole): boolean {
  return role === 'superadmin' || role === 'admin';
}

/** JWT from last login, if the server issued one (SESSION_SECRET). */
export function readAuthToken(): string | null {
  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (typeof parsed.expiresAt !== 'number' || parsed.expiresAt < Date.now()) return null;
    return typeof parsed.token === 'string' ? parsed.token : null;
  } catch {
    return null;
  }
}

/** Headers for future authenticated admin API calls. */
export function getAuthHeaders(): Record<string, string> {
  const token = readAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
