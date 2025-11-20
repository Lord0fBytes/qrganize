-- Migration: Add slug columns to locations and items tables
-- This migration adds slug support for cleaner, more user-friendly URLs

-- Step 1: Add slug column to locations table
ALTER TABLE locations
ADD COLUMN slug TEXT;

-- Step 2: Add slug column to items table
ALTER TABLE items
ADD COLUMN slug TEXT;

-- Step 3: Generate slugs for existing locations
-- This uses a similar algorithm to our TypeScript generateSlug function
UPDATE locations
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          TRIM(name),
          '[^\w\s-]', '', 'g'  -- Remove special characters
        ),
        '\s+', '-', 'g'  -- Replace spaces with hyphens
      ),
      '-+', '-', 'g'  -- Replace multiple hyphens with single
    ),
    '^-+|-+$', '', 'g'  -- Remove leading/trailing hyphens
  )
)
WHERE slug IS NULL;

-- Step 4: Generate slugs for existing items
UPDATE items
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          TRIM(name),
          '[^\w\s-]', '', 'g'
        ),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    ),
    '^-+|-+$', '', 'g'
  )
)
WHERE slug IS NULL;

-- Step 5: Handle duplicate slugs by appending a number
-- For locations
WITH ranked_locations AS (
  SELECT
    id,
    user_id,
    slug,
    ROW_NUMBER() OVER (PARTITION BY user_id, slug ORDER BY created_at) as rn
  FROM locations
)
UPDATE locations
SET slug = locations.slug || '-' || (ranked_locations.rn - 1)
FROM ranked_locations
WHERE locations.id = ranked_locations.id
  AND ranked_locations.rn > 1;

-- For items
WITH ranked_items AS (
  SELECT
    id,
    user_id,
    slug,
    ROW_NUMBER() OVER (PARTITION BY user_id, slug ORDER BY created_at) as rn
  FROM items
)
UPDATE items
SET slug = items.slug || '-' || (ranked_items.rn - 1)
FROM ranked_items
WHERE items.id = ranked_items.id
  AND ranked_items.rn > 1;

-- Step 6: Make slug NOT NULL now that all rows have values
ALTER TABLE locations
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE items
ALTER COLUMN slug SET NOT NULL;

-- Step 7: Add unique constraints for user_id + slug combination
ALTER TABLE locations
ADD CONSTRAINT locations_user_slug_unique UNIQUE (user_id, slug);

ALTER TABLE items
ADD CONSTRAINT items_user_slug_unique UNIQUE (user_id, slug);

-- Step 8: Create indexes for better query performance
CREATE INDEX idx_locations_user_slug ON locations(user_id, slug);
CREATE INDEX idx_items_user_slug ON items(user_id, slug);

-- Verification queries (run these separately to check results)
-- SELECT user_id, slug, name FROM locations ORDER BY user_id, slug;
-- SELECT user_id, slug, name FROM items ORDER BY user_id, slug;
