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

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

```bash
npm install
```

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
