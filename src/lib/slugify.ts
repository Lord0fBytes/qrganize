/**
 * Convert a string to a URL-friendly slug
 * Examples:
 *   "Basement Box" → "basement-box"
 *   "Kitchen Drawer #3" → "kitchen-drawer-3"
 *   "My   Tote!!!" → "my-tote"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, '') // Remove special characters (keep letters, numbers, spaces, hyphens)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Validate slug format
 * Rules:
 *   - Must be lowercase
 *   - Only letters, numbers, and hyphens
 *   - Cannot start or end with hyphen
 *   - Must be at least 1 character
 */
export function validateSlugFormat(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.length === 0) {
    return { valid: false, error: 'Slug cannot be empty' }
  }

  if (slug !== slug.toLowerCase()) {
    return { valid: false, error: 'Slug must be lowercase' }
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' }
  }

  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { valid: false, error: 'Slug cannot start or end with a hyphen' }
  }

  if (slug.includes('--')) {
    return { valid: false, error: 'Slug cannot contain consecutive hyphens' }
  }

  return { valid: true }
}

/**
 * Check if a slug is unique for a user
 * @param supabase - Supabase client
 * @param slug - The slug to check
 * @param userId - The user ID
 * @param table - 'locations' or 'items'
 * @param excludeId - Optional ID to exclude from check (for edit operations)
 */
export async function checkSlugUniqueness(
  supabase: any,
  slug: string,
  userId: string,
  table: 'locations' | 'items',
  excludeId?: string
): Promise<{ unique: boolean; error?: string }> {
  try {
    let query = supabase
      .from(table)
      .select('id')
      .eq('user_id', userId)
      .eq('slug', slug)

    // If excluding an ID (for edits), filter it out
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error checking slug uniqueness:', error)
      return { unique: false, error: 'Failed to check slug uniqueness' }
    }

    // If any results returned, slug is not unique
    const isUnique = !data || data.length === 0

    return {
      unique: isUnique,
      error: isUnique ? undefined : 'This slug is already in use'
    }
  } catch (error) {
    console.error('Error in checkSlugUniqueness:', error)
    return { unique: false, error: 'Failed to check slug uniqueness' }
  }
}
