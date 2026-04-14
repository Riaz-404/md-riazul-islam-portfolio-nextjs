---
name: Portfolio Project Overview
description: Core architecture facts about the Riazul Islam portfolio site
type: project
---

Next.js 15 personal portfolio + CMS for Md. Riazul Islam (GitHub: Riaz-404).

**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, MongoDB/Mongoose, Cloudinary, Formspree, shadcn/ui, motion/react (not framer-motion), @dnd-kit, Lexical editor, Jose JWT.

**Key paths:**
- Public pages: `src/app/page.tsx`, `src/app/(pages)/`
- Services: `src/lib/*-service.ts`
- Models: `src/models/`
- Admin: `src/app/admin/` (JWT-protected, NOT to be modified)
- Shared components: `src/components/shared/`
- Motion wrappers: `src/components/motion/motion-html-element.tsx`

**Why:** Portfolio targeting recruiters, remote companies, freelance clients, startup founders.

**How to apply:** Keep admin components untouched. Public components use pure Tailwind (no Bootstrap classes in new code). Server components fetch data directly from services (not HTTP). Use `motion/react` not `framer-motion`.
