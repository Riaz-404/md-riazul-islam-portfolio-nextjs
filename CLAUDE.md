# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on port 5000 (Turbopack)
pnpm build        # Production build
pnpm lint         # ESLint (note: ESLint is ignored during builds)
pnpm db:init      # Initialize MongoDB with seed data via scripts/init-db.mjs
```

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_DATABASE_URL` — MongoDB connection string
- `NEXT_PUBLIC_JWT_SECRET` — Secret for JWT signing (admin auth)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `NEXT_PUBLIC_CLOUDINARY_API_SECRET` — Cloudinary image hosting

## Architecture Overview

This is a Next.js 15 portfolio site with a built-in CMS admin panel. Content is stored in MongoDB and images are hosted on Cloudinary.

### Data Flow

1. **Public pages** (`src/app/page.tsx`, `src/app/(pages)/projects/`) — Server components that fetch data via service functions in `src/lib/`. Pages use `export const revalidate = 3600` for ISR with manual revalidation via `/api/revalidate`.
2. **Service layer** (`src/lib/*-service.ts`) — Each domain (hero, about, expertise, navigation, projects) has its own service that calls the MongoDB models.
3. **Mongoose models** (`src/models/`) — Define schemas for `Hero`, `About`, `Navigation`, `Expertise`, `Project`, and `Admin` collections.
4. **API routes** (`src/app/api/`) — REST endpoints called by both the admin panel and the service layer.

### Admin Panel

- Located at `/admin` (protected by JWT cookie middleware in `middleware.ts`)
- Login at `/admin/login` — credentials stored in the `Admin` MongoDB collection
- Single-page client component (`src/app/admin/page.tsx`) with tab-based sections for managing all portfolio content
- Admin sections live in `src/components/admin/`; form schemas are in `src/components/admin/schemas.ts`
- Cache can be manually purged via the Admin tab → triggers `POST /api/revalidate`

### Authentication

- Custom JWT auth using `jose` (not NextAuth for admin — `next-auth` is installed but admin uses a cookie-based JWT approach)
- `AuthService` in `src/lib/auth-service.ts` handles password hashing (bcryptjs) and token generation
- Middleware (`middleware.ts`) protects all `/admin/*` routes except `/admin/login`
- Token stored in `admin-token` cookie, expires in 24h

### Image Handling

- Images are uploaded to Cloudinary via `POST /api/upload`
- `CloudinaryService` (`src/lib/cloudinary-service.ts`) handles upload/delete
- Projects support `mainImage`, `fullPageImage`, and `additionalImages[]` (all stored as `{filename, contentType, url, publicId}`)
- `next.config.ts` whitelists `res.cloudinary.com` and other external image hosts

### UI Stack

- **shadcn/ui** components in `src/components/ui/` (configured via `components.json`)
- **Tailwind CSS v4** with `tw-animate-css`
- **motion/react** for animations (not framer-motion)
- **Lexical** for rich text editing in the admin panel (`src/components/ui/rich-text-editor.tsx`)
- **@dnd-kit** for drag-and-drop reordering in admin lists

### Key Conventions

- Path alias `@/` maps to `src/`
- Database connection is cached in a module-level variable in `src/databases/db-connection.js` (JS, not TS)
- Each MongoDB model follows the pattern: check `models.ModelName` before calling `model()` to avoid Next.js hot-reload duplicate registration
- Project slugs are auto-generated from titles via a Mongoose pre-save hook
