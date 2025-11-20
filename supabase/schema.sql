-- QRganize Database Schema
-- This schema creates the core tables for hierarchical location and item tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- LOCATIONS TABLE
-- ============================================================================
-- Self-referencing table for hierarchical location structure
-- Example: House > Room > Shelf > Box

CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON public.locations(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON public.locations(parent_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own locations
CREATE POLICY "Users can view own locations" ON public.locations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own locations
CREATE POLICY "Users can insert own locations" ON public.locations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own locations
CREATE POLICY "Users can update own locations" ON public.locations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own locations
CREATE POLICY "Users can delete own locations" ON public.locations
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- ITEMS TABLE
-- ============================================================================
-- Items that belong to locations

CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_location_id ON public.items(location_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own items
CREATE POLICY "Users can view own items" ON public.items
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own items
CREATE POLICY "Users can insert own items" ON public.items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own items
CREATE POLICY "Users can update own items" ON public.items
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own items
CREATE POLICY "Users can delete own items" ON public.items
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================
-- Function to automatically update updated_at timestamp

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_items_updated_at
    BEFORE UPDATE ON public.items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- HELPFUL QUERIES (for reference)
-- ============================================================================

-- Get all root locations (locations without parents) for a user
-- SELECT * FROM public.locations WHERE user_id = 'user-uuid' AND parent_id IS NULL;

-- Get all child locations of a specific location
-- SELECT * FROM public.locations WHERE parent_id = 'location-uuid';

-- Get all items in a specific location
-- SELECT * FROM public.items WHERE location_id = 'location-uuid';

-- Get location hierarchy path (breadcrumb) - requires recursive query
-- WITH RECURSIVE location_path AS (
--   SELECT id, name, parent_id, 1 as level
--   FROM public.locations
--   WHERE id = 'target-location-uuid'
--   UNION ALL
--   SELECT l.id, l.name, l.parent_id, lp.level + 1
--   FROM public.locations l
--   INNER JOIN location_path lp ON l.id = lp.parent_id
-- )
-- SELECT * FROM location_path ORDER BY level DESC;
