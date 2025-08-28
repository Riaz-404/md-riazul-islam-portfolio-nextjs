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
