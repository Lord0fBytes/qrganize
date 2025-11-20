# QRganize

A smart location and item tracking application built with Next.js 15 and PWA capabilities.

## Features

- Hierarchical location tracking
- QR code generation and scanning
- Item management with location assignment
- Progressive Web App (installable on mobile/desktop)
- Offline support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Quick Start

1. Install dependencies: `npm install`
2. Create a Supabase project at [supabase.com](https://supabase.com)
3. Run the database schema from `supabase/schema.sql`
4. Copy `.env.local.example` to `.env.local` and add your Supabase credentials
5. Start dev server: `npm run dev`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── location/        # Location pages
│   ├── item/            # Item pages
│   └── scan/            # QR scanner page
├── components/          # React components
├── lib/                 # Utilities and helpers
└── types/               # TypeScript types
```

## Database Schema

### Location
- Self-referencing hierarchical structure
- Each location can contain child locations and items
- QR code for each location

### Item
- Belongs to one location
- Optional quantity tracking
- QR code for each item

## License

MIT
