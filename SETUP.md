# QRganize Setup Guide

This guide will walk you through setting up QRganize for development.

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier is fine)

## Step 1: Install Dependencies

Dependencies should already be installed, but if not:

```bash
npm install
```

## Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: QRganize
   - **Database Password**: Generate and save a strong password
   - **Region**: Choose the closest region to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

## Step 3: Set Up Database Schema

1. In your Supabase project dashboard, click **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Open the file `supabase/schema.sql` in this project
4. Copy the entire contents and paste into the SQL editor
5. Click **"Run"** to execute

This creates:
- `locations` table - for hierarchical location storage
- `items` table - for items in locations
- Row Level Security policies - users only see their own data
- Indexes and triggers - for performance and auto-updates

## Step 4: Get API Keys

1. In Supabase, go to **Project Settings** (gear icon)
2. Click **API** in the left menu
3. You'll need two values:
   - **Project URL** (under "Configuration")
   - **anon public** key (under "Project API keys")

## Step 5: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Save the file

## Step 6: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Test Authentication (Optional)

For development, you may want to disable email confirmation:

1. In Supabase, go to **Authentication** > **Providers**
2. Click on **Email**
3. Scroll down and toggle off **"Confirm email"**
4. Click **Save**

This allows you to sign up without needing to verify email during development.

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
├── lib/
│   └── supabase/            # Supabase client utilities
│       ├── client.ts        # Browser client
│       ├── server.ts        # Server component client
│       └── middleware.ts    # Auth middleware
├── types/
│   └── database.types.ts    # TypeScript types for database
└── middleware.ts            # Next.js middleware for auth

supabase/
├── schema.sql              # Database schema
└── README.md               # Supabase-specific docs
```

## Troubleshooting

### Environment variables not loading
- Make sure `.env.local` is in the root directory
- Restart the dev server after changing env vars
- Check that the file isn't named `.env.local.txt` or similar

### Database connection errors
- Verify your Supabase URL and anon key are correct
- Make sure you ran the schema.sql in your Supabase project
- Check that your Supabase project is active (not paused)

### Authentication issues
- Ensure Row Level Security is enabled (it is by default in schema.sql)
- Check that auth middleware is working (middleware.ts)
- Verify cookies are enabled in your browser

## Next Steps

Now that setup is complete, you can start building:
- Authentication pages (login/signup)
- Location management pages
- Item management pages
- QR code generation and scanning

See the main README.md for feature documentation.
