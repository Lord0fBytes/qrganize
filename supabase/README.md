# Supabase Setup for QRganize

This directory contains the database schema and setup instructions for QRganize.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: QRganize
   - **Database Password**: (generate a strong password and save it)
   - **Region**: Choose closest to your location
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

### 2. Run the Database Schema

1. In your Supabase project, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the contents of `schema.sql` from this directory
4. Paste into the SQL editor
5. Click "Run" to execute the schema
6. You should see a success message

This will create:
- `locations` table (hierarchical location storage)
- `items` table (items that belong to locations)
- Row Level Security (RLS) policies (users can only see their own data)
- Indexes for performance
- Triggers for automatic timestamp updates

### 3. Get Your API Keys

1. In your Supabase project, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. Copy the following values:
   - **Project URL** (under "Configuration")
   - **anon public** key (under "Project API keys")

### 4. Configure Environment Variables

1. In your QRganize project root, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and paste your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: `.env.local` is already in `.gitignore` and will not be committed

### 5. Enable Email Authentication (Optional)

By default, Supabase uses email/password authentication.

1. Go to **Authentication** > **Providers**
2. Email provider should be enabled by default
3. Configure email templates if desired (Settings > Auth > Email Templates)

For development, you may want to disable email confirmation:
1. Go to **Authentication** > **Settings**
2. Disable "Enable email confirmations"

### 6. Test the Connection

After setting up, restart your Next.js dev server:
```bash
npm run dev
```

The app will be able to connect to Supabase once the client utilities are configured.

## Database Schema Overview

### Locations Table
- Hierarchical self-referencing structure
- Each location can have a parent location
- Each location can contain multiple child locations and items
- QR codes point to `/location/[id]`

### Items Table
- Each item belongs to one location (or none if location_id is null)
- Track name, description, and quantity
- QR codes point to `/item/[id]`

### Security
- Row Level Security (RLS) ensures users can only access their own data
- All tables require authentication
- User ID is automatically populated from the authenticated session

## Useful SQL Queries

### View all your locations
```sql
SELECT * FROM public.locations WHERE user_id = auth.uid();
```

### View all your items
```sql
SELECT * FROM public.items WHERE user_id = auth.uid();
```

### View root locations (no parent)
```sql
SELECT * FROM public.locations WHERE user_id = auth.uid() AND parent_id IS NULL;
```
