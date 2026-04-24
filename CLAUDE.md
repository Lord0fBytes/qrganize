# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QRganize is a hierarchical location and item tracking PWA built with Next.js 15. Users organize items across nested locations (e.g., House > Room > Shelf > Box), with QR codes enabling instant navigation and offline support.

**Tech Stack**: Next.js 15 (App Router), TypeScript, Supabase (PostgreSQL + Auth), Tailwind CSS, Serwist (PWA)

## Development Commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## Core Architecture

### Data Model & Routing

**Slug-based routing**: Both locations and items use human-readable slugs (e.g., `/location/kitchen-drawer`, `/item/screwdriver-set`) instead of UUIDs for better UX. The `[slug]` dynamic route at `src/app/[slug]/page.tsx` handles legacy QR code redirects when enabled in user settings.

**Database**: Two main tables with RLS policies:
- `locations`: Self-referencing hierarchy via `parent_id`. Each location can contain child locations and items.
- `items`: Belong to one location via `location_id` (nullable). Include quantity tracking.

Both tables require `slug` (unique per user, auto-generated from name) and `user_id` columns. See `supabase/schema.sql` for complete schema.

### Slug System

Slugs are URL-safe identifiers generated from names:
- Generated in server actions via `src/lib/slugify.ts::generateSlug()`
- Uniqueness enforced by appending numeric suffixes (`-1`, `-2`, etc.)
- Custom slugs can be provided via optional `slug` form field
- Validation rules: lowercase, alphanumeric + hyphens only, no leading/trailing hyphens

### Server Actions Pattern

All database operations use Next.js Server Actions in `src/app/actions/`:
- `locations.ts`: CRUD + `getLocationPath()` for breadcrumb navigation
- `items.ts`: CRUD with location relationship management
- `auth.ts`: Supabase authentication flows
- `search.ts`: Full-text search across items and locations
- `settings.ts`: User preferences (theme, legacy QR behavior)

Actions handle:
1. User authentication via `createClient()` from `@/lib/supabase/server`
2. RLS-protected queries
3. Slug generation/uniqueness checks
4. Cache invalidation via `revalidatePath()`
5. Redirects after mutations

### Supabase Client Patterns

**Server Components/Actions**: Use `src/lib/supabase/server.ts::createClient()` which handles cookie-based session management via Next.js `cookies()`.

**Client Components**: Use `src/lib/supabase/client.ts::createClient()` for browser-side operations (rare, as most data fetching happens server-side).

**Middleware**: `src/middleware.ts` refreshes Supabase sessions on every request via `src/lib/supabase/middleware.ts::updateSession()`.

### PWA Configuration

- Service worker: `src/app/sw.ts` (compiled to `public/sw.js` by Serwist)
- Manifest: `src/app/manifest.ts` (dynamic route)
- Config: `next.config.ts` with Serwist wrapper (disabled in development)
- Registration: Client-side via `src/components/ServiceWorkerRegister.tsx`
- Install prompt: `src/components/InstallPrompt.tsx` handles browser install UI

### QR Code System

**Generation**: Server-side via `qrcode` library in components (`src/components/QRCodeDisplay.tsx`)
**Scanning**: Client-side via `html5-qrcode` library (`src/components/QRScanner.tsx` on `/scan` page)
**URL Format**: Modern QRs use `/location/{slug}` or `/item/{slug}`. Legacy QRs without prefix redirect via `src/app/[slug]/page.tsx` based on user's `legacy_qr_target` setting (items/locations).

## File Structure Conventions

```
src/
├── app/
│   ├── actions/          # Server Actions for data mutations
│   ├── [slug]/           # Legacy QR redirect handler
│   ├── location/[slug]/  # Location detail + edit pages
│   ├── locations/        # Location list + new form
│   ├── item/[slug]/      # Item detail + edit pages
│   ├── items/            # Item list + new form
│   ├── scan/             # QR scanner page
│   ├── search/           # Search interface
│   ├── settings/         # User settings
│   └── (auth pages)/     # login, signup
├── components/           # React components (client/server)
└── lib/
    ├── supabase/         # Supabase client factories
    ├── slugify.ts        # Slug generation utilities
    └── utils.ts          # Tailwind class merging (cn)
```

## Key Implementation Details

**Path Imports**: Use `@/*` alias for absolute imports (e.g., `@/lib/supabase/server`)

**Cache Invalidation**: After mutations, revalidate affected paths:
- Always: List pages (`/locations`, `/items`)
- Conditionally: Parent location pages when adding/removing children
- New slug: Updated detail page after edit

**Form Handling**: Forms use `action` prop with server actions directly (no client state). FormData extraction in server actions.

**Authentication Flow**: Supabase handles sessions via cookies. Middleware refreshes on every request. Unauthenticated users redirect to `/login` in server actions.

**Dark Mode**: Managed via user settings stored in Supabase (`settings` table), applied via Tailwind dark mode classes.

## Database Setup

1. Create Supabase project
2. Run `supabase/schema.sql` in SQL Editor
3. Copy `.env.local.example` to `.env.local` with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

RLS policies automatically enforce user data isolation.
