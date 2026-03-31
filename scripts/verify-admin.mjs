#!/usr/bin/env node
/**
 * Diagnose: does the DB row for this username accept this password?
 *
 *   node scripts/verify-admin.mjs admin MinhaPass123
 */
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDotEnv } from './load-dot-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

console.log('[verify-admin] project root:', root);
loadDotEnv(root);

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error('[verify-admin] DATABASE_URL missing. Add it to .env in the project root.');
  process.exit(1);
}
console.log('[verify-admin] DATABASE_URL is set (host is hidden).');

const username = (process.argv[2] || 'admin').trim().toLowerCase();
const password = process.argv[3] || '';

if (!password) {
  console.error('Usage: node scripts/verify-admin.mjs <username> <password>');
  process.exit(1);
}

let conn;
try {
  conn = await mysql.createConnection({ uri: url });
  const [rows] = await conn.query(
    'SELECT username, password_hash, role FROM admin_users WHERE username = ? LIMIT 1',
    [username],
  );

  if (!rows?.length) {
    console.log(`[verify-admin] NO row for username "${username}" in admin_users.`);
    console.log('[verify-admin] Run: node scripts/seed-admin.mjs', username, '<password>', 'superadmin');
    process.exit(2);
  }

  const row = rows[0];
  const hash = String(row.password_hash ?? '');
  console.log('[verify-admin] Found row:', row.username, 'role=', row.role);
  console.log('[verify-admin] Hash prefix:', hash.slice(0, 7), '… length', hash.length);

  if (!hash.startsWith('$2')) {
    console.error('[verify-admin] password_hash does not look like bcrypt (should start with $2).');
    process.exit(3);
  }

  const ok = bcrypt.compareSync(password, hash);
  if (ok) {
    console.log('[verify-admin] PASSWORD MATCHES — same check as /api/admin-login.');
    process.exit(0);
  }
  console.log('[verify-admin] PASSWORD DOES NOT MATCH this hash.');
  console.log('[verify-admin] Fix: node scripts/seed-admin.mjs', username, password, 'superadmin');
  process.exit(4);
} catch (e) {
  console.error('[verify-admin] ERROR:', e?.message || e);
  process.exit(1);
} finally {
  if (conn) await conn.end();
}
