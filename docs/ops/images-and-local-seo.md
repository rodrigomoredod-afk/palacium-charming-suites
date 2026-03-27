# Images and Local SEO Guide

Last updated: 2026-03-27

## Quick Answers

### Do images have to be WebP?

- No, but WebP (or AVIF) is strongly recommended for performance.
- Best practice:
  - Serve modern formats (`.webp` or `.avif`)
  - Keep JPEG fallback when needed
  - Use responsive image sizes instead of one large file

### Should images live on Drive or another online folder?

- Images must be publicly accessible from your website.
- Avoid Google Drive links for production image delivery.
- Better options:
  - Store in site assets (if manageable volume), or
  - Use a proper image hosting/CDN service (Cloudinary, ImageKit, Vercel Blob, S3 + CDN).

### Will images help people find the property online?

- Yes, but through image SEO + local SEO, not only by file hosting location.
- Ranking/discovery is improved by:
  - Fast-loading pages
  - Descriptive image metadata
  - Local business profile and structured data

## Practical Launch Checklist

## 1) Performance and formats

- Prefer `webp` (and optional `avif`) for primary delivery.
- Keep source masters offline (high quality originals), publish optimized variants.
- Suggested max widths:
  - Hero: 1920px
  - Section images: 1200-1600px
  - Thumbnails/cards: 600-900px
- Compress aggressively while preserving visual quality.

## 2) Naming and metadata

- Use descriptive file names with location and intent, e.g.:
  - `suite-deluxe-205-palacium-figueiro.webp`
  - `palacium-breakfast-room-figueiro.webp`
- Write descriptive `alt` text for every meaningful image.
- Keep captions consistent with suite names and amenities.

## 3) Technical SEO signals

- Add/maintain structured data (`LodgingBusiness` / `LocalBusiness`).
- Ensure each suite page/section has clear:
  - title
  - meta description
  - localized copy (PT/EN)
- Keep canonical URLs stable.

## 4) Local discovery (critical)

- Keep Google Business Profile complete and updated:
  - category, description, phone, address, hours
  - fresh photos that match website suites and spaces
- Ensure NAP consistency everywhere:
  - Name, Address, Phone match site and business listings.

## 5) Content strategy for better visibility

- Publish suite-specific content with unique photos and details.
- Include nearby attractions and practical travel context.
- Keep PT and EN versions equally complete to avoid thin pages.

## Recommended Workflow

1. Collect high-quality originals (organized by suite/space).
2. Export optimized website variants (`webp`, optional `avif`, fallback jpg).
3. Upload to repo assets or CDN.
4. Update image `alt` text and labels in PT/EN.
5. Validate Lighthouse performance + manual visual check.
6. Publish and update Google Business Profile photos.

## Notes for Future Expansion

- When more suite photos/details are ready:
  - prioritize unique hero + bathroom + detail + view per suite
  - maintain consistent naming pattern
  - update this guide with final image pipeline decisions (local assets vs CDN)
