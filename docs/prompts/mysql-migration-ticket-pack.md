# MySQL migration — ticket pack & agent handoff

**Purpose:** Single source of truth for migrating Palacium Charming Suites from **browser `localStorage` + optional Supabase reservation ingest** to **MySQL as canonical store**, with server APIs and a safe rollout path.

**How to use:** Execute tickets **in order**. After each ticket: `npm run typecheck`, `npm run build`, and smoke-test Área Reservada + booking flow if touched.

---

## 1. Current architecture (baseline)

### 1.1 Client state — `contexts/DataContext.tsx`

All of the following sync to **`localStorage`** on change (per browser, not shared across users or devices).

| Key | Version | Contents | TypeScript |
|-----|---------|----------|------------|
| `palacium_suites_data_v2` | v2 | Full `Suite[]` (price + image overrides, etc.) | `Suite` in `types.ts` |
| `palacium_reviews_data_v1` | v1 | `Review[]` | `types.ts` |
| `palacium_reservations_v1` | v1 | `Reservation[]` | `types.ts` |
| `palacium_booking_score_v1` | v1 | Single number 0–10 | `bookingDisplayScore` |
| `palacium_site_content_v1` | v1 | `SiteContent` JSON | `hero` PT/EN, `heroSlideshowOverride` |

**Merge helper:** `mergeSiteContent()` in `DataContext.tsx` — preserve when adding DB-backed loads (defaults + overrides).

### 1.2 Admin auth — `lib/auth.ts` + `api/admin-login.ts`

- Credentials: **`ADMIN_USERS_JSON`** env (server-only). Not in DB today.
- Client keeps **`palacium_admin_session_v1`** in `localStorage` (username + role + TTL); this is **not** a signed server session yet.

### 1.3 Reservations API — `api/reservations.ts` + `lib/submitReservationRemote.ts`

- If `VITE_ENABLE_RESERVATION_API=true`, the client POSTs completed reservations to **`/api/reservations`**.
- Server inserts into **Supabase** table `reservations` (snake_case columns) when `SUPABASE_*` is set; **email** via Resend is optional.
- **Important:** Admin-created reservations and offline usage still rely on **localStorage** as source of truth in the SPA. Supabase is only a **copy on submit**, not a full sync.

**MySQL migration implication:** Replace Supabase insert with MySQL (or dual-write during cutover), then remove Supabase deps from this path when stable.

### 1.4 Static / build-time content (not in localStorage)

- Suite catalog **defaults:** `constants.tsx` (`SUITES`, etc.).
- Hero slideshow **defaults:** `images.ts` (`heroSlideshow`).
- Suite detail drawer copy: `suiteDetails.ts` (file-based; optional future DB for i18n).

---

## 2. Target architecture (MySQL)

### 2.1 Principles

- **MySQL is canonical** for: reservations, reviews, suite overrides, site content, booking score, and (optionally) admin users.
- **Serverless note:** Vercel functions should use a **pooled** connection (e.g. `@vercel/kv` is unrelated; use **`mysql2`** with a **connection pool** singleton, or a managed HTTP proxy to MySQL). Document chosen provider (PlanetScale serverless driver, RDS Proxy, etc.).
- **Never** expose DB credentials to the client; only `VITE_*` for public API base URLs if needed.

### 2.2 Proposed tables (sketch — adjust types to match `types.ts`)

Use UTF8MB4 everywhere.

**`suites`**

- `id` VARCHAR PK — matches existing suite ids (`101`, `102`, …).
- `name`, `image`, `description`, `area` TEXT/VARCHAR
- `adults` INT, `price` DECIMAL(10,2) or INT cents (match app)
- `updated_at` TIMESTAMP

**`reviews`**

- `id` VARCHAR PK (or CHAR(36) UUID)
- `author`, `nationality`, `comment`, `date` TEXT/VARCHAR
- `rating` TINYINT
- `created_at` TIMESTAMP

**`reservations`**

- Align columns with `api/reservations.ts` insert + `types.ts` `Reservation`.
- Store `suite_ids` / `suite_names` as JSON columns if MySQL ≥ 5.7, or separate join table `reservation_suites`.
- Include `updated_at`, indexes on `check_in`, `status`, `created_at`.

**`site_content`**

- Option A: single row `id = 1` with JSON columns `hero_pt`, `hero_en`, `hero_slideshow_override` (JSON array or NULL).
- Option B: normalized `locale` + `key` + `value` — more work, clearer for CMS later.

**`site_settings`**

- Key-value for scalar `booking_display_score` (or column on `site_content` row).

**`admin_users`** (when replacing `ADMIN_USERS_JSON`)

- `id`, `username` UNIQUE, `password_hash` (argon2/bcrypt), `role` ENUM, `created_at`.

**`sessions`** (when replacing client-only “session”)

