'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/slugify'

export async function getLocations(parentId?: string | null) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { locations: [], error: 'Not authenticated' }
  }

  const query = supabase
    .from('locations')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (parentId === null) {
    query.is('parent_id', null)
  } else if (parentId) {
    query.eq('parent_id', parentId)
  }

  const { data, error } = await query

  if (error) {
    return { locations: [], error: error.message }
  }

  return { locations: data || [], error: null }
}

export async function getLocation(slug: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { location: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('slug', slug)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { location: null, error: error.message }
  }

  return { location: data, error: null }
}

export async function getLocationPath(locationId: string): Promise<Array<{ id: string; slug: string; name: string }>> {
  const supabase = await createClient()
  const path: Array<{ id: string; slug: string; name: string }> = []

  let currentId: string | null = locationId

  while (currentId) {
    const { data, error }: { data: any; error: any } = await supabase
      .from('locations')
      .select('id, slug, name, parent_id')
      .eq('id', currentId)
      .single()

    if (error || !data) break

    path.unshift({ id: data.id, slug: data.slug, name: data.name })
    currentId = data.parent_id
  }

  return path
}

export async function createLocation(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const parentId = formData.get('parent_id') as string | null
  const customSlug = formData.get('slug') as string

  // Use custom slug if provided, otherwise generate from name
  let slug = customSlug && customSlug.trim() ? customSlug.trim() : generateSlug(name)

  // Ensure slug is unique by appending numbers if needed
  let isUnique = false
  let counter = 0
  let finalSlug = slug

  while (!isUnique) {
    const { data: existing } = await supabase
      .from('locations')
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

  const { data, error } = await supabase
    .from('locations')
    .insert({
      name,
      slug: finalSlug,
      description: description || null,
      parent_id: parentId || null,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/locations')
  if (parentId) {
    revalidatePath(`/location/${parentId}`)
  }

  redirect(`/location/${data.slug}`)
}

export async function updateLocation(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const customSlug = formData.get('slug') as string

  // Use custom slug if provided, otherwise generate from name
  let slug = customSlug && customSlug.trim() ? customSlug.trim() : generateSlug(name)

  // Ensure slug is unique (excluding current location)
  let isUnique = false
  let counter = 0
  let finalSlug = slug

  while (!isUnique) {
    const { data: existing } = await supabase
      .from('locations')
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

  const { error } = await supabase
    .from('locations')
    .update({
      name,
      slug: finalSlug,
      description: description || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/locations')
  revalidatePath(`/location/${finalSlug}`)

  redirect(`/location/${finalSlug}`)
}

export async function deleteLocation(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get the parent location info before deleting
  const { data: location } = await supabase
    .from('locations')
    .select('parent_id')
    .eq('id', id)
    .single()

  let parentSlug: string | null = null
  if (location?.parent_id) {
    const { data: parent } = await supabase
      .from('locations')
      .select('slug')
      .eq('id', location.parent_id)
      .single()

    parentSlug = parent?.slug || null
  }

  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/locations')
  if (parentSlug) {
    revalidatePath(`/location/${parentSlug}`)
    redirect(`/location/${parentSlug}`)
  } else {
    redirect('/locations')
  }
}
