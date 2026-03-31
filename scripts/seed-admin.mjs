#!/usr/bin/env node
/**
 * Inserts or updates an admin user in MySQL (bcrypt password hash).
 *
 * Usage:
 *   npm run db:seed-admin -- <username> <password> [role]
 *   ADMIN_SEED_USERNAME=... ADMIN_SEED_PASSWORD=... ADMIN_SEED_ROLE=superadmin npm run db:seed-admin
 *
 * Roles: superadmin | admin | viewer
 */
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDotEnv } from './load-dot-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

loadDotEnv(root);

console.log('[seed-admin] project root:', root);

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error('[seed-admin] DATABASE_URL is not set in .env or .env.local (project root).');
  process.exit(1);
}
console.log('[seed-admin] DATABASE_URL is set.');

const argvUser = process.argv[2];
const argvPass = process.argv[3];
const argvRole = process.argv[4];

const username = (argvUser || process.env.ADMIN_SEED_USERNAME || '').trim().toLowerCase();
const password = argvPass || process.env.ADMIN_SEED_PASSWORD || '';
const roleRaw = (argvRole || process.env.ADMIN_SEED_ROLE || 'superadmin').trim().toLowerCase();

const validRoles = ['superadmin', 'admin', 'viewer'];
if (!validRoles.includes(roleRaw)) {
  console.error(`Invalid role. Use one of: ${validRoles.join(', ')}`);
  process.exit(1);
}

if (!username || !password) {
  console.error('Usage: npm run db:seed-admin -- <username> <password> [role]');
  console.error('   Or: ADMIN_SEED_USERNAME, ADMIN_SEED_PASSWORD, ADMIN_SEED_ROLE in .env');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
let conn;
try {
  console.log('[seed-admin] connecting to MySQL…');
  conn = await mysql.createConnection({ uri: url, multipleStatements: false });
  await conn.query(
    `INSERT INTO admin_users (username, password_hash, role)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role)`,
    [username, hash, roleRaw],
  );
  const [check] = await conn.query(
    'SELECT username, role, LENGTH(password_hash) AS hash_len FROM admin_users WHERE username = ?',
    [username],
  );
  const row = check?.[0];
  console.log(
    `[seed-admin] OK: admin user "${username}" (${roleRaw}).`,
    row ? JSON.stringify(row) : '',
  );
} catch (e) {
  console.error('[seed-admin] FAILED:', e?.message || e);
  process.exit(1);
} finally {
  if (conn) await conn.end();
}
console.log('[seed-admin] done.');
