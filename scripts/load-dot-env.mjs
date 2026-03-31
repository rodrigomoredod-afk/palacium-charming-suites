import fs from 'fs';
import path from 'path';

/**
 * Load `.env` / `.env.local` from `projectRoot` (does not override existing `process.env`).
 * @param {string} projectRoot - Absolute path to repo root (folder with package.json)
 */
export function loadDotEnv(projectRoot) {
  for (const name of ['.env.local', '.env']) {
    const p = path.join(projectRoot, name);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}
