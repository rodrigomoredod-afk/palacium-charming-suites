# Security and Environment Notes

## Rules

- Never commit real secrets.
- Store secrets in local `.env` and hosting secret manager.
- Frontend variables must start with `VITE_`.
- Server-only secrets must never use `VITE_`.

## Current Auth Approach

- Admin login is validated server-side (`api/admin-login.ts`).
- Credentials come from `ADMIN_USERS_JSON` in environment variables.
- Frontend stores short-lived session metadata only.

## When to Move to Database Auth

Move to MySQL/Supabase auth when you need:
- password reset,
- user lifecycle management,
- audit trails and stronger policy control.

## Pre-Deploy Checklist

- [ ] Production env variables set
- [ ] `ADMIN_USERS_JSON` uses strong passwords
- [ ] Reservation ingest secret set (if used)
- [ ] Build passes
