export type AdminRole = 'superadmin' | 'admin' | 'viewer';

export interface AuthUser {
  username: string;
  role: AdminRole;
}

const AUTH_SESSION_KEY = 'palacium_admin_session_v1';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

interface AuthSession extends AuthUser {
  expiresAt: number;
}

export async function authenticate(username: string, password: string): Promise<AuthUser | null> {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const url = base ? `${base}/api/admin-login` : '/api/admin-login';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      user?: AuthUser;
      error?: string;
    };
    if (!response.ok || !data.ok || !data.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

export function saveAuthSession(user: AuthUser): void {
  const session: AuthSession = {
    ...user,
    expiresAt: Date.now() + SESSION_TTL_MS,
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
