# Visual QA Checklist (PT/EN)

Use this checklist to validate public pages visually in both locales before design freeze.

## Scope

- Public UI only (exclude admin panel).
- Devices:
  - Mobile: 390x844 (or similar)
  - Desktop: 1440x900 (or similar)
- Locales:
  - PT
  - EN

## Capture Rule

For each section/page below, capture:

- 1 screenshot in PT
- 1 screenshot in EN
- Name pattern: `qa-<page>-<section>-<locale>-<device>.png`

Example:

- `qa-home-hero-pt-mobile.png`
- `qa-home-hero-en-desktop.png`

## Global Checks (All Pages)

- Header behavior:
  - Transparent on top where intended.
  - Solid/white on scroll where intended.
  - Logo color and contrast remain legible.
- Locale switch:
  - PT/EN toggle updates text immediately.
  - No mixed-language labels in visible area.
- Typography:
  - No over-spaced uppercase labels on mobile.
  - CTA labels fit without awkward wrapping.
- Buttons:
  - Tap target size is comfortable on mobile.
  - Hover/focus states look intentional on desktop.
- Spacing:
  - No clipped text, overlaps, or broken line-height.
- Accessibility basics:
  - Skip link appears and text is localized.
  - Scroll-to-top button appears after scroll and is clickable.

## Home Page

### Hero

- Eyebrow/title/subtitle are localized.
- Booking bar labels are localized.
- Guest label switches PT/EN correctly.
- Sticky booking bar appears correctly on scroll.

### Introduction

- Feature labels are localized in EN.
- Button text localized.
- Image treatment consistent (overlay/contrast).

### Amenities

- Section title and score card localized.
- Amenity group titles/items localized in EN.
- Dietary highlight copy localized.

### Suites Gallery

- Card descriptions localized in EN.
- Price line and breakfast label localized.
- CTA labels fit and remain readable.

### Testimonials

- Header and helper labels localized.
- Nationalities and review dates display in EN correctly.
- Carousel navigation labels localized.

### Partners

- Title/subtitle localized.
- Category and helper text localized.

### Map

- Overlay title/body localized.
- Popup descriptions localized.
- Directions button localized (`Como Chegar` / `Directions`).

### Final CTA

- Heading/body/button localized.
- CTA spacing and readability good on mobile.

## Standalone Pages

### Suites Page

- Hero intro copy localized.
- Suite descriptions localized in EN.
- CTA texts localized and aligned.

### Experiences Page

- Hero and section labels localized.
- Nearby section labels localized.
- Distance units read naturally in EN.

### About Page

- Main copy and support labels localized.
- Quote remains readable and aligned.

### Gallery Page

- Heading/subheading localized.
- Grid overlays readable on mobile and desktop.

### History Page

- Hero, section labels, and CTA localized.
- Visual rhythm consistent with other pages.

## Booking Modal Flow (Critical)

Validate in PT and EN across all steps:

1. Dates & Guests
2. Suite Selection
3. Summary
4. Confirmation & Billing
5. Success state

Checks:

- Validation errors are localized.
- Step titles and helper copy are localized.
- Capacity and suggestion messages are localized.
- Cost summary labels are localized.
- Final confirmation screen is localized.
- CTAs remain readable on mobile (no excessive letter spacing).

## Sign-off Table

| Area | PT | EN | Notes |
|---|---|---|---|
| Home |  |  |  |
| Suites |  |  |  |
| Experiences |  |  |  |
| About |  |  |  |
| Gallery |  |  |  |
| History |  |  |  |
| Booking Modal |  |  |  |
| Global Header/Footer |  |  |  |

## Exit Criteria

- All rows in sign-off table marked pass in PT and EN.
- No mixed-language text in public UI.
- No visual regressions in header/scroll/CTA behavior.
