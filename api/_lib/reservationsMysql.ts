import { getMysqlPool, isDatabaseConfigured } from './db.js';

export type ReservationPayload = {
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

export async function insertReservationMysql(body: ReservationPayload): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  const pool = getMysqlPool();
  const suiteIdsJson = JSON.stringify(body.suiteIds);
  const suiteNamesJson = JSON.stringify(body.suiteNames);
  const updatedAt = new Date();
  await pool.query(
    `INSERT INTO reservations (
      id, source, status, check_in, check_out, guest_name, email, phone, adults, children_count,
      suite_ids, suite_names, nights, total_price, nif, notes, external_ref, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      guest_name = VALUES(guest_name),
      status = VALUES(status),
      notes = VALUES(notes),
      phone = VALUES(phone),
      email = VALUES(email),
      updated_at = VALUES(updated_at)`,
    [
      body.id,
      body.source,
      body.status,
      body.checkIn,
      body.checkOut,
      body.guestName,
      body.email ?? null,
      body.phone ?? null,
      body.adults,
      body.childrenCount,
      suiteIdsJson,
      suiteNamesJson,
      body.nights,
      body.totalPrice ?? null,
      body.nif ?? null,
      body.notes ?? null,
      body.externalRef ?? null,
      body.createdAt,
      updatedAt,
    ],
  );
  return true;
}
