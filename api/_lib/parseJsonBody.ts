import type { VercelRequest } from '@vercel/node';

export function parseJsonBody(req: VercelRequest): unknown {
  let raw: unknown = req.body;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw) as unknown;
    } catch {
      return undefined;
    }
  }
  return raw;
}
