# Client Handoff Cleanup Checklist

Use this checklist when preparing the owner-facing delivery repository.

## 1) Create a delivery branch/copy

- [ ] Create a dedicated branch for handoff cleanup.
- [ ] Confirm no in-progress dev work is mixed into handoff.

## 2) Remove internal-only assets

- [ ] Remove `.cursor/`
- [ ] Remove `docs/prompts/`
- [ ] Remove `docs/sales/` (unless intentionally shared)
- [ ] Remove any internal strategy/scratch notes

## 3) Keep owner-relevant documentation

- [ ] Keep deployment instructions
- [ ] Keep environment variable guide (`.env.example`)
- [ ] Keep admin usage/runbook docs
- [ ] Keep release checklist (if useful to owner)

## 4) Security and secrets pass

- [ ] Verify no real secrets are committed
- [ ] Verify credentials are environment-based
- [ ] Rotate temporary credentials before final handoff

## 5) Functional validation

- [ ] Run `npm run build`
- [ ] Smoke-test reservation flow
- [ ] Smoke-test admin login and key actions

## 6) Final delivery package

- [ ] Include a short `HANDOFF.md` with:
  - project overview
  - deploy steps
  - environment variables
  - support/maintenance contact
