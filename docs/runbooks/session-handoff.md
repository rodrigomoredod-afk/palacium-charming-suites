# Session Handoff

Last updated: 2026-04-01 — Laptop/Vercel access runbook; deploy fixes (logo, api/_lib)

## Laptop, Vercel & Área Reservada

- **Second machine / laptop:** clone repo, `npm install`, copy `.env` from `.env.example` and fill secrets locally (never commit `.env`). See **`docs/runbooks/laptop-and-vercel-access.md`**.
- **Live site on any device:** same **Vercel** project = same URL and same env (`ADMIN_USERS_JSON`, optional `DATABASE_URL`). No separate “laptop Vercel config” for production — you only configure Vercel once.
- **Local Área Reservada:** `npm run dev:vercel` + local `.env` with `ADMIN_USERS_JSON` (and optional MySQL). If `DATABASE_URL` points at localhost but Docker is off, comment it out or use JSON-only login.

## Latest Sync Status

- **Git:** confirm with `git status` / `git log` before assuming pushed; user may have local commits.
- **Dev servers:**
  - **`npm run dev`** — Vite only, **no `/api`** (Área Reservada login will show “API not running” unless you use the other command).
  - **`npm run dev:vercel`** — site + **`/api`** (admin login, health, reservations). Default **http://localhost:3000/**
  - **Never** set `package.json` `"dev"` to `vercel dev` — Vercel invokes `npm run dev` and it **recurses** (CLI error).
- **MySQL migration:** In progress; see **`docs/prompts/mysql-migration-ticket-pack.md`**. Tickets **1–8** largely implemented (pool, migrations, seed, DB login, JWT optional, reservations → MySQL, **`GET /api/site-data`** + admin writes when `VITE_ENABLE_SITE_DATA_API` + `SESSION_SECRET` / JWT).
- **Área Reservada — Tarifas:**
  - Calendário sazonal: períodos com €/noite por intervalo; **edição em massa** (várias suites no mesmo período) em **`AdminPricingCalendar`**.
  - Regras em **`localStorage`** `palacium_suite_price_rules_v1`; **`DataContext`**: `suitePriceRules`, `addSuitePriceRule`, `deleteSuitePriceRule`; **`lib/suitePricing.ts`** (noites, preço efetivo, grelha).
  - **“Restaurar Originais”** nas Tarifas também limpa regras sazonais (confirm atualizado no UI).
- **Área Reservada — Reservas:**
  - **Sugestão de total** no formulário (e no modal de edição): suites + datas + tarifário sazonal; botão “Usar sugestão”; suites mostram preço base.
  - **Editar reserva:** ícone lápis na coluna Ações → modal (Esc / fundo / X); **`updateReservation`**. Perfil **viewer** não vê editar (só admin/superadmin como resto do painel).
  - Datas manual: **Entrada/Saída** com display **pt-PT** (dd/mm/yyyy) + input nativo invisível; blur após pick para evitar bloqueio no Chrome/Edge.
- **Auth / API:** inalterado face à ronda anterior — ver bullets anteriores em git para `admin-login`, `SESSION_SECRET`, etc.
- **Local tooling:** **`scripts/diagnose-env.cmd`**, **`npm run db:verify-admin`**. **Visual QA:** **`docs/runbooks/visual-qa-pt-en-checklist.md`**.
- **Deploy / assets:** Logo served from **`public/logo.svg`**; API helpers under **`api/_lib/`** (Vercel Hobby 12-function limit).

## Current Project Phase

- **Admin:** tarifário sazonal e reservas editáveis são **só cliente** (localStorage) exceto quando site data API está ligada para suites/conteúdo já descrito no ticket 8.
- **Backend:** reservas **gravadas na app** ainda sem `PATCH /api/admin/reservations` — edições ficam em `localStorage` até haver API (ticket pack / follow-up).
- **Público:** modal de reserva no site continua a usar preço **base** da suite; alinhar com tarifário sazonal é próximo passo opcional.

## What Was Completed (cumulative — highlights recentes)

- Suite details drawer, PT/EN, History, MySQL foundation, site-data API (tickets 1–8) — ver histórico em git.
- **2026-03-30:** `types.SuitePriceRule`, `lib/suitePricing.ts`, **`AdminPricingCalendar`**, sugestão de estadia em **Reservas**, integração `DataContext` + reset.
- **2026-03-31:** bulk de suites no calendário sazonal; **modal Editar reserva**; cópia da sugestão no modal; coluna **Ações**; handoff atualizado.

## Validation State

- **`npm run build`** / **`npm run typecheck`** — correr antes de merge.

## Important Decisions

- Keep **History** page; admin **PT-first**; **`dev`** ≠ `vercel dev` no `package.json`.
- Sazonalidade: **última regra guardada** (`updatedAt`) ganha em noites sobrepostas na mesma suite.

## Known Non-Blocking Notes

- Chunk Vite ~500kb: informativo.
- **`npm run dev:vercel`** pode precisar `npx vercel login` na primeira vez.

## Next Recommended Actions

1. **API (opcional):** persistir `SuitePriceRule` em MySQL + endpoints admin; ou export/import JSON.
2. **Site público:** usar `effectiveNightlyRate` / `computeSuggestedStayQuote` no **BookingModal** quando datas + suites escolhidas.
3. **Ticket 9+** (ticket pack): backfill `localStorage` → MySQL; retirar Supabase quando estável.
4. **Visual QA** e env **Vercel** como no handoff anterior.

## Quick Resume Prompt (paste in a new chat)

```
Continue from docs/runbooks/session-handoff.md (and mysql-migration-ticket-pack.md if backend).
Laptop/new PC: docs/runbooks/laptop-and-vercel-access.md — clone, .env from .env.example, never commit .env; Vercel env is shared for production on all devices.
Dev: npm run dev:vercel for /api; npm run dev is Vite-only.
Admin: Tarifas → calendário sazonal (bulk suites); Reservas → sugestão total + modal Editar.
Data: palacium_suite_price_rules_v1 in localStorage; site data API still VITE_ENABLE_SITE_DATA_API + SESSION_SECRET for MySQL writes.
Run npm run typecheck && npm run build after changes.
Next: optional MySQL for price rules, public booking seasonal rates, or ticket 9 backfill.
```
