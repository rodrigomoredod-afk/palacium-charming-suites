import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

type Payload = {
  id: string;
  source: string;
  status: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  email?: string;
  phone?: string;
  adults: number;
  childrenCount: number;
  suiteIds: string[];
  suiteNames: string[];
  nights: number;
  totalPrice?: number;
  nif?: string;
  notes?: string;
  externalRef?: string;
  createdAt: string;
};

function isValidPayload(b: unknown): b is Payload {
  if (!b || typeof b !== 'object') return false;
  const o = b as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.source === 'string' &&
    typeof o.status === 'string' &&
    typeof o.checkIn === 'string' &&
    typeof o.checkOut === 'string' &&
    typeof o.guestName === 'string' &&
    typeof o.adults === 'number' &&
    typeof o.childrenCount === 'number' &&
    Array.isArray(o.suiteIds) &&
    Array.isArray(o.suiteNames) &&
    typeof o.nights === 'number' &&
    typeof o.createdAt === 'string'
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const secret = process.env.RESERVATION_INGEST_SECRET;
  if (secret) {
    const sent = req.headers['x-reservation-secret'];
    if (sent !== secret) {
      res.status(401).json({ ok: false, error: 'Unauthorized' });
      return;
    }
  }

  let bodyRaw: unknown = req.body;
  if (typeof bodyRaw === 'string') {
    try {
      bodyRaw = JSON.parse(bodyRaw) as unknown;
    } catch {
      res.status(400).json({ ok: false, error: 'Invalid JSON' });
      return;
    }
  }
  if (!isValidPayload(bodyRaw)) {
    res.status(400).json({ ok: false, error: 'Invalid payload' });
    return;
  }
  const body = bodyRaw;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.NOTIFY_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'Palacium Reservas <onboarding@resend.dev>';

  const dbConfigured = !!(supabaseUrl && supabaseKey);
  const emailConfigured = !!(resendKey && notifyTo);

  if (!dbConfigured && !emailConfigured) {
    res.status(503).json({
      ok: false,
      error: 'Configura SUPABASE_* e/ou RESEND_API_KEY + NOTIFY_EMAIL.',
      stored: false,
      emailed: false,
    });
    return;
  }

  let stored = false;
  let emailed = false;

  if (dbConfigured) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('reservations').insert({
        id: body.id,
        source: body.source,
        status: body.status,
        check_in: body.checkIn,
        check_out: body.checkOut,
        guest_name: body.guestName,
        email: body.email ?? null,
        phone: body.phone ?? null,
        adults: body.adults,
        children_count: body.childrenCount,
        suite_ids: body.suiteIds,
        suite_names: body.suiteNames,
        nights: body.nights,
        total_price: body.totalPrice ?? null,
        nif: body.nif ?? null,
        notes: body.notes ?? null,
        external_ref: body.externalRef ?? null,
        created_at: body.createdAt,
      });
      if (!error) stored = true;
      else console.error('[reservations] Supabase insert:', error.message);
    } catch (e) {
      console.error('[reservations] Supabase:', e);
    }
  }

  if (emailConfigured) {
    try {
      const resend = new Resend(resendKey);
      const lines = [
        `<p><strong>Nova reserva</strong> (${body.source})</p>`,
        `<p><strong>Hóspede:</strong> ${escapeHtml(body.guestName)}</p>`,
        `<p><strong>Check-in / Check-out:</strong> ${escapeHtml(body.checkIn)} → ${escapeHtml(body.checkOut)} (${body.nights} noites)</p>`,
        `<p><strong>Suites:</strong> ${escapeHtml(body.suiteNames.join(', '))}</p>`,
        `<p><strong>Adultos / Crianças:</strong> ${body.adults} / ${body.childrenCount}</p>`,
        body.email ? `<p><strong>E-mail:</strong> ${escapeHtml(body.email)}</p>` : '',
        body.phone ? `<p><strong>Telefone:</strong> ${escapeHtml(body.phone)}</p>` : '',
        body.totalPrice != null ? `<p><strong>Total indicado:</strong> €${body.totalPrice}</p>` : '',
        body.externalRef ? `<p><strong>Ref. externa:</strong> ${escapeHtml(body.externalRef)}</p>` : '',
        body.notes ? `<p><strong>Notas:</strong> ${escapeHtml(body.notes)}</p>` : '',
        `<p style="color:#888;font-size:12px">ID: ${escapeHtml(body.id)}</p>`,
      ]
        .filter(Boolean)
        .join('');

      await resend.emails.send({
        from: fromEmail,
        to: notifyTo,
        subject: `[Palacium] Nova reserva — ${body.guestName}`,
        html: `<div style="font-family:Georgia,serif;line-height:1.6">${lines}</div>`,
      });
      emailed = true;
    } catch (e) {
      console.error('[reservations] Resend:', e);
    }
  }

  res.status(200).json({ ok: true, stored, emailed });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
