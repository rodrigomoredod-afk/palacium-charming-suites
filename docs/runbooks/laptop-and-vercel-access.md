# Laptop setup & Área Reservada (Vercel vs local)

Use this on a **second machine** (laptop) or after a fresh clone. Keep secrets out of git — use `.env` locally and **Vercel → Settings → Environment Variables** for production.

## 1. Clone and install (any computer)

```bash
git clone https://github.com/rodrigomoredod-afk/palacium-charming-suites.git
cd palacium-charming-suites
npm install
```

Copy env template and fill in **your** values (never commit `.env`):

```bash
cp .env.example .env
```

## 2. Área Reservada on the **live Vercel site** (desktop, laptop, phone)

**Yes — you use the same Vercel project configuration everywhere.** The deployed URL is one app; credentials come from **Vercel environment variables**, not from your laptop.

- Set **`ADMIN_USERS_JSON`** in Vercel (Production + Preview if you use previews) with your admin user JSON (one line, valid JSON).
- If production uses **MySQL** (`DATABASE_URL` on Vercel), login checks the database first for that username; then JSON may apply for users without a DB row. Match whatever you configured in Vercel.
- Open the **same production URL** on any device → **Área Reservada** uses that deployment’s env. No extra “laptop config” for the live site.

After changing env vars on Vercel, **redeploy** so functions pick them up.

## 3. Área Reservada **locally** on the laptop

Local dev needs a **local `.env`** (not synced by git):

- **`npm run dev:vercel`** — site + `/api` (admin login, reservations, etc.). Often `http://localhost:3000/`
- **`npm run dev`** — Vite only, **no** `/api` → login will show API unavailable.

Minimum for JSON-only admin login locally:

- `ADMIN_USERS_JSON=[{"username":"admin","password":"YOUR_STRONG_PASSWORD","role":"superadmin"}]`

If **`DATABASE_URL`** is set in `.env` but MySQL is not running, login can fail; either start MySQL + seed admin, or **comment out** `DATABASE_URL` to use JSON-only locally.

First time on a machine you may need:

```bash
npx vercel login
npx vercel link
```

## 4. Keep this repo in sync between desktop and laptop

- **Code:** `git pull` / `git push` — never commit `.env`.
- **Secrets:** copy the same logical values into each machine’s `.env` and into Vercel manually (or use a password manager note), not the repo.

## 5. Where to find more context

| Doc | Purpose |
|-----|--------|
| `docs/runbooks/session-handoff.md` | Full project resume, dev commands, admin features |
| `docs/runbooks/visual-qa-pt-en-checklist.md` | Public PT/EN visual QA |
| `docs/prompts/mysql-migration-ticket-pack.md` | MySQL / API tickets |
| `.env.example` | All env keys explained (no real secrets) |

## 6. Portfolio / other projects

Case study copy and Cursor prompts for your **portfolio** repo live outside this project; use your portfolio’s own handoff file (e.g. `docs/runbooks/case-study-handoff.md`) there. This file is only for **Palacium** deployment and multi-machine dev.