- `id` / token hash, `user_id`, `expires_at`, optional `user_agent` / IP for audit.

### 2.3 API routes to add or replace (map to existing files)

| Domain | Today | Target |
|--------|-------|--------|
| Reservations POST | `api/reservations.ts` → Supabase | Same handler shape; persist to MySQL |
| Reservations list/patch (admin) | localStorage only | `GET/PATCH/DELETE` under `/api/admin/...` with auth |
| Suites CRUD / public read | localStorage | `GET /api/suites` public; admin mutates |
| Reviews | localStorage | `GET` public; admin `POST/DELETE` |
| Site content + score | localStorage | `GET` public; admin `PUT` partial |
| Admin login | `api/admin-login.ts` | Issue signed cookie or JWT after verifying DB user (or keep env users until ticket “admin seed”) |

---

## 3. Environment variables — migration matrix

| Variable | Role today | After MySQL |
|----------|------------|-------------|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Reservation insert | Remove or unused once MySQL writes |
| `DATABASE_URL` or `MYSQL_*` | — | **Add** — server only |
| `ADMIN_USERS_JSON` | Login | Replace with DB users when ready |
| `RESEND_*`, `RESEND_API_KEY`, `NOTIFY_EMAIL` | Email alerts | Keep |
| `RESERVATION_INGEST_SECRET` | Protect POST | Keep |
| `VITE_*` | Client | Minimize; API base URL only if split domain |

Update **`.env.example`** when wiring `DATABASE_URL` (or split host/user/pass/db).

---

## 4. Data backfill strategy

1. **Export script (browser):** Optional one-off page or console snippet to dump `localStorage` keys listed in §1.1 to JSON.
2. **Import script (Node):** Read JSON, `INSERT ... ON DUPLICATE KEY UPDATE` into MySQL.
3. **Conflict rules:** Prefer newer `updated_at` where applicable; for reservations, merge by `id` UUID.
4. **Cutover:** Enable “read from API” flag in frontend after backfill verified; keep localStorage as fallback behind a feature flag for one release if needed.

---

## 5. Ticket order (execution checklist)

Global rules: small PR-sized tickets; run **typecheck + build** after each; document new env vars in `.env.example` only (no secrets).

### Ticket 1 — MySQL foundation ✅ (implemented 2026-03-30)

- **Driver:** `mysql2` (promise API).
- **Pool:** `api/lib/db.ts` — singleton on `globalThis`, `connectionLimit` from `DATABASE_POOL_LIMIT` (default 5, cap 10).
- **SSL:** Optional `DATABASE_SSL=true` / `1` or hints in URL; `DATABASE_SSL_REJECT_UNAUTHORIZED` (default reject untrusted certs).
- **Env:** See `.env.example` (`DATABASE_URL`, pool, SSL, `DATABASE_HEALTH_SECRET`).
- **Health:** `GET /api/health/db` — `{ ok: true }` on success; `503` + `not_configured` if no `DATABASE_URL`; `503` + `db_unreachable` on query failure; optional `403` if `DATABASE_HEALTH_SECRET` is set and request lacks Bearer / `X-Health-Secret`.

### Ticket 2 — Schema and migrations ✅ (implemented 2026-03-30)

- **Approach:** versioned SQL in `db/migrations/` + `npm run db:migrate` (`scripts/db-migrate.mjs`, tracks `schema_migrations`).
- **Initial file:** `db/migrations/001_initial_schema.sql` — `suites`, `reviews` (column `review_date` maps to `Review.date` in app), `reservations` (JSON `suite_ids` / `suite_names`), `site_content` (singleton `id=1`, JSON hero PT/EN + slideshow), `site_settings`, `admin_users`, `admin_sessions`.
- **Note:** `reviews.review_date` is the display string; map in repositories when wiring the API.

### Ticket 3 — Secure admin seed ✅ (2026-03-30)

- **`npm run db:seed-admin`** — `scripts/seed-admin.mjs`, bcrypt hash, `INSERT ... ON DUPLICATE KEY UPDATE` on `admin_users`.
- Args: `npm run db:seed-admin -- <username> <password> [role]` or env `ADMIN_SEED_*`.
- Rotate password by re-running seed for the same username.

### Ticket 4 — Server auth service ✅ (2026-03-30)

- **`api/lib/adminDbAuth.ts`** — `authenticateAdminFromDb`, `adminUsernameExistsInDb`, `hasAnyAdminUser`.
- **`api/admin-login.ts`** — if `DATABASE_URL` set: DB user takes precedence when a row exists (no JSON fallback on wrong DB password). `ADMIN_USERS_JSON` still works when no DB row for that username.
- **503** when neither `DATABASE_URL` nor `ADMIN_USERS_JSON`; or DB URL set but **no** `admin_users` rows and empty JSON.

### Ticket 5 — DB-backed sessions ✅ (partial, 2026-03-30)

