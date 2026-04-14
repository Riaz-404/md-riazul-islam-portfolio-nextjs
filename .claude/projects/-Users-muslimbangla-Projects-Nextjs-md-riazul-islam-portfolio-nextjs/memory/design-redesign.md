---
name: Premium Design Redesign
description: Full UI redesign completed — Vercel/Linear/Stripe aesthetic with Inter font and amber accent
type: project
---

Complete public-facing redesign completed 2026-04-15.

**Design system:**
- Font: Inter (replaces Work Sans + Roboto; Poppins kept for admin compat)
- Dark mode primary: `oklch(0.065 0 0)` background, `oklch(0.76 0.18 55)` amber primary
- Light mode: `oklch(0.99 0 0)` background, `oklch(0.65 0.17 55)` amber primary
- Utilities added: `.dot-grid`, `.mesh-bg`, `.glass`, `.gradient-text`, `.glow`
- Border radius: 0.75rem (12px), cards: 16px (rounded-2xl)

**Files redesigned (public only — admin untouched):**
- `src/app/globals.css` — new design tokens, premium utilities
- `src/app/layout.tsx` — Inter font
- `src/components/shared/navigation.tsx` — RI monogram, "Hire Me" CTA, mobile slide panel
- `src/components/hero-section/hero-section.tsx` — bold hero, status badge, stats, floating cards
- `src/components/hero-section/rotating-text.tsx` — vertical slide animation
- `src/components/about-section.tsx` — bio + skill tags by category
- `src/components/expertise-section.tsx` — refined skill bars with gradient fill
- `src/components/projects-section.tsx` — editorial section header
- `src/components/projects-client-section.tsx` — premium cards with hover overlay
- `src/components/blog-section.tsx` — clean section header
- `src/components/shared/blog-card.tsx` — premium card design
- `src/components/publications-section.tsx` — clean list with motion
- `src/components/contact-section.tsx` — two-column CTA + clean form with labels
- `src/components/shared/footer.tsx` — brand + nav + availability card

**Key patterns:**
- Server components: inline motion props (no function variants — causes prerender error)
- Bootstrap classes kept in globals.css for admin compat
- All new public components use pure Tailwind (no `.container-custom`, `.row`, etc.)

**Why:** User requested Vercel + Linear + Stripe aesthetic targeting recruiters/remote companies.
**How to apply:** Follow this design language for any future public-facing component additions.
