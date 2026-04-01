# Project Knowledge Base

This folder is the human-friendly source of truth for business, operations, and reusable prompts.

## Structure

- `docs/prompts/` - reusable execution prompts and ticket packs (MySQL migration: `mysql-migration-ticket-pack.md`).
- `docs/sales/` - proposals, pricing notes, and client message templates.
- `docs/ops/` - environment setup, deployment notes, and security decisions.
- `docs/runbooks/` - step-by-step procedures; **`session-handoff.md`** = resume context for new chats (dev commands, MySQL, admin login). **`laptop-and-vercel-access.md`** = clone, second machine, Vercel vs local Área Reservada.
- `docs/ops/images-and-local-seo.md` - image optimization and local discovery guidance.

## Editing Rules

- Keep files short and specific.
- Add dates when decisions change.
- Do not store secrets here.
- Reference real file paths when relevant.

## Agent-Friendly Notes

- Mirror active plans inside `.cursor/plans/`.
- Keep copy-paste task prompts in `.cursor/prompts/`.
- If a prompt becomes stable, copy it into `docs/prompts/`.
