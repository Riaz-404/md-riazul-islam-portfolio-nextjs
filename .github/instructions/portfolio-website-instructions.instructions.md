---
applyTo: "**"
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

## Project Overview

Convert an existing HTML/CSS/JS portfolio to a modern Next.js application with dark/light mode toggle and admin panel for content management. Maintain all existing designs and content while adding new features.

## Tech Stack Requirements

- **Framework**: Next.js 15 (Server Side Generation/SSG)
- **Styling**: Tailwind CSS with custom theme
- **Components**: shadcn/ui
- **Animations**: @motion/react (NOT framer-motion)
- **Package Manager**: pnpm
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: TipTap editor with extensions
- **Theme Management**: next-themes
- **Fonts**: Work Sans, Roboto, Poppins

## Design System

### Colors

- **Background Dark**: #0b090a
- **Accent**: #e1a34c
- **Theme**: Custom dark/light mode toggle

### Typography

- Primary: Work Sans
- Secondary: Roboto
- Headings: Poppins

## Component Guidelines

### Server vs Client Components

- **Server Components**: Navigation, Hero, About sections (default)
- **Client Components**: Theme toggle, Admin panel, Rich text editor
- Use `"use client"` directive only when necessary

### Motion Components

- Use custom motion wrapper: `src/components/motion/motion-html-element.tsx`
- Import from `@motion/react`, not `framer-motion`
- Server-side compatible animations

### Theme System

- Use `next-themes` for theme management
- Custom CSS variables in `globals.css`
- Theme toggle in navigation

## Data Management

### Current Implementation

**Backend Data Storage**: Currently using **in-memory storage** in the API route (`src/app/api/about/route.ts`). This means:

- Data is stored in a JavaScript variable
- Data resets when the server restarts
- Not suitable for production

### Admin Panel Features

- Hidden route: `/admin` (not exposed in navigation)
- Rich text editor with TipTap
- React Hook Form with validation
- Tabbed interface for different content sections
- Real-time preview capabilities

### API Endpoints

- `GET /api/about` - Fetch about data
- `PUT /api/about` - Update about data

## Development Guidelines

### Code Style

- Use TypeScript for all files
- Implement proper error handling
- Follow Next.js app directory conventions
- Use server components by default
- Modular component architecture

### Performance

- Static Site Generation (SSG)
- Optimized images with Next.js Image component
- Efficient CSS with Tailwind
- Proper font optimization

### Security

- Admin panel not exposed in public navigation
- Input validation with Zod schemas
- Sanitized rich text content

## Database Integration (Future)

For production deployment, replace in-memory storage with:

- **MongoDB**: Document-based, good for flexible content
- **PostgreSQL**: Relational database with JSON support
- **Prisma**: Type-safe database client
- **Supabase**: Full-stack solution with real-time features

## Deployment Notes

### Build Configuration

- Next.js static export ready
- Optimized for Vercel deployment
- Environment variables for database connections
- Custom build scripts in package.json

### Environment Variables (Future)

```
DATABASE_URL=your_database_connection_string
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=your_domain
```

## Common Issues & Solutions

### TipTap SSR

- Use `immediatelyRender: false` in TipTap config
- Implement proper client-side hydration
- Handle server/client content mismatches

### Theme Hydration

- Use `next-themes` with proper suppression
- Implement loading states for theme-dependent content

### Motion Components

- Use custom wrapper for SSR compatibility
- Avoid framer-motion direct imports
