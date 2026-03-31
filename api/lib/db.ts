import mysql from 'mysql2/promise';

/**
 * Reuse one pool across warm serverless invocations (Vercel).
 * Do not import from client-side code.
 */
const globalForMysql = globalThis as unknown as { _palaciumMysqlPool?: mysql.Pool };

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getMysqlPool(): mysql.Pool {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!globalForMysql._palaciumMysqlPool) {
    const limitRaw = process.env.DATABASE_POOL_LIMIT;
    const connectionLimit = Math.min(
      10,
      Math.max(1, Number.parseInt(limitRaw || '5', 10) || 5),
    );
    const useSsl =
      process.env.DATABASE_SSL === '1' ||
      process.env.DATABASE_SSL === 'true' ||
      /\bssl-mode=REQUIRED\b/i.test(url) ||
      /\bsslmode=require\b/i.test(url);

    globalForMysql._palaciumMysqlPool = mysql.createPool({
      uri: url,
      waitForConnections: true,
      connectionLimit,
      queueLimit: 0,
      enableKeepAlive: true,
      ...(useSsl
        ? {
            ssl: {
              rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
            },
          }
        : {}),
    });
  }
  return globalForMysql._palaciumMysqlPool;
}

/** Returns true if SELECT 1 succeeds. */
export async function pingMysql(): Promise<boolean> {
  const pool = getMysqlPool();
  const conn = await pool.getConnection();
  try {
    await conn.query('SELECT 1');
    return true;
  } finally {
    conn.release();
  }
}
