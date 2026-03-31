import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';
import { getMysqlPool, isDatabaseConfigured } from './db.js';

export type AdminRole = 'superadmin' | 'admin' | 'viewer';

export async function hasAnyAdminUser(): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  try {
    const pool = getMysqlPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS c FROM admin_users',
    );
    return Number(rows[0]?.c) > 0;
  } catch (e) {
    console.error('[adminDbAuth] hasAnyAdminUser', e);
    return false;
  }
}

/** DB row exists for this username — used to block JSON fallback when password is wrong. */
export async function adminUsernameExistsInDb(username: string): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  try {
    const pool = getMysqlPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT 1 FROM admin_users WHERE username = ? LIMIT 1',
      [username],
    );
    return rows.length > 0;
  } catch (e) {
    console.error('[adminDbAuth] adminUsernameExistsInDb', e);
    return false;
  }
}

export async function authenticateAdminFromDb(
  username: string,
  password: string,
): Promise<{ username: string; role: AdminRole } | null> {
  if (!isDatabaseConfigured()) return null;
  const pool = getMysqlPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT username, password_hash, role FROM admin_users WHERE username = ? LIMIT 1',
    [username],
  );
  const row = rows[0];
  if (!row) return null;
  const ok = bcrypt.compareSync(password, String(row.password_hash));
  if (!ok) return null;
  return {
    username: String(row.username),
    role: row.role as AdminRole,
  };
}
