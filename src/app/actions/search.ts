'use server'

import { createClient } from '@/lib/supabase/server'

export type SearchFilter = 'all' | 'items' | 'locations'

export interface SearchResultItem {
  id: string
  name: string
  slug: string
  description: string | null
  type: 'item' | 'location'
  location?: {
    name: string
    slug: string
  } | null
  parent?: {
    name: string
    slug: string
  } | null
  created_at: string
}

export interface SearchResults {
  items: SearchResultItem[]
  locations: SearchResultItem[]
  totalCount: number
}

/**
 * Search for items and locations by name or description
 */
export async function searchItems(
  query: string,
  filter: SearchFilter = 'all'
): Promise<{ results: SearchResults; error: string | null }> {
  if (!query || query.trim().length === 0) {
    return {
      results: { items: [], locations: [], totalCount: 0 },
      error: null
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      results: { items: [], locations: [], totalCount: 0 },
      error: 'Not authenticated'
    }
  }

  const searchTerm = `%${query.trim().toLowerCase()}%`
  let itemResults: SearchResultItem[] = []
  let locationResults: SearchResultItem[] = []

  // Search items if filter allows
  if (filter === 'all' || filter === 'items') {
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select(`
        id,
        name,
        slug,
        description,
        created_at,
        location:locations(name, slug)
      `)
      .eq('user_id', user.id)
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .order('name', { ascending: true })
      .limit(50)

    if (itemsError) {
      return {
        results: { items: [], locations: [], totalCount: 0 },
        error: itemsError.message
      }
    }

    itemResults = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      type: 'item' as const,
      location: item.location && Array.isArray(item.location) && item.location[0] ? {
        name: item.location[0].name,
        slug: item.location[0].slug
      } : null,
      created_at: item.created_at
    }))
  }

  // Search locations if filter allows
  if (filter === 'all' || filter === 'locations') {
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select(`
        id,
        name,
        slug,
        description,
        created_at,
        parent:parent_id(name, slug)
      `)
      .eq('user_id', user.id)
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .order('name', { ascending: true })
      .limit(50)

    if (locationsError) {
      return {
        results: { items: itemResults, locations: [], totalCount: itemResults.length },
        error: locationsError.message
      }
    }

    locationResults = locations.map((location: any) => ({
      id: location.id,
      name: location.name,
      slug: location.slug,
      description: location.description,
      type: 'location' as const,
      parent: location.parent && Array.isArray(location.parent) && location.parent[0] ? {
        name: location.parent[0].name,
        slug: location.parent[0].slug
      } : null,
      created_at: location.created_at
    }))
  }

  return {
    results: {
      items: itemResults,
      locations: locationResults,
      totalCount: itemResults.length + locationResults.length
    },
    error: null
  }
}