- **`api/lib/sessionJwt.ts`** — HS256 JWT when **`SESSION_SECRET`** (≥16 chars) is set.
- Login response may include **`token`**; HTTP-only cookies deferred to a later hardening pass.

### Ticket 6 — Frontend session integration ✅ (partial, 2026-03-30)

- **`lib/auth.ts`** — `saveAuthSession(user, token?)`, `readAuthToken()`, `getAuthHeaders()` for future admin APIs.
- **`AdminPanel`** — passes through `token` when returned.

### Ticket 7 — Reservations DB canonical ✅ (partial, 2026-03-30)

- **`api/lib/reservationsMysql.ts`** — inserts into `reservations`; **idempotent** `ON DUPLICATE KEY UPDATE` on duplicate `id`.
- **`api/reservations.ts`** — prefers MySQL when `DATABASE_URL` is set; falls back to **Supabase** if MySQL insert did not store; email unchanged.
- **Pending:** GET/PATCH admin routes, full removal of Supabase (ticket 11 / cleanup).

### Ticket 8 — Suites, reviews, site content API ✅ (implemented 2026-03-30)

- **Public:** `GET /api/site-data` — merged suites, reviews, site content, booking score when `DATABASE_URL` is set (`503` + `not_configured` otherwise).
- **Admin (Bearer JWT + `SESSION_SECRET` ≥16; roles `admin` / `superadmin`):**
  - `PATCH /api/admin/suites` — body `{ id, price?, image?, name?, … }` upserts `suites`.
  - `POST /api/admin/reviews` / `DELETE /api/admin/reviews?id=` — mutate `reviews`.
  - `PUT /api/admin/site-content` — partial hero PT/EN + optional `heroSlideshowOverride`.
  - `PUT /api/admin/booking-score` — body `{ score }`.
- **Client:** `VITE_ENABLE_SITE_DATA_API=true` → hydrate on load; writes sync when `SESSION_SECRET` issued a JWT at login (`lib/siteDataApi.ts`). Defaults live in `data/suites.ts`, `data/reviews.ts`, `data/siteContent.ts` (also used by API merge).
- **Pending:** admin reservations list API (ticket 7 follow-up), backfill script (ticket 9).

### Ticket 9 — Data backfill

- Run export/import per §4; verify counts and spot-check UI.

### Ticket 10 — Security hardening pass

- Rate limit admin login and reservation POST.
- CORS, CSRF for cookie-based admin if applicable.
- Audit logs for admin mutations (optional table `audit_log`).

### Ticket 11 — QA and rollout

- Staging with production-like MySQL.
- Remove dead Supabase code paths and env vars from docs.
- Update `docs/ops/security-and-env.md` with MySQL notes.

---

## 6. File reference (quick find)

| Area | Path |
|------|------|
| SPA data layer | `contexts/DataContext.tsx` |
| Types | `types.ts` |
| Defaults | `constants.tsx`, `images.ts` |
| Admin UI | `components/AdminPanel.tsx` |
| Admin calendário sazonal (localStorage) | `components/AdminPricingCalendar.tsx`, `lib/suitePricing.ts`, `palacium_suite_price_rules_v1` |
| Admin login API | `api/admin-login.ts` |
| Reservation ingest | `api/reservations.ts` |
| Client reservation POST | `lib/submitReservationRemote.ts` |
| Auth client | `lib/auth.ts` |
| MySQL pool (serverless) | `api/lib/db.ts` |
| DB health | `api/health/db.ts` |
| SQL migrations | `db/migrations/*.sql`, `npm run db:migrate` |
| Admin DB auth | `api/lib/adminDbAuth.ts` |
| Admin JWT | `api/lib/sessionJwt.ts` |
| Reservations → MySQL | `api/lib/reservationsMysql.ts` |
| Seed admin | `npm run db:seed-admin`, `scripts/seed-admin.mjs` |
| Env loader (scripts) | `scripts/load-dot-env.mjs` |

---

## 7. Agent bootstrap prompt (paste at start of migration sprint)

```
Continue from docs/prompts/mysql-migration-ticket-pack.md (sections 1–5).
Implement the next unchecked ticket in section 5 only; do not expand scope.
Preserve existing public UX and TypeScript types unless the ticket requires API shape changes.
After changes: npm run typecheck && npm run build.
List changed files, new env vars for .env.example, and what remains for the next ticket.
```

---

## 8. Open decisions (fill before coding)

- [ ] MySQL host (managed service name + connection limits for serverless).
- [ ] ORM vs raw SQL (team preference).
- [ ] Single-region vs failover requirements.
- [ ] Retire Supabase in same release as MySQL or dual-write for one deploy.

---

*Last expanded: 2026-03-31 — see `docs/runbooks/session-handoff.md` for local dev, tarifário sazonal, editar reservas, sugestão de totais.*
