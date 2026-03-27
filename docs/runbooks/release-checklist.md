# Release Checklist

## Before Release

- [ ] Pull latest branch and review changed files
- [ ] Confirm `.env` values in deployment platform
- [ ] Run `npm run build`
- [ ] Smoke test: homepage, language switch, reservation submit, admin login

## Admin Smoke Test

- [ ] Login as admin
- [ ] Update one content field
- [ ] Create manual reservation
- [ ] Change reservation status
- [ ] Logout and re-login

## After Release

- [ ] Validate production form submissions
- [ ] Confirm notification email delivery
- [ ] Check browser console for runtime errors
- [ ] Record release notes in `docs/ops/`
