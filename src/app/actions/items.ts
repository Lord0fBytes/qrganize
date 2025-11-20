'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/slugify'

export async function getItems(locationId?: string | null) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { items: [], error: 'Not authenticated' }
  }

  const query = supabase
    .from('items')
    .select('*, location:locations(id, slug, name)')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (locationId !== undefined) {
    if (locationId === null) {
      query.is('location_id', null)
    } else {
      query.eq('location_id', locationId)
    }
  }

  const { data, error } = await query

  if (error) {
    return { items: [], error: error.message }
  }

  return { items: data || [], error: null }
}

export async function getItem(slug: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { item: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('items')
    .select('*, location:locations(id, slug, name)')
    .eq('slug', slug)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { item: null, error: error.message }
  }

  return { item: data, error: null }
}

export async function createItem(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const locationId = formData.get('location_id') as string | null
  const quantity = formData.get('quantity') as string
  const customSlug = formData.get('slug') as string

  // Use custom slug if provided, otherwise generate from name
  let slug = customSlug && customSlug.trim() ? customSlug.trim() : generateSlug(name)

  // Ensure slug is unique by appending numbers if needed
  let isUnique = false
  let counter = 0
  let finalSlug = slug

  while (!isUnique) {
    const { data: existing } = await supabase
      .from('items')
      .select('id')
      .eq('user_id', user.id)
      .eq('slug', finalSlug)
      .single()

    if (!existing) {
      isUnique = true
    } else {
      counter++
      finalSlug = `${slug}-${counter}`
    }
  }

  // Get location slug if location_id is provided
  let locationSlug: string | null = null
  if (locationId) {
    const { data: location } = await supabase
      .from('locations')
      .select('slug')
      .eq('id', locationId)
      .single()

    locationSlug = location?.slug || null
  }

  const { data, error } = await supabase
    .from('items')
    .insert({
      name,
      slug: finalSlug,
      description: description || null,
      location_id: locationId || null,
      quantity: quantity ? parseInt(quantity) : 1,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/items')
  if (locationSlug) {
    revalidatePath(`/location/${locationSlug}`)
  }

  redirect(`/item/${data.slug}`)
}

export async function updateItem(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const locationId = formData.get('location_id') as string | null
  const quantity = formData.get('quantity') as string
  const customSlug = formData.get('slug') as string

  // Use custom slug if provided, otherwise generate from name
  let slug = customSlug && customSlug.trim() ? customSlug.trim() : generateSlug(name)

  // Ensure slug is unique (excluding current item)
  let isUnique = false
  let counter = 0
  let finalSlug = slug

  while (!isUnique) {
    const { data: existing } = await supabase
      .from('items')
      .select('id')
      .eq('user_id', user.id)
      .eq('slug', finalSlug)
      .neq('id', id)
      .single()

    if (!existing) {
      isUnique = true
    } else {
      counter++
      finalSlug = `${slug}-${counter}`
    }
  }

  // Get old location for cache invalidation
  const { data: oldItem } = await supabase
    .from('items')
    .select('location_id')
    .eq('id', id)
    .single()

  // Get location slugs for cache invalidation
  let oldLocationSlug: string | null = null
  let newLocationSlug: string | null = null

  if (oldItem?.location_id) {
    const { data: oldLocation } = await supabase
      .from('locations')
      .select('slug')
      .eq('id', oldItem.location_id)
      .single()

    oldLocationSlug = oldLocation?.slug || null
  }

  if (locationId) {
    const { data: newLocation } = await supabase
      .from('locations')
      .select('slug')
      .eq('id', locationId)
      .single()

    newLocationSlug = newLocation?.slug || null
  }

  const { error } = await supabase
    .from('items')
    .update({
      name,
      slug: finalSlug,
      description: description || null,
      location_id: locationId || null,
      quantity: quantity ? parseInt(quantity) : 1,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/items')
  revalidatePath(`/item/${finalSlug}`)

  // Invalidate old and new location pages
  if (oldLocationSlug) {
    revalidatePath(`/location/${oldLocationSlug}`)
  }
  if (newLocationSlug) {
    revalidatePath(`/location/${newLocationSlug}`)
  }

  redirect(`/item/${finalSlug}`)
}

export async function deleteItem(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get the location info before deleting
  const { data: item } = await supabase
    .from('items')
    .select('location_id')
    .eq('id', id)
    .single()

  let locationSlug: string | null = null
  if (item?.location_id) {
    const { data: location } = await supabase
      .from('locations')
      .select('slug')
      .eq('id', item.location_id)
      .single()

    locationSlug = location?.slug || null
  }

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/items')
  if (locationSlug) {
    revalidatePath(`/location/${locationSlug}`)
    redirect(`/location/${locationSlug}`)
  } else {
    redirect('/items')
  }
}
