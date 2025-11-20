'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

export async function getLocation(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { location: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { location: null, error: error.message }
  }

  return { location: data, error: null }
}

export async function getLocationPath(locationId: string): Promise<Array<{ id: string; name: string }>> {
  const supabase = await createClient()
  const path: Array<{ id: string; name: string }> = []

  let currentId: string | null = locationId

  while (currentId) {
    const { data, error } = await supabase
      .from('locations')
      .select('id, name, parent_id')
      .eq('id', currentId)
      .single()

    if (error || !data) break

    path.unshift({ id: data.id, name: data.name })
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

  const { data, error } = await supabase
    .from('locations')
    .insert({
      name,
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

  redirect(`/location/${data.id}`)
}

export async function updateLocation(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('locations')
    .update({
      name,
      description: description || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/locations')
  revalidatePath(`/location/${id}`)

  redirect(`/location/${id}`)
}

export async function deleteLocation(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get the parent_id before deleting
  const { data: location } = await supabase
    .from('locations')
    .select('parent_id')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/locations')
  if (location?.parent_id) {
    revalidatePath(`/location/${location.parent_id}`)
    redirect(`/location/${location.parent_id}`)
  } else {
    redirect('/locations')
  }
}
