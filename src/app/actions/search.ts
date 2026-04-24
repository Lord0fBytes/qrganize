'use server'

import { sql } from '@/lib/db'

export type SearchFilter = 'all' | 'items' | 'locations'

export interface SearchResultItem {
  id: string
  name: string
  slug: string
  description: string | null
  type: 'item' | 'location'
  location?: { name: string; slug: string } | null
  parent?: { name: string; slug: string } | null
  created_at: string
}

export interface SearchResults {
  items: SearchResultItem[]
  locations: SearchResultItem[]
  totalCount: number
}

export async function searchItems(
  query: string,
  filter: SearchFilter = 'all'
): Promise<{ results: SearchResults; error: string | null }> {
  if (!query?.trim()) {
    return { results: { items: [], locations: [], totalCount: 0 }, error: null }
  }

  const term = `%${query.trim().toLowerCase()}%`
  let itemResults: SearchResultItem[] = []
  let locationResults: SearchResultItem[] = []

  if (filter === 'all' || filter === 'items') {
    const rows = await sql`
      SELECT i.id, i.name, i.slug, i.description, i.created_at,
             l.name as location_name, l.slug as location_slug
      FROM items i
      LEFT JOIN locations l ON i.location_id = l.id
      WHERE LOWER(i.name) LIKE ${term} OR LOWER(COALESCE(i.description, '')) LIKE ${term}
      ORDER BY i.name ASC
      LIMIT 50
    `
    itemResults = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      type: 'item' as const,
      location: r.location_name ? { name: r.location_name, slug: r.location_slug } : null,
      created_at: r.created_at,
    }))
  }

  if (filter === 'all' || filter === 'locations') {
    const rows = await sql`
      SELECT l.id, l.name, l.slug, l.description, l.created_at,
             p.name as parent_name, p.slug as parent_slug
      FROM locations l
      LEFT JOIN locations p ON l.parent_id = p.id
      WHERE LOWER(l.name) LIKE ${term} OR LOWER(COALESCE(l.description, '')) LIKE ${term}
      ORDER BY l.name ASC
      LIMIT 50
    `
    locationResults = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      type: 'location' as const,
      parent: r.parent_name ? { name: r.parent_name, slug: r.parent_slug } : null,
      created_at: r.created_at,
    }))
  }

  return {
    results: {
      items: itemResults,
      locations: locationResults,
      totalCount: itemResults.length + locationResults.length,
    },
    error: null,
  }
}
