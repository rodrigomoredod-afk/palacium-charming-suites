import type { Reservation } from '../types';

/**
 * Envia a reserva para a API (Vercel) → Supabase + e-mail.
 * Em `vite` local, `/api/*` não existe — falha em silêncio; o localStorage mantém a cópia.
 */
export async function submitReservationRemote(row: Reservation): Promise<{
  ok: boolean;
  stored?: boolean;
  emailed?: boolean;
}> {
  if (import.meta.env.VITE_ENABLE_RESERVATION_API !== 'true') {
    return { ok: false };
  }

  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const url = base ? `${base}/api/reservations` : '/api/reservations';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const secret = import.meta.env.VITE_RESERVATION_INGEST_SECRET;
  if (secret) {
    headers['X-Reservation-Secret'] = secret;
  }

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(row),
    });
    const data = (await r.json().catch(() => ({}))) as {
      ok?: boolean;
      stored?: boolean;
      emailed?: boolean;
    };
    return {
      ok: r.ok && data.ok !== false,
      stored: data.stored,
      emailed: data.emailed,
    };
  } catch {
    return { ok: false };
  }
}
